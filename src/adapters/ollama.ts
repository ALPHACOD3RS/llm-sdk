import type { Adapter, AdapterContext, AdapterRequest, AdapterResponse, AdapterStreamEvent } from "../types.js";
import { envKey, openAiCompatibleComplete, openAiCompatibleStream } from "./openai-compatible.js";

/** Ollama (also registered as `local`). */
export class OllamaAdapter implements Adapter {
  readonly name: "ollama" | "local";

  constructor(
    private readonly ctx: AdapterContext = {},
    name: "ollama" | "local" = "ollama",
  ) {
    this.name = name;
  }

  private target() {
    return {
      name: this.name,
      baseUrl: this.ctx.baseUrl ?? "http://127.0.0.1:11434/v1",
      apiKey: this.ctx.apiKey ?? envKey("LOCAL_API_KEY") ?? envKey("OLLAMA_API_KEY") ?? "ollama",
    };
  }

  async complete(request: AdapterRequest): Promise<AdapterResponse> {
    return openAiCompatibleComplete(this.target(), request);
  }

  stream(request: AdapterRequest): AsyncIterable<AdapterStreamEvent> {
    return openAiCompatibleStream(this.target(), request);
  }
}
