import { describe, expect, it } from "vitest";
import { BadRequest, createRouter } from "../src/index.js";
import { mergeOptions } from "../src/router/options.js";
import { FakeAdapter } from "./helpers/fake-adapter.js";

describe("configuration examples", () => {
  it("merges call > route > global for scalars and replaces fallbacks wholesale", async () => {
    const events: Array<{ from: string; to: string }> = [];
    const llm = createRouter({
      primary: "test/global-primary",
      fallbacks: ["test/global-fallback"],
      timeout: 60_000,
      system: "global system",
      routes: {
        fast: {
          primary: "test/route-primary",
          fallbacks: ["test/route-fallback"],
          timeout: 10_000,
        },
      },
      default: "fast",
      onFallback: (from, to) => events.push({ from, to }),
      adapters: {
        test: new FakeAdapter("test", {
          fail: ["rate_limit", "ok"],
          responses: ["served"],
        }),
      },
    });

    const res = await llm.complete("x", {
      model: "test/call-primary",
      timeout: 5_000,
      cache: false,
    });

    expect(res.model).toBe("route-fallback");
    expect(res.text).toBe("served");
    expect(res.attempts).toHaveLength(2);
    expect(res.attempts[0]).toMatchObject({ model: "call-primary", error: "rate_limit" });
    expect(res.attempts[1]).toMatchObject({ model: "route-fallback" });
    expect(events).toEqual([{ from: "test/call-primary", to: "test/route-fallback" }]);
  });

  it("shallow-merges retry and raw across layers", () => {
    const merged = mergeOptions(
      {
        primary: "test/a",
        retry: { attempts: 2, baseDelay: 1, maxDelay: 10 },
        raw: { openai: { seed: 1 } },
      },
      {
        primary: "test/b",
        retry: { attempts: 1 },
        raw: { anthropic: { top_k: 40 } },
      },
      { raw: { openai: { seed: 99 } } },
    );

    expect(merged.retry).toEqual({ attempts: 1, baseDelay: 1, maxDelay: 10 });
    expect(merged.raw).toEqual({
      openai: { seed: 99 },
      anthropic: { top_k: 40 },
    });
    expect(merged.primary).toBe("test/b");
  });

  it("rejects model and primary in the same layer; allows call model over global primary", async () => {
    expect(() =>
      createRouter({ model: "openai/gpt-4o-mini", primary: "openai/gpt-4o" }),
    ).toThrow(BadRequest);

    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/fallback"],
      adapters: {
        test: new FakeAdapter("test", { responses: ["from override"] }),
      },
    });

    const res = await llm.complete("x", { model: "test/override" });
    expect(res.model).toBe("override");
    expect(res.text).toBe("from override");
    expect(res.attempts).toHaveLength(1);
  });

  it("registers a custom adapter under any provider name", async () => {
    const llm = createRouter({
      primary: "acme/fast-model",
      adapters: { acme: new FakeAdapter("acme", { responses: ["from acme"] }) },
    });

    const res = await llm.complete("hi");
    expect(res.provider).toBe("acme");
    expect(res.model).toBe("fast-model");
    expect(res.text).toBe("from acme");
  });
});
