import { cacheKey, parseTtl, type CacheEntry } from "../cache/index.js";
import { AllProvidersFailed, BadRequest, ProviderError } from "../errors.js";
import { extractWithSchema } from "../extract.js";
import { cacheAllowed } from "../policy/cache.js";
import { errorLabel, reclassifyFatal, skipsSameProviderRetry } from "../policy/fallback.js";
import { computeBackoff, sleep } from "../policy/retry.js";
import { TimeoutBudget } from "../policy/timeout.js";
import { cost } from "../pricing/index.js";
import type {
  AttemptRecord,
  CallOptions,
  CompleteArg,
  CompleteResult,
  ExtractInput,
  ExtractResult,
  InferSchemaOutput,
  ModelRef,
  RouteConfig,
  StreamChunk,
  StreamHandle,
  ToolCall,
  Usage,
} from "../types.js";
import { toMessages } from "./messages.js";
import { parseModelRef } from "./model-ref.js";
import { assertNoConflictingModelFields, mergeOptions, resolveModelChain } from "./options.js";
import { buildAdapterRequest } from "./request.js";
import type { RouterState } from "./state.js";
import type { PreparedCall, Router } from "./types.js";

/** Pre-flush buffer size for stream failover. */
const STREAM_BUFFER_CHARS = 40;

/** Replay a cache hit as a single chunk. */
function replayFromCache(hit: CacheEntry): StreamHandle {
  async function* run(): AsyncGenerator<StreamChunk> {
    if (hit.text) yield { text: hit.text };
    yield { text: "", done: true };
  }

  const iterator = run();
  const result: CompleteResult = { ...hit, cached: true, latencyMs: 0, attempts: [] };

  return {
    [Symbol.asyncIterator]: () => iterator,
    async result(): Promise<CompleteResult> {
      for await (const _ of iterator) {
        /* drain */
      }
      return result;
    },
  };
}

export class RouterImpl<R extends string> implements Router<R> {
  constructor(
    private readonly state: RouterState,
    private readonly routeName?: R,
  ) {}

  private get config() {
    return this.state.config;
  }

  route(name: R): Router<R> {
    if (!this.config.routes?.[name]) {
      throw new BadRequest(`Unknown route "${name}"`);
    }
    return new RouterImpl(this.state, name);
  }

  private prepareCall(input: CompleteArg, call: CallOptions): PreparedCall {
    assertNoConflictingModelFields(call, "call options");
    const routeConfig = this.activeRoute();
    const options = mergeOptions(this.config, routeConfig, call);
    const modelChain = resolveModelChain(options);

    if (modelChain.length === 0) {
      throw new BadRequest("No primary model configured");
    }

    const messages = toMessages(input, options);
    const temperature =
      call.temperature ??
      (typeof input === "object" ? input.temperature : undefined) ??
      options.temperature;
    const maxTokens =
      call.maxTokens ??
      (typeof input === "object" ? input.maxTokens : undefined) ??
      options.maxTokens;
    const tools =
      call.tools ?? (typeof input === "object" ? input.tools : undefined) ?? options.tools;

    return {
      options,
      modelChain,
      messages,
      ...(temperature !== undefined ? { temperature } : {}),
      ...(maxTokens !== undefined ? { maxTokens } : {}),
      ...(tools !== undefined ? { tools } : {}),
    };
  }

  async complete(input: CompleteArg, call: CallOptions = {}): Promise<CompleteResult> {
    const prepared = this.prepareCall(input, call);
    const { options, modelChain, messages, temperature, maxTokens } = prepared;

    const keyOpts = {
      ...(temperature !== undefined ? { temperature } : {}),
      ...(maxTokens !== undefined ? { maxTokens } : {}),
    };

    const cacheEnabled = cacheAllowed(options.cache, temperature);
    if (cacheEnabled) {
      const hit = this.state.cache.get(cacheKey(modelChain, messages, keyOpts));
      if (hit) {
        return { ...hit, cached: true, latencyMs: 0, attempts: [] };
      }
    }

    const budget = new TimeoutBudget(options.timeout ?? 60_000);
    const attempts: AttemptRecord[] = [];
    const retries = options.retry?.attempts ?? 1;

    for (let i = 0; i < modelChain.length; i++) {
      const ref = modelChain[i] as ModelRef;
      const parsed = parseModelRef(ref);
      const adapter = this.state.getAdapter(parsed.provider);

      for (let retry = 0; retry < retries; retry++) {
        if (budget.exhausted()) {
          attempts.push({
            provider: parsed.provider,
            model: parsed.model,
            error: "timeout",
            ms: 0,
          });
          break;
        }

        const started = Date.now();
        const { signal, clear } = budget.signalForAttempt();

        try {
          const response = await adapter.complete(buildAdapterRequest(parsed, prepared, signal));

          clear();
          const ms = Date.now() - started;
          attempts.push({ provider: parsed.provider, model: parsed.model, ms });

          const estimated = cost(response.usage, parsed.model);
          const result: CompleteResult = {
            text: response.text,
            provider: parsed.provider,
            model: parsed.model,
            usage: response.usage,
            cost: estimated,
            cached: false,
            latencyMs: ms,
            attempts,
            toolCalls: response.toolCalls,
          };

          if (cacheEnabled && options.cache) {
            const entry: CacheEntry = {
              text: result.text,
              provider: result.provider,
              model: result.model,
              usage: result.usage,
              cost: result.cost,
              toolCalls: result.toolCalls,
            };
            this.state.cache.set(
              cacheKey(modelChain, messages, keyOpts),
              entry,
              parseTtl(options.cache.ttl ?? "1h"),
            );
          }

          return result;
        } catch (err) {
          clear();
          const ms = Date.now() - started;
          attempts.push({
            provider: parsed.provider,
            model: parsed.model,
            error: errorLabel(err),
            ms,
          });

          reclassifyFatal(err, options, attempts);

          const nextRef = modelChain[i + 1] as ModelRef | undefined;
          const isLastRetry = skipsSameProviderRetry(err) || retry >= retries - 1;

          if (isLastRetry) {
            if (nextRef) this.config.onFallback?.(ref, nextRef, err);
            break;
          }

          const retryAfterMs = err instanceof ProviderError ? err.retryAfterMs : undefined;
          const delay = computeBackoff(retry, options.retry ?? {}, retryAfterMs);
          const wait = Math.min(delay, budget.remaining());
          if (wait > 0) {
            await sleep(wait, AbortSignal.timeout(budget.remaining()));
          }
        }
      }
    }

    throw new AllProvidersFailed(attempts);
  }

  extract<S, T = InferSchemaOutput<S>>(
    input: ExtractInput<S>,
    call: CallOptions = {},
  ): Promise<ExtractResult<T>> {
    return extractWithSchema<S, T>((i, o) => this.complete(i, o), input, call);
  }

  stream(input: CompleteArg, call: CallOptions = {}): StreamHandle {
    const prepared = this.prepareCall(input, call);
    const { options, modelChain, messages, temperature, maxTokens } = prepared;

    const keyOpts = {
      ...(temperature !== undefined ? { temperature } : {}),
      ...(maxTokens !== undefined ? { maxTokens } : {}),
    };
    const cacheEnabled = cacheAllowed(options.cache, temperature);

    if (cacheEnabled) {
      const hit = this.state.cache.get(cacheKey(modelChain, messages, keyOpts));
      if (hit) return replayFromCache(hit);
    }

    const budget = new TimeoutBudget(options.timeout ?? 60_000);
    const attempts: AttemptRecord[] = [];
    let finalResult: CompleteResult | undefined;
    let finalError: unknown;
    const config = this.config;
    const state = this.state;

    async function* run(): AsyncGenerator<StreamChunk> {
      try {
        for (let i = 0; i < modelChain.length; i++) {
          const ref = modelChain[i] as ModelRef;
          const parsed = parseModelRef(ref);
          const adapter = state.getAdapter(parsed.provider);

          const started = Date.now();
          const { signal, clear } = budget.signalForAttempt();

          let fullText = "";
          let buffer = "";
          let flushed = false;
          let usage: Usage = { input: 0, output: 0 };
          let toolCalls: ToolCall[] = [];

          try {
            for await (const evt of adapter.stream(buildAdapterRequest(parsed, prepared, signal))) {
              if (evt.type === "delta") {
                fullText += evt.text;
                if (!flushed) {
                  buffer += evt.text;
                  if (buffer.length >= STREAM_BUFFER_CHARS) {
                    flushed = true;
                    yield { text: buffer };
                    buffer = "";
                  }
                } else {
                  yield { text: evt.text };
                }
              } else {
                usage = evt.usage;
                toolCalls = evt.toolCalls;
              }
            }

            clear();
            const ms = Date.now() - started;
            attempts.push({ provider: parsed.provider, model: parsed.model, ms });

            if (buffer.length > 0) yield { text: buffer };
            yield { text: "", done: true };

            const estimated = cost(usage, parsed.model);

            if (cacheEnabled && options.cache) {
              const entry: CacheEntry = {
                text: fullText,
                provider: parsed.provider,
                model: parsed.model,
                usage,
                cost: estimated,
                toolCalls,
              };
              state.cache.set(cacheKey(modelChain, messages, keyOpts), entry, parseTtl(options.cache.ttl ?? "1h"));
            }

            finalResult = {
              text: fullText,
              provider: parsed.provider,
              model: parsed.model,
              usage,
              cost: estimated,
              cached: false,
              latencyMs: ms,
              attempts,
              toolCalls,
            };
            return;
          } catch (err) {
            clear();
            const ms = Date.now() - started;
            attempts.push({ provider: parsed.provider, model: parsed.model, error: errorLabel(err), ms });

            reclassifyFatal(err, options, attempts);

            if (flushed) {
              // Partial output already visible — cannot fail over cleanly.
              throw err;
            }

            const nextRef = modelChain[i + 1] as ModelRef | undefined;
            if (nextRef) {
              config.onFallback?.(ref, nextRef, err);
              continue;
            }
            throw new AllProvidersFailed(attempts);
          }
        }
        throw new AllProvidersFailed(attempts);
      } catch (err) {
        finalError = err;
        throw err;
      }
    }

    const iterator = run();

    return {
      [Symbol.asyncIterator]: () => iterator,
      async result(): Promise<CompleteResult> {
        for await (const _ of iterator) {
          /* drain */
        }
        if (finalResult) return finalResult;
        throw finalError ?? new Error("stream ended without a result");
      },
    };
  }

  private activeRoute(): RouteConfig | undefined {
    if (this.routeName) return this.config.routes?.[this.routeName];
    if (this.config.default && this.config.routes?.[this.config.default]) {
      return this.config.routes[this.config.default];
    }
    return undefined;
  }
}
