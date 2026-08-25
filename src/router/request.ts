import type { AdapterRequest, ProviderName } from "../types.js";
import type { ParsedModel, PreparedCall } from "./types.js";

export function buildAdapterRequest(
  parsed: ParsedModel,
  prepared: PreparedCall,
  signal: AbortSignal,
): AdapterRequest {
  return {
    model: parsed.model,
    messages: prepared.messages,
    ...(prepared.temperature !== undefined ? { temperature: prepared.temperature } : {}),
    ...(prepared.maxTokens !== undefined ? { maxTokens: prepared.maxTokens } : {}),
    ...(prepared.tools !== undefined ? { tools: prepared.tools } : {}),
    ...(prepared.options.raw?.[parsed.provider as ProviderName]
      ? { raw: prepared.options.raw[parsed.provider as ProviderName] }
      : {}),
    signal,
  };
}
