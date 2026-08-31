---
description: Deterministic cache keys, TTLs, and cost estimated from usage against a price table.
---

# Caching & cost

Two separate features that show up on every `CompleteResult`: `cached` and `cost`.

## Caching

Caching is **off** unless you set it. There is no surprise memoization.

```ts
const llm = createRouter({
  primary: "openai/gpt-4o-mini",
  cache: { ttl: "1h" },
});
```

### TTL

`ttl` accepts:

| Form | Example |
| ---- | ------- |
| Duration string | `"30m"`, `"1h"`, `"24h"`, `"7d"`, `"500ms"` |
| Milliseconds number | `3_600_000` |

Invalid strings throw at write time.

### When a call is eligible

| Condition | Cached? |
| --------- | ------- |
| No `cache` / `cache: false` | No |
| `temperature` omitted or `0` | Yes (if cache configured) |
| `temperature > 0` | **No**, unless `includeNonDeterministic: true` |
| `stream()` | Same rules — shares the cache with `complete()` |

```ts
cache: { ttl: "1h", includeNonDeterministic: true }
```

### Cache key

```ts
JSON.stringify({
  models: modelChain, // primary + fallbacks actually configured for this call
  messages,
  temperature: temperature ?? null,
  maxTokens: maxTokens ?? null,
})
```

Same prompt with a different fallback list is a different key. Same prompt via `complete()` and
`stream()` share a key.

**Not included today:** `tools`, `raw`, `system` that only lives on the router vs folded into
`messages` (system is part of the normalized `messages` array, so it *is* covered once
normalized). If tool definitions change but messages do not, you can get a wrong hit — disable
cache for tool loops.

### Hits

```ts
const res = await llm.complete(prompt);
res.cached; // true
res.latencyMs; // 0
res.attempts; // [] — no provider was called
```

`stream()` on a hit emits one immediate chunk (nothing left to generate incrementally).
`stream.result().cached` is still `true`.

### Storage

The built-in store is an in-process `MemoryCache`:

- Per router instance (create the router **once** at startup — see `examples/server.ts`)
- Cap **1000** entries; least-recently-used eviction when full
- TTL expiry checked on read
- Not shared across processes or servers

There is a `Cache` interface in the codebase for a future backend; it is not pluggable from
public config yet.

## Cost

Every successful live call sets `res.cost` in **estimated USD**:

```ts
cost = (usage.input / 1e6) * price.input + (usage.output / 1e6) * price.output
```

Prices live in `src/pricing/prices.json` (also exported as `PRICES` / `PRICING`):

| Model id | Input $/MTok | Output $/MTok |
| -------- | ------------ | ------------- |
| `gpt-4o` | 2.5 | 10 |
| `gpt-4o-mini` | 0.15 | 0.6 |
| `claude-sonnet-4-5` | 3 | 15 |
| `claude-haiku-4-5` | 1 | 5 |
| `llama-3.3-70b` | 0.59 | 0.79 |
| `llama-3.3-70b-versatile` | 0.59 | 0.79 |

Lookup is by the **model id only** (the part after `provider/`), not the full ref.

```ts
import { cost, PRICES } from "llm-sdk";

cost({ input: 1000, output: 200 }, "gpt-4o-mini");
```

### Unknown models → `$0`

If the model id is missing from the table, `cost` is **`0`**. That is silent. Treat `0` with
non-zero `usage` as "unpriced," or extend the price table in a fork / local patch until the
package grows coverage.

Cached hits still return the **original** stored `cost` from when the entry was written (they
do not re-price).

## Putting it together

```ts
const llm = createRouter({
  primary: "openai/gpt-4o-mini",
  cache: { ttl: "5m" },
  temperature: 0,
});

for (const question of faqTraffic) {
  const res = await llm.complete(question);
  total += res.cost;
  if (res.cached) hits++;
}
```

See `examples/cache.ts` for a support-FAQ scenario that prints API calls vs cache hits.

## Next

- [Configuration](/guide/configuration) — `cache` on global / route / call
- [Named routes](/guide/routes) — a `cheap` route with a long TTL
- [Tools](/guide/tools) — why tool calls and cache collide
