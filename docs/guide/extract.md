---
description: Typed JSON out of a model with a Zod schema, and what happens when it comes back
  invalid.
---

# Structured output

`extract()` asks the model for JSON, parses it, and validates it against a schema. The validated
value is typed when the schema is Zod (v3 or v4) or any [Standard Schema](https://standardschema.dev)
library (Valibot, ArkType, …) — with **zero** runtime dependency on those libraries.

```ts
import { z } from "zod";
import { createRouter } from "llm-sdk";

const llm = createRouter({
  primary: "openai/gpt-4o-mini",
  temperature: 0,
});

const { data, text, provider, attempts } = await llm.extract({
  prompt: "Extract the invoice details from: …",
  system: "You extract structured data for accounting.",
  schema: z.object({
    total: z.number(),
    dueDate: z.string(),
    lineItems: z.array(
      z.object({
        label: z.string(),
        amount: z.number(),
      }),
    ),
  }),
});

data.total; // number
data.lineItems[0].label; // string
```

`zod` is an **optional peer dependency**. Install it only if you use `extract()` (or Zod tool
schemas).

## What gets sent to the model

The router appends an instruction to your prompt:

1. If `schemaDescription` is set, that string is used.
2. Else, for Zod object schemas, field names and coarse types are read from `.shape`
   (e.g. `{ total: number, dueDate: string }`).
3. Else: `"Respond with JSON only that matches the requested schema. No markdown."`

Markdown fences around the JSON are stripped before `JSON.parse`.

## Schema retries

Validation can fail even when the HTTP call succeeded (invalid JSON, wrong shape, Zod error).
`extract()` will call `complete()` up to **twice**:

1. First attempt with the base prompt + schema instruction.
2. Second attempt feeding `Previous JSON was invalid: … Fix it.` back to the model.

If both fail, it throws `BadRequest` with the last parse/validation error. That uses the
`BadRequest` class (caller-facing "this didn't produce valid data") rather than
`AllProvidersFailed` — even though the underlying model calls may have succeeded.

Only the **last** successful `complete()`'s `usage` / `cost` / `attempts` are returned on
success. Failed parse attempts' provider trails are not merged into the result today.

## Temperature

`extract()` forces `temperature: 0` unless you pass an explicit `temperature` in the call
options. Structured extraction wants determinism.

## Options

`extract(input, callOptions?)` accepts the same second-argument options as `complete()` —
`model`, `fallbacks`, `cache`, `timeout`, `retry`, and so on. Caching works: identical extract
prompts with `temperature: 0` and a configured `cache` can hit.

## Non-Zod schemas

Anything with `.parse()` or `.safeParse()` works at runtime. Type inference and auto
`schemaDescription` need Zod/Standard Schema shape. For a hand-rolled validator, pin both:

```ts
const { data } = await llm.extract<typeof myValidator, { total: number; dueDate: string }>({
  prompt: "Extract the invoice",
  schema: myValidator,
  schemaDescription: "{ total: number, dueDate: string }",
});
```

## What `extract()` is not

- It is not provider-native structured output / JSON mode APIs (those can still be passed via
  `raw` if you want them in addition).
- It does not stream.
- It does not run tools; use `complete()` for tool loops.

## Next

- [Tools](/guide/tools) — when the model should call functions instead of returning JSON once
- [Configuration](/guide/configuration) — caching and model overrides on extract calls
- [Errors](/guide/errors) — `BadRequest` from failed extraction
