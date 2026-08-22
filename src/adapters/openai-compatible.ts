import { providerErrorFromHttp, ProviderError } from "../errors.js";
import type { AdapterRequest, AdapterResponse, AdapterStreamEvent, Message, ToolCall, Usage } from "../types.js";
import { readSseEvents } from "./sse.js";
import { toJsonSchema } from "./zod-schema.js";

export function envKey(name: string): string | undefined {
  return typeof process !== "undefined" ? process.env[name] : undefined;
}

/** POST JSON; classifies network / HTTP failures as `ProviderError`. */
async function postJson(
  adapter: { name: string; baseUrl: string; apiKey: string },
  path: string,
  body: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<Response> {
  const url = `${adapter.baseUrl.replace(/\/$/, "")}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adapter.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...(signal ? { signal } : {}),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ProviderError("Timed out", { kind: "timeout", provider: adapter.name, cause: err });
    }
    throw new ProviderError("Network error", {
      kind: "network",
      provider: adapter.name,
      cause: err,
    });
  }

  if (!response.ok) {
    const responseBody = await response.text().catch(() => "");
    throw providerErrorFromHttp(
      adapter.name,
      response.status,
      responseBody,
      response.headers.get("retry-after"),
    );
  }
  return response;
}

/** Map SDK messages to OpenAI chat message shapes (including tools). */
function toOpenAiMessages(messages: Message[]) {
  return messages.map((m) => {
    if (m.role === "assistant" && m.toolCalls?.length) {
      return {
        role: "assistant",
        content: m.content || null,
        tool_calls: m.toolCalls.map((c) => ({
          id: c.id,
          type: "function" as const,
          function: { name: c.name, arguments: JSON.stringify(c.args) },
        })),
      };
    }
    if (m.role === "tool") {
      return { role: "tool", tool_call_id: m.toolCallId, content: m.content };
    }
    return { role: m.role, content: m.content, ...(m.name ? { name: m.name } : {}) };
  });
}

function toOpenAiTools(request: AdapterRequest) {
  if (!request.tools?.length) return undefined;
  return request.tools.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: toJsonSchema(t.schema),
    },
  }));
}

function parseOpenAiToolCalls(
  raw: Array<{ id?: string; function?: { name?: string; arguments?: string } }> | undefined,
): ToolCall[] {
  if (!raw?.length) return [];
  return raw.map((c, i) => {
    const name = c.function?.name ?? "";
    const argsText = c.function?.arguments ?? "{}";
    let args: unknown;
    try {
      args = JSON.parse(argsText);
    } catch {
      args = argsText;
    }
    return { id: c.id ?? `call_${i}`, name, args };
  });
}

/** Shared OpenAI-compatible `/chat/completions` caller. */
export async function openAiCompatibleComplete(
  adapter: { name: string; baseUrl: string; apiKey: string },
  request: AdapterRequest,
): Promise<AdapterResponse> {
  const response = await postJson(
    adapter,
    "/chat/completions",
    {
      model: request.model,
      messages: toOpenAiMessages(request.messages),
      temperature: request.temperature,
      max_tokens: request.maxTokens,
      tools: toOpenAiTools(request),
      ...request.raw,
    },
    request.signal,
  );

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
        tool_calls?: Array<{ id?: string; function?: { name?: string; arguments?: string } }>;
      };
      finish_reason?: string;
    }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  const choice = data.choices?.[0];

  if (choice?.finish_reason === "content_filter") {
    throw new ProviderError("Content was filtered by the provider", {
      kind: "content_filter",
      provider: adapter.name,
      retryable: false,
    });
  }

  return {
    text: choice?.message?.content ?? "",
    usage: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
    toolCalls: parseOpenAiToolCalls(choice?.message?.tool_calls),
    ...(choice?.finish_reason ? { finishReason: choice.finish_reason } : {}),
  };
}

/** OpenAI-compatible streaming. Tool calls are not accumulated; use `complete()`. */
export async function* openAiCompatibleStream(
  adapter: { name: string; baseUrl: string; apiKey: string },
  request: AdapterRequest,
): AsyncGenerator<AdapterStreamEvent> {
  const response = await postJson(
    adapter,
    "/chat/completions",
    {
      model: request.model,
      messages: toOpenAiMessages(request.messages),
      temperature: request.temperature,
      max_tokens: request.maxTokens,
      tools: toOpenAiTools(request),
      stream: true,
      stream_options: { include_usage: true },
      ...request.raw,
    },
    request.signal,
  );

  if (!response.body) {
    throw new ProviderError("Empty stream body", { kind: "network", provider: adapter.name });
  }

  let usage: Usage = { input: 0, output: 0 };
  let finishReason: string | undefined;

  try {
    for await (const evt of readSseEvents(response.body)) {
      if (!evt.data || evt.data === "[DONE]") continue;
      let parsed: {
        choices?: Array<{ delta?: { content?: string }; finish_reason?: string }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      try {
        parsed = JSON.parse(evt.data);
      } catch {
        continue;
      }

      const choice = parsed.choices?.[0];
      if (typeof choice?.delta?.content === "string" && choice.delta.content.length > 0) {
        yield { type: "delta", text: choice.delta.content };
      }
      if (choice?.finish_reason) finishReason = choice.finish_reason;
      if (parsed.usage) {
        usage = {
          input: parsed.usage.prompt_tokens ?? 0,
          output: parsed.usage.completion_tokens ?? 0,
        };
      }
    }
  } catch (err) {
    if (err instanceof ProviderError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new ProviderError("Timed out", { kind: "timeout", provider: adapter.name, cause: err });
    }
    throw new ProviderError("Network error", { kind: "network", provider: adapter.name, cause: err });
  }

  if (finishReason === "content_filter") {
    throw new ProviderError("Content was filtered by the provider", {
      kind: "content_filter",
      provider: adapter.name,
      retryable: false,
    });
  }

  yield { type: "done", usage, toolCalls: [], ...(finishReason ? { finishReason } : {}) };
}

export function requireApiKey(
  provider: string,
  envName: string,
  explicit?: string,
): string {
  const key = explicit ?? envKey(envName);
  if (!key) {
    throw new ProviderError(`Missing API key (${envName})`, {
      kind: "auth",
      provider,
      retryable: false,
    });
  }
  return key;
}
