import { describe, expect, it } from "vitest";
import { BadRequest, classify, ProviderError, providerErrorFromHttp } from "../src/errors.js";

describe("classify", () => {
  it("maps common HTTP statuses", () => {
    expect(classify(429)).toBe("rate_limit");
    expect(classify(401)).toBe("auth");
    expect(classify(500)).toBe("server_error");
    expect(classify(408)).toBe("timeout");
    expect(classify(400)).toBe("bad_request");
    expect(classify(529)).toBe("overloaded");
  });
});

describe("providerErrorFromHttp", () => {
  it("parses Retry-After seconds", () => {
    const err = providerErrorFromHttp("openai", 429, "slow down", "2");
    expect(err).toBeInstanceOf(ProviderError);
    expect(err.kind).toBe("rate_limit");
    expect(err.retryAfterMs).toBe(2000);
    expect(err.retryable).toBe(true);
  });
});

describe("BadRequest", () => {
  it("is named correctly", () => {
    expect(new BadRequest("x").name).toBe("BadRequest");
  });
});
