import { describe, expect, it } from "vitest";
import { createRouter } from "../src/index.js";
import { FakeAdapter } from "./helpers/fake-adapter.js";

describe("router integration", () => {
  it("falls back to the next provider", async () => {
    const llm = createRouter({
      primary: "test/primary",
      fallbacks: ["test/backup"],
      adapters: {
        test: new FakeAdapter("test", { fail: ["rate_limit", "ok"], responses: ["served by backup"] }),
      },
      retry: { attempts: 1 },
    });
    const res = await llm.complete("ping");
    expect(res.text).toBe("served by backup");
  });

  it("resolves named routes", async () => {
    const llm = createRouter({
      routes: {
        fast: { primary: "test/fast" },
        smart: { primary: "test/smart" },
        cheap: { primary: "test/cheap", cache: { ttl: "24h" } },
      },
      default: "smart",
      adapters: { test: new FakeAdapter("test", { responses: ["smart", "fast", "cheap"] }) },
    });
    expect((await llm.complete("plan")).text).toBe("smart");
    expect((await llm.route("fast").complete("classify")).text).toBe("fast");
    expect((await llm.route("cheap").complete("summarise")).text).toBe("cheap");
  });

  it("extracts structured data via a Zod-compatible schema", async () => {
    const llm = createRouter({
      primary: "test/extract",
      adapters: {
        test: new FakeAdapter("test", { responses: ['{"total": 42, "dueDate": "2026-01-01"}'] }),
      },
    });
    const schema = {
      parse(value: unknown) {
        const v = value as { total: number; dueDate: string };
        if (typeof v.total !== "number" || typeof v.dueDate !== "string") throw new Error("invalid");
        return v;
      },
    };
    const { data } = await llm.extract({ prompt: "Extract the invoice details", schema });
    expect(data).toEqual({ total: 42, dueDate: "2026-01-01" });
  });

  it("returns tool calls from complete()", async () => {
    const llm = createRouter({
      primary: "test/tools",
      adapters: {
        test: new FakeAdapter("test", {
          responses: ["Let me check the weather."],
          toolCalls: [{ id: "call_1", name: "getWeather", args: { city: "Addis Ababa" } }],
        }),
      },
    });
    const res = await llm.complete({
      messages: [{ role: "user", content: "What's the weather in Addis Ababa?" }],
      tools: [
        {
          name: "getWeather",
          description: "Current weather for a city",
          schema: { type: "object", properties: { city: { type: "string" } }, required: ["city"] },
        },
      ],
    });
    expect(res.toolCalls).toEqual([
      { id: "call_1", name: "getWeather", args: { city: "Addis Ababa" } },
    ]);
  });

  it("streams a response and exposes the final result", async () => {
    const llm = createRouter({
      primary: "test/stream",
      adapters: {
        test: new FakeAdapter("test", {
          responses: ["Streaming responses arrive incrementally, chunk by chunk."],
        }),
      },
    });
    const stream = llm.stream("Explain streaming in one sentence.");
    let text = "";
    for await (const chunk of stream) text += chunk.text;
    expect(text).toBe("Streaming responses arrive incrementally, chunk by chunk.");
    const final = await stream.result();
    expect(final.provider).toBe("test");
  });
});
