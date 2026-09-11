import type { Message, ToolDefinition } from "../types.js";
import { toJsonSchema } from "../adapters/zod-schema.js";

export function cacheKey(
  modelChain: string[],
  messages: Message[],
  opts: {
    temperature?: number;
    maxTokens?: number;
    tools?: ToolDefinition[];
    raw?: Partial<Record<string, Record<string, unknown>>>;
  } = {},
): string {
  return JSON.stringify({
    models: modelChain,
    messages,
    temperature: opts.temperature ?? null,
    maxTokens: opts.maxTokens ?? null,
    tools: opts.tools
      ? opts.tools.map((t) => ({
          name: t.name,
          description: t.description ?? null,
          schema: toJsonSchema(t.schema),
        }))
      : null,
    raw: opts.raw ?? null,
  });
}
