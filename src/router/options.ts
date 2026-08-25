import { BadRequest } from "../errors.js";
import type { CallOptions, RouteConfig, RouterConfig } from "../types.js";

/** Reject configs that set both `model` and `primary`. */
export function assertNoConflictingModelFields(o: CallOptions, where: string): void {
  if (o.model !== undefined && o.primary !== undefined) {
    throw new BadRequest(
      `Both "model" and "primary" are set in the same ${where} — "model" always takes ` +
        `precedence, so "primary" would be silently ignored. Set only one.`,
    );
  }
}

/** Merge order: call > route > global. */
export function mergeOptions(
  global: RouterConfig,
  route?: RouteConfig,
  call?: CallOptions,
): CallOptions {
  const out: CallOptions = {
    ...pickShared(global),
    ...pickShared(route ?? {}),
    ...pickShared(call ?? {}),
  };

  const retry = { ...global.retry, ...route?.retry, ...call?.retry };
  if (Object.keys(retry).length > 0) out.retry = retry;

  if (call?.cache !== undefined) out.cache = call.cache;
  else if (route?.cache !== undefined) out.cache = route.cache;
  else if (global.cache !== undefined) out.cache = global.cache;

  const fallbacks = call?.fallbacks ?? route?.fallbacks ?? global.fallbacks;
  if (fallbacks !== undefined) out.fallbacks = fallbacks;

  const raw = { ...global.raw, ...route?.raw, ...call?.raw };
  if (Object.keys(raw).length > 0) out.raw = raw;

  return out;
}

function pickShared(o: CallOptions): CallOptions {
  const out: CallOptions = {};
  if (o.model !== undefined) out.model = o.model;
  if (o.primary !== undefined) out.primary = o.primary;
  if (o.fallbacks !== undefined) out.fallbacks = o.fallbacks;
  if (o.retry !== undefined) out.retry = o.retry;
  if (o.timeout !== undefined) out.timeout = o.timeout;
  if (o.cache !== undefined) out.cache = o.cache;
  if (o.temperature !== undefined) out.temperature = o.temperature;
  if (o.maxTokens !== undefined) out.maxTokens = o.maxTokens;
  if (o.system !== undefined) out.system = o.system;
  if (o.messages !== undefined) out.messages = o.messages;
  if (o.raw !== undefined) out.raw = o.raw;
  if (o.tools !== undefined) out.tools = o.tools;
  if (o.allowContentFilterFailover !== undefined) {
    out.allowContentFilterFailover = o.allowContentFilterFailover;
  }
  return out;
}

export function resolveModelChain(options: CallOptions): string[] {
  if (options.model) return [options.model, ...(options.fallbacks ?? [])];
  if (!options.primary) return options.fallbacks ?? [];
  return [options.primary, ...(options.fallbacks ?? [])];
}
