---
description: Name your tradeoffs once — fast, smart, cheap — then call them by name instead of
  repeating model strings.
---

# Named routes

Different parts of an app need different tradeoffs. Triage wants cheap and fast. A customer-facing
reply wants quality. A nightly digest wants long cache TTLs. Scatter those choices as string
literals and every call site becomes a policy decision. Put them in one place and call them by
name.

```ts
import { createRouter } from "llm-sdk";

const llm = createRouter({
  routes: {
    fast: {
      primary: "groq/llama-3.3-70b",
      fallbacks: ["openai/gpt-4o-mini"],
      timeout: 8_000,
    },
    smart: {
      primary: "anthropic/claude-sonnet-4-5",
      fallbacks: ["openai/gpt-4o"],
      retry: { attempts: 3 },
    },
    cheap: {
      primary: "openai/gpt-4o-mini",
      cache: { ttl: "24h" },
      temperature: 0,
    },
  },
  default: "smart",
  // Shared across every route unless a route overrides them:
  onFallback: (from, to, err) => console.warn("fallback", { from, to, err }),
  timeout: 60_000,
});

await llm.complete(prompt); // uses "smart"
await llm.route("fast").complete(ticket);
await llm.route("cheap").complete(digestBody);
```

## How `route()` works

`createRouter({ routes, default: "smart" })` returns a router already bound to `"smart"`. Calling
`llm.route("fast")` returns a **new** router handle that shares the same cache, adapters, and
global config — it does not recreate anything expensive.

```ts
const fast = llm.route("fast");
const a = await fast.complete("classify A");
const b = await fast.complete("classify B"); // same route, same shared cache
```

An unknown name throws `BadRequest` immediately:

```ts
llm.route("smrt"); // BadRequest: Unknown route "smrt"
```

Route names are typed from the config object. With `as const` inference (the default for
`createRouter`), TypeScript rejects typos at compile time:

```ts
await llm.route("smrt").complete(prompt); // type error — not assignable to "fast" | "smart" | "cheap"
```

## What a route can set

A route is a `RouteConfig` — the same keys as a call (see [Configuration](/guide/configuration)):

| Typical use | Route fields |
| ----------- | ------------ |
| Model chain | `primary`, `fallbacks`, or `model` |
| Latency | `timeout`, `retry` |
| Cost / memoization | `cache`, `temperature`, `maxTokens` |
| Prompt defaults | `system` |
| Tools for that surface | `tools` |
| Provider extras | `raw` |

Router-only fields (`routes`, `default`, `onFallback`, `providers`, `adapters`) stay on
`createRouter()` — they are not per-route.

## Merge order with routes

For every call:

**call options > active route > global config**

```ts
const llm = createRouter({
  timeout: 60_000,
  fallbacks: ["openai/gpt-4o"],
  routes: {
    fast: {
      primary: "groq/llama-3.3-70b",
      timeout: 8_000,
      fallbacks: ["openai/gpt-4o-mini"],
    },
  },
  default: "fast",
});

// Uses route timeout 8s and route fallbacks — not the global ones.
await llm.complete(prompt);

// Call wins: 3s budget, still on the "fast" primary unless you also pass model.
await llm.complete(prompt, { timeout: 3_000 });

// Swap the model for one call; route fallbacks still apply.
await llm.complete(prompt, { model: "openai/gpt-4o-mini" });
```

`fallbacks` are replaced as a whole list, not concatenated. If the route sets
`fallbacks: ["openai/gpt-4o-mini"]`, the global `fallbacks` are ignored for that route.

## Routes vs per-call `model`

| Reach for… | When |
| ---------- | ---- |
| **Named routes** | The same tradeoff appears in many places (product surfaces, queues, cron jobs) |
| **Per-call `model`** | A one-off override on an otherwise shared route or global primary |
| **Both** | Route defines the chain; a rare call pins `model` for that request only |

Do **not** set `model` and `primary` on the same route object — that throws `BadRequest`. A call
passing `model` while the route has `primary` is fine.

## Default route

- With `default: "smart"`, bare `llm.complete()` uses the smart route.
- Without `default`, you must either set a top-level `primary`, or always call `llm.route(…)`.
- `createRouter()` requires `primary` **or** `routes` (at least one). Routes-only without a
  `default` and without calling `route()` will fail at call time with "No primary model
  configured" if nothing resolves a chain.

## Shared state

All `route()` handles share:

- The in-process `MemoryCache`
- Built-in and custom `adapters`
- `providers` overrides
- `onFallback`

So a cache write from `route("cheap")` can be hit by another handle that builds the same cache
key (same model chain + messages + temperature + maxTokens). See
[Caching & cost](/guide/caching-cost).

## Next

- [Fallback & retry](/guide/fallback) — what happens when a route's primary is down
- [Configuration](/guide/configuration) — full option reference
- [Caching & cost](/guide/caching-cost) — when `cheap` actually saves money
