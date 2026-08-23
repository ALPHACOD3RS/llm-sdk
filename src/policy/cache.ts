import type { CallOptions } from "../types.js";

/** Skip cache when temperature > 0 unless opted in. */
export function cacheAllowed(
  cache: CallOptions["cache"],
  temperature: number | undefined,
): cache is NonNullable<CallOptions["cache"]> & object {
  if (!cache) return false;
  if (temperature !== undefined && temperature > 0 && !cache.includeNonDeterministic) return false;
  return true;
}
