# llm-sdk

**Your primary model fails. The next one answers.**

A TypeScript router for LLM calls. Give it a primary model and a list of fallbacks; it retries,
fails over, and returns which provider actually answered, what the call cost, and every attempt
on the way. It runs inside your own process — your API keys, direct HTTP calls to providers, no
proxy service in the middle, zero runtime dependencies.

[![npm version](https://img.shields.io/npm/v/llm-sdk-js.svg)](https://www.npmjs.com/package/llm-sdk-js)
[![CI](https://github.com/ALPHACOD3RS/llm-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/ALPHACOD3RS/llm-sdk/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/llm-sdk-js.svg)](https://github.com/ALPHACOD3RS/llm-sdk/blob/main/LICENSE)

[Documentation](https://www.llm-sdk.dev) ·
[Getting started](https://www.llm-sdk.dev/guide/getting-started) ·
[API reference](https://www.llm-sdk.dev/api/create-router) ·
[npm](https://www.npmjs.com/package/llm-sdk-js)

## Contents

- [Install](#install)
- [Quick start](#quick-start)
- [Why](#why)
- [Providers](#providers)
- [Named routes](#named-routes)
- [Fallback and retry](#fallback-and-retry)
- [Streaming](#streaming)
- [Structured output](#structured-output)
- [Tools](#tools)
- [Caching and cost](#caching-and-cost)
- [Errors](#errors)
- [Testing](#testing)
- [API surface](#api-surface)
- [Documentation for AI agents and LLMs](#documentation-for-ai-agents-and-llms)
- [Contributing](#contributing)
- [License](#license)

## Install

```bash
npm install llm-sdk-js
```

Requires Node 18+. `zod` is an optional peer dependency, needed only if you use `extract()` or
Zod tool schemas.

## Quick start

```ts
import { createRouter } from "llm-sdk-js";

const llm = createRouter({
  primary: "anthropic/claude-sonnet-4-5",
  fallbacks: ["openai/gpt-4o", "groq/llama-3.3-70b"],
  retry: { attempts: 3 },
  timeout: 30_000,
  onFallback: (from, to, err) => console.warn({ from, to, err }),
});

const res = await llm.complete("Summarise this in one line.");

res.text; // string
res.provider; // which model actually answered
res.cost; // estimated USD for this call
res.attempts; // every provider tried, in order, with the error if any
```

Keys are read from the environment (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`, …) by
default. No client object to construct per provider, no SDK per vendor.

## Why

- **A model chain, not a client per provider.** One `primary` plus an ordered list of
  `fallbacks`. When a call is rate-limited, times out, or the provider is down, the router moves
  to the next model and tells you it happened — no silent downgrade.
- **Nothing hidden in the response.** `attempts`, `provider`, and `cost` are on every
  `CompleteResult`, not behind a separate dashboard or logging integration.
- **Runs in your process.** Requests go straight from your code to the provider's HTTP API with
  your own keys. There is no hosted gateway, account, or proxy in between, and nothing to deploy.
- **Zero runtime dependencies.** The core router has none. `zod` is an optional peer dependency
  used only by `extract()` and Zod tool schemas.

## Providers

| `provider/model` prefix | Adapter | Notes |
| --- | --- | --- |
| `openai/…` | OpenAI | Chat Completions API |
| `anthropic/…` | Anthropic | Messages API |
| `groq/…` | Groq | OpenAI-compatible wire format |
| `ollama/…`, `local/…` | Ollama / local | Any local OpenAI-compatible server |
| any other prefix | your own | Register via `createRouter({ adapters: { name: yourAdapter } })` |

Per-provider `apiKey`, `baseUrl`, and `timeoutMs` overrides go under `providers` in the config —
see [Configuration](https://www.llm-sdk.dev/guide/configuration). Any OpenAI-compatible endpoint
(self-hosted, an internal gateway, a provider not built in) works by implementing the `Adapter`
interface and pointing a route at it; you don't need to fork the package to add one.

## Named routes

Put a tradeoff in one place and call it by name instead of repeating model strings at every call
site:

```ts
const llm = createRouter({
  routes: {
    fast: { primary: "groq/llama-3.3-70b" },
    smart: {
      primary: "anthropic/claude-sonnet-4-5",
      fallbacks: ["openai/gpt-4o", "groq/llama-3.3-70b"],
    },
  },
  default: "smart",
});

await llm.complete("…"); // uses "smart"
await llm.route("fast").complete("…");
```

Route names are inferred from your config, so `llm.route("smrt")` fails at compile time. See
[Named routes](https://www.llm-sdk.dev/guide/routes).

## Fallback and retry

`retryable` errors (rate limits, timeouts, overload, transient network/server errors) trigger
same-provider retries with backoff, honoring a provider's `Retry-After` when present; once retries
on a model are exhausted, the router fails over to the next model in the chain. See
[Fallback & retry](https://www.llm-sdk.dev/guide/fallback) for exactly which error kinds retry,
which fail over, and what stops the chain.

## Streaming

```ts
const stream = llm.stream("Write a haiku about deploys.");

for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}

const final = await stream.result(); // usage, cost, provider, attempts
```

Streaming uses real server-sent events from the provider with a small failover buffer: once text
has reached the caller, a failure ends the stream rather than silently switching providers
mid-sentence. Tool calls are not returned from `stream()` — use `complete()` when you need them.
Details in [Fallback & retry](https://www.llm-sdk.dev/guide/fallback).

## Structured output

`extract()` asks the model for JSON and validates it against a schema — Zod (v3 or v4) or any
[Standard Schema](https://standardschema.dev) library (Valibot, ArkType, …) — with no runtime
dependency on those libraries beyond whichever one you use:

```ts
import { z } from "zod";

const { data } = await llm.extract({
  prompt: "Extract the invoice details from: …",
  schema: z.object({
    total: z.number(),
    dueDate: z.string(),
    lineItems: z.array(z.object({ label: z.string(), amount: z.number() })),
  }),
});

data.total; // number, typed from the schema
```

If the model returns invalid JSON or a shape that fails validation, `extract()` retries once,
feeding the validation error back to the model. It does not stream. See
[Structured output](https://www.llm-sdk.dev/guide/extract).

## Tools

The router serializes tool definitions into each provider's wire format and parses tool calls out
of the response. It does not execute tools or run an agent loop — you own dispatch:

```ts
const res = await llm.complete({
  messages: [{ role: "user", content: "Is acct_104 over their seat limit?" }],
  tools: [
    {
      name: "getSubscription",
      description: "Look up a customer's plan and seat usage",
      schema: {
        type: "object",
        properties: { accountId: { type: "string" } },
        required: ["accountId"],
      },
    },
  ],
});

if (res.toolCalls.length > 0) {
  const call = res.toolCalls[0]; // { id, name, arguments }
}
```

`schema` accepts a plain JSON Schema object or a Zod schema, converted best-effort. See
[Tools](https://www.llm-sdk.dev/guide/tools).

## Caching and cost

Both are on every `CompleteResult`; caching is off unless you configure it:

```ts
const llm = createRouter({
  primary: "openai/gpt-4o-mini",
  cache: { ttl: "1h" },
});

const res = await llm.complete("…");
res.cached; // false on the first call, true on a hit
res.cost; // estimated USD, computed from usage against a bundled price table
```

Calls are cache-eligible when `temperature` is omitted or `0`; non-deterministic calls
(`temperature > 0`) are skipped unless you opt in with `includeNonDeterministic: true`. `stream()`
shares the cache with `complete()`. Cost is an estimate from token usage against known list
prices, not a billed total from the provider. See
[Caching & cost](https://www.llm-sdk.dev/guide/caching-cost).

## Errors

Three error types, all exported from the package root:

| Type | When | Retried / failed over? |
| --- | --- | --- |
| `BadRequest` | Your config or call is invalid (bad model ref, missing prompt, unknown route, …) | No — fix the call |
| `ProviderError` | A provider call failed; carries `kind`, `provider`, `retryable`, `status` | Depends on `kind` |
| `AllProvidersFailed` | Every model in the chain was exhausted; carries `attempts` | Terminal |

```ts
import { AllProvidersFailed, BadRequest } from "llm-sdk-js";

try {
  await llm.complete("…");
} catch (err) {
  if (err instanceof AllProvidersFailed) {
    console.error(err.attempts); // what was tried, in order, with each error
  } else if (err instanceof BadRequest) {
    // fix the call site
  }
}
```

See [Errors](https://www.llm-sdk.dev/guide/errors).

## Testing

There is no shipped mock provider. Tests use the same extension point as a custom provider:
implement the `Adapter` interface, register it under a name, and route calls to it — so you can
exercise retries, fallback, and streaming with no network, no keys, and no clock skew. See
[Testing](https://www.llm-sdk.dev/guide/testing) for a complete example.

## API surface

Simplified for readability — route names, generics, and full option types live in the reference:

```ts
function createRouter(config: RouterConfig): Router;

interface Router {
  complete(input: string | CompleteInput, options?: CallOptions): Promise<CompleteResult>;
  stream(input: string | CompleteInput, options?: CallOptions): StreamHandle;
  extract<S>(input: ExtractInput<S>, options?: CallOptions): Promise<ExtractResult<...>>;
  route(name: string): Router; // bound to a named route
}
```

Full type definitions: [API reference](https://www.llm-sdk.dev/api/create-router) ·
[Types](https://www.llm-sdk.dev/api/types) · [Errors API](https://www.llm-sdk.dev/api/errors).

## Documentation for AI agents and LLMs

The full documentation is also available as plain text, generated from the same source as the
website:

- [`llm-sdk.dev/llms.txt`](https://www.llm-sdk.dev/llms.txt) — a short index with links to every
  page.
- [`llm-sdk.dev/llms-full.txt`](https://www.llm-sdk.dev/llms-full.txt) — every guide and API page
  concatenated into a single file.

## Contributing

Issues and pull requests are welcome at
[github.com/ALPHACOD3RS/llm-sdk](https://github.com/ALPHACOD3RS/llm-sdk). `npm test` runs the
suite, `npm run typecheck` runs `tsc --noEmit`, `npm run docs:dev` serves the documentation site
locally.

## License

MIT © ALPHACOD3RS. See [LICENSE](./LICENSE).
