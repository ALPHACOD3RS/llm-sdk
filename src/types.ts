export type ProviderName = "openai" | "anthropic" | "groq" | "ollama" | "local";

/** e.g. `anthropic/claude-sonnet-4-5` */
export type ModelRef = `${ProviderName}/${string}` | (string & {});

export type Role = "system" | "user" | "assistant" | "tool";

export interface Message {
  role: Role;
  content: string;
  name?: string;
  /** Present on assistant turns after tool use. */
  toolCalls?: ToolCall[];
  /** Present on tool turns — id of the call being answered. */
  toolCallId?: string;
}

export interface RetryOptions {
  attempts?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export interface CacheOptions {
  /** e.g. `"1h"`, `"30m"`, or milliseconds. */
  ttl?: string | number;
  /** Cache even when `temperature > 0` (off by default). */
  includeNonDeterministic?: boolean;
}

export interface ProviderOverrideConfig {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface CallOptions {
  model?: ModelRef;
  primary?: ModelRef;
  fallbacks?: ModelRef[];
  retry?: RetryOptions;
  /** Total budget across all attempts (ms). */
  timeout?: number;
  cache?: CacheOptions | false;
  temperature?: number;
  maxTokens?: number;
  system?: string;
  messages?: Message[];
  raw?: Partial<Record<ProviderName, Record<string, unknown>>>;
  tools?: ToolDefinition[];
  /** Fail over on content filter / refusal (off by default). */
  allowContentFilterFailover?: boolean;
}

export interface ToolDefinition {
  name: string;
  description?: string;
  schema?: unknown;
}

export interface ToolCall {
  id: string;
  name: string;
  args: unknown;
}

export interface Usage {
  input: number;
  output: number;
}

export interface AttemptRecord {
  provider: ProviderName | string;
  model: string;
  error?: string;
  ms: number;
}

export interface CompleteResult {
  text: string;
  provider: ProviderName | string;
  model: string;
  usage: Usage;
  cost: number;
  cached: boolean;
  latencyMs: number;
  attempts: AttemptRecord[];
  toolCalls: ToolCall[];
}

export interface CompleteInput {
  system?: string;
  messages?: Message[];
  prompt?: string;
  maxTokens?: number;
  temperature?: number;
  tools?: ToolDefinition[];
}

export type CompleteArg = string | CompleteInput;

export interface ExtractInput<S = unknown> {
  prompt: string;
  system?: string;
  schema: S;
  /** Prompt hint when the schema has no inferable `.shape`. */
  schemaDescription?: string;
}

/** Standard Schema phantom marker (Zod v4, Valibot, ArkType, …). */
interface StandardSchemaLike<Output> {
  readonly "~standard": {
    readonly types?: {
      readonly output: Output;
    };
  };
}

/** Zod v3 output phantom (`z.infer`). */
interface ZodV3Like<Output> {
  readonly _output: Output;
}

/** Infer schema output type; falls back to `unknown`. */
export type InferSchemaOutput<S> =
  S extends StandardSchemaLike<infer O> ? O : S extends ZodV3Like<infer O> ? O : unknown;

export interface ExtractResult<T = unknown> {
  data: T;
  text: string;
  provider: ProviderName | string;
  model: string;
  usage: Usage;
  cost: number;
  cached: boolean;
  latencyMs: number;
  attempts: AttemptRecord[];
}

export interface RouteConfig extends CallOptions {
  primary?: ModelRef;
  fallbacks?: ModelRef[];
}

export interface RouterConfig extends CallOptions {
  primary?: ModelRef;
  fallbacks?: ModelRef[];
  routes?: Record<string, RouteConfig>;
  default?: string;
  onFallback?: (from: ModelRef, to: ModelRef, err: unknown) => void;
  providers?: Partial<Record<ProviderName, ProviderOverrideConfig>>;
  /** Custom adapter for a provider name (replaces the built-in). */
  adapters?: Record<string, Adapter>;
}

export interface StreamChunk {
  text: string;
  done?: boolean;
}

export interface StreamHandle {
  [Symbol.asyncIterator](): AsyncIterator<StreamChunk>;
  result(): Promise<CompleteResult>;
}

/** Per-attempt request passed to adapters (no retry/cache). */
export interface AdapterRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  tools?: ToolDefinition[];
  raw?: Record<string, unknown>;
  signal?: AbortSignal;
}

export interface AdapterResponse {
  text: string;
  usage: Usage;
  toolCalls: ToolCall[];
  finishReason?: string;
}

export interface AdapterContext {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface AdapterStreamDelta {
  type: "delta";
  text: string;
}

export interface AdapterStreamDone {
  type: "done";
  usage: Usage;
  toolCalls: ToolCall[];
  finishReason?: string;
}

export type AdapterStreamEvent = AdapterStreamDelta | AdapterStreamDone;

export interface Adapter {
  readonly name: ProviderName | string;
  complete(request: AdapterRequest): Promise<AdapterResponse>;
  /** Streaming does not emit tool calls; use `complete()`. */
  stream(request: AdapterRequest): AsyncIterable<AdapterStreamEvent>;
}
