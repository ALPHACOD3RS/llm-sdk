import { BadRequest } from "../errors.js";
import type { CallOptions, CompleteArg, Message } from "../types.js";

/** Normalize call input + options into `Message[]`. */
export function toMessages(input: CompleteArg, options: CallOptions): Message[] {
  const messages: Message[] = [];
  const system = typeof input === "object" ? input.system ?? options.system : options.system;
  if (system) messages.push({ role: "system", content: system });

  if (typeof input === "string") {
    messages.push({ role: "user", content: input });
    return messages;
  }

  if (input.messages?.length) messages.push(...input.messages);
  else if (input.prompt) messages.push({ role: "user", content: input.prompt });

  if (messages.filter((m) => m.role !== "system").length === 0) {
    throw new BadRequest("complete() requires a string prompt or messages");
  }

  return messages;
}
