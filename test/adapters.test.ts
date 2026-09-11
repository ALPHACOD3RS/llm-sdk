import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnthropicAdapter } from "../src/adapters/anthropic.js";
import { OpenAIAdapter } from "../src/adapters/openai.js";
import { ProviderError } from "../src/errors.js";
import {
  anthropicMessage,
  anthropicRefusal,
  anthropicToolUse,
  openAiChatCompletion,
  openAiContentFilter,
  openAiToolCall,
} from "./fixtures/responses.js";

function jsonResponse(body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json", ...headers },
  });
}

function sseResponse(frames: string): Response {
  return new Response(frames, { status: 200, headers: { "content-type": "text/event-stream" } });
}

async function collectStream(
  gen: AsyncIterable<{
    type: string;
    text?: string;
    usage?: unknown;
    toolCalls?: unknown[];
    finishReason?: string;
  }>,
) {
  const deltas: string[] = [];
  let done: { usage: unknown; toolCalls: unknown[]; finishReason?: string } | undefined;
  for await (const evt of gen) {
    if (evt.type === "delta") deltas.push(evt.text ?? "");
    else
      done = {
        usage: evt.usage,
        toolCalls: evt.toolCalls ?? [],
        ...(evt.finishReason ? { finishReason: evt.finishReason } : {}),
      };
  }
  return { deltas, done };
}

describe("OpenAIAdapter", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("classifies a missing API key as auth, not network — never even calls fetch", async () => {
    const adapter = new OpenAIAdapter({});

    await expect(
      adapter.complete({ model: "gpt-4o", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toMatchObject({ kind: "auth" } satisfies Partial<ProviderError>);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("parses plain text responses", async () => {
    fetchMock.mockResolvedValue(jsonResponse(openAiChatCompletion));
    const adapter = new OpenAIAdapter({ apiKey: "sk-test" });

    const res = await adapter.complete({ model: "gpt-4o", messages: [{ role: "user", content: "hi" }] });

    expect(res.text).toBe("hello");
    expect(res.usage).toEqual({ input: 10, output: 2 });
    expect(res.toolCalls).toEqual([]);
    expect(res.finishReason).toBe("stop");
  });

  it("sends tool definitions and parses tool_calls back", async () => {
    fetchMock.mockResolvedValue(jsonResponse(openAiToolCall));
    const adapter = new OpenAIAdapter({ apiKey: "sk-test" });

    const res = await adapter.complete({
      model: "gpt-4o",
      messages: [{ role: "user", content: "weather?" }],
      tools: [{ name: "getWeather", description: "Current weather", schema: { type: "object" } }],
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const sentBody = JSON.parse(init.body as string);
    expect(sentBody.tools).toEqual([
      { type: "function", function: { name: "getWeather", description: "Current weather", parameters: { type: "object" } } },
    ]);

    expect(res.toolCalls).toEqual([
      { id: "call_1", name: "getWeather", args: { city: "Addis Ababa" } },
    ]);
    expect(res.finishReason).toBe("tool_calls");
  });

  it("converts a Zod-shaped tool schema to JSON Schema on the wire", async () => {
    fetchMock.mockResolvedValue(jsonResponse(openAiToolCall));
    const adapter = new OpenAIAdapter({ apiKey: "sk-test" });
    const zodLikeCity = { _def: { typeName: "ZodString" } };
    const zodLikeSchema = { _def: { typeName: "ZodObject" }, shape: { city: zodLikeCity } };

    await adapter.complete({
      model: "gpt-4o",
      messages: [{ role: "user", content: "weather?" }],
      tools: [{ name: "getWeather", schema: zodLikeSchema }],
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const sentBody = JSON.parse(init.body as string);
    expect(sentBody.tools[0].function.parameters).toEqual({
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
    });
  });

  it("streams SSE deltas and a final usage/finishReason done event", async () => {
    const frames = [
      `data: ${JSON.stringify({ choices: [{ delta: { content: "Hello" } }] })}`,
      `data: ${JSON.stringify({ choices: [{ delta: { content: " world" } }] })}`,
      `data: ${JSON.stringify({
        choices: [{ delta: {}, finish_reason: "stop" }],
        usage: { prompt_tokens: 5, completion_tokens: 2 },
      })}`,
      "data: [DONE]",
    ].join("\n\n");
    fetchMock.mockResolvedValue(sseResponse(frames));
    const adapter = new OpenAIAdapter({ apiKey: "sk-test" });

    const { deltas, done } = await collectStream(
      adapter.stream({ model: "gpt-4o", messages: [{ role: "user", content: "hi" }] }),
    );

    expect(deltas).toEqual(["Hello", " world"]);
    expect(done).toEqual({ usage: { input: 5, output: 2 }, toolCalls: [], finishReason: "stop" });
  });

  it("accumulates streamed tool_calls deltas across chunks into a finished call", async () => {
    const frames = [
      `data: ${JSON.stringify({
        choices: [
          {
            delta: {
              tool_calls: [{ index: 0, id: "call_1", function: { name: "getWeather", arguments: "" } }],
            },
          },
        ],
      })}`,
      `data: ${JSON.stringify({
        choices: [{ delta: { tool_calls: [{ index: 0, function: { arguments: '{"city":' } }] } }],
      })}`,
      `data: ${JSON.stringify({
        choices: [{ delta: { tool_calls: [{ index: 0, function: { arguments: '"Addis Ababa"}' } }] } }],
      })}`,
      `data: ${JSON.stringify({
        choices: [{ delta: {}, finish_reason: "tool_calls" }],
        usage: { prompt_tokens: 5, completion_tokens: 10 },
      })}`,
      "data: [DONE]",
    ].join("\n\n");
    fetchMock.mockResolvedValue(sseResponse(frames));
    const adapter = new OpenAIAdapter({ apiKey: "sk-test" });

    const { done } = await collectStream(
      adapter.stream({
        model: "gpt-4o",
        messages: [{ role: "user", content: "weather?" }],
        tools: [{ name: "getWeather", schema: { type: "object" } }],
      }),
    );

    expect(done?.toolCalls).toEqual([{ id: "call_1", name: "getWeather", args: { city: "Addis Ababa" } }]);
    expect(done?.finishReason).toBe("tool_calls");
  });

  it("classifies a content_filter finish_reason mid-stream", async () => {
    const frames = [`data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: "content_filter" }] })}`].join(
      "\n\n",
    );
    fetchMock.mockResolvedValue(sseResponse(frames));
    const adapter = new OpenAIAdapter({ apiKey: "sk-test" });

    await expect(
      collectStream(adapter.stream({ model: "gpt-4o", messages: [{ role: "user", content: "hi" }] })),
    ).rejects.toMatchObject({ kind: "content_filter" } satisfies Partial<ProviderError>);
  });

  it("classifies finish_reason: content_filter as a content_filter error", async () => {
    fetchMock.mockResolvedValue(jsonResponse(openAiContentFilter));
    const adapter = new OpenAIAdapter({ apiKey: "sk-test" });

    await expect(
      adapter.complete({ model: "gpt-4o", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toMatchObject({ kind: "content_filter" } satisfies Partial<ProviderError>);
  });

  it("serializes an assistant tool-call turn and its tool result on the wire", async () => {
    fetchMock.mockResolvedValue(jsonResponse(openAiChatCompletion));
    const adapter = new OpenAIAdapter({ apiKey: "sk-test" });

    await adapter.complete({
      model: "gpt-4o",
      messages: [
        { role: "user", content: "weather?" },
        {
          role: "assistant",
          content: "",
          toolCalls: [{ id: "call_1", name: "getWeather", args: { city: "Addis Ababa" } }],
        },
        { role: "tool", toolCallId: "call_1", content: '{"tempC":24}' },
      ],
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const sentBody = JSON.parse(init.body as string);
    expect(sentBody.messages).toEqual([
      { role: "user", content: "weather?" },
      {
        role: "assistant",
        content: null,
        tool_calls: [
          { id: "call_1", type: "function", function: { name: "getWeather", arguments: '{"city":"Addis Ababa"}' } },
        ],
      },
      { role: "tool", tool_call_id: "call_1", content: '{"tempC":24}' },
    ]);
  });
});

describe("AnthropicAdapter", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("classifies a missing API key as auth, not network — never even calls fetch", async () => {
    const adapter = new AnthropicAdapter({});

    await expect(
      adapter.complete({ model: "claude-sonnet-4-5", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toMatchObject({ kind: "auth" } satisfies Partial<ProviderError>);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("parses plain text responses", async () => {
    fetchMock.mockResolvedValue(jsonResponse(anthropicMessage));
    const adapter = new AnthropicAdapter({ apiKey: "sk-ant-test" });

    const res = await adapter.complete({
      model: "claude-sonnet-4-5",
      messages: [{ role: "user", content: "hi" }],
    });

    expect(res.text).toBe("hello");
    expect(res.usage).toEqual({ input: 10, output: 2 });
    expect(res.toolCalls).toEqual([]);
    expect(res.finishReason).toBe("end_turn");
  });

  it("sends tool definitions and parses tool_use blocks back", async () => {
    fetchMock.mockResolvedValue(jsonResponse(anthropicToolUse));
    const adapter = new AnthropicAdapter({ apiKey: "sk-ant-test" });

    const res = await adapter.complete({
      model: "claude-sonnet-4-5",
      messages: [{ role: "user", content: "weather?" }],
      tools: [{ name: "getWeather", description: "Current weather", schema: { type: "object" } }],
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const sentBody = JSON.parse(init.body as string);
    expect(sentBody.tools).toEqual([
      { name: "getWeather", description: "Current weather", input_schema: { type: "object" } },
    ]);

    expect(res.text).toBe("Let me check.");
    expect(res.toolCalls).toEqual([
      { id: "toolu_1", name: "getWeather", args: { city: "Addis Ababa" } },
    ]);
    expect(res.finishReason).toBe("tool_use");
  });

  it("classifies stop_reason: refusal as a content_filter error", async () => {
    fetchMock.mockResolvedValue(jsonResponse(anthropicRefusal));
    const adapter = new AnthropicAdapter({ apiKey: "sk-ant-test" });

    await expect(
      adapter.complete({ model: "claude-sonnet-4-5", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toMatchObject({ kind: "content_filter" } satisfies Partial<ProviderError>);
  });

  it("serializes an assistant tool_use turn and its tool_result on the wire", async () => {
    fetchMock.mockResolvedValue(jsonResponse(anthropicMessage));
    const adapter = new AnthropicAdapter({ apiKey: "sk-ant-test" });

    await adapter.complete({
      model: "claude-sonnet-4-5",
      messages: [
        { role: "user", content: "weather?" },
        {
          role: "assistant",
          content: "Let me check.",
          toolCalls: [{ id: "toolu_1", name: "getWeather", args: { city: "Addis Ababa" } }],
        },
        { role: "tool", toolCallId: "toolu_1", content: '{"tempC":24}' },
      ],
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const sentBody = JSON.parse(init.body as string);
    expect(sentBody.messages).toEqual([
      { role: "user", content: "weather?" },
      {
        role: "assistant",
        content: [
          { type: "text", text: "Let me check." },
          { type: "tool_use", id: "toolu_1", name: "getWeather", input: { city: "Addis Ababa" } },
        ],
      },
      { role: "user", content: [{ type: "tool_result", tool_use_id: "toolu_1", content: '{"tempC":24}' }] },
    ]);
  });

  it("merges consecutive tool messages into one user turn with multiple tool_result blocks", async () => {
    fetchMock.mockResolvedValue(jsonResponse(anthropicMessage));
    const adapter = new AnthropicAdapter({ apiKey: "sk-ant-test" });

    await adapter.complete({
      model: "claude-sonnet-4-5",
      messages: [
        {
          role: "assistant",
          content: "",
          toolCalls: [
            { id: "toolu_1", name: "getWeather", args: { city: "Addis Ababa" } },
            { id: "toolu_2", name: "getWeather", args: { city: "Nairobi" } },
          ],
        },
        { role: "tool", toolCallId: "toolu_1", content: '{"tempC":24}' },
        { role: "tool", toolCallId: "toolu_2", content: '{"tempC":26}' },
      ],
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const sentBody = JSON.parse(init.body as string);
    expect(sentBody.messages[1]).toEqual({
      role: "user",
      content: [
        { type: "tool_result", tool_use_id: "toolu_1", content: '{"tempC":24}' },
        { type: "tool_result", tool_use_id: "toolu_2", content: '{"tempC":26}' },
      ],
    });
  });

  it("streams SSE text deltas and a final usage/finishReason done event", async () => {
    const frames = [
      `event: message_start\ndata: ${JSON.stringify({ message: { usage: { input_tokens: 10 } } })}`,
      `event: content_block_delta\ndata: ${JSON.stringify({ delta: { type: "text_delta", text: "Hello" } })}`,
      `event: content_block_delta\ndata: ${JSON.stringify({ delta: { type: "text_delta", text: " world" } })}`,
      `event: message_delta\ndata: ${JSON.stringify({ delta: { stop_reason: "end_turn" }, usage: { output_tokens: 2 } })}`,
      `event: message_stop\ndata: ${JSON.stringify({})}`,
    ].join("\n\n");
    fetchMock.mockResolvedValue(sseResponse(frames));
    const adapter = new AnthropicAdapter({ apiKey: "sk-ant-test" });

    const { deltas, done } = await collectStream(
      adapter.stream({ model: "claude-sonnet-4-5", messages: [{ role: "user", content: "hi" }] }),
    );

    expect(deltas).toEqual(["Hello", " world"]);
    expect(done).toEqual({ usage: { input: 10, output: 2 }, toolCalls: [], finishReason: "end_turn" });
  });

  it("accumulates a streamed tool_use block's input_json_delta chunks into a finished call", async () => {
    const frames = [
      `event: content_block_start\ndata: ${JSON.stringify({
        index: 0,
        content_block: { type: "tool_use", id: "toolu_1", name: "getWeather" },
      })}`,
      `event: content_block_delta\ndata: ${JSON.stringify({
        index: 0,
        delta: { type: "input_json_delta", partial_json: '{"city":' },
      })}`,
      `event: content_block_delta\ndata: ${JSON.stringify({
        index: 0,
        delta: { type: "input_json_delta", partial_json: '"Addis Ababa"}' },
      })}`,
      `event: content_block_stop\ndata: ${JSON.stringify({ index: 0 })}`,
      `event: message_delta\ndata: ${JSON.stringify({
        delta: { stop_reason: "tool_use" },
        usage: { output_tokens: 10 },
      })}`,
    ].join("\n\n");
    fetchMock.mockResolvedValue(sseResponse(frames));
    const adapter = new AnthropicAdapter({ apiKey: "sk-ant-test" });

    const { done } = await collectStream(
      adapter.stream({
        model: "claude-sonnet-4-5",
        messages: [{ role: "user", content: "weather?" }],
        tools: [{ name: "getWeather", schema: { type: "object" } }],
      }),
    );

    expect(done?.toolCalls).toEqual([{ id: "toolu_1", name: "getWeather", args: { city: "Addis Ababa" } }]);
    expect(done?.finishReason).toBe("tool_use");
  });

  it("classifies a mid-stream error event by Anthropic error type", async () => {
    const frames = [
      `event: error\ndata: ${JSON.stringify({ error: { type: "overloaded_error", message: "Overloaded" } })}`,
    ].join("\n\n");
    fetchMock.mockResolvedValue(sseResponse(frames));
    const adapter = new AnthropicAdapter({ apiKey: "sk-ant-test" });

    await expect(
      collectStream(
        adapter.stream({ model: "claude-sonnet-4-5", messages: [{ role: "user", content: "hi" }] }),
      ),
    ).rejects.toMatchObject({ kind: "overloaded" } satisfies Partial<ProviderError>);
  });
});
