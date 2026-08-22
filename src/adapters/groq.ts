import type { Adapter, AdapterContext, AdapterRequest, AdapterResponse, AdapterStreamEvent } from "../types.js";
import { openAiCompatibleComplete, openAiCompatibleStream, requireApiKey } from "./openai-compatible.js";

export class GroqAdapter implements Adapter {
  readonly name = "groq";

  constructor(private readonly ctx: AdapterContext = {}) {}

  private target() {
    return {
      name: this.name,
      baseUrl: this.ctx.baseUrl ?? "https://api.groq.com/openai/v1",
      apiKey: requireApiKey(this.name, "GROQ_API_KEY", this.ctx.apiKey),
    };
  }

  async complete(request: AdapterRequest): Promise<AdapterResponse> {
    return openAiCompatibleComplete(this.target(), request);
  }

  stream(request: AdapterRequest): AsyncIterable<AdapterStreamEvent> {
    return openAiCompatibleStream(this.target(), request);
  }
}
