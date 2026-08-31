---
description: A router for LLM calls — one primary model, a list of fallbacks, and a response that
  says which provider actually answered, what it cost, and every attempt on the way.
---

# Getting started

`llm-sdk` runs inside your process using your API keys over `fetch`. There is no proxy to deploy, no
account to create, and no service in the middle that sees your prompts.

## Install

::: code-group

```bash [npm]
npm install llm-sdk
```

```bash [pnpm]
pnpm add llm-sdk
```

```bash [yarn]
yarn add llm-sdk
```

```bash [bun]
bun add llm-sdk
```

:::

Node 18 or newer, since the adapters use the built-in `fetch`. The package ships ESM and CJS builds
with TypeScript types, and has no runtime dependencies. `zod` is an optional peer dependency, needed
only for [`extract()`](/guide/extract).

## Set a key

Keys are read from the environment, so nothing sensitive goes in your config:

| Provider              | Variable            | Notes                                      |
| --------------------- | ------------------- | ------------------------------------------ |
| `openai/…`            | `OPENAI_API_KEY`    |                                            |
| `anthropic/…`         | `ANTHROPIC_API_KEY` |                                            |
| `groq/…`              | `GROQ_API_KEY`      |                                            |
| `ollama/…`, `local/…` | —                   | Talks to `http://127.0.0.1:11434/v1`       |

You only need keys for the providers you actually reference. To pass a key explicitly instead — or
to point a provider at a compatible endpoint — see [Configuration](/guide/configuration).

## Your first call

```ts [example.ts]
import { createRouter } from "llm-sdk";

const llm = createRouter({
  primary: "anthropic/claude-sonnet-4-5",
  fallbacks: ["openai/gpt-4o", "groq/llama-3.3-70b"],
});

const res = await llm.complete("Summarise this changelog in one line: ...");

console.log(res.text);
console.log(res.provider); // "anthropic" — unless it was down
```

Models are plain `provider/model` strings, so switching a model is a text edit rather than a new
client class. `complete()` takes either a string prompt or an object when you need more control:

```ts
const res = await llm.complete({
  system: "You are a terse release-notes editor.",
  prompt: "Summarise this changelog in one line: ...",
  maxTokens: 120,
  temperature: 0,
});
```

Or pass `messages` directly for multi-turn conversations:

```ts
const res = await llm.complete({
  messages: [
    { role: "user", content: "What broke in v2?" },
    { role: "assistant", content: "The auth middleware changed shape." },
    { role: "user", content: "Show me the migration." },
  ],
});
```

## What comes back

Every call resolves to the same shape, whether it was served by the primary, a fallback, or the
cache:

```ts
res.text; // "Renamed AuthService to IdentityGateway."
res.provider; // "openai"
res.model; // "gpt-4o"
res.usage; // { input: 412, output: 38 }
res.cost; // 0.0014 — USD, estimated from usage
res.cached; // false
res.latencyMs; // 184
res.toolCalls; // [] unless the model called a tool
res.attempts; // one record per try, in order
```

`attempts` is the part worth logging. It is the whole story of the call, including the failures:

```ts
[
  { provider: "anthropic", model: "claude-sonnet-4-5", error: "rate_limit", ms: 210 },
  { provider: "openai", model: "gpt-4o", ms: 184 },
];
```

A quiet model switch is the kind of thing that gets a library a bad reputation, so it is never
hidden — `res.provider` and `res.attempts` always tell you what really happened.

## When everything fails

If the chain is exhausted, the call throws `AllProvidersFailed` with the same attempt records
attached:

```ts
import { AllProvidersFailed, BadRequest } from "llm-sdk";

try {
  await llm.complete(prompt);
} catch (err) {
  if (err instanceof AllProvidersFailed) {
    console.error("no provider answered", err.attempts);
  } else if (err instanceof BadRequest) {
    // Your mistake, not the provider's: bad model ref, empty prompt, unknown route.
    // Never retried, never failed over.
    throw err;
  }
}
```

Those are the only two error types you catch. Details in [Errors](/guide/errors).

## Run it without a network

There's no shipped mock provider — implement the `Adapter` interface with a small deterministic
double and register it under any provider name via `adapters`, which makes the fallback path
something you can actually test:

```ts [router.test.ts]
import { createRouter, ProviderError, type Adapter } from "llm-sdk";

class FakeAdapter implements Adapter {
  readonly name = "fake";
  private calls = 0;

  async complete() {
    if (this.calls++ === 0) {
      throw new ProviderError("rate limited", { kind: "rate_limit", provider: this.name });
    }
    return { text: "served by the fallback", usage: { input: 0, output: 0 }, toolCalls: [] };
  }

  async *stream() {
    yield { type: "done" as const, usage: { input: 0, output: 0 }, toolCalls: [] };
  }
}

const llm = createRouter({
  primary: "fake/fail",
  fallbacks: ["fake/ok"],
  adapters: { fake: new FakeAdapter() },
});

const res = await llm.complete("hi");

res.text; // "served by the fallback"
res.attempts.length; // 2
```

The router doesn't distinguish a real provider from your `FakeAdapter` — it only sees the
`Adapter` interface, so `ProviderError`'s `kind` drives the exact same retry/fallback logic
either way. No key, no network, no clock skew. See [Testing](/guide/testing).

## Name your tradeoffs

Once you have more than one kind of call, put the choices in one place and refer to them by name
instead of repeating model strings:

```ts
const llm = createRouter({
  routes: {
    fast: { primary: "groq/llama-3.3-70b" },
    smart: {
      primary: "anthropic/claude-sonnet-4-5",
      fallbacks: ["openai/gpt-4o"],
    },
    cheap: {
      primary: "openai/gpt-4o-mini",
      cache: { ttl: "24h" },
    },
  },
  default: "smart",
});

await llm.complete(prompt); // uses "smart"
await llm.route("fast").complete(ticket); // uses "fast"
```

Route names are typed from the config, so `llm.route("smrt")` fails at compile time rather than at
3am. Options merge in one direction — call beats route beats global — which is covered in
[Named routes](/guide/routes).

## Streaming

```ts
const stream = llm.stream(prompt);

for await (const chunk of stream) {
  if (!chunk.done) process.stdout.write(chunk.text);
}

const final = await stream.result(); // usage, cost, provider, attempts
```

Streaming is real SSE from the provider, not a fake replay. The router buffers the first ~40
characters before emitting anything so it can still fail over cleanly if that provider dies
early. Once text has reached you, a failure ends the stream — there is no silent hop mid-sentence.
Live streams do not return tool calls; use `complete()` for tools. Details in
[Fallback & retry](/guide/fallback).

## Next

- [Configuration](/guide/configuration) — every option, and where to set it
- [Named routes](/guide/routes) — one config for `fast` / `smart` / `cheap`
- [Fallback & retry](/guide/fallback) — which errors fail over, and how backoff works
- [Caching & cost](/guide/caching-cost) — deterministic keys, TTLs, and pricing
- [Structured output](/guide/extract) — `extract()` with a Zod schema
- [Tools](/guide/tools) — declare tools and complete the round trip
- [Errors](/guide/errors) — what to catch
- [Testing](/guide/testing) — fake adapters, no network
