import { createAdapter } from "../adapters/index.js";
import { MemoryCache } from "../cache/index.js";
import type { Adapter, RouterConfig } from "../types.js";

/** Per-router cache + lazily created adapters. */
export class RouterState {
  readonly cache = new MemoryCache();
  readonly adapters = new Map<string, Adapter>();

  constructor(readonly config: RouterConfig) {}

  getAdapter(provider: string): Adapter {
    let adapter = this.adapters.get(provider);
    if (!adapter) {
      adapter =
        this.config.adapters?.[provider] ??
        createAdapter(provider, {
          ...(this.config.providers !== undefined ? { providers: this.config.providers } : {}),
        });
      this.adapters.set(provider, adapter);
    }
    return adapter;
  }
}
