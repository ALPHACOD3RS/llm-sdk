---
description: Exercise the fallback path with no network, no keys, and no clock skew.
---

# Testing

There is **no** shipped mock provider. Tests use the same extension point as a custom gateway:
implement `Adapter`, register it under a name, route `name/model` to it.

## Minimal fake

```ts
import { createRouter, ProviderError, type Adapter } from "llm-sdk";

class FakeAdapter implements Adapter {
  readonly name = "fake";
  private calls = 0;

  async complete() {
    if (this.calls++ === 0) {
      throw new ProviderError("rate limited", {
        kind: "rate_limit",
        provider: this.name,
      });
    }
    return {
      text: "second reply",
      usage: { input: 0, output: 0 },
      toolCalls: [],
    };
  }

  async *stream() {
    yield {
      type: "done" as const,
      usage: { input: 0, output: 0 },
      toolCalls: [],
    };
  }
}

const llm = createRouter({
  primary: "fake/primary",
  fallbacks: ["fake/backup"],
  adapters: { fake: new FakeAdapter() },
  retry: { attempts: 1 },
});

const res = await llm.complete("hi");
// res.text === "second reply"
// res.attempts[0].error === "rate_limit"
```

Both model refs share **one** adapter instance (keyed by provider name `fake`). Call counters and
queues are therefore global to that adapter — construct a **fresh** router (or adapter) per test
when order matters.

## What to assert

| Behavior | How to trigger |
| -------- | -------------- |
| Failover | First `complete()` throws `ProviderError` with retryable / skip-retry kind; second returns OK |
| No failover on bad request | `kind: "bad_request"` → expect `BadRequest`, `onFallback` not called |
| Auth hops and notifies | `kind: "auth"` → next provider; `onFallback` fired |
| Content filter stop | `kind: "content_filter"` without opt-in → `AllProvidersFailed` |
| Content filter hop | same kind with `allowContentFilterFailover: true` |
| Cache hit | `cache: { ttl: "1h" }`, `temperature: 0`, identical prompt twice → `cached: true` |
| Route typing | `route("typo")` type error / runtime `BadRequest` |

## Stream failures

To test pre-buffer vs post-buffer failover, emit a few `delta` events then throw. The router
buffers ~40 characters before the first yield to the caller; failures before that can still fail
over.

The repo's own suite uses `test/helpers/fake-adapter.ts` (not published) with
`fail` / `responses` / `streamFailAfterChunks` queues — copy that pattern or depend on your own
double.

## Live examples

`examples/*.ts` call **real** OpenAI (and optionally Anthropic for failover demos). They are not
unit tests. Copy `.env.example` → `.env` and run:

```bash
node --env-file=.env node_modules/.bin/tsx examples/fallback.ts
```

## CI shape

```bash
npm run typecheck   # src + test + examples
npm test            # vitest, no network
npm run build
```

Do not put real API keys in unit tests. Prefer `adapters` fakes for policy coverage and a small
optional integration job for live smoke if you need it.

## Next

- [Fallback & retry](/guide/fallback) — which `kind` values to throw
- [Errors](/guide/errors) — `ProviderError` fields
- [Configuration](/guide/configuration) — `adapters` map
