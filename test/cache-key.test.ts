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
});
