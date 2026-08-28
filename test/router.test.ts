import { describe, expect, it } from "vitest";
import { AllProvidersFailed, BadRequest, createRouter } from "../src/index.js";
import { FakeAdapter } from "./helpers/fake-adapter.js";

describe("createRouter", () => {
  it("a per-call model overrides a globally-configured primary; fallbacks still apply", async () => {
    const llm = createRouter({
      primary: "test/should-be-skipped",
      fallbacks: ["test/fallback"],
      adapters: {
        test: new FakeAdapter("test", { fail: ["rate_limit", "ok"], responses: ["served by fallback"] }),
      },
      retry: { attempts: 1 },
    });

    const res = await llm.complete("x", { model: "test/override" });
    expect(res.model).toBe("fallback");
    expect(res.text).toBe("served by fallback");
  });

  it("rejects model and primary set together in the same createRouter() config", () => {
    expect(() =>
      createRouter({ model: "openai/gpt-4o-mini", primary: "openai/gpt-4o" }),
    ).toThrow(BadRequest);
  });

  it("rejects model and primary set together on the same route", () => {
    expect(() =>
      createRouter({
        primary: "openai/gpt-4o",
        routes: { bad: { model: "openai/gpt-4o-mini", primary: "openai/gpt-4o" } },
      }),
    ).toThrow(BadRequest);
  });

  it("rejects model and primary set together in the same complete() call", async () => {
    const llm = createRouter({
      primary: "test/primary",
      adapters: { test: new FakeAdapter("test", { responses: ["unused"] }) },
    });

    await expect(
      llm.complete("x", { model: "test/a", primary: "test/b" }),
    ).rejects.toBeInstanceOf(BadRequest);
  });

  it("completes with a bare string via a custom adapter", async () => {
    const llm = createRouter({
      primary: "test/test",
      adapters: { test: new FakeAdapter("test", { responses: ["hello from the fake"] }) },
    });

    const res = await llm.complete("Hi");
    expect(res.text).toBe("hello from the fake");
    expect(res.provider).toBe("test");
    expect(res.model).toBe("test");
    expect(res.cached).toBe(false);
    expect(res.attempts).toHaveLength(1);
  });

  it("uses named routes", async () => {
    const llm = createRouter({
      routes: {
        fast: { primary: "test/fast" },
        smart: { primary: "test/smart" },
      },
      default: "smart",
      adapters: { test: new FakeAdapter("test", { responses: ["smart reply", "fast reply"] }) },
    });

    const smart = await llm.complete("x");
    expect(smart.model).toBe("smart");
    expect(smart.text).toBe("smart reply");

    const fast = await llm.route("fast").complete("y");
    expect(fast.model).toBe("fast");
    expect(fast.text).toBe("fast reply");
  });

  it("caches responses when ttl is set", async () => {
    const llm = createRouter({
      primary: "test/cache",
      cache: { ttl: "1h" },
      adapters: { test: new FakeAdapter("test", { responses: ["once", "twice"] }) },
    });

    const a = await llm.complete("same");
    const b = await llm.complete("same");
    expect(a.text).toBe("once");
    expect(b.text).toBe("once");
    expect(b.cached).toBe(true);
  });

  it("does not cache when temperature > 0 by default", async () => {
    const llm = createRouter({
      primary: "test/cache",
      cache: { ttl: "1h" },
      adapters: { test: new FakeAdapter("test", { responses: ["once", "twice"] }) },
    });

    const a = await llm.complete("same", { temperature: 0.9 });
    const b = await llm.complete("same", { temperature: 0.9 });
    expect(a.text).toBe("once");
    expect(b.text).toBe("twice");
    expect(b.cached).toBe(false);
  });

  it("caches non-deterministic calls when opted in", async () => {
    const llm = createRouter({
      primary: "test/cache",
      cache: { ttl: "1h", includeNonDeterministic: true },
      adapters: { test: new FakeAdapter("test", { responses: ["once", "twice"] }) },
    });

    const a = await llm.complete("same", { temperature: 0.9 });
    const b = await llm.complete("same", { temperature: 0.9 });
    expect(a.text).toBe("once");
    expect(b.text).toBe("once");
    expect(b.cached).toBe(true);
  });
});

describe("AllProvidersFailed", () => {
  it("includes attempts", async () => {
    const llm = createRouter({
      primary: "test/a",
      adapters: { test: new FakeAdapter("test", { fail: ["rate_limit"] }) },
      retry: { attempts: 1 },
    });

    try {
      await llm.complete("x");
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(AllProvidersFailed);
      expect((err as AllProvidersFailed).attempts[0]?.error).toBe("rate_limit");
    }
  });
});
