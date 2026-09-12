---
"llm-sdk-js": patch
---

`stream()` now accumulates tool call deltas from the wire (both the OpenAI-compatible adapter,
shared by OpenAI/Groq/Ollama, and the Anthropic adapter) and surfaces the finished calls on the
`done` event's `toolCalls`, instead of always returning `[]`.
