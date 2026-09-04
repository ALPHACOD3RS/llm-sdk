# llm-sdk

<p align="center">
  <strong>Your primary model fails. The next one answers.</strong>
</p>

<p align="center">
  TypeScript LLM router with automatic fallbacks.<br/>
  Runs in your process — your keys, direct to providers, zero runtime deps.
</p>

<p align="center">
  <a href="https://llm-sdk.dev"><b>Documentation →</b></a>
  ·
  <a href="https://llm-sdk.dev/guide/getting-started">Getting started</a>
  ·
  <a href="https://www.npmjs.com/package/llm-sdk">npm</a>
</p>

---

```bash
npm install llm-sdk
```

```ts
import { createRouter } from "llm-sdk";

const llm = createRouter({
  routes: {
    fast: { primary: "groq/llama-3.3-70b" },
    smart: {
      primary: "anthropic/claude-sonnet-4-5",
      fallbacks: ["openai/gpt-4o", "groq/llama-3.3-70b"],
    },
  },
  default: "smart",
  cache: { ttl: "1h" },
  retry: { attempts: 3 },
  timeout: 30_000,
  onFallback: (from, to, err) => console.warn({ from, to, err }),
});

const res = await llm.complete("Summarise this in one line.");
// or: await llm.route("fast").complete("…")
```

Keys are read from the environment (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`, …). No client setup.

---

<p align="center">
  Everything else lives in the docs.<br/>
  <a href="https://llm-sdk.dev"><b>llm-sdk.dev</b></a>
</p>
