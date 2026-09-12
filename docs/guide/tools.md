---
description: Declare tools, read the calls a model asks for, and stop short of an agent loop — this
  is a router.
---

# Tools

`llm-sdk` serializes tool definitions into each provider's wire format, parses tool calls out of
the response, and — when you push results back onto `messages` — serializes the round trip
correctly for OpenAI-compatible and Anthropic APIs.

It does **not** execute tools or run an agent loop. You own dispatch.

## Declare tools

```ts
const tools = [
  {
    name: "getSubscription",
    description: "Look up a Northwind Analytics customer's plan and seat usage",
    schema: {
      type: "object",
      properties: {
        accountId: { type: "string" },
      },
      required: ["accountId"],
    },
  },
];

const res = await llm.complete({
  messages: [{ role: "user", content: "Is acct_104 over their seat limit?" }],
  tools,
});
```

`schema` may be:

- A plain JSON Schema object (passed through), or
- A Zod schema (v3 or v4) — converted best-effort via duck-typing (`object`, `string`, `number`,
  `boolean`, `array`, `enum`, `literal`, `optional` / `nullable` / `default`). Unrecognized
  wrappers become a permissive `{}` rather than a wrong schema.

## Read `toolCalls`

```ts
if (res.toolCalls.length > 0) {
  const call = res.toolCalls[0];
  call.id; // provider id — required when you answer
  call.name; // "getSubscription"
  call.args; // { accountId: "acct_104" } — already JSON-parsed when possible
}
```

`finishReason` is parsed inside adapters today but is **not** yet exposed on `CompleteResult`.
Use `toolCalls.length` to decide whether to dispatch.

## Full round trip

```ts
const messages = [{ role: "user", content: "Is acct_104 over their seat limit?" }];

const first = await llm.complete({ messages, tools });

if (!first.toolCalls.length) {
  console.log(first.text); // model answered without tools
} else {
  // 1. Echo the assistant turn, including the tool calls it made
  messages.push({
    role: "assistant",
    content: first.text,
    toolCalls: first.toolCalls,
  });

  // 2. Answer each call by id (your code runs the tool)
  for (const call of first.toolCalls) {
    if (call.name !== "getSubscription") {
      throw new Error(`Unknown tool: ${call.name}`);
    }
    const result = getSubscription(call.args as { accountId: string });
    messages.push({
      role: "tool",
      toolCallId: call.id,
      content: JSON.stringify(result),
    });
  }

  // 3. Ask again — model sees the tool results
  const final = await llm.complete({ messages, tools });
  console.log(final.text);
}
```

### Message fields that matter

| Role | Extra fields |
| ---- | ------------ |
| `assistant` | `toolCalls?: ToolCall[]` — echo from `CompleteResult.toolCalls` |
| `tool` | `toolCallId: string` — the `ToolCall.id` you are answering; `content` is the result body |

### Provider differences (handled for you)

- **OpenAI / Groq / Ollama:** `tool_calls` on the assistant message; `tool` role + `tool_call_id`.
- **Anthropic:** `tool_use` / `tool_result` content blocks. Consecutive `tool` messages are merged
  into the single `user` turn Anthropic requires.

## Streaming and tools

`stream()` accumulates tool call deltas from the wire and surfaces the finished calls on the
`done` event's `toolCalls` — same shape as `CompleteResult.toolCalls`. Text deltas still arrive
incrementally; tool calls only resolve once the stream completes, since providers send them as
partial JSON chunks that aren't safe to parse until the block closes.

A **cache hit** replayed through `stream()` surfaces `toolCalls` that were stored from an
earlier call — the cache entry includes them.

## Caching

The cache key includes `tools` and `raw` alongside the model chain, messages, temperature, and
`maxTokens`. Changing the tool set or provider-specific `raw` params will miss the cache even
when the prompt text is identical.

## Next

- [Structured output](/guide/extract) — JSON once, no tool loop
- [Testing](/guide/testing) — fake an adapter that returns `toolCalls`
- `examples/tools.ts` — end-to-end loop against a real provider
