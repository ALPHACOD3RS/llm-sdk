---
description: Which errors fail over, how backoff and Retry-After are handled, and what ends up in
  the attempt trail.
---

# Fallback & retry

A router earns its keep when the primary is rate-limited, timed out, or simply down. This page is
the full policy: what retries, what fails over, what stops the chain, and what you see afterward.

## The model chain

Every call walks a list:

```text
[primary or model, ...fallbacks]
```

Example:

```ts
createRouter({
  primary: "anthropic/claude-sonnet-4-5",
  fallbacks: ["openai/gpt-4o", "groq/llama-3.3-70b"],
  retry: { attempts: 3, baseDelay: 500, maxDelay: 10_000 },
  timeout: 60_000,
  onFallback: (from, to, err) => console.warn("fallback", { from, to, err }),
});
```

For each model in the chain the router may retry the **same** provider a few times (backoff),
then move to the **next** model. When the list is exhausted, it throws `AllProvidersFailed`.

## Error kinds

Adapters map HTTP and network failures into a `ProviderError` with a `kind`. The kind decides
the next step:

| kind | Same-provider retry? | Fail over to next model? | Notes |
| ---- | -------------------- | ------------------------ | ----- |
| `rate_limit` | Yes (honors `Retry-After`) | Yes, after retries | |
| `timeout` | Yes | Yes, after retries | Includes aborted budget |
| `server_error` | Yes | Yes, after retries | 5xx except 529 |
| `network` | Yes | Yes, after retries | DNS, connection reset, … |
| `overloaded` | **No** — skip immediately | Yes | HTTP 529; no backoff wait |
| `auth` | **No** — skip immediately | Yes | Bad/missing key on *this* provider does not imply the next is broken |
| `unknown` | **No** — skip immediately | Yes | Unclassified provider failure |
| `content_filter` | **No** | **Only if** `allowContentFilterFailover: true` | Default: stop the chain |
| `bad_request` | Never | Never | Becomes `BadRequest` — your bug |

`BadRequest` (empty prompt, bad model ref, unknown route, `model`+`primary` in one object) is
never retried and never failed over. It throws before or instead of walking the chain.

## Defaults that surprise people

| Option | Default | Meaning |
| ------ | ------- | ------- |
| `retry.attempts` | **`1`** | **No** same-provider retry unless you raise it — only failover |
| `retry.baseDelay` | `500` | ms, used in exponential backoff |
| `retry.maxDelay` | `10_000` | cap for backoff and `Retry-After` |
| `timeout` | `60_000` | **Total** budget for the whole chain, including sleeps |

```ts
// Production-shaped retry: three tries on the primary before failing over
retry: { attempts: 3, baseDelay: 500, maxDelay: 10_000 }
```

## Backoff

Between same-provider retries:

1. If the response included `Retry-After`, use that delay (seconds or HTTP-date), capped by
   `maxDelay`.
2. Otherwise full jitter: `random(0 … min(maxDelay, baseDelay * 2^attemptIndex))`.
3. The wait is also capped by the **remaining** timeout budget. If the budget is gone, the
   attempt is recorded as `timeout` and the chain moves on or fails.

`overloaded`, `auth`, `unknown`, and opted-in `content_filter` **skip** this wait and jump to
the next model (firing `onFallback`).

## Content filtering

OpenAI may return `finish_reason: "content_filter"`. Anthropic may return `stop_reason: "refusal"`.
Both become `kind: "content_filter"`.

**Default:** the router throws `AllProvidersFailed` with message
`"Content was filtered by the provider"` and does **not** try the next model. Silently shopping
for a looser provider is a bad default.

```ts
await llm.complete(prompt, { allowContentFilterFailover: true });
```

With the flag, content filter behaves like other fail-over-immediately kinds.

## `onFallback`

Fires whenever the router hands off to the next model — including after `auth` and `overloaded`.
Arguments: `(from, to, err)` where `from` / `to` are model refs (`"anthropic/…"`) and `err` is
the failure that caused the hop.

Use it for metrics and logs. Do not assume it means the call ultimately failed — the next
provider may still succeed.

## The attempt trail

Every finished call (success or `AllProvidersFailed`) carries `attempts`:

```ts
[
  { provider: "anthropic", model: "claude-sonnet-4-5", error: "rate_limit", ms: 210 },
  { provider: "openai", model: "gpt-4o", ms: 1840 },
]
```

- Successful attempts omit `error`.
- `res.provider` / `res.model` are **who served the answer**, not who was tried first.
- Log `attempts` in production. When output looks wrong, that array is the postmortem.

## Streaming vs `complete()`

| | `complete()` | `stream()` |
| - | ------------ | ---------- |
| Same-provider retries | Yes (`retry.attempts`) | **No** — one try per model |
| Fail over | Full chain | Only while the first ~40 characters are still buffered |
| After text has been emitted | — | Failure ends the stream; no silent failover |

See the streaming section in the README / Getting started for the buffer rationale.

## Total timeout budget

`timeout` is not "per HTTP request." A `TimeoutBudget` starts when the call begins. Every
attempt's `AbortSignal`, every backoff sleep, and every failover share that deadline. When it
hits zero mid-chain, remaining models may be skipped with `error: "timeout"` records.

## Catching the outcome

```ts
import { AllProvidersFailed, BadRequest } from "llm-sdk";

try {
  const res = await llm.complete(prompt);
  console.log(res.provider, res.attempts);
} catch (err) {
  if (err instanceof BadRequest) {
    // Fix the call site
  } else if (err instanceof AllProvidersFailed) {
    console.error(err.attempts); // every try, including content_filter stops
  }
}
```

You do **not** catch `ProviderError` from `complete()` in normal app code — it is classified and
either folded into the trail or rethrown as one of the two public errors. (`ProviderError` is
exported for **authoring** custom adapters; see [Testing](/guide/testing).)

## Next

- [Errors](/guide/errors) — the two classes in more detail
- [Configuration](/guide/configuration) — where to set `retry` / `timeout` / `fallbacks`
- [Testing](/guide/testing) — drive every branch with a fake adapter
