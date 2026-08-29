import { createRouter } from "../src/index.js";

const llm = createRouter({
  primary: "openai/gpt-4o-mini",
  fallbacks: ["anthropic/claude-sonnet-4-5"],
  retry: { attempts: 2 },
  onFallback: (from, to, err) => console.warn(`[incident-bot] ${from} failed, trying ${to}:`, err),
});

const alertData = `
Service: checkout-api
Alert: p99 latency > 2000ms (threshold: 500ms)
Duration: 14 minutes and rising
Affected: ~8% of checkout requests (region: eu-west-1)
Related deploy: checkout-api v2.14.0, rolled out 22 minutes ago
`;

const res = await llm.complete(
  `Write a 2-sentence incident summary for our #incidents Slack channel from this alert data. ` +
    `Be specific about impact and the likely cause.\n${alertData}`,
);

console.log(res.text);
console.log({ servedBy: res.provider, attempts: res.attempts });
