import { describe, expect, it } from "vitest";
import { createRouter } from "../src/index.js";
import { errorLabel } from "../src/policy/fallback.js";
import { AllProvidersFailed, BadRequest, ProviderError } from "../src/errors.js";
import { FakeAdapter } from "./helpers/fake-adapter.js";

describe("fallback chain", () => {
  it("walks to the next model after a failure", async () => {
    const events: Array<{ from: string; to: string }> = [];
    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/secondary"],
      adapters: {
        test: new FakeAdapter("test", { fail: ["rate_limit", "ok"], responses: ["fallback ok"] }),
      },
      retry: { attempts: 1 },
      onFallback: (from, to) => events.push({ from, to }),
    });

    const res = await llm.complete("go");
    expect(res.text).toBe("fallback ok");
    expect(res.model).toBe("secondary");
    expect(errorLabel(new ProviderError("x", { kind: "rate_limit", provider: "test" }))).toBe(
      "rate_limit",
    );
    expect(events).toEqual([{ from: "test/primary", to: "test/secondary" }]);
  });

  it("does not fail over on bad_request — fails loudly and immediately", async () => {
    const events: Array<{ from: string; to: string }> = [];
    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/secondary"],
      adapters: {
        test: new FakeAdapter("test", { fail: ["bad_request"], responses: ["should never be served"] }),
      },
      onFallback: (from, to) => events.push({ from, to }),
    });

    await expect(llm.complete("go")).rejects.toBeInstanceOf(BadRequest);
    expect(events).toEqual([]);
  });

  it("fails over on overloaded without waiting for backoff", async () => {
    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/secondary"],
      adapters: {
        test: new FakeAdapter("test", { fail: ["overloaded", "ok"], responses: ["served by secondary"] }),
      },
      retry: { attempts: 3, baseDelay: 2_000, maxDelay: 10_000 },
    });

    const started = Date.now();
    const res = await llm.complete("go");
    const elapsed = Date.now() - started;

    expect(res.text).toBe("served by secondary");
    expect(elapsed).toBeLessThan(500);
  });

  it("does not hammer an overloaded provider retries-times when there's no fallback", async () => {
    let callCount = 0;
    const adapter = new FakeAdapter("test", { fail: ["overloaded", "overloaded", "overloaded"], responses: [] });
    const originalComplete = adapter.complete.bind(adapter);
    adapter.complete = (...args: Parameters<typeof originalComplete>) => {
      callCount++;
      return originalComplete(...args);
    };

    const llm = createRouter({
      primary: "test/only",
      adapters: { test: adapter },
      retry: { attempts: 3, baseDelay: 2_000, maxDelay: 10_000 },
    });

    await expect(llm.complete("go")).rejects.toBeInstanceOf(AllProvidersFailed);
    expect(callCount).toBe(1);
  });

  it("fails over on a missing/invalid API key (auth) rather than stopping the chain", async () => {
    const events: Array<{ from: string; to: string }> = [];
    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/secondary"],
      adapters: {
        test: new FakeAdapter("test", { fail: ["auth", "ok"], responses: ["served by secondary"] }),
      },
      onFallback: (from, to) => events.push({ from, to }),
    });

    const res = await llm.complete("go");
    expect(res.text).toBe("served by secondary");
    expect(events).toEqual([{ from: "test/primary", to: "test/secondary" }]);
  });

  it("does not hammer a provider with a bad key retries-times when there's no fallback", async () => {
    let callCount = 0;
    const adapter = new FakeAdapter("test", { fail: ["auth", "auth", "auth"], responses: [] });
    const originalComplete = adapter.complete.bind(adapter);
    adapter.complete = (...args: Parameters<typeof originalComplete>) => {
      callCount++;
      return originalComplete(...args);
    };

    const llm = createRouter({
      primary: "test/only",
      adapters: { test: adapter },
      retry: { attempts: 3, baseDelay: 2_000, maxDelay: 10_000 },
    });

    await expect(llm.complete("go")).rejects.toBeInstanceOf(AllProvidersFailed);
    expect(callCount).toBe(1);
  });

  it("does not fail over on content_filter by default", async () => {
    const events: Array<{ from: string; to: string }> = [];
    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/secondary"],
      adapters: {
        test: new FakeAdapter("test", { fail: ["content_filter"], responses: ["should never be served"] }),
      },
      onFallback: (from, to) => events.push({ from, to }),
    });

    try {
      await llm.complete("go");
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(AllProvidersFailed);
      expect((err as AllProvidersFailed).attempts[0]?.error).toBe("content_filter");
    }
    expect(events).toEqual([]);
  });

  it("fails over on content_filter when explicitly opted in", async () => {
    const events: Array<{ from: string; to: string }> = [];
    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/secondary"],
      adapters: {
        test: new FakeAdapter("test", {
          fail: ["content_filter", "ok"],
          responses: ["served by secondary"],
        }),
      },
      allowContentFilterFailover: true,
      onFallback: (from, to) => events.push({ from, to }),
    });

    const res = await llm.complete("go");
    expect(res.text).toBe("served by secondary");
    expect(events).toEqual([{ from: "test/primary", to: "test/secondary" }]);
  });
});
