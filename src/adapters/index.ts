import type { Adapter, AdapterContext, ProviderName, ProviderOverrideConfig } from "../types.js";
import { AnthropicAdapter } from "./anthropic.js";
import { GroqAdapter } from "./groq.js";
import { OllamaAdapter } from "./ollama.js";
import { OpenAIAdapter } from "./openai.js";

export type { Adapter };

export function createAdapter(
  provider: ProviderName | string,
  ctx: AdapterContext & {
    providers?: Partial<Record<ProviderName, ProviderOverrideConfig>>;
  } = {},
): Adapter {
  const override = ctx.providers?.[provider as ProviderName];
  const adapterCtx: AdapterContext = {
    ...(override?.apiKey !== undefined ? { apiKey: override.apiKey } : {}),
    ...(override?.baseUrl !== undefined ? { baseUrl: override.baseUrl } : {}),
    ...(override?.timeoutMs !== undefined ? { timeoutMs: override.timeoutMs } : {}),
    ...(ctx.apiKey !== undefined ? { apiKey: ctx.apiKey } : {}),
    ...(ctx.baseUrl !== undefined ? { baseUrl: ctx.baseUrl } : {}),
  };

  switch (provider) {
    case "openai":
      return new OpenAIAdapter(adapterCtx);
    case "anthropic":
      return new AnthropicAdapter(adapterCtx);
    case "groq":
      return new GroqAdapter(adapterCtx);
    case "ollama":
      return new OllamaAdapter(adapterCtx, "ollama");
    case "local":
      return new OllamaAdapter(adapterCtx, "local");
    default:
      throw new Error(
        `Unknown provider "${provider}". Register a custom Adapter for it via createRouter({ adapters: { "${provider}": ... } }).`,
      );
  }
}
