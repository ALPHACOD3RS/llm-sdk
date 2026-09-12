import { afterEach, describe, expect, it, vi } from "vitest";
import { cost, isKnownModel, PRICES, resetPricingWarnings } from "../src/pricing/index.js";

describe("cost", () => {
  afterEach(() => {
    resetPricingWarnings();
    vi.restoreAllMocks();
  });

  it("prices a known model from the table", () => {
    const [model, row] = Object.entries(PRICES)[0]!;
    const amount = cost({ input: 1_000_000, output: 1_000_000 }, model);
    expect(amount).toBeCloseTo(row.input + row.output);
  });

  it("returns 0 for an unknown model", () => {
    expect(cost({ input: 1000, output: 200 }, "totally-made-up-model")).toBe(0);
  });

  it("warns once per unknown model, not on every call", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    cost({ input: 10, output: 10 }, "some-unpriced-model");
    cost({ input: 10, output: 10 }, "some-unpriced-model");
    cost({ input: 10, output: 10 }, "some-unpriced-model");

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain("some-unpriced-model");
  });

  it("does not warn for a known model", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const [model] = Object.entries(PRICES)[0]!;

    cost({ input: 10, output: 10 }, model);

    expect(warn).not.toHaveBeenCalled();
  });
});

describe("isKnownModel", () => {
  it("is true for a model in the price table", () => {
    const [model] = Object.entries(PRICES)[0]!;
    expect(isKnownModel(model)).toBe(true);
  });

  it("is false for a model not in the price table", () => {
    expect(isKnownModel("totally-made-up-model")).toBe(false);
  });
});
