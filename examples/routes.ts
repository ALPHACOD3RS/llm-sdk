import { createRouter } from "../src/index.js";

const llm = createRouter({
  routes: {
    triage: { primary: "openai/gpt-4o-mini" },
    reply: { primary: "openai/gpt-4o" },
    digest: { primary: "openai/gpt-4o-mini", cache: { ttl: "24h" } },
  },
  default: "reply",
});

const ticket = "My export button has been spinning for 20 minutes and nothing downloads.";

const category = await llm
  .route("triage")
  .complete(
    `Classify this support ticket into exactly one word (billing, bug, feature-request, other): "${ticket}"`,
  );
console.log("triage:", category.text);

const reply = await llm
  .route("reply")
  .complete(
    `Write a short, empathetic reply to this customer ticket, acknowledging the issue and saying ` +
      `we're looking into it: "${ticket}"`,
  );
console.log("reply:", reply.text);

const digest = await llm
  .route("digest")
  .complete("In one sentence, explain why PDF export failures often spike right after a frontend deploy.");
console.log("digest:", digest.text);
