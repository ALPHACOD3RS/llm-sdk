import { createRouter } from "../src/index.js";

const llm = createRouter({ primary: "openai/gpt-4o-mini", cache: { ttl: "5m" } });

const prompt =
  "Write a short release announcement (3-4 sentences) for a new 'scheduled exports' feature " +
  "that lets users automatically email themselves a PDF dashboard export every Monday morning.";

async function draft(label: string) {
  const started = Date.now();
  const stream = llm.stream(prompt);

  for await (const chunk of stream) {
    if (!chunk.done) process.stdout.write(chunk.text);
  }

  const final = await stream.result();
  console.log("\n", label, {
    provider: final.provider,
    cost: final.cost,
    cached: final.cached,
    elapsedMs: Date.now() - started,
  });
}

await draft("[first draft]");
// Cache hit: streamed as one chunk with `cached: true`.
await draft("[same prompt again]");
