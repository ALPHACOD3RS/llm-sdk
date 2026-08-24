import type { Usage } from "../types.js";
import prices from "./prices.json" with { type: "json" };

export type PriceRow = { input: number; output: number };

export const PRICES: Record<string, PriceRow> = prices;

/** Estimated USD cost for a completion. */
export function cost(usage: Usage, model: string): number {
  const row = PRICES[model];
  if (!row) return 0;
  return (usage.input / 1_000_000) * row.input + (usage.output / 1_000_000) * row.output;
}

/** @deprecated Prefer `cost(usage, model)` */
export function estimateCost(model: string, usage: Usage): number {
  return cost(usage, model);
}

export { PRICES as PRICING };
