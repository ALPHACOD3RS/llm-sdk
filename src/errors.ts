import type { AttemptRecord } from "./types.js";

/** Caller mistake — not retried or failed over. */
export class BadRequest extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "BadRequest";
  }
}

/** All providers / attempts exhausted. */
export class AllProvidersFailed extends Error {
  readonly attempts: AttemptRecord[];

  constructor(attempts: AttemptRecord[], message = "All providers failed") {
    super(message);
    this.name = "AllProvidersFailed";
    this.attempts = attempts;
  }
}

export type ErrorKind =
  | "rate_limit"
  | "timeout"
  | "overloaded"
  | "server_error"
  | "network"
  | "auth"
  | "bad_request"
  | "content_filter"
  | "unknown";

/** Provider failure; may trigger failover when retryable. */
export class ProviderError extends Error {
  readonly kind: ErrorKind;
  readonly provider: string;
  readonly retryable: boolean;
  readonly status?: number;
  readonly retryAfterMs?: number;

  constructor(
    message: string,
    options: {
      kind: ErrorKind;
      provider: string;
      retryable?: boolean;
      status?: number;
      retryAfterMs?: number;
      cause?: unknown;
    },
  ) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "ProviderError";
    this.kind = options.kind;
    this.provider = options.provider;
    this.retryable =
      options.retryable ??
      (options.kind === "rate_limit" ||
        options.kind === "timeout" ||
        options.kind === "overloaded" ||
        options.kind === "server_error" ||
        options.kind === "network");
    if (options.status !== undefined) this.status = options.status;
    if (options.retryAfterMs !== undefined) this.retryAfterMs = options.retryAfterMs;
  }
}

/** Map HTTP status → `ErrorKind`. */
export function classify(status: number): ErrorKind {
  if (status === 429) return "rate_limit";
  if (status === 408 || status === 504) return "timeout";
  if (status === 401 || status === 403) return "auth";
  if (status === 529) return "overloaded";
  if (status === 400 || status === 404 || status === 422) return "bad_request";
  if (status >= 500) return "server_error";
  return "unknown";
}

export function providerErrorFromHttp(
  provider: string,
  status: number,
  body: string,
  retryAfterHeader?: string | null,
): ProviderError {
  const kind = classify(status);
  const retryAfterMs = parseRetryAfterHeader(retryAfterHeader);
  return new ProviderError(`Request failed (${status}): ${body}`, {
    kind,
    provider,
    status,
    retryable:
      kind === "rate_limit" || kind === "timeout" || kind === "server_error" || kind === "overloaded",
    ...(retryAfterMs !== undefined ? { retryAfterMs } : {}),
  });
}

function parseRetryAfterHeader(header?: string | null): number | undefined {
  if (!header) return undefined;
  const asInt = Number(header);
  if (!Number.isNaN(asInt)) return asInt * 1000;
  const date = Date.parse(header);
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  return undefined;
}
