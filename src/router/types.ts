import type {
  CallOptions,
  CompleteArg,
  CompleteResult,
  ExtractInput,
  ExtractResult,
  InferSchemaOutput,
  Message,
  ModelRef,
  ProviderName,
  StreamHandle,
  ToolDefinition,
} from "../types.js";

export interface Router<R extends string = string> {
  /** Retries the same provider (`retry.attempts`) before failing over to the next model. */
  complete(input: CompleteArg, options?: CallOptions): Promise<CompleteResult>;
  /** Infer output type from schema; override with `T` if needed. */
  extract<S, T = InferSchemaOutput<S>>(
    input: ExtractInput<S>,
    options?: CallOptions,
  ): Promise<ExtractResult<T>>;
  /**
   * Unlike `complete()`, one try per model — no same-provider retry. Fails over to the next
   * model only while the ~40-char pre-flush buffer hasn't been sent to the caller yet; once
   * text has been emitted, a mid-stream failure ends the stream instead (a retry can't un-send
   * text already yielded). See the fallback guide's "Streaming vs complete()" section.
   */
  stream(input: CompleteArg, options?: CallOptions): StreamHandle;
  route(name: R): Router<R>;
}

export interface ParsedModel {
  provider: ProviderName | string;
  model: string;
  ref: ModelRef;
}

/** Resolved options + messages for a call. */
export interface PreparedCall {
  options: CallOptions;
  modelChain: string[];
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  tools?: ToolDefinition[];
}
