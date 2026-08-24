import type { Message } from "../types.js";

export function cacheKey(
  modelChain: string[],
  messages: Message[],
  opts: { temperature?: number; maxTokens?: number } = {},
): string {
  return JSON.stringify({
    models: modelChain,
    messages,
    temperature: opts.temperature ?? null,
    maxTokens: opts.maxTokens ?? null,
  });
}
