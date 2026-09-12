import type { Usage } from "../types.js";
import prices from "./prices.json" with { type: "json" };

export type PriceRow = { input: number; output: number };

export const PRICES: Record<string, PriceRow> = prices;

/** Whether `model` has a row in the price table (lookup key `cost()` and the router both use). */
export function isKnownModel(model: string): boolean {
  return Object.hasOwn(PRICES, model);
}

const warnedModels = new Set<string>();

/** Reset the warn-once tracker. Exposed for tests; not part of the public API surface. */
export function resetPricingWarnings(): void {
  warnedModels.clear();
}

/** Estimated USD cost for a completion. `0` for a model missing from `PRICES` — warns once per model. */
export function cost(usage: Usage, model: string): number {
  const row = PRICES[model];
  if (!row) {
    if (!warnedModels.has(model)) {
      warnedModels.add(model);
      console.warn(
        `[llm-sdk] No pricing data for model "${model}" — cost will report as 0, which means ` +
          `"unpriced," not "free." Extend PRICES or check CompleteResult.unknownModel.`,
      );
    }
    return 0;
  }
  return (usage.input / 1_000_000) * row.input + (usage.output / 1_000_000) * row.output;
}

/** @deprecated Prefer `cost(usage, model)` */
export function estimateCost(model: string, usage: Usage): number {
  return cost(usage, model);
}

export { PRICES as PRICING };
