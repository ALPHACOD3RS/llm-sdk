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
  complete(input: CompleteArg, options?: CallOptions): Promise<CompleteResult>;
  /** Infer output type from schema; override with `T` if needed. */
  extract<S, T = InferSchemaOutput<S>>(
    input: ExtractInput<S>,
    options?: CallOptions,
  ): Promise<ExtractResult<T>>;
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
