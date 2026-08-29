import { describe, expect, it } from "vitest";
import { AllProvidersFailed, BadRequest, createRouter } from "../src/index.js";
import { FakeAdapter } from "./helpers/fake-adapter.js";

describe("guide examples", () => {
  it("named routes: default + route() + unknown name", async () => {
    const llm = createRouter({
      routes: {
        fast: { primary: "test/fast" },
        smart: { primary: "test/smart", fallbacks: ["test/smart-fb"] },
        cheap: { primary: "test/cheap", cache: { ttl: "1h" } },
      },
      default: "smart",
      adapters: { test: new FakeAdapter("test", { responses: ["ok"] }) },
    });

    expect((await llm.complete("x")).model).toBe("smart");
    expect((await llm.route("fast").complete("x")).model).toBe("fast");
    expect(() => llm.route("nope" as "fast")).toThrow(BadRequest);
  });

  it("fallback: auth skips same-provider retry and fires onFallback", async () => {
    const events: Array<{ from: string; to: string }> = [];
    const llm = createRouter({
      primary: "test/a",
      fallbacks: ["test/b"],
      retry: { attempts: 3 },
      onFallback: (from, to) => events.push({ from, to }),
      adapters: {
        test: new FakeAdapter("test", {
          fail: ["auth", "ok"],
          responses: ["recovered"],
        }),
      },
    });

    const res = await llm.complete("x");
    expect(res.text).toBe("recovered");
    expect(res.attempts).toHaveLength(2);
    expect(res.attempts[0]?.error).toBe("auth");
    expect(events).toEqual([{ from: "test/a", to: "test/b" }]);
  });

  it("content_filter stops the chain by default", async () => {
    const llm = createRouter({
      primary: "test/a",
      fallbacks: ["test/b"],
      adapters: {
        test: new FakeAdapter("test", { fail: ["content_filter"], responses: ["nope"] }),
      },
    });

    const err = await llm.complete("x").then(
      () => undefined,
      (e: unknown) => e,
    );
    expect(err).toBeInstanceOf(AllProvidersFailed);
    expect((err as AllProvidersFailed).attempts).toHaveLength(1);
    expect((err as AllProvidersFailed).attempts[0]?.error).toBe("content_filter");
  });

  it("tools round-trip fields are accepted on messages", async () => {
    const llm = createRouter({
      primary: "test/t",
      adapters: {
        test: new FakeAdapter("test", {
          responses: ["done"],
          toolCalls: [{ id: "call_1", name: "lookup", args: { id: "1" } }],
        }),
      },
    });

    const first = await llm.complete({
      messages: [{ role: "user", content: "go" }],
      tools: [{ name: "lookup", schema: { type: "object", properties: {} } }],
    });
    expect(first.toolCalls[0]?.name).toBe("lookup");

    const second = await llm.complete({
      messages: [
        { role: "user", content: "go" },
        { role: "assistant", content: first.text, toolCalls: first.toolCalls },
        {
          role: "tool",
          toolCallId: first.toolCalls[0]!.id,
          content: JSON.stringify({ ok: true }),
        },
      ],
    });
    expect(second.text).toBe("done");
  });
});
