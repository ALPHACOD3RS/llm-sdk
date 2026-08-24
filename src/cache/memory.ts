import type { Cache, CacheEntry } from "./types.js";

const DEFAULT_MAX_ENTRIES = 1000;

interface StoredEntry {
  value: CacheEntry;
  expiresAt: number;
}

/** In-process cache with TTL and LRU eviction (default cap 1000). */
export class MemoryCache implements Cache {
  private readonly store = new Map<string, StoredEntry>();

  constructor(private readonly maxEntries: number = DEFAULT_MAX_ENTRIES) {}

  get(key: string): CacheEntry | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    this.store.delete(key);
    this.store.set(key, entry); // move to most-recently-used
    return entry.value;
  }

  set(key: string, value: CacheEntry, ttlMs: number): void {
    this.store.delete(key);
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
    if (this.store.size > this.maxEntries) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) this.store.delete(oldest);
    }
  }
}
