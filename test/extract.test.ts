import { describe, expect, it } from "vitest";
import { z } from "zod";
import { extractWithSchema } from "../src/extract.js";
import type { CompleteInput, CompleteResult } from "../src/types.js";

function stubResult(text: string): CompleteResult {
  return {
    text,
    provider: "test",
    model: "extract",
    usage: { input: 0, output: 0 },
    cost: 0,
    cached: false,
    latencyMs: 0,
    attempts: [],
    toolCalls: [],
  };
}

describe("extractWithSchema prompt building", () => {
  it("describes an auto-detected Zod-shaped schema's fields in the prompt", async () => {
    const seen: CompleteInput[] = [];
    const zodLikeSchema = {
      shape: {
        total: { _def: { typeName: "ZodNumber" } },
        dueDate: { _def: { typeName: "ZodString" } },
      },
      safeParse: (v: unknown) => ({ success: true, data: v }),
    };

    await extractWithSchema(
      async (input) => {
        seen.push(input);
        return stubResult('{"total": 1, "dueDate": "x"}');
      },
      { prompt: "Extract the invoice", schema: zodLikeSchema },
    );

    expect(seen[0]?.prompt).toContain("total: number");
    expect(seen[0]?.prompt).toContain("dueDate: string");
  });

  it("uses an explicit schemaDescription override when given", async () => {
    const seen: CompleteInput[] = [];
    const schema = { safeParse: (v: unknown) => ({ success: true, data: v }) };

    await extractWithSchema(
      async (input) => {
        seen.push(input);
        return stubResult("{}");
      },
      { prompt: "Extract", schema, schemaDescription: "{ custom: field }" },
    );

    expect(seen[0]?.prompt).toContain("{ custom: field }");
  });

  it("falls back to a generic instruction for schemas with no shape or override", async () => {
    const seen: CompleteInput[] = [];
    const schema = { safeParse: (v: unknown) => ({ success: true, data: v }) };

    await extractWithSchema(
      async (input) => {
        seen.push(input);
        return stubResult("{}");
      },
      { prompt: "Extract", schema },
    );

    expect(seen[0]?.prompt).toContain("matches the requested schema");
  });
});

describe("extractWithSchema type inference", () => {
  it("infers T from a real Zod schema with no explicit generic", async () => {
    const schema = z.object({ total: z.number(), dueDate: z.string() });

    const res = await extractWithSchema(
      async () => stubResult('{"total": 42, "dueDate": "2026-01-01"}'),
      { prompt: "Extract the invoice", schema },
    );

    const total: number = res.data.total;
    const dueDate: string = res.data.dueDate;
    expect(total).toBe(42);
    expect(dueDate).toBe("2026-01-01");
  });

  it("still allows T to be pinned explicitly for a non-inferable (plain) schema", async () => {
    interface Invoice {
      total: number;
    }
    const rawSchema = { parse: (v: unknown) => v as Invoice };

    const res = await extractWithSchema<typeof rawSchema, Invoice>(
      async () => stubResult('{"total": 5}'),
      { prompt: "Extract", schema: rawSchema, schemaDescription: "{ total: number }" },
    );

    const total: number = res.data.total;
    expect(total).toBe(5);
  });
});
