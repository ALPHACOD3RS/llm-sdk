import type { RetryOptions } from "../types.js";
import { ProviderError } from "../errors.js";

export function computeBackoff(
  attemptIndex: number,
  options: RetryOptions = {},
  retryAfterMs?: number,
): number {
  if (retryAfterMs !== undefined && retryAfterMs > 0) {
    return Math.min(options.maxDelay ?? 10_000, retryAfterMs);
  }
  const base = options.baseDelay ?? 500;
  const max = options.maxDelay ?? 10_000;
  const exp = Math.min(max, base * 2 ** attemptIndex);
  // full jitter
  return Math.floor(Math.random() * exp);
}

export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ProviderError("Timed out", { kind: "timeout", provider: "router" }));
      return;
    }
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(new ProviderError("Timed out", { kind: "timeout", provider: "router" }));
      },
      { once: true },
    );
  });
}
