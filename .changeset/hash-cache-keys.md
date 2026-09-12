---
"llm-sdk-js": patch
---

Cache keys are now a normalized SHA-256 hash instead of raw `JSON.stringify` output. This fixes
two bugs: keys no longer grow unbounded with prompt size (a `Map` no longer stores the full
prompt twice, once as key and once in the cached value), and object key order no longer affects
the key (`{role, content}` and `{content, role}` now hash identically).
