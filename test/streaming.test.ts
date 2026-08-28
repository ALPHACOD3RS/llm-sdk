import { describe, expect, it } from "vitest";
import { createRouter } from "../src/index.js";
import { AllProvidersFailed, BadRequest } from "../src/errors.js";
import { FakeAdapter } from "./helpers/fake-adapter.js";

async function collect(stream: AsyncIterable<{ text: string; done?: boolean }>): Promise<string[]> {
  const chunks: string[] = [];
  for await (const chunk of stream) chunks.push(chunk.text);
  return chunks;
}

describe("stream()", () => {
  it("streams a short response as a single buffered flush + done sentinel", async () => {
    const llm = createRouter({
      primary: "test/test",
      adapters: { test: new FakeAdapter("test", { responses: ["hello world"] }) },
    });

    const stream = llm.stream("hi");
    const chunks = await collect(stream);

    expect(chunks).toEqual(["hello world", ""]);
    const result = await stream.result();
    expect(result.text).toBe("hello world");
    expect(result.provider).toBe("test");
    expect(result.cached).toBe(false);
  });

  it("streams a long response incrementally once the buffer fills", async () => {
    const words = Array.from({ length: 15 }, () => "word");
    const llm = createRouter({
      primary: "test/test",
      adapters: { test: new FakeAdapter("test", { responses: [words.join(" ")] }) },
    });

    const stream = llm.stream("hi");
    const chunks = await collect(stream);

    expect(chunks.length).toBeGreaterThan(2);
    expect(chunks.join("")).toBe(words.join(" "));
    const result = await stream.result();
    expect(result.text).toBe(words.join(" "));
  });

  it("result() works without the caller manually iterating", async () => {
    const llm = createRouter({
      primary: "test/test",
      adapters: { test: new FakeAdapter("test", { responses: ["hello"] }) },
    });
    const result = await llm.stream("hi").result();
    expect(result.text).toBe("hello");
  });

  it("fails over to the next provider when the failure happens before the buffer flushes", async () => {
    const events: Array<{ from: string; to: string }> = [];
    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/secondary"],
      adapters: {
        test: new FakeAdapter("test", { fail: ["rate_limit", "ok"], responses: ["served by secondary"] }),
      },
      onFallback: (from, to) => events.push({ from, to }),
    });

    const stream = llm.stream("hi");
    const chunks = await collect(stream);

    expect(chunks.join("")).toBe("served by secondary");
    expect(events).toEqual([{ from: "test/primary", to: "test/secondary" }]);
    const result = await stream.result();
    expect(result.provider).toBe("test");
    expect(result.model).toBe("secondary");
  });

  it("does not fail over once the buffer has already flushed to the caller", async () => {
    const events: Array<{ from: string; to: string }> = [];
    const longResponse = Array.from({ length: 15 }, () => "word").join(" ");
    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/secondary"],
      adapters: {
        test: new FakeAdapter("test", {
          fail: ["rate_limit"],
          responses: [longResponse],
          streamFailAfterChunks: 12,
        }),
      },
      onFallback: (from, to) => events.push({ from, to }),
    });

    const stream = llm.stream("hi");
    await expect(collect(stream)).rejects.toThrow();
    expect(events).toEqual([]);
  });

  it("throws BadRequest immediately on bad_request, never failing over", async () => {
    const events: Array<{ from: string; to: string }> = [];
    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/secondary"],
      adapters: {
        test: new FakeAdapter("test", { fail: ["bad_request"], responses: ["should never be served"] }),
      },
      onFallback: (from, to) => events.push({ from, to }),
    });

    await expect(collect(llm.stream("hi"))).rejects.toBeInstanceOf(BadRequest);
    expect(events).toEqual([]);
  });

  it("does not fail over on content_filter by default", async () => {
    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/secondary"],
      adapters: {
        test: new FakeAdapter("test", { fail: ["content_filter"], responses: ["should never be served"] }),
      },
    });

    await expect(collect(llm.stream("hi"))).rejects.toBeInstanceOf(AllProvidersFailed);
  });

  it("serves a repeated call from cache as a single immediate chunk", async () => {
    const llm = createRouter({
      primary: "test/test",
      cache: { ttl: "1h" },
      adapters: { test: new FakeAdapter("test", { responses: ["once", "twice"] }) },
    });

    const first = await collect(llm.stream("same"));
    expect(first).toEqual(["once", ""]);

    const stream = llm.stream("same");
    const second = await collect(stream);
    expect(second).toEqual(["once", ""]); // not "twice" — never reached the adapter

    const result = await stream.result();
    expect(result.cached).toBe(true);
    expect(result.latencyMs).toBe(0);
  });

  it("shares its cache with complete() — a stream() can replay a complete() response", async () => {
    const llm = createRouter({
      primary: "test/test",
      cache: { ttl: "1h" },
      adapters: { test: new FakeAdapter("test", { responses: ["from complete()"] }) },
    });

    const first = await llm.complete("same");
    expect(first.cached).toBe(false);

    const stream = llm.stream("same");
    const chunks = await collect(stream);
    expect(chunks).toEqual(["from complete()", ""]);

    const result = await stream.result();
    expect(result.cached).toBe(true);
  });

  it("does not cache when temperature > 0 by default", async () => {
    const llm = createRouter({
      primary: "test/test",
      cache: { ttl: "1h" },
      adapters: { test: new FakeAdapter("test", { responses: ["once", "twice"] }) },
    });

    const first = await collect(llm.stream("same", { temperature: 0.9 }));
    const second = await collect(llm.stream("same", { temperature: 0.9 }));
    expect(first).toEqual(["once", ""]);
    expect(second).toEqual(["twice", ""]); // both actually reached the adapter
  });

  it("fails over on content_filter when opted in", async () => {
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
    });

    const chunks = await collect(llm.stream("hi"));
    expect(chunks.join("")).toBe("served by secondary");
  });
});
