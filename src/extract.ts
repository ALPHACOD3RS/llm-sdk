import { BadRequest } from "./errors.js";
import type {
  CallOptions,
  CompleteInput,
  CompleteResult,
  ExtractInput,
  ExtractResult,
  InferSchemaOutput,
} from "./types.js";

type Completer = (input: CompleteInput, options?: CallOptions) => Promise<CompleteResult>;

function zodFieldKind(field: unknown): string | undefined {
  const f = field as { _def?: { typeName?: string }; def?: { type?: string } };
  const name = f._def?.typeName ?? f.def?.type;
  return name ? String(name).replace(/^Zod/, "").toLowerCase() : undefined;
}

/** Describe a Zod object `.shape` for the extract prompt. */
function describeSchema(schema: unknown): string | undefined {
  const s = schema as { shape?: Record<string, unknown> };
  if (!s || typeof s !== "object" || !s.shape || typeof s.shape !== "object") return undefined;

  const fields = Object.entries(s.shape).map(([key, field]) => {
    const kind = zodFieldKind(field);
    return kind ? `${key}: ${kind}` : key;
  });
  return fields.length > 0 ? `{ ${fields.join(", ")} }` : undefined;
}

export async function extractWithSchema<S, T = InferSchemaOutput<S>>(
  complete: Completer,
  input: ExtractInput<S>,
  call: CallOptions = {},
): Promise<ExtractResult<T>> {
  const schema = input.schema as {
    parse?: (v: unknown) => T;
    safeParse?: (v: unknown) => { success: boolean; data?: T; error?: unknown };
  };

  if (!schema || (typeof schema.parse !== "function" && typeof schema.safeParse !== "function")) {
    throw new BadRequest("extract() requires a Zod schema (or compatible parse/safeParse)");
  }

  const shape = input.schemaDescription ?? describeSchema(input.schema);
  const instruction = shape
    ? `Respond with JSON only matching this shape: ${shape}. No markdown.`
    : "Respond with JSON only that matches the requested schema. No markdown.";
  const basePrompt = [input.prompt, "", instruction].join("\n");

  const maxSchemaRetries = 2;
  let lastErr: unknown;

  for (let i = 0; i < maxSchemaRetries; i++) {
    const prompt =
      i === 0
        ? basePrompt
        : `${basePrompt}\n\nPrevious JSON was invalid:\n${String(lastErr)}\n\nFix it.`;

    const completeInput: CompleteInput = {
      prompt,
      ...(input.system !== undefined ? { system: input.system } : {}),
    };

    const res = await complete(completeInput, {
      ...call,
      temperature: call.temperature ?? 0,
    });

    try {
      const jsonText = stripJsonFence(res.text);
      const parsed = JSON.parse(jsonText) as unknown;
      const data =
        typeof schema.parse === "function"
          ? schema.parse(parsed)
          : (() => {
              const r = schema.safeParse!(parsed);
              if (!r.success) throw r.error;
              return r.data as T;
            })();

      return {
        data,
        text: res.text,
        provider: res.provider,
        model: res.model,
        usage: res.usage,
        cost: res.cost,
        cached: res.cached,
        latencyMs: res.latencyMs,
        attempts: res.attempts,
      };
    } catch (err) {
      lastErr = err;
    }
  }

  throw new BadRequest(`extract() failed to produce valid data: ${String(lastErr)}`);
}

function stripJsonFence(text: string): string {
  const trimmed = text.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/i.exec(trimmed);
  return fence?.[1]?.trim() ?? trimmed;
}
