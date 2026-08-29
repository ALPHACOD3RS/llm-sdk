import { describe, expect, it } from "vitest";
import { AllProvidersFailed, BadRequest, createRouter } from "../src/index.js";
import { FakeAdapter } from "./helpers/fake-adapter.js";

describe("getting started examples", () => {
  it("falls back to the next provider and records both attempts", async () => {
    const llm = createRouter({
      primary: "test/fail",
      fallbacks: ["test/ok"],
      adapters: {
        test: new FakeAdapter("test", {
          fail: ["rate_limit", "ok"],
          responses: ["served by the fallback"],
        }),
      },
    });

    const res = await llm.complete("hi");

    expect(res.text).toBe("served by the fallback");
    expect(res.attempts).toHaveLength(2);
    expect(res.attempts[0]?.error).toBe("rate_limit");
    expect(res.cached).toBe(false);
    expect(res.toolCalls).toEqual([]);
    expect(Object.keys(res).sort()).toEqual(
      [
        "attempts",
        "cached",
        "cost",
        "latencyMs",
        "model",
        "provider",
        "text",
        "toolCalls",
        "usage",
      ].sort(),
    );
  });

  it("accepts a string, an input object, or messages", async () => {
    const llm = createRouter({
      primary: "test/x",
      adapters: { test: new FakeAdapter("test", { responses: ["ok"] }) },
    });

    expect((await llm.complete("prompt")).text).toBe("ok");
    expect(
      (
        await llm.complete({
          system: "You are a terse release-notes editor.",
          prompt: "Summarise this changelog in one line: ...",
          maxTokens: 120,
          temperature: 0,
        })
      ).text,
    ).toBe("ok");
    expect(
      (
        await llm.complete({
          messages: [
            { role: "user", content: "What broke in v2?" },
            { role: "assistant", content: "The auth middleware changed shape." },
            { role: "user", content: "Show me the migration." },
          ],
        })
      ).text,
    ).toBe("ok");
  });

  it("uses the default route, and route() to pick another", async () => {
    const llm = createRouter({
      routes: {
        fast: { primary: "test/llama-3.3-70b" },
        smart: { primary: "test/claude-sonnet-4-5" },
        cheap: { primary: "test/gpt-4o-mini", cache: { ttl: "24h" } },
      },
      default: "smart",
      adapters: { test: new FakeAdapter("test", { responses: ["ok"] }) },
    });

    expect((await llm.complete("x")).model).toBe("claude-sonnet-4-5");
    expect((await llm.route("fast").complete("x")).model).toBe("llama-3.3-70b");
    expect(() => llm.route("smrt" as "fast")).toThrow(BadRequest);
  });

  it("throws AllProvidersFailed with the attempt trail", async () => {
    const deadChain = () =>
      createRouter({
        primary: "test/a",
        fallbacks: ["test/b"],
        adapters: { test: new FakeAdapter("test", { fail: ["timeout", "timeout"] }) },
      });

    await expect(deadChain().complete("x")).rejects.toThrow(AllProvidersFailed);

    const err = await deadChain()
      .complete("x")
      .then(
        () => undefined,
        (e: unknown) => e,
      );

    expect(err).toBeInstanceOf(AllProvidersFailed);
    expect((err as AllProvidersFailed).attempts).toHaveLength(2);
  });
});
