import type { ErrorKind } from "../errors.js";
import { providerErrorFromHttp, ProviderError } from "../errors.js";
import type {
  Adapter,
  AdapterContext,
  AdapterRequest,
  AdapterResponse,
  AdapterStreamEvent,
  Message,
  ToolCall,
  Usage,
} from "../types.js";
import { readSseEvents } from "./sse.js";
import { requireApiKey } from "./openai-compatible.js";
import { toJsonSchema } from "./zod-schema.js";

function toAnthropicTools(request: AdapterRequest) {
  if (!request.tools?.length) return undefined;
  return request.tools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: toJsonSchema(t.schema),
  }));
}

function parseAnthropicToolCalls(
  content: Array<{ type: string; id?: string; name?: string; input?: unknown }> | undefined,
): ToolCall[] {
  if (!content?.length) return [];
  return content
    .filter((c) => c.type === "tool_use")
    .map((c, i) => ({ id: c.id ?? `call_${i}`, name: c.name ?? "", args: c.input }));
}

type AnthropicContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: string };

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string | AnthropicContentBlock[];
}

function isToolResultMessage(m: AnthropicMessage): m is AnthropicMessage & { content: AnthropicContentBlock[] } {
  return Array.isArray(m.content) && m.content.every((b) => b.type === "tool_result");
}

/** Map SDK messages to Anthropic's format; consecutive tool results merge into one user turn. */
function toAnthropicMessages(messages: Message[]) {
  const system = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n");

  const rest: AnthropicMessage[] = [];

  for (const m of messages) {
    if (m.role === "system") continue;

    if (m.role === "assistant" && m.toolCalls?.length) {
      const blocks: AnthropicContentBlock[] = [];
      if (m.content) blocks.push({ type: "text", text: m.content });
      for (const call of m.toolCalls) {
        blocks.push({ type: "tool_use", id: call.id, name: call.name, input: call.args });
      }
      rest.push({ role: "assistant", content: blocks });
      continue;
    }

    if (m.role === "tool") {
      const block: AnthropicContentBlock = {
        type: "tool_result",
        tool_use_id: m.toolCallId ?? "",
        content: m.content,
      };
      const prev = rest.at(-1);
      if (prev?.role === "user" && isToolResultMessage(prev)) {
        prev.content.push(block);
      } else {
        rest.push({ role: "user", content: [block] });
      }
      continue;
    }

    rest.push({ role: m.role === "assistant" ? "assistant" : "user", content: m.content });
  }

  return { system, messages: rest };
}

function classifyAnthropicErrorType(type: string | undefined): ErrorKind {
  switch (type) {
    case "rate_limit_error":
      return "rate_limit";
    case "overloaded_error":
      return "overloaded";
    case "authentication_error":
    case "permission_error":
      return "auth";
    case "invalid_request_error":
    case "not_found_error":
      return "bad_request";
    case "timeout_error":
      return "timeout";
    case "api_error":
      return "server_error";
    default:
      return "unknown";
  }
}

export class AnthropicAdapter implements Adapter {
  readonly name = "anthropic";

  constructor(private readonly ctx: AdapterContext = {}) {}

  private headers(): Record<string, string> {
    return {
      "x-api-key": requireApiKey(this.name, "ANTHROPIC_API_KEY", this.ctx.apiKey),
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    };
  }

  private url(): string {
    return `${(this.ctx.baseUrl ?? "https://api.anthropic.com").replace(/\/$/, "")}/v1/messages`;
  }

  private async post(request: AdapterRequest, extra: Record<string, unknown> = {}): Promise<Response> {
    const { system, messages } = toAnthropicMessages(request.messages);
    // Auth check outside try so missing keys stay `auth`, not re-wrapped as `network`.
    const headers = this.headers();
    let response: Response;
    try {
      response = await fetch(this.url(), {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: request.model,
          max_tokens: request.maxTokens ?? 1024,
          temperature: request.temperature,
          system: system || undefined,
          messages,
          tools: toAnthropicTools(request),
          ...extra,
          ...request.raw,
        }),
        ...(request.signal ? { signal: request.signal } : {}),
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new ProviderError("Timed out", { kind: "timeout", provider: this.name, cause: err });
      }
      throw new ProviderError("Network error", { kind: "network", provider: this.name, cause: err });
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw providerErrorFromHttp(
        this.name,
        response.status,
        body,
        response.headers.get("retry-after"),
      );
    }
    return response;
  }

  async complete(request: AdapterRequest): Promise<AdapterResponse> {
    const response = await this.post(request);

    const data = (await response.json()) as {
      content?: Array<{ type: string; text?: string; id?: string; name?: string; input?: unknown }>;
      usage?: { input_tokens?: number; output_tokens?: number };
      stop_reason?: string;
    };

    if (data.stop_reason === "refusal") {
      throw new ProviderError("Content was filtered by the provider", {
        kind: "content_filter",
        provider: this.name,
        retryable: false,
      });
    }

    const text =
      data.content?.filter((c) => c.type === "text").map((c) => c.text ?? "").join("") ?? "";

    return {
      text,
      usage: {
        input: data.usage?.input_tokens ?? 0,
        output: data.usage?.output_tokens ?? 0,
      },
      toolCalls: parseAnthropicToolCalls(data.content),
      ...(data.stop_reason ? { finishReason: data.stop_reason } : {}),
    };
  }

  /** Streaming does not emit tool calls; use `complete()`. */
  async *stream(request: AdapterRequest): AsyncGenerator<AdapterStreamEvent> {
    const response = await this.post(request, { stream: true });

    if (!response.body) {
      throw new ProviderError("Empty stream body", { kind: "network", provider: this.name });
    }

    let usage: Usage = { input: 0, output: 0 };
    let stopReason: string | undefined;

    try {
      for await (const evt of readSseEvents(response.body)) {
        if (!evt.data) continue;
        let parsed: {
          message?: { usage?: { input_tokens?: number } };
          delta?: { type?: string; text?: string; stop_reason?: string };
          usage?: { output_tokens?: number };
          error?: { type?: string; message?: string };
        };
        try {
          parsed = JSON.parse(evt.data);
        } catch {
          continue;
        }

        if (evt.event === "message_start") {
          usage.input = parsed.message?.usage?.input_tokens ?? 0;
        } else if (evt.event === "content_block_delta" && parsed.delta?.type === "text_delta") {
          if (parsed.delta.text) yield { type: "delta", text: parsed.delta.text };
        } else if (evt.event === "message_delta") {
          if (parsed.usage?.output_tokens !== undefined) usage.output = parsed.usage.output_tokens;
          if (parsed.delta?.stop_reason) stopReason = parsed.delta.stop_reason;
        } else if (evt.event === "error") {
          throw new ProviderError(parsed.error?.message ?? "Anthropic stream error", {
            kind: classifyAnthropicErrorType(parsed.error?.type),
            provider: this.name,
          });
        }
      }
    } catch (err) {
      if (err instanceof ProviderError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new ProviderError("Timed out", { kind: "timeout", provider: this.name, cause: err });
      }
      throw new ProviderError("Network error", { kind: "network", provider: this.name, cause: err });
    }

    if (stopReason === "refusal") {
      throw new ProviderError("Content was filtered by the provider", {
        kind: "content_filter",
        provider: this.name,
        retryable: false,
      });
    }

    yield { type: "done", usage, toolCalls: [], ...(stopReason ? { finishReason: stopReason } : {}) };
  }
}
