import anthropic from "@lobehub/icons-static-svg/icons/anthropic.svg?raw";
import deepseek from "@lobehub/icons-static-svg/icons/deepseek.svg?raw";
import fireworks from "@lobehub/icons-static-svg/icons/fireworks.svg?raw";
import gemini from "@lobehub/icons-static-svg/icons/gemini.svg?raw";
import groq from "@lobehub/icons-static-svg/icons/groq.svg?raw";
import lmstudio from "@lobehub/icons-static-svg/icons/lmstudio.svg?raw";
import mistral from "@lobehub/icons-static-svg/icons/mistral.svg?raw";
import ollama from "@lobehub/icons-static-svg/icons/ollama.svg?raw";
import openai from "@lobehub/icons-static-svg/icons/openai.svg?raw";
import openrouter from "@lobehub/icons-static-svg/icons/openrouter.svg?raw";
import together from "@lobehub/icons-static-svg/icons/together.svg?raw";
import vllm from "@lobehub/icons-static-svg/icons/vllm.svg?raw";
import xai from "@lobehub/icons-static-svg/icons/xai.svg?raw";

/** Fallback marks when there is no vendor logo. */
const mock = `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="2.2"/></svg>`;
const compatible = `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 7H6a3 3 0 0 0 0 6h3M15 17h3a3 3 0 0 0 0-6h-3M8 12h8"/></svg>`;
const custom = `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 5v14M5 12h14"/></svg>`;

export const brands = {
  anthropic,
  compatible,
  custom,
  deepseek,
  fireworks,
  gemini,
  groq,
  lmstudio,
  mistral,
  mock,
  ollama,
  openai,
  openrouter,
  together,
  vllm,
  xai,
} satisfies Record<string, string>;

export type BrandName = keyof typeof brands;
