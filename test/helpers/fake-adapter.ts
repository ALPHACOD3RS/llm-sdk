import { ProviderError, type ErrorKind } from "../../src/errors.js";
import type { Adapter, AdapterRequest, AdapterResponse, AdapterStreamEvent, ToolCall } from "../../src/types.js";

/** In-memory adapter double for router/policy tests. */
export interface FakeAdapterConfig {
  responses?: string[];
  fail?: Array<"ok" | ErrorKind>;
  toolCalls?: ToolCall[];
  /** Chunks to emit before a stream failure (0 = fail before any chunk). */
  streamFailAfterChunks?: number;
}

export class FakeAdapter implements Adapter {
  private responseIndex = 0;
  private failIndex = 0;

  constructor(
    readonly name: string,
    private readonly config: FakeAdapterConfig = {},
  ) {}

  async complete(_request: AdapterRequest): Promise<AdapterResponse> {
    const fail = this.config.fail?.[this.failIndex++];
    if (fail && fail !== "ok") {
      throw new ProviderError(`Fake failure: ${fail}`, { kind: fail, provider: this.name });
    }

    const text =
      this.config.responses?.[this.responseIndex++] ?? this.config.responses?.at(-1) ?? "fake response";

    return {
      text,
      usage: { input: 0, output: 0 },
      toolCalls: this.config.toolCalls ?? [],
      finishReason: "stop",
    };
  }

  async *stream(_request: AdapterRequest): AsyncGenerator<AdapterStreamEvent> {
    const fail = this.config.fail?.[this.failIndex++];
    const text =
      this.config.responses?.[this.responseIndex++] ?? this.config.responses?.at(-1) ?? "fake response";
    const failAfter = this.config.streamFailAfterChunks ?? 0;
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
      if (fail && fail !== "ok" && i === failAfter) {
        throw new ProviderError(`Fake failure: ${fail}`, { kind: fail, provider: this.name });
      }
      yield { type: "delta", text: (i > 0 ? " " : "") + words[i] };
    }

    if (fail && fail !== "ok" && failAfter >= words.length) {
      throw new ProviderError(`Fake failure: ${fail}`, { kind: fail, provider: this.name });
    }

    yield {
      type: "done",
      usage: { input: 0, output: 0 },
      toolCalls: this.config.toolCalls ?? [],
      finishReason: "stop",
    };
  }
}
