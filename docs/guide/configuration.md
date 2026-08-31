---
description: Every option, where it can be set, and how global, route, and per-call values resolve.
---

# Configuration

Options use the **same keys** at three layers. Later layers win:

1. **Global** — `createRouter({ … })`
2. **Route** — `routes.fast` / `routes.smart` / …
3. **Call** — the second argument to `complete()` / `stream()` / `extract()`

```ts
const llm = createRouter({
  primary: "anthropic/claude-sonnet-4-5",
  fallbacks: ["openai/gpt-4o", "groq/llama-3.3-70b"],

  retry: { attempts: 3, baseDelay: 500, maxDelay: 10_000 },
  timeout: 60_000, // total budget across all attempts (default if omitted)
  cache: { ttl: "1h" }, // omit to disable caching entirely
  system: "Be concise.",
  onFallback: (from, to, err) => console.warn("fallback", { from, to, err }),
});

await llm.complete(prompt, {
  model: "anthropic/claude-haiku-4-5", // overrides primary for this call; fallbacks still apply
  timeout: 5_000,
  cache: false,
});
```

You almost never need every field. Defaults are enough for a first integration; dig in when
latency, cost, or failure modes matter.

## Merge rules

| Field | How it merges |
| ----- | ------------- |
| Most scalars (`timeout`, `temperature`, `maxTokens`, `system`, `tools`, …) | Last layer wins |
| `retry` | Shallow-merged (`{ ...global.retry, ...route.retry, ...call.retry }`) |
| `cache` | Last layer wins; `cache: false` turns caching off for that call |
| `fallbacks` | Last layer wins (the whole list is replaced, not concatenated) |
| `raw` | Shallow-merged per provider (`global.raw.anthropic` + `call.raw.anthropic`) |

`model` and `primary` cannot both appear **in the same object** — `createRouter({…})`, one route,
or one call. `model` always wins inside a layer, so a sibling `primary` would be dead code; that
throws `BadRequest` immediately. A per-call `model` overriding a global or route `primary` is
normal and supported.

```ts
// OK — call overrides global primary
await llm.complete(prompt, { model: "openai/gpt-4o-mini" });

// BadRequest — both in the same object
createRouter({ model: "openai/gpt-4o-mini", primary: "openai/gpt-4o" });
```

## Option reference

Same keys on `RouterConfig`, each route, and each call (except router-only fields marked ★).

| Key | Default | Notes |
| --- | ------- | ----- |
| `primary` | — | First model in the chain (`provider/model`) |
| `model` | — | Alias that replaces `primary` for that layer; fallbacks still apply |
| `fallbacks` | `[]` | Tried in order after the primary fails (see [Fallback & retry](/guide/fallback)) |
| `retry` | `{ attempts: 1 }` | Same-provider retries before failing over. `baseDelay` / `maxDelay` default to `500` / `10_000` ms |
| `timeout` | `60_000` | **Total** budget across every attempt and backoff wait, not per request |
| `cache` | off | `{ ttl }` or `false`. See [Caching & cost](/guide/caching-cost) |
| `temperature` | provider default | Values `> 0` skip the cache unless `includeNonDeterministic: true` |
| `maxTokens` | provider default | Anthropic requires a value; the adapter sends `1024` if you omit it |
| `system` | — | Injected as a system message when the input is a string or `{ prompt }` |
| `messages` | — | Prefer passing these on the call input, not as a sticky global |
| `tools` | — | Tool definitions for this call (see [Tools](/guide/tools)) |
| `raw` | — | Provider-specific body fields, keyed by provider name |
| `allowContentFilterFailover` | `false` | Opt in to fail over on content filter / refusal |
| `routes` / `default` ★ | — | Named tradeoffs — see [Named routes](/guide/routes) |
| `onFallback` ★ | — | Fires on every hand-off to the next model |
| `providers` ★ | — | Per-provider `apiKey` / `baseUrl` overrides |
| `adapters` ★ | — | Bring-your-own `Adapter` for a provider name |

★ Router-only — not valid on a per-call options object.

## Models and keys

Models are plain strings: `"openai/gpt-4o"`, `"anthropic/claude-sonnet-4-5"`. The part before the
slash picks the adapter; the rest is the model id sent upstream.

| Provider | Env var | Default base URL |
| -------- | ------- | ---------------- |
| `anthropic` | `ANTHROPIC_API_KEY` | `https://api.anthropic.com` |
| `openai` | `OPENAI_API_KEY` | `https://api.openai.com/v1` |
| `groq` | `GROQ_API_KEY` | `https://api.groq.com/openai/v1` |
| `ollama` / `local` | `OLLAMA_API_KEY` / `LOCAL_API_KEY` (optional) | `http://127.0.0.1:11434/v1` |

Override connection details without writing an adapter:

```ts
createRouter({
  primary: "ollama/llama3",
  providers: {
    ollama: { baseUrl: "http://gpu-box:11434/v1", apiKey: "ollama" },
  },
});
```

Env vars are the default. An explicit `providers.*.apiKey` wins when you need a key that isn't in
the process environment (tests, multi-tenant hosts, short-lived secrets).

## Custom adapters

Anything not in the table — a gateway, a second OpenAI-compatible host under a new name, or a
deterministic test double — registers the same way:

```ts
import { createRouter, type Adapter } from "llm-sdk";

const llm = createRouter({
  primary: "acme/fast-model",
  adapters: {
    acme: myAcmeAdapter, // implements Adapter
  },
});
```

That name bypasses the built-in factory entirely. See [Testing](/guide/testing) for a full
`ProviderError` example.

## Escape hatch: `raw`

When a provider accepts a parameter this library doesn't model, pass it under that provider's
key. It is merged into the request body for that provider only:

```ts
await llm.complete(prompt, {
  raw: { anthropic: { top_k: 40 } },
});
```

## What this page deliberately skips

Retry kinds, content-filter policy, and the attempt trail live in
[Fallback & retry](/guide/fallback). Cache keys, TTL strings, and cost estimates live in
[Caching & cost](/guide/caching-cost). Typed `route("fast")` lives in
[Named routes](/guide/routes).
