import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const SUMMARY =
  "llm-sdk (npm: llm-sdk-js) is an open-source TypeScript router for LLM calls. It runs in your " +
  "own process — your API keys, direct HTTP calls to providers, zero runtime dependencies, no " +
  "proxy service in the middle. Given a primary model and a list of fallbacks, it retries and " +
  "fails over automatically and returns which provider answered, what the call cost, and every " +
  "attempt on the way. It supports OpenAI, Anthropic, Groq, and local/self-hosted OpenAI-compatible " +
  "endpoints, plus named routes, response caching, cost tracking, structured output extraction, " +
  "and tool calling.";

/** Build the short, curated `/llms.txt` index (llmstxt.org convention). */
export async function renderLlmsIndex(srcDir: string, siteUrl: string): Promise<string> {
  const files = (await walk(srcDir))
    .filter((file) => relative(srcDir, file) !== "index.md")
    .sort(order);

  const entries = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(file, "utf8");
      const path = relative(srcDir, file).split(sep).join("/");
      const url = `${siteUrl}/${path.replace(/\.md$/, "")}`;
      const title = firstHeading(raw) ?? path;
      const description = frontmatterDescription(raw);
      return { path, url, title, description };
    }),
  );

  const guide = entries.filter((e) => e.path.startsWith("guide/"));
  const api = entries.filter((e) => e.path.startsWith("api/"));

  const section = (title: string, items: typeof entries) =>
    items.length === 0
      ? []
      : [
          `## ${title}`,
          "",
          ...items.map((e) => `- [${e.title}](${e.url})${e.description ? `: ${e.description}` : ""}`),
          "",
        ];

  return [
    "# llm-sdk",
    "",
    `> ${SUMMARY}`,
    "",
    "## Start here",
    "",
    `- [Getting started](${siteUrl}/guide/getting-started): install, first call, project layout.`,
    `- [GitHub repository](https://github.com/ALPHACOD3RS/llm-sdk): source, issues, releases.`,
    `- [npm package](https://www.npmjs.com/package/llm-sdk-js): \`npm install llm-sdk-js\`.`,
    `- [Full documentation, concatenated](${siteUrl}/llms-full.txt): every guide and API page in one file, for models that read a single document.`,
    "",
    ...section("Guide", guide),
    ...section("API reference", api),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .concat("\n");
}

/** Build `/llms-full.txt`: the complete docs source, concatenated for language models. */
export async function renderLlmsFullTxt(srcDir: string, siteUrl: string): Promise<string> {
  const files = (await walk(srcDir))
    .filter((file) => relative(srcDir, file) !== "index.md")
    .sort(order);

  const pages = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(file, "utf8");
      const path = relative(srcDir, file).split(sep).join("/");
      const url = `${siteUrl}/${path.replace(/\.md$/, "")}`;
      return `<!-- source: ${url} -->\n\n${toPlainMarkdown(raw)}\n`;
    }),
  );

  return [
    "# llm-sdk",
    "",
    SUMMARY,
    "",
    "The complete documentation, concatenated for language models. See" +
      ` ${siteUrl}/llms.txt for a shorter, curated index.`,
    "",
    pages.join("\n---\n\n"),
  ].join("\n");
}

function firstHeading(raw: string): string | undefined {
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  return /^#\s+(.+)$/m.exec(body)?.[1]?.trim();
}

function frontmatterDescription(raw: string): string | undefined {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(raw)?.[1];
  if (!fm) return undefined;
  const match = /^description:\s*([\s\S]*?)(?:\n\w+:|$)/m.exec(fm);
  return match?.[1]
    ?.replace(/\r?\n\s*/g, " ")
    .trim()
    .replace(/^["']|["']$/g, "");
}

/** Prefer guide pages, then getting-started. */
function order(a: string, b: string): number {
  const rank = (p: string) =>
    (p.includes(`${sep}guide${sep}`) ? 0 : 1) + (p.includes("getting-started") ? -0.5 : 0);
  return rank(a) - rank(b) || a.localeCompare(b);
}

/** Strip frontmatter / Vue / VitePress containers for plain text. */
function toPlainMarkdown(raw: string): string {
  return raw
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
    .replace(/<script[\s\S]*?<\/script>\n?/g, "")
    .replace(/^::: *(?:code-group|details).*$/gm, "")
    .replace(/^::: *\w+ *(.*)$/gm, (_, title: string) => (title ? `**${title}**` : ""))
    .replace(/^::: *$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = await Promise.all(
    entries.map(async (entry) => {
      if (entry.name.startsWith(".") || entry.name === "public") return [];
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return walk(path);
      return entry.name.endsWith(".md") ? [path] : [];
    }),
  );
  return found.flat();
}

/** Minimal Vite middleware shape (avoids conflicting Vite type copies). */
interface MiddlewareServer {
  middlewares: {
    use(
      handler: (
        req: { url?: string | undefined },
        res: { setHeader(name: string, value: string): void; end(body: string): void },
        next: () => void,
      ) => void,
    ): void;
  };
}

/** Serve `/llms.txt` and `/llms-full.txt` during `vitepress dev`. */
export function llmsTxtDevServer(srcDir: string, siteUrl: string) {
  return {
    name: "llm-sdk:llms-txt",
    apply: "serve" as const,
    configureServer(server: MiddlewareServer) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/llms.txt") {
          renderLlmsIndex(srcDir, siteUrl).then((body) => {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(body);
          }, next);
        } else if (req.url === "/llms-full.txt") {
          renderLlmsFullTxt(srcDir, siteUrl).then((body) => {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(body);
          }, next);
        } else {
          next();
        }
      });
    },
  };
}
