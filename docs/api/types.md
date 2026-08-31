---
description: CompleteResult, CallOptions, RouterConfig, ModelRef, and the shapes around them.
---

# Types

Public TypeScript shapes exported from `llm-sdk`. For behavior, prefer the guide pages; this is
the field checklist.

## Model refs

```ts
type ProviderName = "openai" | "anthropic" | "groq" | "ollama" | "local";
type ModelRef = `${ProviderName}/${string}` | (string & {});
```

Custom adapter names are allowed at runtime (`"acme/fast"`); the branded template helps
autocomplete for built-ins.

## Messages

```ts
type Role = "system" | "user" | "assistant" | "tool";

interface Message {
  role: Role;
  content: string;
  name?: string;
  toolCalls?: ToolCall[]; // assistant — echo from CompleteResult
  toolCallId?: string; // tool — id being answered
}

interface ToolCall {
  id: string;
  name: string;
  args: unknown;
}

interface ToolDefinition {
  name: string;
  description?: string;
  schema?: unknown; // JSON Schema or Zod
}
```

## Options

```ts
interface RetryOptions {
  attempts?: number; // default 1
  baseDelay?: number; // default 500
  maxDelay?: number; // default 10_000
}

interface CacheOptions {
  ttl?: string | number;
  includeNonDeterministic?: boolean;
}

interface CallOptions {
  model?: ModelRef;
  primary?: ModelRef;
  fallbacks?: ModelRef[];
  retry?: RetryOptions;
  timeout?: number;
  cache?: CacheOptions | false;
  temperature?: number;
  maxTokens?: number;
  system?: string;
  messages?: Message[];
  raw?: Partial<Record<ProviderName, Record<string, unknown>>>;
  tools?: ToolDefinition[];
  allowContentFilterFailover?: boolean;
}

interface RouteConfig extends CallOptions {}

interface ProviderOverrideConfig {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number; // accepted on the type; not applied by built-in adapters today
}

interface RouterConfig extends CallOptions {
  routes?: Record<string, RouteConfig>;
  default?: string;
  onFallback?: (from: ModelRef, to: ModelRef, err: unknown) => void;
  providers?: Partial<Record<ProviderName, ProviderOverrideConfig>>;
  adapters?: Record<string, Adapter>;
}
```

## Results

```ts
interface Usage {
  input: number;
  output: number;
}

interface AttemptRecord {
  provider: string;
  model: string;
  error?: string;
  ms: number;
}

interface CompleteResult {
  text: string;
  provider: string;
  model: string;
  usage: Usage;
  cost: number;
  cached: boolean;
  latencyMs: number;
  attempts: AttemptRecord[];
  toolCalls: ToolCall[];
}

interface ExtractResult<T = unknown> {
  data: T;
  text: string;
  provider: string;
  model: string;
  usage: Usage;
  cost: number;
  cached: boolean;
  latencyMs: number;
  attempts: AttemptRecord[];
}
```

## Streaming

```ts
interface StreamChunk {
  text: string;
  done?: boolean;
}

interface StreamHandle {
  [Symbol.asyncIterator](): AsyncIterator<StreamChunk>;
  result(): Promise<CompleteResult>;
}
```

## Adapter contract

```ts
interface AdapterRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  tools?: ToolDefinition[];
  raw?: Record<string, unknown>;
  signal?: AbortSignal;
}

interface AdapterResponse {
  text: string;
  usage: Usage;
  toolCalls: ToolCall[];
  finishReason?: string;
}

type AdapterStreamEvent =
  | { type: "delta"; text: string }
  | { type: "done"; usage: Usage; toolCalls: ToolCall[]; finishReason?: string };

interface Adapter {
  readonly name: string;
  complete(request: AdapterRequest): Promise<AdapterResponse>;
  stream(request: AdapterRequest): AsyncIterable<AdapterStreamEvent>;
}
```

## Extract helpers

```ts
interface ExtractInput<S = unknown> {
  prompt: string;
  system?: string;
  schema: S;
  schemaDescription?: string;
}

type InferSchemaOutput<S> = /* Zod / Standard Schema inference, else unknown */;
```

## Related

- [createRouter](/api/create-router)
- [Configuration](/guide/configuration)
- [Errors API](/api/errors)
