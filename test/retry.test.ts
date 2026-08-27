import { describe, expect, it } from "vitest";
import { computeBackoff } from "../src/policy/retry.js";

describe("computeBackoff", () => {
  it("respects Retry-After when provided", () => {
    expect(computeBackoff(0, { maxDelay: 10_000 }, 2_000)).toBe(2_000);
  });

  it("caps Retry-After at maxDelay", () => {
    expect(computeBackoff(0, { maxDelay: 1_000 }, 5_000)).toBe(1_000);
  });

  it("returns jittered delay within max", () => {
    for (let i = 0; i < 20; i++) {
      const delay = computeBackoff(0, { baseDelay: 500, maxDelay: 10_000 });
      expect(delay).toBeGreaterThanOrEqual(0);
      expect(delay).toBeLessThan(500);
    }
  });
});
