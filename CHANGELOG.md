# llm-sdk-js

## 0.2.0

### Minor Changes

- 167a9b5: Renamed the npm package from `llm-sdk` to `llm-sdk-js` (the original name was already taken by
  an unrelated package). Update imports and install commands accordingly:
  
  ```bash
  npm install llm-sdk-js
  ```
  
  ```ts
  import { createRouter } from "llm-sdk-js";
  ```
  
  The GitHub repository name is unchanged.
- 167a9b5: `CompleteResult`, `ExtractResult`, and `CacheEntry` now include `unknownModel: boolean`, set
  when `model` has no row in the price table — so a typo'd or newly-released model reports as
  explicitly unpriced instead of silently costing `$0`. `cost()` also logs a one-time
  `console.warn` per unrecognized model instead of failing silently. Also exports a new
  `isKnownModel(model)` helper.

### Patch Changes

- 167a9b5: Cache keys are now a normalized SHA-256 hash instead of raw `JSON.stringify` output. This fixes
  two bugs: keys no longer grow unbounded with prompt size (a `Map` no longer stores the full
  prompt twice, once as key and once in the cached value), and object key order no longer affects
  the key (`{role, content}` and `{content, role}` now hash identically).
- 167a9b5: `stream()` now accumulates tool call deltas from the wire (both the OpenAI-compatible adapter,
  shared by OpenAI/Groq/Ollama, and the Anthropic adapter) and surfaces the finished calls on the
  `done` event's `toolCalls`, instead of always returning `[]`.
