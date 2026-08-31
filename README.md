# llm-sdk

TypeScript LLM router with automatic fallbacks, named routes, cost tracking, and caching.

Your app calls a model. That call fails — rate limit, timeout, 503, provider outage. Right now
your feature is down. `llm-sdk` sits between your code and the providers: one interface,
several providers behind it, and when the primary fails it transparently tries the next one.

**This is a library, not a hosted gateway.** It runs in your process, with your API keys,
talking directly to providers over `fetch`. No hop through a third party, nobody else sees your
data, no added latency, no signup. `npm install` and you're done.

**Zero runtime dependencies.** Zod is an optional peer, only needed if you use `extract()`.

## Five-second example

```ts
import { createRouter } from "llm-sdk";

const llm = createRouter({
  primary: "anthropic/claude-sonnet-4-5",
  fallbacks: ["openai/gpt-4o"],
});

const res = await llm.complete("Summarise this in one line: ...");
console.log(res.text);
```

Keys come from `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GROQ_API_KEY` in the environment
automatically. No client construction, no adapter wiring.

`complete()` takes a bare string because most calls are one prompt — the full object is there
when you need it.

## The real call

```ts
const res = await llm.complete({
  system: "You are a terse assistant.",
  messages: [{ role: "user", content: "What changed in this diff?" }],
  maxTokens: 500,
  temperature: 0.3,
});
```

## The response object

```ts
res.text          // 'The diff renames …'
res.provider       // 'openai'  ← primary failed, this served it
res.model          // 'gpt-4o'
res.usage          // { input: 1203, output: 88 }
res.cost           // 0.0041
res.cached         // false
res.latencyMs      // 1840
res.toolCalls      // []
res.attempts       // [{ provider: 'anthropic', model: 'claude-sonnet-4-5', error: 'rate_limit', ms: 210 },
                    //  { provider: 'openai', model: 'gpt-4o', ms: 1840 }]
```

`res.provider` and `res.attempts` are the fields that matter most in production — when output
looks wrong, the first question is always "which model actually answered this?"

## Configuration, in layers

Defaults are sane enough that most calls never touch this.

```ts
const llm = createRouter({
  primary: "anthropic/claude-sonnet-4-5",
  fallbacks: ["openai/gpt-4o", "groq/llama-3.3-70b"],

  retry: { attempts: 3, baseDelay: 500, maxDelay: 10_000 },
  timeout: 60_000, // total budget across all attempts (default)
  cache: { ttl: "1h" }, // omit to disable caching entirely
  onFallback: (from, to, err) => console.warn("fallback", { from, to, err }),
});
```

Per-call overrides use the same keys, and merge as `call > route > global`:

```ts
await llm.complete(prompt, {
  model: "anthropic/claude-haiku-4-5", // overrides primary for this call; configured fallbacks still apply
  timeout: 5_000,
  cache: false,
});
```

`model` and `primary` can't both be set *in the same config object* — `createRouter({...})`, one
route, or one `complete()`/`stream()` call — since `model` always wins and `primary` would be
silently dead there; that throws `BadRequest` at the point it's set, not later. Setting `model`
on a call to override a `primary` configured globally or on a route (as above) is the normal,
supported pattern and is unaffected — the check only looks at each config layer on its own,
before they're merged.

### Retry & fallback semantics

Each HTTP error is classified into a kind, and the kind decides what happens:

| kind | behavior |
|---|---|
| `rate_limit` | retry same provider after backoff (honors `Retry-After`), then fail over |
| `overloaded` (529) | fail over immediately, no backoff wait |
| `timeout` / `server_error` | retry per policy, then fail over |
| `network` | retry per policy, then fail over |
| `auth` | fatal for that provider, try next |
| `bad_request` (400/404/422) | **fatal** — thrown immediately as `BadRequest`, never retried, never failed over |
| `content_filter` | **not failed over by default** — see below |

Backoff is `min(baseDelay * 2^attempt, maxDelay)` with full jitter, and every retry respects the
call's overall `timeout` budget.

### Content filtering

When a provider declines to answer (OpenAI's `finish_reason: "content_filter"`, or Anthropic's
`stop_reason: "refusal"`), the router stops immediately by default — it does **not** try the
next provider. Silently reaching for a looser-policy provider to get blocked content through
isn't something you want as a default. The caller sees `AllProvidersFailed` with
`attempts[0].error === "content_filter"`, even though only one provider was actually tried.

Opt in if you want it to fail over like any other retryable error:

```ts
await llm.complete(prompt, { allowContentFilterFailover: true });
```

### Caching

Keyed on the model chain, messages, temperature, and maxTokens. **Calls with `temperature > 0`
are never cached by default** — the caller asked for variety, and silently returning identical
output would violate that. Opt in explicitly if you want it anyway:

```ts
cache: { ttl: "1h", includeNonDeterministic: true }
```

The built-in cache is an in-process `Map` bounded to 1000 entries — once full, the
least-recently-used entry is evicted to make room, on top of normal TTL expiry. It's a
memoization cache for one running process ("don't pay for the same call twice"), not a shared or
distributed cache; if you need caching shared across multiple server instances, that's outside
this SDK's scope.

## Named routes

Different parts of an app need different tradeoffs. Define them once, centrally, instead of
scattering model strings through your codebase.

```ts
const llm = createRouter({
  routes: {
    fast: { primary: "groq/llama-3.3-70b", fallbacks: ["openai/gpt-4o-mini"] },
    smart: { primary: "anthropic/claude-sonnet-4-5", fallbacks: ["openai/gpt-4o"] },
    cheap: { primary: "openai/gpt-4o-mini", cache: { ttl: "24h" } },
  },
  default: "smart",
});

await llm.route("fast").complete("classify this ticket: ...");
await llm.route("smart").complete("write the migration plan: ...");
```

Route names are typed from the config — `llm.route("smrt")` fails at compile time.

## Structured output

```ts
import { z } from "zod";

const { data } = await llm.extract({
  prompt: "Extract the invoice details: ...",
  schema: z.object({
    total: z.number(),
    dueDate: z.string(),
    lineItems: z.array(z.object({ label: z.string(), amount: z.number() })),
  }),
});

data.total; // number — validated
```

`extract()` retries once, feeding the validation error back to the model, if the first response
doesn't parse against the schema. `schema` needs a `.parse()` or `.safeParse()` method — any Zod
schema works, and so does a hand-rolled object with the same shape.

`data`'s type is inferred straight from `schema` — no explicit generic needed — for Zod (v3 or
v4) or anything else implementing [Standard Schema](https://standardschema.dev) (Valibot,
ArkType, …). No schema library dependency required to make that work: it's structural duck-typing
against Zod's/Standard Schema's own type shape, the same trick used elsewhere in this SDK to
convert Zod schemas for `tools` without importing zod.

The model is also told what fields to produce: for a Zod object schema, field names (and coarse
types) are auto-detected from `.shape`. For a hand-rolled validator, neither the type nor the
description can be inferred — pass both yourself:

```ts
const { data } = await llm.extract<typeof myHandRolledValidator, { total: number; dueDate: string }>({
  prompt: "Extract the invoice details",
  schema: myHandRolledValidator,
  schemaDescription: "{ total: number, dueDate: string }",
});

data.total; // number — pinned explicitly, not inferred
```

## Tools

```ts
const res = await llm.complete({
  messages,
  tools: [
    {
      name: "getWeather",
      description: "Current weather for a city",
      schema: { type: "object", properties: { city: { type: "string" } }, required: ["city"] },
    },
  ],
});

if (res.toolCalls.length) {
  res.toolCalls[0].name; // 'getWeather'
  res.toolCalls[0].args; // { city: 'Addis Ababa' } — parsed from the provider's response
}
```

A tool's `schema` can be a plain JSON Schema object, or a Zod schema (v3 or v4) — it's
auto-detected and converted before being sent to the provider. Conversion is best-effort and
covers the common cases (`object`, `string`, `number`, `boolean`, `array`, `enum`, `literal`,
`optional`/`nullable`/`default`); anything it doesn't recognize becomes a permissive
accept-anything schema rather than a wrong one.

Execution is out of scope — this is a router, not an agent framework. It surfaces the tool call
and lets you run it. Answering it back is in scope, though: push the assistant's tool call and
your result onto `messages` and call `complete()` again.

```ts
const messages = [{ role: "user", content: "What's the weather in Addis Ababa?" }];
const first = await llm.complete({ messages, tools: [/* … */] });

// Echo the assistant's tool call back, then answer it by its id.
messages.push({ role: "assistant", content: first.text, toolCalls: first.toolCalls });
messages.push({ role: "tool", toolCallId: first.toolCalls[0].id, content: getWeather(...) });

const final = await llm.complete({ messages });
final.text; // the model's answer, grounded in your tool's result
```

`toolCalls` on an `assistant` message and `toolCallId` on a `tool` message are the only two
fields this needs — each adapter serializes them into that provider's actual wire shape
(OpenAI's `tool_calls`/`tool_call_id`, Anthropic's `tool_use`/`tool_result` content blocks,
including merging consecutive `tool` messages into the single `user` turn Anthropic requires).
See `examples/tools.ts` for the full loop.

## Streaming

```ts
const stream = llm.stream(prompt);

for await (const chunk of stream) {
  if (!chunk.done) process.stdout.write(chunk.text);
}

const final = await stream.result(); // usage, cost, provider
```

Real incremental streaming — each provider's SSE wire format is parsed as it arrives, not
buffered and replayed. `stream.result()` also works without manually iterating first; it drains
the stream internally and resolves once it's done.

**Fallback and streaming are in real tension**: once text has reached the caller, there's no
clean way to fail over — the caller already saw output from the failed provider. `llm-sdk`
buffers the first ~40 characters before emitting anything. If a failure happens inside that
window, it fails over exactly like `complete()` — the caller never sees the failed provider's
output at all. Once the buffer flushes, a failure just ends the stream (thrown from the
iterator) — no silent retry after the fact. This is a deliberate tradeoff, not an oversight: see
Step 8 of the design doc for why "buffer vs. emit immediately" doesn't have a clean answer.

Streaming does one attempt per provider — no same-provider backoff-retry mid-stream, only
fallback to the next provider while still buffering. Tool calls aren't streamed from a live call
(`stream()` never returns `toolCalls` for a fresh response); use `complete()` if you need both.

`stream()` shares the same cache as `complete()` — same cache key, same `MemoryCache` instance.
A cache hit has nothing to incrementally generate, so it's replayed as a single immediate chunk
instead of faked out with artificial per-word delays; `stream.result().cached` is still `true`,
so a caller who wants to skip a "typing" animation for cached replies can check that. Because
the cache is shared, a `stream()` call can replay a response that a `complete()` call produced
(and vice versa) — including its `toolCalls`, if that response happened to have any.

## Errors

```ts
import { AllProvidersFailed, BadRequest } from "llm-sdk";

try {
  await llm.complete(prompt);
} catch (err) {
  if (err instanceof BadRequest) {
    // your fault — fatal, never retried, never failed over
  }
  if (err instanceof AllProvidersFailed) {
    err.attempts; // [{ provider, model, error, ms }, …] every single try
  }
}
```

Two exported error classes is enough for *catching* — you only ever need to branch on "is this
my bug or theirs." `ProviderError` is a third export, but for a different job: it's what you
*throw* when authoring a custom `Adapter` (see Testing below), not something `complete()` ever
hands back to a caller.

## Framework integration

```ts
// Next.js route handler
export async function POST(req: Request) {
  const { message } = await req.json();
  const res = await llm.route("fast").complete(message);
  return Response.json({ text: res.text });
}
```

Nothing special required — `complete()` is a plain async function.

For a fuller picture of backend usage — a router created once at startup and reused across
requests, a real SSE endpoint streaming `stream()`'s chunks over HTTP, and SDK errors mapped to
HTTP status codes — see `examples/server.ts`, a small plain-`node:http` API with no framework
dependency.

## Testing

There's no shipped mock provider — implement the same `Adapter` interface every built-in
provider implements, and register it per-provider name via `adapters`:

```ts
import { createRouter, ProviderError, type Adapter } from "llm-sdk";

class FakeAdapter implements Adapter {
  readonly name = "fake";
  private calls = 0;

  async complete() {
    if (this.calls++ === 0) {
      throw new ProviderError("rate limited", { kind: "rate_limit", provider: this.name });
    }
    return { text: "second reply", usage: { input: 0, output: 0 }, toolCalls: [] };
  }

  async *stream() {
    yield { type: "done" as const, usage: { input: 0, output: 0 }, toolCalls: [] };
  }
}

const llm = createRouter({
  primary: "fake/primary",
  fallbacks: ["fake/backup"],
  adapters: { fake: new FakeAdapter() },
});
```

No network calls, no mocking library, and no distinction between "test provider" and "real
provider" from the router's point of view — `ProviderError`'s `kind` drives the same
retry/fallback logic either way, so you can exercise every branch of your own error handling
deterministically.

## Escape hatch

Someone will need a provider-specific parameter this library doesn't model:

```ts
await llm.complete(prompt, { raw: { anthropic: { top_k: 40 } } });
```

`raw` merges directly into the request body sent to that provider.

## Providers

| provider | env var | default base URL |
|---|---|---|
| `anthropic` | `ANTHROPIC_API_KEY` | `https://api.anthropic.com` |
| `openai` | `OPENAI_API_KEY` | `https://api.openai.com/v1` |
| `groq` | `GROQ_API_KEY` | `https://api.groq.com/openai/v1` |
| `ollama` / `local` | `OLLAMA_API_KEY` / `LOCAL_API_KEY` (optional) | `http://127.0.0.1:11434/v1` |

Need a provider that's not on this list, a custom gateway, or a deterministic test double?
Register your own `Adapter` under any provider name via `adapters` (see Testing) — it bypasses
the built-in adapter for that name entirely.

Override the built-in adapters' connection details per router:

```ts
createRouter({
  primary: "ollama/llama3",
  providers: { ollama: { baseUrl: "http://my-host:11434/v1" } },
});
```

## Out of scope for v1

Circuit breaker, model-equivalence/context-limit-aware fallback skipping, load balancing across
API keys, semantic caching, automatic cheap-model routing, and any hosted/proxy mode. See
`PLAN.md` for the full status and what's next.

## Layout

```
src/
  index.ts          # public exports only
  router.ts         # public barrel — re-exports createRouter/Router from router/
  router/           # model-ref parsing, option merging, message building, request building,
                     # adapter+cache state, and the complete()/stream() orchestration itself
  types.ts
  errors.ts         # BadRequest, AllProvidersFailed, classify()
  extract.ts
  adapters/         # dumb: convert in/out, classify errors — anthropic, openai, groq, ollama
  policy/           # retry, fallback, timeout, cache-eligibility (no network)
  cache/
  pricing/          # prices.json is data
examples/
test/
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Bundle ESM + CJS + types |
| `npm run typecheck` | `tsc --noEmit` over `src/`, `test/`, and `examples/` (see `tsconfig.check.json`) |
| `npm test` | Vitest |

`examples/*.ts` call the real OpenAI API — set `OPENAI_API_KEY` (copy `.env.example` to `.env`)
and run one with `node --env-file=.env node_modules/.bin/tsx examples/fallback.ts`.
