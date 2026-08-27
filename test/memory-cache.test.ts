import { describe, expect, it, vi } from "vitest";
import { MemoryCache } from "../src/cache/memory.js";
import type { CacheEntry } from "../src/cache/types.js";

function entry(text: string): CacheEntry {
  return { text, provider: "test", model: "m", usage: { input: 0, output: 0 }, cost: 0, toolCalls: [] };
}

describe("MemoryCache", () => {
  it("returns what was set", () => {
    const cache = new MemoryCache();
    cache.set("a", entry("hello"), 1_000);
    expect(cache.get("a")?.text).toBe("hello");
  });

  it("returns undefined for a missing key", () => {
    expect(new MemoryCache().get("nope")).toBeUndefined();
  });

  it("expires an entry once its TTL has passed", () => {
    vi.useFakeTimers();
    const cache = new MemoryCache();
    cache.set("a", entry("hello"), 1_000);
    vi.advanceTimersByTime(1_001);
    expect(cache.get("a")).toBeUndefined();
    vi.useRealTimers();
  });

  it("evicts the least-recently-used entry once past the cap", () => {
    const cache = new MemoryCache(2);
    cache.set("a", entry("a"), 10_000);
    cache.set("b", entry("b"), 10_000);
    cache.set("c", entry("c"), 10_000); // pushes "a" out — "a" was least recently used

    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")?.text).toBe("b");
    expect(cache.get("c")?.text).toBe("c");
  });

  it("a get() refreshes recency, so a recently-read entry survives eviction", () => {
    const cache = new MemoryCache(2);
    cache.set("a", entry("a"), 10_000);
    cache.set("b", entry("b"), 10_000);
    cache.get("a"); // "a" is now more recently used than "b"
    cache.set("c", entry("c"), 10_000); // should push out "b", not "a"

    expect(cache.get("a")?.text).toBe("a");
    expect(cache.get("b")).toBeUndefined();
    expect(cache.get("c")?.text).toBe("c");
  });

  it("never exceeds maxEntries even after many writes", () => {
    const cache = new MemoryCache(50);
    for (let i = 0; i < 500; i++) {
      cache.set(`key-${i}`, entry(`v${i}`), 10_000);
    }
    expect((cache as unknown as { store: Map<string, unknown> }).store.size).toBe(50);
  });
});
