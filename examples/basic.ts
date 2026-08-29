import { createRouter } from "../src/index.js";

const llm = createRouter({
  primary: "anthropic/claude-sonnet-4-5",
  fallbacks: ["openai/gpt-4o"],
});

const email = `
Subject: Dashboard exports broken since this morning

Hi, ever since your update this morning I can't export any of my dashboards to PDF anymore.
The button just spins forever and nothing downloads. I have a board meeting in 2 hours and
I need these reports. This is on the Pro plan, account acme-corp.io. Please help ASAP.
`;

const res = await llm.complete(
  `Summarize this support email as a single Slack alert line, formatted as ` +
    `"[urgency] one-sentence summary — account". Email:\n${email}`,
);

console.log(res.text);
console.log({ provider: res.provider, cost: res.cost, attempts: res.attempts, usage: res.usage });
