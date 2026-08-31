---
description: The two errors you catch — BadRequest for your mistakes, AllProvidersFailed for
  everyone else's.
---

# Errors

App code only needs to branch on two classes. A third export exists for people **writing**
adapters, not for catching `complete()`.

```ts
import { AllProvidersFailed, BadRequest } from "llm-sdk";

try {
  await llm.complete(prompt);
} catch (err) {
  if (err instanceof BadRequest) {
    // Fix the call site — never retried, never failed over
  } else if (err instanceof AllProvidersFailed) {
    // Every useful attempt is in err.attempts
  } else {
    throw err; // unexpected
  }
}
```

## `BadRequest`

**Meaning:** the request is invalid on your side, or `extract()` could not produce valid data
after schema retries.

**Typical causes:**

| Cause | Example |
| ----- | ------- |
| Missing config | `createRouter({})` without `primary` or `routes` |
| Bad model ref | `"gpt-4o"` (no `provider/`) |
| Empty input | `complete()` with no prompt/messages |
| Unknown route | `route("nope")` |
| Conflicting fields | `model` and `primary` in the same object |
| Bad extract schema | no `.parse` / `.safeParse` |
| Extract exhausted | JSON/schema still invalid after 2 tries |

**Behavior:** throw immediately. No retry. No failover. May wrap a cause via `{ cause }`.

## `AllProvidersFailed`

**Meaning:** the model chain finished without a successful answer.

**Fields:**

```ts
err.attempts; // AttemptRecord[] — every try in order
err.message; // default "All providers failed", or content-filter specific text
```

```ts
interface AttemptRecord {
  provider: string;
  model: string;
  error?: string; // ErrorKind or message label; omitted on success
  ms: number;
}
```

**Includes:**

- Exhausted fallbacks after rate limits / timeouts / auth hops
- Default content-filter stop (often a **single** attempt with `error: "content_filter"`)
- Budget exhaustion mid-chain

**Does not mean** "HTTP 500 from one host" by itself — that is usually a failover-able
`ProviderError` that never leaves the router as that class.

## `ProviderError` (for adapters)

```ts
import { ProviderError, type ErrorKind } from "llm-sdk";

throw new ProviderError("rate limited", {
  kind: "rate_limit",
  provider: "acme",
  retryable: true, // optional; defaults from kind
  status: 429,
  retryAfterMs: 1_500,
});
```

| Field | Role |
| ----- | ---- |
| `kind` | Drives retry / failover policy ([Fallback & retry](/guide/fallback)) |
| `provider` | Label in logs / attempts |
| `retryable` | Default true for rate_limit, timeout, overloaded, server_error, network |
| `status` | Optional HTTP status |
| `retryAfterMs` | Optional backoff hint |

`complete()` / `stream()` / `extract()` are not documented to reject with `ProviderError` for
normal provider failures — they classify and either continue the chain or throw one of the two
public errors. Mid-stream failures after the buffer has flushed may still surface a raw error
from the iterator; prefer draining via patterns that treat stream abort as failure, and see
[Fallback & retry](/guide/fallback) for streaming limits.

## Mapping HTTP → kind

Built-in adapters use shared classification roughly as:

| Status | Kind |
| ------ | ---- |
| 429 | `rate_limit` |
| 408, 504 | `timeout` |
| 401, 403 | `auth` |
| 529 | `overloaded` |
| 400, 404, 422 | `bad_request` |
| other 5xx | `server_error` |
| network / abort | `network` / `timeout` |

## HTTP APIs

When wrapping the router in a server (`examples/server.ts`):

| SDK error | Sensible HTTP status |
| --------- | -------------------- |
| `BadRequest` | `400` |
| `AllProvidersFailed` | `503` |

## Next

- [Fallback & retry](/guide/fallback) — policy table by kind
- [Testing](/guide/testing) — throw `ProviderError` from a fake adapter
- [Errors API](/api/errors) — field-level reference
