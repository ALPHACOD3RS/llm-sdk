---
description: Reference for createRouter(config) and the router it hands back.
---

# createRouter

```ts
import { createRouter, type Router } from "llm-sdk";

const llm = createRouter({
  primary: "anthropic/claude-sonnet-4-5",
  fallbacks: ["openai/gpt-4o"],
});
```

## Signature

```ts
function createRouter<const C extends RouterConfig>(config: C): Router<RouteNames<C>>
```

- Requires `primary` **or** `routes` (or both).
- Validates each config layer for `model` + `primary` conflicts.
- If `default` is set and `routes` exist, the returned router is already bound to that route.
- Route name generics are inferred from `routes` keys.

Throws `BadRequest` on invalid config.

## `Router` methods

### `complete(input, options?)`

```ts
complete(input: string | CompleteInput, options?: CallOptions): Promise<CompleteResult>
```

- `input` string → single user message (plus optional `system` from options/config).
- `CompleteInput`: `{ prompt?, messages?, system?, maxTokens?, temperature?, tools? }`.
- Walks the model chain with retry/failover/cache/cost. See [Fallback & retry](/guide/fallback).

### `stream(input, options?)`

```ts
stream(input: string | CompleteInput, options?: CallOptions): StreamHandle
```

```ts
interface StreamHandle {
  [Symbol.asyncIterator](): AsyncIterator<StreamChunk>; // { text, done? }
  result(): Promise<CompleteResult>; // drains if needed
}
```

- Real SSE from providers; ~40 character failover buffer.
- No same-provider retries; tool calls not accumulated on live streams.
- Shares cache with `complete()`.

### `extract(input, options?)`

```ts
extract<S, T = InferSchemaOutput<S>>(
  input: ExtractInput<S>,
  options?: CallOptions,
): Promise<ExtractResult<T>>
```

See [Structured output](/guide/extract).

### `route(name)`

```ts
route(name: R): Router<R>
```

Returns a handle bound to that named route (shared cache/adapters). Unknown name → `BadRequest`.
See [Named routes](/guide/routes).

## Config overview

Full field docs: [Configuration](/guide/configuration).

| Area | Keys |
| ---- | ---- |
| Chain | `primary`, `model`, `fallbacks`, `routes`, `default` |
| Policy | `retry`, `timeout`, `allowContentFilterFailover`, `onFallback` |
| Generation | `temperature`, `maxTokens`, `system`, `messages`, `tools`, `raw` |
| Cache | `cache` |
| Connectivity | `providers`, `adapters` |

## Related

- [Types](/api/types) — `RouterConfig`, `CompleteResult`, …
- [Errors API](/api/errors) — thrown classes
