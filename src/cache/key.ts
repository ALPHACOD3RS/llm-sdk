import { createHash } from "node:crypto";
import type { Message, ToolDefinition } from "../types.js";
import { toJsonSchema } from "../adapters/zod-schema.js";

/** Deep-clones a value with object keys sorted, so key order doesn't affect the JSON output. */
function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value !== null && typeof value === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = normalize((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

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
  const payload = JSON.stringify(
    normalize({
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
    }),
  );
  return createHash("sha256").update(payload).digest("hex");
}
