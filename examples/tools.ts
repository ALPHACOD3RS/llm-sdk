import { createRouter, type Message } from "../src/index.js";

const llm = createRouter({ primary: "openai/gpt-4o-mini" });

async function getWeather(city: string): Promise<string> {
  const geo = (await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
  ).then((r) => r.json())) as {
    results?: Array<{ name: string; country: string; latitude: number; longitude: number }>;
  };

  const place = geo.results?.[0];
  if (!place) return JSON.stringify({ error: `No location found for "${city}"` });

  const forecast = (await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m`,
  ).then((r) => r.json())) as { current?: { temperature_2m: number } };

  return JSON.stringify({ city: place.name, country: place.country, tempC: forecast.current?.temperature_2m });
}

function convertTemperature(value: number, from: "C" | "F", to: "C" | "F"): string {
  if (from === to) return JSON.stringify({ value });
  const result = from === "C" ? value * (9 / 5) + 32 : (value - 32) * (5 / 9);
  return JSON.stringify({ value: Math.round(result * 10) / 10 });
}

const handlers: Record<string, (args: any) => Promise<string> | string> = {
  getWeather: ({ city }) => getWeather(city),
  convertTemperature: ({ value, from, to }) => convertTemperature(value, from, to),
};

const tools = [
  {
    name: "getWeather",
    description: "Real-time current weather for a city, in Celsius",
    schema: { type: "object", properties: { city: { type: "string" } }, required: ["city"] },
  },
  {
    name: "convertTemperature",
    description:
      "Precisely converts a temperature between Celsius and Fahrenheit. Always use this instead of doing the math yourself.",
    schema: {
      type: "object",
      properties: {
        value: { type: "number" },
        from: { type: "string", enum: ["C", "F"] },
        to: { type: "string", enum: ["C", "F"] },
      },
      required: ["value", "from", "to"],
    },
  },
];

const messages: Message[] = [
  { role: "user", content: "What's the weather in Addis Ababa right now, in Fahrenheit?" },
];

let res = await llm.complete({ messages, tools });

while (res.toolCalls.length > 0) {
  messages.push({ role: "assistant", content: res.text, toolCalls: res.toolCalls });

  for (const call of res.toolCalls) {
    const handler = handlers[call.name];
    if (!handler) throw new Error(`Model called unknown tool "${call.name}"`);

    const result = await handler(call.args as any);
    console.log(`→ ${call.name}(${JSON.stringify(call.args)}) =`, result);
    messages.push({ role: "tool", toolCallId: call.id, content: result });
  }

  res = await llm.complete({ messages, tools });
}

console.log(res.text);
