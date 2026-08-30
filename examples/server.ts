import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { z } from "zod";
import { AllProvidersFailed, BadRequest, createRouter, type Message } from "../src/index.js";

// One router per process — creating per-request drops the in-process cache.
const llm = createRouter({
  system: "You are the support system for Northwind Analytics, a B2B dashboarding SaaS.",
  routes: {
    triage: { primary: "openai/gpt-4o-mini" },
    reply: { primary: "openai/gpt-4o-mini", fallbacks: ["anthropic/claude-sonnet-4-5"] },
  },
  default: "reply",
  cache: { ttl: "10m" },
  onFallback: (from, to, err) =>
    console.warn(`[llm-sdk] ${from} failed, falling back to ${to}:`, err instanceof Error ? err.message : err),
});

const accounts: Record<string, { plan: string; seats: number; renewalDate: string }> = {
  "acme-corp.io": { plan: "Pro", seats: 10, renewalDate: "2026-11-01" },
  "globex.io": { plan: "Free", seats: 1, renewalDate: "n/a" },
};

function lookupAccount(accountId: string): string {
  const account = accounts[accountId];
  return account
    ? JSON.stringify(account)
    : JSON.stringify({ error: `No account found for "${accountId}"` });
}

const accountLookupTool = {
  name: "getAccountInfo",
  description: "Look up a customer's plan, seat count, and renewal date by their account domain",
  schema: { type: "object", properties: { accountId: { type: "string" } }, required: ["accountId"] },
};

const TriageSchema = z.object({
  category: z.enum(["billing", "bug", "feature-request", "other"]),
  urgency: z.enum(["low", "medium", "high"]),
  sentiment: z.enum(["positive", "neutral", "negative"]),
});

interface TicketRequest {
  customerId: string;
  subject: string;
  body: string;
}

function parseTicketRequest(body: unknown): TicketRequest {
  const b = body as Partial<TicketRequest> | null;
  if (typeof b?.customerId !== "string" || typeof b?.subject !== "string" || typeof b?.body !== "string") {
    throw new BadRequest("Request body must include customerId, subject, and body (all strings)");
  }
  return { customerId: b.customerId, subject: b.subject, body: b.body };
}

async function triage(ticket: TicketRequest) {
  return llm.route("triage").extract({
    prompt: `Subject: ${ticket.subject}\n\n${ticket.body}`,
    schema: TriageSchema,
  });
}

async function draftReply(ticket: TicketRequest, urgency: z.infer<typeof TriageSchema>["urgency"]) {
  if (urgency !== "high") {
    return llm.route("reply").complete(`Write a short, friendly reply to this support ticket:\n\n${ticket.body}`);
  }

  const messages: Message[] = [
    {
      role: "user",
      content:
        `Write a reply to this urgent support ticket, looking up the customer's account first ` +
        `(account: ${ticket.customerId}):\n\n${ticket.body}`,
    },
  ];

  const first = await llm.route("reply").complete({ messages, tools: [accountLookupTool] });
  if (!first.toolCalls.length) return first;

  messages.push({ role: "assistant", content: first.text, toolCalls: first.toolCalls });
  for (const call of first.toolCalls) {
    const { accountId } = call.args as { accountId: string };
    messages.push({ role: "tool", toolCallId: call.id, content: lookupAccount(accountId) });
  }

  return llm.route("reply").complete({ messages });
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new BadRequest("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body, null, 2));
}

function errorStatus(err: unknown): number {
  if (err instanceof BadRequest) return 400; // caller's mistake — bad input, or the SDK's own
  if (err instanceof AllProvidersFailed) return 503; // every provider failed — try again later
  return 500;
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/tickets") {
      const ticket = parseTicketRequest(await readJsonBody(req));
      const triaged = await triage(ticket);
      const reply = await draftReply(ticket, triaged.data.urgency);

      sendJson(res, 200, {
        ...triaged.data,
        reply: reply.text,
        cost: triaged.cost + reply.cost,
        cached: reply.cached,
        servedBy: reply.provider,
      });
      return;
    }

    if (req.method === "POST" && req.url === "/tickets/stream") {
      const ticket = parseTicketRequest(await readJsonBody(req));
      const triaged = await triage(ticket);

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      // Streaming path skips tools; use /tickets for tool-grounded replies.
      const stream = llm
        .route("reply")
        .stream(`Write a short, friendly reply to this ${triaged.data.urgency}-urgency support ticket:\n\n${ticket.body}`);

      for await (const chunk of stream) {
        if (!chunk.done) res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }

      const final = await stream.result();
      res.write(
        `event: done\ndata: ${JSON.stringify({
          ...triaged.data,
          cost: triaged.cost + final.cost,
          cached: final.cached,
        })}\n\n`,
      );
      res.end();
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (err) {
    if (res.headersSent) {
      res.end();
      return;
    }
    sendJson(res, errorStatus(err), { error: err instanceof Error ? err.message : "Unknown error" });
  }
});

const PORT = Number(process.env.PORT ?? 3000);
server.listen(PORT, () => {
  console.log(`Northwind support API listening on http://localhost:${PORT}\n`);
  console.log("Try it:\n");
  console.log(
    `curl -X POST http://localhost:${PORT}/tickets -H "Content-Type: application/json" -d ` +
      `'{"customerId":"acme-corp.io","subject":"Export broken","body":"My PDF export has been failing since this morning, on the Pro plan, urgent."}'\n`,
  );
  console.log(
    `curl -N -X POST http://localhost:${PORT}/tickets/stream -H "Content-Type: application/json" -d ` +
      `'{"customerId":"acme-corp.io","subject":"Quick question","body":"Do you support SSO?"}'`,
  );
});
