---
description: Exported error classes and the fields they carry.
---

# Errors API

```ts
import {
  BadRequest,
  AllProvidersFailed,
  ProviderError,
  type ErrorKind,
} from "llm-sdk";
```

Behavioral guide: [Errors](/guide/errors).

## `BadRequest`

```ts
class BadRequest extends Error {
  name: "BadRequest";
  constructor(message: string, options?: { cause?: unknown });
}
```

Fatal for the call. Never retried. Never failed over.

## `AllProvidersFailed`

```ts
class AllProvidersFailed extends Error {
  name: "AllProvidersFailed";
  readonly attempts: AttemptRecord[];
  constructor(attempts: AttemptRecord[], message?: string);
}
```

Default message: `"All providers failed"`. Content-filter default stop uses
`"Content was filtered by the provider"`.

## `ProviderError`

```ts
type ErrorKind =
  | "rate_limit"
  | "timeout"
  | "overloaded"
  | "server_error"
  | "network"
  | "auth"
  | "bad_request"
  | "content_filter"
  | "unknown";

class ProviderError extends Error {
  name: "ProviderError";
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
  );
}
```

Default `retryable` is `true` for `rate_limit`, `timeout`, `overloaded`, `server_error`, and
`network`; otherwise `false` unless overridden.

Use when implementing a custom `Adapter`. See [Testing](/guide/testing).

## Related

- [Fallback & retry](/guide/fallback) — policy by `kind`
- [createRouter](/api/create-router)
