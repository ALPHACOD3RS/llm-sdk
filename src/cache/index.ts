export type { Cache, CacheEntry } from "./types.js";
export { MemoryCache } from "./memory.js";
export { cacheKey } from "./key.js";

/** Parse `1h` / `30m` / `24h` / ms number → milliseconds. */
export function parseTtl(ttl: string | number): number {
  if (typeof ttl === "number") return ttl;
  const match = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/i.exec(ttl.trim());
  if (!match) {
    throw new Error(`Invalid TTL "${ttl}". Use e.g. "30m", "1h", or milliseconds.`);
  }
  const n = Number(match[1]);
  const unit = match[2]!.toLowerCase();
  switch (unit) {
    case "ms":
      return n;
    case "s":
      return n * 1000;
    case "m":
      return n * 60_000;
    case "h":
      return n * 3_600_000;
    case "d":
      return n * 86_400_000;
    default:
      return n;
  }
}
