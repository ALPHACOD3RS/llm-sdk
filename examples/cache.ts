import { createRouter } from "../src/index.js";

const llm = createRouter({
  primary: "openai/gpt-4o-mini",
  system:
    "You are the support assistant for Northwind Analytics, a B2B dashboarding SaaS. " +
    "Answer in one short sentence. Refund policy: full refund within 14 days, no refunds after. " +
    "Free plan: 3 dashboards, 1 seat. Pro plan ($49/mo): unlimited dashboards, 10 seats.",
  cache: { ttl: "5m" },
});

const incoming = [
  { user: "user_104", question: "What's your refund policy?" },
  { user: "user_207", question: "How many dashboards do I get on the free plan?" },
  { user: "user_318", question: "What's your refund policy?" },
  { user: "user_119", question: "How much is the Pro plan?" },
  { user: "user_104", question: "What's your refund policy?" },
  { user: "user_402", question: "How many dashboards do I get on the free plan?" },
];

let totalCost = 0;
let apiCalls = 0;
let cacheHits = 0;

for (const { user, question } of incoming) {
  const res = await llm.complete(question);
  totalCost += res.cost;
  res.cached ? cacheHits++ : apiCalls++;

  console.log(`[${user}]${res.cached ? " (cached)" : ""} "${question}" → ${res.text}`);
}

console.log(
  `\n${incoming.length} questions answered — ${apiCalls} real API call(s), ${cacheHits} served from cache.`,
);

console.log(`Total attributed cost: $${totalCost.toFixed(6)}`);
