import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

/** Build `/llms.txt` from the docs source tree. */
export async function renderLlmsTxt(srcDir: string, siteUrl = ""): Promise<string> {
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
    "TypeScript LLM router — automatic fallbacks, named routes, cost tracking, and caching.",
    "The complete documentation, concatenated for language models.",
    "",
    pages.join("\n---\n\n"),
  ].join("\n");
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

/** Serve `/llms.txt` during `vitepress dev`. */
export function llmsTxtDevServer(srcDir: string) {
  return {
    name: "llm-sdk:llms-txt",
    apply: "serve" as const,
    configureServer(server: MiddlewareServer) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== "/llms.txt") return next();
        renderLlmsTxt(srcDir).then((body) => {
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end(body);
        }, next);
      });
    },
  };
}
