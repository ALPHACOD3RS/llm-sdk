import { z } from "zod";
import { createRouter } from "../src/index.js";

const llm = createRouter({ primary: "openai/gpt-4o-mini" });

const schema = z.object({
  total: z.number(),
  dueDate: z.string(),
});

const { data } = await llm.extract({
  prompt: "Extract the invoice details: Total due is $42, payable by January 1, 2026.",
  schema,
});

console.log(data.total, data.dueDate);
