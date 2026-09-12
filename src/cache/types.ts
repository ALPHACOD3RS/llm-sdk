import type { ToolCall, Usage } from "../types.js";

export interface CacheEntry {
  text: string;
  provider: string;
  model: string;
  usage: Usage;
  cost: number;
  unknownModel: boolean;
  toolCalls: ToolCall[];
}

export interface Cache {
  get(key: string): CacheEntry | undefined;
  set(key: string, value: CacheEntry, ttlMs: number): void;
}
