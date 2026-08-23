import { AllProvidersFailed, BadRequest, ProviderError } from "../errors.js";
import type { AttemptRecord, CallOptions } from "../types.js";

export function errorLabel(error: unknown): string {
  if (error instanceof ProviderError) return error.kind;
  if (error instanceof Error) return error.message;
  return "unknown";
}

/** Failover must stop for these errors. */
export function reclassifyFatal(err: unknown, options: CallOptions, attempts: AttemptRecord[]): void {
  if (err instanceof BadRequest) throw err;
  if (err instanceof ProviderError && err.kind === "bad_request") {
    throw new BadRequest(err.message, { cause: err });
  }
  if (
    err instanceof ProviderError &&
    err.kind === "content_filter" &&
    !options.allowContentFilterFailover
  ) {
    throw new AllProvidersFailed(attempts, "Content was filtered by the provider");
  }
}

/** Kinds where retrying the same provider is pointless. */
export function skipsSameProviderRetry(err: unknown): boolean {
  return (
    err instanceof ProviderError &&
    (err.kind === "overloaded" ||
      err.kind === "content_filter" ||
      err.kind === "auth" ||
      err.kind === "unknown")
  );
}
