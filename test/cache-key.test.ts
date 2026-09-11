import { describe, expect, it } from "vitest";
import { cacheKey } from "../src/cache/key.js";

describe("cacheKey", () => {
  it("is stable for identical inputs", () => {
    const a = cacheKey(["openai/a"], [{ role: "user", content: "hi" }], {
      temperature: 0.2,
      maxTokens: 100,
    });
    const b = cacheKey(["openai/a"], [{ role: "user", content: "hi" }], {
      temperature: 0.2,
      maxTokens: 100,
    });
    expect(a).toBe(b);
  });

  it("changes when messages change", () => {
    const a = cacheKey(["openai/a"], [{ role: "user", content: "hi" }]);
    const b = cacheKey(["openai/a"], [{ role: "user", content: "bye" }]);
    expect(a).not.toBe(b);
  });

  it("changes when model chain changes", () => {
    const a = cacheKey(["openai/a"], [{ role: "user", content: "hi" }]);
    const b = cacheKey(["openai/a", "openai/b"], [{ role: "user", content: "hi" }]);
    expect(a).not.toBe(b);
  });

  it("changes when tools change", () => {
    const messages = [{ role: "user" as const, content: "hi" }];
    const a = cacheKey(["openai/a"], messages, {
      tools: [{ name: "lookup", schema: { type: "object", properties: { id: { type: "string" } } } }],
    });
    const b = cacheKey(["openai/a"], messages, {
      tools: [{ name: "search", schema: { type: "object", properties: { q: { type: "string" } } } }],
    });
    expect(a).not.toBe(b);
  });

  it("changes when raw provider params change", () => {
    const messages = [{ role: "user" as const, content: "hi" }];
    const a = cacheKey(["openai/a"], messages, { raw: { openai: { seed: 1 } } });
    const b = cacheKey(["openai/a"], messages, { raw: { openai: { seed: 2 } } });
    expect(a).not.toBe(b);
  });

  it("normalizes Zod-like tool schemas so equivalent shapes share a key", () => {
    const messages = [{ role: "user" as const, content: "hi" }];
    const zodLike = {
      _def: {
        typeName: "ZodObject",
        shape: () => ({
          city: { _def: { typeName: "ZodString" } },
        }),
      },
      shape: {
        city: { _def: { typeName: "ZodString" } },
      },
    };
    const a = cacheKey(["openai/a"], messages, {
      tools: [{ name: "weather", schema: zodLike }],
    });
    const b = cacheKey(["openai/a"], messages, {
      tools: [{ name: "weather", schema: zodLike }],
    });
    expect(a).toBe(b);
  });

  it("returns a bounded SHA-256 hex digest regardless of prompt size", () => {
    const key = cacheKey(["openai/a"], [{ role: "user", content: "x".repeat(50_000) }]);
    expect(key).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is independent of object key order", () => {
    const a = cacheKey(["openai/a"], [{ role: "user", content: "hi" }]);
    const b = cacheKey(["openai/a"], [{ content: "hi", role: "user" }]);
    expect(a).toBe(b);
  });
});
