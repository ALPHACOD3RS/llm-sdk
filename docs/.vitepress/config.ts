import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { defineConfigWithTheme, type DefaultTheme } from "vitepress";
import { llmsTxtDevServer, renderLlmsTxt } from "./llms.js";
import { icons, type IconName } from "./theme/sidebar-icons.js";

const { version } = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
) as { version: string };

function navItem(icon: IconName, text: string, link: string) {
  return { text: `${icons[icon]}<span>${text}</span>`, link };
}

function navGroup(icon: IconName, text: string) {
  return `${icons[icon]}<span>${text}</span>`;
}

type ThemeConfig = DefaultTheme.Config & { version: string };

export default defineConfigWithTheme<ThemeConfig>({
  title: "llm-sdk",
  description:
    "TypeScript LLM router — automatic fallbacks, named routes, cost tracking, and caching.",
  cleanUrls: true,
  lastUpdated: true,
  appearance: "force-dark",

  vite: {
    plugins: [llmsTxtDevServer(new URL("..", import.meta.url).pathname)],
  },

  async buildEnd({ srcDir, outDir }) {
    await writeFile(join(outDir, "llms.txt"), await renderLlmsTxt(srcDir));
  },

  markdown: {
    config(md) {
      // ```ts [src/router.ts] → filename title bar on the fence.
      const defaultFence = md.renderer.rules.fence!;
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const match = /^(\S+)\s+\[(.+)\]$/.exec(token.info.trim());
        if (!match) return defaultFence(tokens, idx, options, env, self);

        const [, lang, title] = match;
        token.info = lang!;

        // Skip title bars inside ::: code-group (bracket is already the tab label).
        for (let i = idx - 1; i >= 0; i--) {
          const type = tokens[i]!.type;
          if (type === "container_code-group_close") break;
          if (type === "container_code-group_open") {
            return defaultFence(tokens, idx, options, env, self);
          }
        }

        const escaped = title!.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
        return `<div class="code-title">${escaped}</div>${defaultFence(tokens, idx, options, env, self)}`;
      };
    },
  },

  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "",
      },
    ],
  ],

  themeConfig: {
    siteTitle: "llm-sdk",
    version,
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API", link: "/api/create-router" },
      {
        text: "GitHub",
        link: "https://github.com/ALPHACOD3RS/llm-sdk",
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: navGroup("book", "Guide"),
          items: [
            navItem("play", "Getting started", "/guide/getting-started"),
            navItem("sliders", "Configuration", "/guide/configuration"),
            navItem("gitBranch", "Named routes", "/guide/routes"),
            navItem("refresh", "Fallback & retry", "/guide/fallback"),
            navItem("braces", "Structured output", "/guide/extract"),
            navItem("wrench", "Tools", "/guide/tools"),
            navItem("database", "Caching & cost", "/guide/caching-cost"),
            navItem("alertTriangle", "Errors", "/guide/errors"),
            navItem("checkCircle", "Testing", "/guide/testing"),
          ],
        },
      ],
      "/api/": [
        {
          text: navGroup("terminal", "API"),
          items: [
            navItem("parens", "createRouter", "/api/create-router"),
            navItem("brackets", "Types", "/api/types"),
            navItem("alertTriangle", "Errors", "/api/errors"),
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/ALPHACOD3RS/llm-sdk" },
    ],

    search: {
      provider: "local",
    },

    outline: { level: [2, 3] },
    editLink: {
      pattern: "https://github.com/ALPHACOD3RS/llm-sdk/edit/main/docs/:path",
      text: "Edit this page",
    },
  },
});
