---
"llm-sdk-js": minor
---

`CompleteResult`, `ExtractResult`, and `CacheEntry` now include `unknownModel: boolean`, set
when `model` has no row in the price table — so a typo'd or newly-released model reports as
explicitly unpriced instead of silently costing `$0`. `cost()` also logs a one-time
`console.warn` per unrecognized model instead of failing silently. Also exports a new
`isKnownModel(model)` helper.
