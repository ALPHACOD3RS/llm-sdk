import type { Metadata, PageProps } from "@farm.js/core";
import { FARM_VERSION } from "@farm.js/core/version";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  BookOpen,
  BookOpenText,
  Bot,
  Braces,
  Check,
  CloudCog,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  FileOutput,
  FileText,
  FolderTree,
  GitFork,
  Layers3,
  Lock,
  Menu,
  Network,
  Plug,
  RefreshCw,
  Rocket,
  Route,
  Terminal,
  TriangleAlert,
  Workflow,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import auth0IconUrl from "simple-icons/icons/auth0.svg?url";
import betterAuthIconUrl from "simple-icons/icons/betterauth.svg?url";
import clerkIconUrl from "simple-icons/icons/clerk.svg?url";
import cloudflareIconUrl from "simple-icons/icons/cloudflare.svg?url";
import denoIconUrl from "simple-icons/icons/deno.svg?url";
import dockerIconUrl from "simple-icons/icons/docker.svg?url";
import firebaseIconUrl from "simple-icons/icons/firebase.svg?url";
import githubIconUrl from "simple-icons/icons/github.svg?url";
import netlifyIconUrl from "simple-icons/icons/netlify.svg?url";
import nodeIconUrl from "simple-icons/icons/nodedotjs.svg?url";
import prismaIconUrl from "simple-icons/icons/prisma.svg?url";
import reactIconUrl from "simple-icons/icons/react.svg?url";
import renderIconUrl from "simple-icons/icons/render.svg?url";
import resendIconUrl from "simple-icons/icons/resend.svg?url";
import shadcnIconUrl from "simple-icons/icons/shadcnui.svg?url";
import stripeIconUrl from "simple-icons/icons/stripe.svg?url";
import supabaseIconUrl from "simple-icons/icons/supabase.svg?url";
import vercelIconUrl from "simple-icons/icons/vercel.svg?url";
import viteIconUrl from "simple-icons/icons/vite.svg?url";
import authJsIconUrl from "../assets/brands/authjs.svg?url";
import autumnIconUrl from "../assets/brands/autumn.svg?url";
import eveIconUrl from "../assets/brands/eve.svg?url";
import inngestIconUrl from "../assets/brands/inngest.svg?url";
import polarIconUrl from "../assets/brands/polar.svg?url";
import triggerIconUrl from "../assets/brands/trigger.svg?url";
import unkeyIconUrl from "../assets/brands/unkey.svg?url";
import workosIconUrl from "../assets/brands/workos.svg?url";
import farmingLabsLogoUrl from "../assets/farming-labs-logo-dark.svg?url";
import nitroIconUrl from "../assets/nitro.svg?url";
import { BenchmarkSection } from "../components/home/benchmark-section";
import { HeroTitleFrame } from "../components/home/hero-title-frame";
import { HighlightedCode, HighlightedCodeTabs } from "../components/home/highlighted-code";
import type { HighlightedCodeTab } from "../components/home/highlighted-code";
import { InstallCommand } from "../components/home/install-command";
import { FileTree } from "../components/ui/file-tree";
import type { FileTreeNode } from "../components/ui/file-tree";
import { FlickeringGrid } from "../components/ui/flickering-grid";
import { farmBenchmark, formatBenchmarkDuration } from "../lib/framework-benchmark";

const homepageTitle = "Farm.js - Framework for modern integrated apps";
const homepageDescription =
  "Farm.js is the framework for modern integrated apps, unifying routing, typed APIs, middleware, integrations, docs, and deployment.";

export const metadata = {
  metadataBase: "https://farmjs.dev",
  title: homepageTitle,
  description: homepageDescription,
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    url: "https://farmjs.dev/",
    siteName: "Farm.js",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homepageTitle,
    description: homepageDescription,
    images: ["/opengraph-image"],
  },
} satisfies Metadata;

const navItems = [
  { index: "01", label: "Guide", href: "/docs/getting-started", icon: BookOpen },
  { index: "02", label: "Migrations", href: "/docs/migrations", icon: GitFork },
  { index: "03", label: "Integrations", href: "/docs/integrations", icon: Blocks },
  { index: "04", label: "Resources", href: "/docs", icon: FileText },
] as const;

type ProductStackItem = {
  label: string;
  href: string;
  brand?: string;
  icon?: LucideIcon;
  wordmark?: boolean;
};

function withFarmReferral(href: string) {
  const url = new URL(href);
  url.searchParams.set("utm_source", "farmjs.dev");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "product_stack");
  return url.toString();
}

const integrationDirectoryItems = [
  {
    row: 0,
    col: 0,
    label: "Farm Auth",
    href: "/docs/auth",
    icon: Lock,
  },
  {
    row: 0,
    col: 1,
    label: "Better Auth",
    href: "/docs/integrations/auth/better-auth",
    brand: betterAuthIconUrl,
  },
  {
    row: 0,
    col: 3,
    label: "Auth.js",
    href: "/docs/integrations/auth/authjs",
    brand: authJsIconUrl,
  },
  {
    row: 1,
    col: 0,
    label: "Clerk",
    href: "/docs/integrations/auth/clerk",
    brand: clerkIconUrl,
  },
  {
    row: 1,
    col: 2,
    label: "Auth0",
    href: "/docs/integrations/auth/auth0",
    brand: auth0IconUrl,
  },
  {
    row: 1,
    col: 4,
    label: "WorkOS",
    href: "/docs/integrations/auth/workos",
    brand: workosIconUrl,
  },
  {
    row: 2,
    col: 1,
    label: "Supabase",
    href: "/docs/integrations/auth/supabase",
    brand: supabaseIconUrl,
  },
  {
    row: 2,
    col: 3,
    label: "Autumn",
    href: "/docs/integrations/autumn",
    brand: autumnIconUrl,
  },
  {
    row: 3,
    col: 0,
    label: "Polar",
    href: "/docs/integrations/polar",
    brand: polarIconUrl,
  },
  {
    row: 3,
    col: 2,
    label: "Stripe",
    href: "/docs/integrations/stripe",
    brand: stripeIconUrl,
  },
  {
    row: 3,
    col: 4,
    label: "Resend",
    href: "/docs/integrations/email",
    brand: resendIconUrl,
  },
  {
    row: 4,
    col: 1,
    label: "Prisma",
    href: "/docs/integrations/orm-storage",
    brand: prismaIconUrl,
  },
  {
    row: 4,
    col: 3,
    label: "Inngest",
    href: "/docs/integrations/inngest",
    brand: inngestIconUrl,
  },
  {
    row: 5,
    col: 0,
    label: "Trigger.dev",
    href: "/docs/integrations/trigger",
    brand: triggerIconUrl,
  },
  {
    row: 5,
    col: 2,
    label: "shadcn/ui",
    href: "/docs/integrations/ui-registry",
    brand: shadcnIconUrl,
  },
  {
    row: 5,
    col: 4,
    label: "Unkey",
    href: "/docs/integrations/unkey",
    brand: unkeyIconUrl,
  },
] as const;

const ecosystemItems = [
  { label: "React 19", href: withFarmReferral("https://react.dev/"), brand: reactIconUrl },
  { label: "Stripe", href: withFarmReferral("https://stripe.com/"), brand: stripeIconUrl },
  {
    label: "Cloudflare",
    href: withFarmReferral("https://developers.cloudflare.com/agents/"),
    brand: cloudflareIconUrl,
  },
  {
    label: "Better Auth",
    href: withFarmReferral("https://better-auth.com/"),
    brand: betterAuthIconUrl,
  },
  { label: "Vercel", href: withFarmReferral("https://vercel.com/"), brand: vercelIconUrl },
  { label: "Inngest", href: withFarmReferral("https://www.inngest.com/"), brand: inngestIconUrl },
  { label: "Vite", href: withFarmReferral("https://vite.dev/"), brand: viteIconUrl },
  { label: "Supabase", href: withFarmReferral("https://supabase.com/"), brand: supabaseIconUrl },
  {
    label: "Trigger.dev",
    href: withFarmReferral("https://trigger.dev/"),
    brand: triggerIconUrl,
  },
  { label: "Docker", href: withFarmReferral("https://www.docker.com/"), brand: dockerIconUrl },
  { label: "Clerk", href: withFarmReferral("https://clerk.com/"), brand: clerkIconUrl },
  { label: "Resend", href: withFarmReferral("https://resend.com/"), brand: resendIconUrl },
  { label: "Nitro", href: withFarmReferral("https://nitro.build/"), brand: nitroIconUrl },
  { label: "Polar", href: withFarmReferral("https://polar.sh/"), brand: polarIconUrl },
  { label: "Netlify", href: withFarmReferral("https://www.netlify.com/"), brand: netlifyIconUrl },
  { label: "Auth.js", href: withFarmReferral("https://authjs.dev/"), brand: authJsIconUrl },
  { label: "Autumn", href: withFarmReferral("https://useautumn.com/"), brand: autumnIconUrl },
  {
    label: "Cloudflare",
    href: withFarmReferral("https://www.cloudflare.com/"),
    brand: cloudflareIconUrl,
  },
  { label: "Prisma", href: withFarmReferral("https://www.prisma.io/"), brand: prismaIconUrl },
  { label: "Auth0", href: withFarmReferral("https://auth0.com/"), brand: auth0IconUrl },
  {
    label: "shadcn/ui",
    href: withFarmReferral("https://ui.shadcn.com/"),
    brand: shadcnIconUrl,
  },
  { label: "WorkOS", href: withFarmReferral("https://workos.com/"), brand: workosIconUrl },
  { label: "Unkey", href: withFarmReferral("https://www.unkey.com/"), brand: unkeyIconUrl },
  {
    label: "eve",
    href: withFarmReferral("https://www.eve.dev/"),
    brand: eveIconUrl,
    wordmark: true,
  },
] satisfies readonly ProductStackItem[];

type DeploymentTile = {
  row: number;
  col: number;
  label?: string;
  brand?: string;
};

const deploymentTiles: readonly DeploymentTile[] = [
  { row: 0, col: 1 },
  { row: 0, col: 3, label: "Vercel", brand: vercelIconUrl },
  { row: 1, col: 0 },
  { row: 1, col: 2, label: "Cloudflare", brand: cloudflareIconUrl },
  { row: 1, col: 4, label: "Firebase", brand: firebaseIconUrl },
  { row: 2, col: 1, label: "Netlify", brand: netlifyIconUrl },
  { row: 2, col: 3, label: "Docker", brand: dockerIconUrl },
  { row: 3, col: 0 },
  { row: 3, col: 2, label: "Nitro presets", brand: nitroIconUrl },
  { row: 3, col: 4, label: "Render", brand: renderIconUrl },
  { row: 4, col: 1, label: "Self-host", brand: nodeIconUrl },
  { row: 4, col: 3, label: "Deno", brand: denoIconUrl },
];

const footerGroups = [
  {
    title: "Framework",
    icon: BookOpen,
    brand: null,
    action: ["Read guide", "/docs/getting-started"],
    links: [
      ["Getting started", "/docs/getting-started"],
      ["Routing", "/docs/routing"],
      ["Middleware", "/docs/middleware"],
    ],
  },
  {
    title: "Product",
    icon: Layers3,
    brand: null,
    action: ["Integrations", "/docs/integrations"],
    links: [
      ["Integrations", "/docs/integrations"],
      ["API client", "/docs/api-client"],
      ["Deployment", "/docs/deployment"],
    ],
  },
  {
    title: "Open source",
    icon: GitFork,
    brand: githubIconUrl,
    action: ["View source", "https://github.com/farming-labs/farm.js"],
    links: [["GitHub", "https://github.com/farming-labs/farm.js"]],
  },
] as const;

const typedApiCode = `const { data, error } = await api.users.get({
  query: { limit: "5" },
});

if (error) throw error;

data?.users[0]?.name;
//   ^? string | undefined`;

const integrationCodeTabs = [
  {
    id: "integrations",
    label: "integrations.ts",
    language: "ts",
    highlightLines: [1, 5, 7],
    code: `import Stripe from "stripe";
import { stripe } from "@farm.js/integrations/stripe";
import { unkey } from "@farm.js/integrations/unkey";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
export const integrations = {
    billing: stripe({ instance: stripeClient }),
    keys: unkey({
        rootKey: process.env.UNKEY_ROOT_KEY,
        apiId: process.env.UNKEY_API_ID,
    }),
};`,
  },
  {
    id: "apis",
    label: "Typed integration calls",
    language: "ts",
    highlightLines: [3, 4, 7, 8],
    code: `import { api, apiClient } from "@/lib/api";

const key = await api.keys.create.post({
    body: { name: "Production key" },
});

const checkout = await apiClient.billing.checkout.post({
    body: { productId: "pro" },
});`,
  },
] as const satisfies readonly [HighlightedCodeTab, ...HighlightedCodeTab[]];

const docsConfigCode = `import { defineConfig } from "@farm.js/core";
export default defineConfig({
    docs: {
        enabled: true,
        entry: "/docs",
        search: true,
        mcp: true,
    },
});`;

const typedApiHighlightLines = [1, 7, 8] as const;
const docsHighlightLines = [3, 4] as const;
const rendererOptions = ["preact()", "solid()", "vue()", "svelte()"] as const;

const layersConfigTabs = [
  {
    id: "share",
    label: "Share / layer/farm.config.ts",
    language: "ts",
    code: `import { defineConfig } from "@farm.js/core";
export default defineConfig({
    routeRules: {
        "/products/**": { swr: 300 },
    },
});`,
  },
  {
    id: "consume",
    label: "Consume / app/farm.config.ts",
    language: "ts",
    highlightLines: [5],
    code: `import { defineConfig } from "@farm.js/core";
export default defineConfig({
    extends: [
        "@company/farm-base",
        "./layers/commerce",
    ],
});`,
  },
] as const satisfies readonly [HighlightedCodeTab, ...HighlightedCodeTab[]];

const storageCodeTabs = [
  {
    id: "configure",
    label: "Configure / farm.config.ts",
    language: "ts",
    highlightLines: [4, 5],
    code: `export default defineConfig({
    storage: {
        mounts: {
            app: sqliteStorage({ path: "./data.sqlite" }),
            cache: redisStorage({ url: process.env.REDIS_URL! }),
        },
    },
});`,
  },
  {
    id: "use",
    label: "Use / preferences.ts",
    language: "ts",
    highlightLines: [1, 3, 7],
    code: `const app = getStorage("app");

await app.setItem("settings:1", {
    theme: "dark",
});

const settings = await app.getItem<Settings>("settings:1");`,
  },
] as const satisfies readonly [HighlightedCodeTab, ...HighlightedCodeTab[]];

const createRouteHelper = ["create", "Route"].join("");

const routeCodeTabs = [
  {
    id: "route",
    label: "Route / src/farm.route.ts",
    language: "ts",
    highlightLines: [4, 5, 6, 8, 9],
    code: `export const ProductRoute = ${createRouteHelper}("/products/[id]", {
    params: ProductParams,
    data: {
        before: () => auth.user({ required: true }),
        main: ({ params, before }) => getProduct(params.id, before.id),
        after: ({ data }) => recordView(data.id),
    },
    pending: ProductSkeleton,
    error: ProductError,
    component: ProductPage,
});`,
  },
  {
    id: "component",
    label: "Use / product-page.tsx",
    language: "tsx",
    highlightLines: [2, 6, 7],
    code: `export function ProductPage({
    data,
}: ProductPageProps) {
    return (
        <main>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
        </main>
    );
}`,
  },
] as const satisfies readonly [HighlightedCodeTab, ...HighlightedCodeTab[]];

const agentRuntimeCodeTabs = [
  {
    id: "eve",
    label: "Eve / farm.config.ts",
    language: "ts",
    highlightLines: [5, 8],
    code: `import { eve } from "@farm.js/eve";

export default defineConfig({
    integrations: {
        agent: eve(),
    },
    deploy: {
        target: "vercel",
    },
});`,
  },
  {
    id: "cloudflare",
    label: "Cloudflare / farm.config.ts",
    language: "ts",
    highlightLines: [5, 8, 9],
    code: `import { cfAgent } from "@farm.js/cf-agent";

export default defineConfig({
    integrations: {
        agent: cfAgent(),
    },
    deploy: {
        target: "cloudflare",
        preset: "cloudflare-module",
    },
});`,
  },
] as const satisfies readonly [HighlightedCodeTab, ...HighlightedCodeTab[]];

const agentClientCodeTabs = [
  {
    id: "eve",
    label: "Eve / chat.ts",
    language: "ts",
    highlightLines: [2, 5, 7, 8],
    code: `"use client";
import { useEveAgent } from "eve/react";

export function useChat() {
    const agent = useEveAgent();
    return {
        messages: agent.data.messages,
        send: agent.send,
    };
}`,
  },
  {
    id: "cloudflare",
    label: "Cloudflare / counter.ts",
    language: "ts",
    highlightLines: [2, 5, 6, 7],
    code: `"use client";
import { useAgent } from "agents/react";

export function useCounter() {
    return useAgent<
        CounterAgent,
        CounterState
    >({
        agent: "CounterAgent",
        name: "shared",
    });
}`,
  },
] as const satisfies readonly [HighlightedCodeTab, ...HighlightedCodeTab[]];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function BrandIcon({ src, className }: { src: string; className?: string }) {
  return <img alt="" aria-hidden className={cx("brightness-0 invert", className)} src={src} />;
}

function GithubIcon({ className }: { className?: string }) {
  return <BrandIcon className={className} src={githubIconUrl} />;
}

function IndexedLabel({
  index,
  icon: Icon,
  label,
}: {
  index: string;
  icon?: LucideIcon;
  label: string;
}) {
  return (
    <span className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] font-normal uppercase tracking-normal text-current">
      <span className="text-white/26">{index}</span>
      <span aria-hidden className="text-white/18">
        /
      </span>
      {Icon ? <Icon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.5} /> : null}
      <span className="truncate">{label}</span>
    </span>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <a
      aria-label="Farm.js home"
      className={cx(
        "shrink-0 font-mono font-normal uppercase tracking-normal text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
        className,
      )}
      href="/"
    >
      FARM<span className="text-white/52">.JS</span>
    </a>
  );
}

function FarmingLabsBrand() {
  return (
    <a
      aria-label="Farming Labs brand assets"
      className="flex shrink-0 items-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      href="https://www.farming-labs.dev/brand"
      title="Farming Labs brand"
    >
      <img alt="" aria-hidden className="h-[19px] w-auto" src={farmingLabsLogoUrl} />
    </a>
  );
}

function BrandLockup() {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <FarmingLabsBrand />
      <Wordmark className="text-[11px]" />
    </div>
  );
}

function ButtonLink({
  href,
  children,
  icon,
  size = "default",
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  size?: "default" | "compact";
  variant?: "primary" | "secondary";
}) {
  const isExternal = href.startsWith("http");

  return (
    <a
      className={cx(
        "inline-flex min-w-0 items-center justify-center border font-mono font-normal uppercase tracking-normal transition-[background-color,border-color,color,transform] duration-150 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        size === "default" && "h-11 gap-2 px-5 text-[11px]",
        size === "compact" && "h-9 gap-1.5 px-4 text-[10px]",
        variant === "primary" && "border-white bg-white text-black hover:bg-white/88",
        variant === "secondary" &&
          "border-white/18 bg-black text-white hover:border-white/42 hover:bg-white/[0.06]",
      )}
      href={href}
    >
      {icon ? (
        <span
          aria-hidden
          className={cx(
            "grid shrink-0 place-items-center",
            size === "compact" ? "size-3.5" : "size-4",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
      {isExternal ? (
        <ExternalLink
          aria-hidden
          className={size === "compact" ? "size-3" : "size-3.5"}
          strokeWidth={1.5}
        />
      ) : (
        <ArrowRight
          aria-hidden
          className={size === "compact" ? "size-3" : "size-3.5"}
          strokeWidth={1.5}
        />
      )}
    </a>
  );
}

function AnnouncementBar() {
  return (
    <a
      aria-label={`Farm.js ${FARM_VERSION} is open source and in beta. View on GitHub.`}
      className="farm-announcement flex h-5 items-center justify-center gap-2 border-b border-white/12 px-4 font-mono text-[10px] font-normal uppercase tracking-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
      href="https://github.com/farming-labs/farm.js"
    >
      <GithubIcon className="size-3 opacity-55" />
      <span className="text-white/52">Open source</span>
      <span aria-hidden className="text-white/24">
        /
      </span>
      <span className="text-white/76">Farm.js {FARM_VERSION}</span>
    </a>
  );
}

function Header() {
  return (
    <header className="farm-full-rule sticky top-0 z-50 bg-black/94 backdrop-blur-xl">
      <div className="flex h-11 w-full items-stretch">
        <div className="flex shrink-0 items-center px-4 sm:px-7">
          <BrandLockup />
        </div>

        <nav
          aria-label="Primary navigation"
          className="hidden min-w-0 flex-1 items-stretch border-l border-white/12 lg:flex"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              className="flex h-full min-w-0 flex-1 items-center border-r border-white/12 px-3 font-mono uppercase tracking-normal text-white/48 transition-colors duration-150 hover:bg-white/[0.035] hover:text-white focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white xl:px-5"
              href={item.href}
            >
              <IndexedLabel index={item.index} icon={item.icon} label={item.label} />
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 items-stretch lg:flex">
          <a
            aria-label="Open Farm.js on GitHub"
            className="grid size-11 place-items-center border-l border-white/12 text-white/52 transition-colors duration-150 hover:bg-white/[0.035] hover:text-white focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
            href="https://github.com/farming-labs/farm.js"
            title="GitHub"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            className="inline-flex h-11 items-center gap-1.5 border-l border-white/12 bg-white px-5 font-mono text-[10px] font-normal uppercase tracking-normal text-black transition-colors duration-150 hover:bg-white/88 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
            href="/docs"
          >
            <BookOpenText aria-hidden className="size-3.5" strokeWidth={1.6} />
            Docs
          </a>
        </div>

        <details className="group relative ml-auto border-l border-white/12 lg:hidden">
          <summary className="grid size-11 cursor-pointer list-none place-items-center text-white transition-colors hover:bg-white/[0.04] [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open navigation</span>
            <Menu aria-hidden className="size-4 group-open:hidden" strokeWidth={1.5} />
            <X aria-hidden className="hidden size-4 group-open:block" strokeWidth={1.5} />
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute -right-px top-11 w-screen overflow-hidden border border-white/14 bg-black shadow-2xl shadow-black/60"
          >
            {[...navItems, { index: "05", label: "Docs", href: "/docs", icon: BookOpenText }].map(
              (item) => (
                <a
                  key={item.label}
                  className="flex h-12 items-center border-b border-white/10 px-4 font-mono uppercase tracking-normal text-white/58 last:border-b-0 hover:bg-white/[0.04] hover:text-white"
                  href={item.href}
                >
                  <IndexedLabel index={item.index} icon={item.icon} label={item.label} />
                </a>
              ),
            )}
          </nav>
        </details>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="farm-full-rule farm-hero-rule relative w-full overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-px -top-px z-30 size-[9px] border-l border-t border-white/28"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-px -right-px z-30 size-[9px] border-b border-r border-white/28"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[58rem] flex-col items-center px-6 pb-16 pt-11 text-center sm:px-10 sm:pb-20 sm:pt-12 lg:px-12">
        <div className="text-white/42">
          <IndexedLabel index="00" label="Build / Ship / Scale" />
        </div>
        <HeroTitleFrame>
          <h1 className="max-w-full text-[1.125rem] font-medium leading-[1.02] tracking-normal text-white min-[360px]:text-[1.3125rem] min-[380px]:text-[1.4375rem] min-[400px]:text-[1.5rem] min-[420px]:text-[1.625rem] sm:text-[2.25rem] md:text-[2.625rem] lg:text-[3.25rem]">
            <span className="block">a framework for</span>
            <span className="block whitespace-nowrap">product-integrated apps</span>
          </h1>
        </HeroTitleFrame>
        <p className="mt-5 max-w-[38rem] text-balance text-sm leading-6 text-white/56 sm:text-[15px] sm:leading-6">
          Bring the stack you already use. Farm.js connects your app router, typed APIs, middleware,
          integrations, docs, and deployment so they work together as one product.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink
            href="/docs/getting-started"
            icon={<BookOpen aria-hidden className="size-3.5" strokeWidth={1.5} />}
            size="compact"
          >
            Get Started
          </ButtonLink>
        </div>
        <div className="mt-6 w-[calc(100%-3rem)] max-w-[34rem] text-left">
          <InstallCommand />
        </div>
      </div>

      <div
        aria-hidden
        className="farm-hero-flicker pointer-events-none absolute inset-x-0 -bottom-px h-80 sm:h-96"
      >
        <FlickeringGrid
          className="absolute inset-0"
          color="rgb(255, 255, 255)"
          flickerChance={0.9}
          gridGap={7}
          maxOpacity={0.36}
          squareSize={2}
        />
      </div>
    </section>
  );
}

function ProductStackTile({
  item,
  itemIndex,
  duplicate,
}: {
  item: ProductStackItem;
  itemIndex: number;
  duplicate: boolean;
}) {
  const Icon = item.icon;
  const className = cx(
    "flex h-16 w-40 shrink-0 items-center justify-center gap-3 border-r border-white/12 bg-black px-4 font-mono text-[10px] font-normal uppercase tracking-normal text-white/48 transition-colors duration-150 hover:bg-white/[0.07] hover:text-white/82 focus-visible:z-10 focus-visible:bg-white/[0.07] focus-visible:text-white focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-white/36 sm:w-44 sm:text-[11px]",
    itemIndex % 2 === 0 && "bg-white/[0.045]",
  );

  return (
    <a
      aria-label={`${item.label} website (opens in a new tab)`}
      aria-hidden={duplicate ? true : undefined}
      className={className}
      href={item.href}
      rel="noreferrer"
      tabIndex={duplicate ? -1 : undefined}
      target="_blank"
    >
      {item.brand ? (
        <BrandIcon
          className={cx("shrink-0 opacity-72", item.wordmark ? "h-[11px] w-[35px]" : "size-[18px]")}
          src={item.brand}
        />
      ) : Icon ? (
        <Icon aria-hidden className="size-[18px] shrink-0 opacity-72" strokeWidth={1.5} />
      ) : null}
      {item.wordmark ? null : <span className="whitespace-nowrap">{item.label}</span>}
    </a>
  );
}

function EcosystemStrip() {
  return (
    <section className="farm-full-rule w-full">
      <div className="grid h-16 grid-cols-[11rem_minmax(0,1fr)] sm:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="flex min-w-0 items-center border-r border-white/12 px-4 text-white/36 sm:px-8">
          <IndexedLabel icon={Layers3} index="01" label="Product stack" />
        </div>
        <div
          aria-label="Supported product integrations and deployment targets. Hover or focus an item to pause animation."
          className="farm-logo-viewport min-w-0 overflow-hidden focus-within:outline focus-within:outline-1 focus-within:-outline-offset-1 focus-within:outline-white/28"
          role="region"
        >
          <div
            className="farm-logo-rail flex h-full w-max"
            style={{ "--farm-logo-duration": `${ecosystemItems.length * 4}s` } as CSSProperties}
          >
            {([0, 1] as const).map((copyIndex) => (
              <div
                key={copyIndex}
                aria-hidden={copyIndex === 1 ? true : undefined}
                className="farm-logo-rail-copy flex h-full shrink-0"
              >
                {ecosystemItems.map((item, itemIndex) => (
                  <ProductStackTile
                    key={`${copyIndex}-${itemIndex}-${item.label}`}
                    duplicate={copyIndex === 1}
                    item={item}
                    itemIndex={itemIndex}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TerminalRequestLine({
  type,
  method,
  path,
  duration,
}: {
  type: "PAGE" | "API";
  method: "GET" | "POST";
  path: string;
  duration: number;
}) {
  const isApi = type === "API";

  return (
    <span className="block whitespace-nowrap text-white/54">
      <span className="text-white/28">[</span>
      <span className="text-white/86">FARM</span>
      <span className="text-white/28">]</span> <span className="text-white/28">[</span>
      <span className={isApi ? "text-white/86" : "text-white/62"}>{type}</span>
      <span className="text-white/28">]</span> <span className="text-white/28">[</span>
      <span className="text-white/72">{method}</span>
      <span className="text-white/28">]</span>{" "}
      <span className={isApi ? "text-white/72" : "text-white/66"}>{path}</span>{" "}
      <span className="text-white/24">-</span> <span className="text-white/84">200</span>{" "}
      <span className={isApi ? "text-white/38" : "text-white/34"}>({duration}ms)</span>
    </span>
  );
}

function TerminalVisual() {
  return (
    <div className="farm-feature-spotlight relative flex h-[340px] items-end justify-end overflow-hidden pl-6 sm:pl-10">
      <figure className="relative z-10 -mb-px -mr-px flex h-[290px] w-full max-w-full shrink-0 flex-col overflow-hidden border border-white/10 bg-black shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <figcaption className="flex h-10 items-center justify-between border-b border-white/8 px-4">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-white/22" />
            <span className="size-2 rounded-full bg-white/14" />
            <span className="size-2 rounded-full bg-white/10" />
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-normal text-white/28">
            <Terminal aria-hidden className="size-3" strokeWidth={1.5} /> pnpm dev
          </span>
        </figcaption>
        <pre className="min-h-0 flex-1 overflow-x-auto p-5 font-mono text-[10px] leading-5 tracking-normal sm:text-[11px] sm:leading-6">
          <code className="block min-w-0 whitespace-pre-wrap break-words">
            <span className="block min-w-max">
              <span className="block h-5 whitespace-nowrap text-white/48 sm:h-6">
                <span>$ </span>
                <span className="farm-terminal-command-text inline-block align-bottom">
                  pnpm dev
                </span>
                <span aria-hidden className="farm-terminal-command-cursor inline-block" />
              </span>
              <span className="farm-terminal-output mt-1.5 block space-y-1.5">
                <span className="block whitespace-nowrap">
                  <span className="font-semibold text-green-400">Farm.js</span>{" "}
                  <span className="text-white/34">v{FARM_VERSION}</span>{" "}
                  <span className="text-white/34">ready in 23ms</span>
                </span>
                <span className="block whitespace-nowrap text-white/58">
                  <span className="inline-block w-[4.5rem] text-white/82">➜ Local:</span>
                  http://localhost:3000/
                </span>
                <span className="!mt-0.5 block whitespace-nowrap text-white/48">
                  <span className="inline-block w-[4.5rem] text-white/68">➜ Network:</span>
                  http://192.168.1.24:3000/
                </span>
                <TerminalRequestLine duration={8} method="GET" path="/contact" type="PAGE" />
                <TerminalRequestLine duration={5} method="POST" path="/api/waitlist" type="API" />
                <TerminalRequestLine duration={11} method="GET" path="/docs" type="PAGE" />
              </span>
            </span>
          </code>
        </pre>
      </figure>
    </div>
  );
}

function TypedApiVisual() {
  return (
    <div className="farm-feature-spotlight relative flex h-[340px] min-w-0 items-end justify-end overflow-hidden pl-6 sm:pl-10">
      <HighlightedCode
        className="relative z-10 -mb-px -mr-px flex h-[290px] w-full max-w-full shrink-0 flex-col"
        code={typedApiCode}
        highlightLines={typedApiHighlightLines}
        label="/api/users"
        language="tsx"
        prefix="GET"
      />
    </div>
  );
}

function IntegrationVisual() {
  return (
    <div className="farm-feature-spotlight relative flex h-[340px] min-w-0 items-end justify-end overflow-hidden pl-6 sm:pl-10">
      <HighlightedCodeTabs
        className="relative z-10 -mb-px -mr-px flex h-[290px] w-full max-w-full shrink-0 flex-col"
        compact
        id="product-integration-examples"
        tabs={integrationCodeTabs}
        tabsLabel="Integration files"
      />
    </div>
  );
}

function BuildVisual() {
  return (
    <div className="farm-feature-spotlight relative flex h-[340px] items-end justify-end overflow-hidden pl-6 sm:pl-10">
      <figure className="relative z-10 -mb-px -mr-px flex h-[290px] w-full max-w-full shrink-0 flex-col overflow-hidden border border-white/10 bg-black shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <figcaption className="flex h-10 items-center justify-between border-b border-white/8 px-4 font-mono text-[9px] tracking-normal text-white/34">
          <span className="flex items-center gap-1.5">
            <Terminal aria-hidden className="size-3" strokeWidth={1.5} /> production build
          </span>
          <span>bash</span>
        </figcaption>
        <pre className="min-h-0 flex-1 overflow-x-auto p-5 font-mono text-[10px] leading-5 tracking-normal text-white/58 sm:text-[11px] sm:leading-6">
          <code className="block min-w-0 whitespace-pre-wrap break-words">
            <span className="block h-5 whitespace-nowrap text-white sm:h-6">
              <span>$ </span>
              <span className="farm-build-command-text inline-block align-bottom">
                farm build --preset node-server
              </span>
              <span aria-hidden className="farm-build-command-cursor inline-block" />
            </span>
            <span className="farm-build-output mt-2 block">
              <span className="block whitespace-nowrap">
                <span className="text-white">[info]</span> 🚜 Building Farm.js application with
                preset: node-server...
              </span>
              <span className="block whitespace-nowrap">
                <span className="text-white">[info]</span> 🔍 Discovering routes and API
                endpoints...
              </span>
              <span className="block whitespace-nowrap">
                <span className="text-white">[info]</span> 📦 Building client and SSR bundles in
                parallel...
              </span>
              <span className="block whitespace-nowrap">
                <span className="text-white">[bench]</span> Fixture build wall time{" "}
                <span className="font-semibold text-white">
                  {formatBenchmarkDuration(farmBenchmark.metrics.buildMs.median)}
                </span>{" "}
                <span className="text-white/34">median</span>
              </span>
              <span className="block whitespace-nowrap text-white/78">
                <span className="text-white">[info]</span> 📁 Output directory: .farm/.output
              </span>
            </span>
          </code>
        </pre>
      </figure>
    </div>
  );
}

function RendererVisual() {
  return (
    <div className="farm-feature-spotlight relative flex h-[340px] min-w-0 items-end justify-end overflow-hidden pl-6 sm:pl-10">
      <figure className="farm-renderer-code-card relative z-10 -mb-px -mr-px flex h-[290px] w-full max-w-full shrink-0 flex-col overflow-hidden border border-white/10 bg-black shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <figcaption className="flex h-10 min-w-0 shrink-0 items-center justify-between gap-4 border-b border-white/8 px-4 font-mono text-[9px] tracking-normal text-white/38">
          <span className="flex min-w-0 items-center gap-2">
            <Code2 aria-hidden className="size-3 shrink-0" strokeWidth={1.5} />
            <span className="truncate">farm.config.ts</span>
          </span>
          <span className="shrink-0 uppercase text-white/24">ts</span>
        </figcaption>

        <pre
          aria-label="farm.config.ts with the renderer set to Preact, Solid, Vue, or Svelte. React remains the default."
          className="min-h-0 max-w-full flex-1 overflow-x-auto py-5 font-mono text-[10.5px] leading-6 tracking-normal sm:text-[11px]"
          tabIndex={0}
        >
          <code aria-hidden className="farm-highlighted-code block min-w-full">
            <span className="sh__line">
              <span className="text-white">import</span>
              <span className="text-white/64"> {`{ defineConfig }`} </span>
              <span className="text-white">from</span>
              <span className="text-white/94"> &quot;@farm.js/core&quot;</span>
              <span className="text-white/42">;</span>
            </span>
            <span className="sh__line">&nbsp;</span>
            <span className="sh__line">
              <span className="text-white">export default</span>
              <span className="text-white/64"> defineConfig</span>
              <span className="text-white/42">({`{`}</span>
            </span>
            <span className="sh__line sh__line--highlighted">
              {"  "}
              <span className="text-white/78">renderer</span>
              <span className="text-white/42">: </span>
              <span className="farm-renderer-value" data-renderer-count={rendererOptions.length}>
                <span className="farm-renderer-value-track">
                  {[...rendererOptions, rendererOptions[0]].map((renderer, index) => (
                    <span
                      key={`${renderer}-${index}`}
                      className="farm-renderer-value-item text-white/94"
                    >
                      {renderer}
                      <span className="text-white/42">,</span>
                    </span>
                  ))}
                </span>
              </span>
            </span>
            <span className="sh__line">
              {"  "}
              <span className="text-white/78">server</span>
              <span className="text-white/42">: {`{`}</span>
            </span>
            <span className="sh__line">
              {"    "}
              <span className="text-white/78">runtime</span>
              <span className="text-white/42">: </span>
              <span className="text-white/94">&quot;node&quot;</span>
              <span className="text-white/42">,</span>
            </span>
            <span className="sh__line">
              <span className="text-white/42">{`  },`}</span>
            </span>
            <span className="sh__line">
              <span className="text-white/42">{`});`}</span>
            </span>
          </code>
        </pre>

        <div className="flex h-10 shrink-0 items-center justify-between border-t border-white/8 px-4 font-mono text-[8px] uppercase tracking-normal sm:text-[9px]">
          <span className="text-white/30">React by default</span>
          <span className="flex items-center gap-1.5 text-white/68">
            <Check aria-hidden className="size-3" strokeWidth={1.8} /> SSR + hydration
          </span>
        </div>
      </figure>
    </div>
  );
}

function RuntimeErrorVisual() {
  return (
    <div className="farm-feature-spotlight relative flex h-[340px] min-w-0 items-end justify-end overflow-hidden pl-6 sm:pl-10">
      <figure
        aria-label="FARMJS development runtime error overlay mapped to application source"
        className="relative z-10 -mb-px -mr-px flex h-[290px] w-full max-w-full shrink-0 flex-col overflow-hidden border border-white/10 bg-black shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
      >
        <figcaption className="flex h-10 shrink-0 items-center justify-between border-b border-white/8 px-4 font-mono text-[9px] uppercase tracking-normal">
          <span className="flex items-center gap-2 text-white/56">
            <TriangleAlert aria-hidden className="size-3 text-red-300/80" strokeWidth={1.5} />
            Runtime error
          </span>
          <span className="border border-red-300/20 bg-red-300/[0.055] px-2 py-1 text-[8px] text-red-200/70">
            Development
          </span>
        </figcaption>

        <div className="flex min-h-0 flex-1 flex-col px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="font-mono text-[8px] uppercase tracking-normal text-red-200/62">
                Runtime TypeError
              </span>
              <h4 className="mt-1 truncate text-[13px] font-medium tracking-normal text-white/90 sm:text-sm">
                Application failed in the browser
              </h4>
            </div>
            <span className="mt-0.5 shrink-0 border border-white/10 bg-white/[0.025] px-2 py-1 font-mono text-[8px] text-white/42">
              1 occurrence
            </span>
          </div>

          <div className="mt-3 min-h-0 overflow-hidden border border-white/10 bg-white/[0.018] font-mono text-[8px] tracking-normal sm:text-[9px]">
            <div className="flex h-8 min-w-0 items-center justify-between gap-3 border-b border-white/8 px-3">
              <span className="truncate text-white/54">src/app/dashboard/page.tsx:24:38</span>
              <span className="shrink-0 text-white/24">source mapped</span>
            </div>
            <div className="py-1.5">
              <div className="grid grid-cols-[2rem_minmax(0,1fr)] px-2 leading-5 text-white/34">
                <span className="text-right text-white/18">23</span>
                <code className="truncate pl-3">const profile = response.user.profile;</code>
              </div>
              <div className="grid grid-cols-[2rem_minmax(0,1fr)] border-l-2 border-red-300/70 bg-red-300/[0.06] px-2 leading-5 text-white/86">
                <span className="text-right text-red-200/56">24</span>
                <code className="truncate pl-3">profile.formatDisplayName();</code>
              </div>
              <div className="grid grid-cols-[2rem_minmax(0,1fr)] px-2 leading-5 text-white/34">
                <span className="text-right text-white/18">25</span>
                <code className="truncate pl-3">setDisplayName(name);</code>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-center gap-2 pt-3 font-mono text-[8px] uppercase tracking-normal sm:text-[9px]">
            <span className="inline-flex h-8 items-center gap-1.5 border border-white/18 bg-white px-3 text-black">
              <Copy aria-hidden className="size-3" strokeWidth={1.6} /> Copy report
            </span>
            <span className="inline-flex h-8 items-center gap-1.5 border border-white/12 bg-white/[0.025] px-3 text-white/58">
              <RefreshCw aria-hidden className="size-3" strokeWidth={1.6} /> Reload
            </span>
          </div>
        </div>
      </figure>
    </div>
  );
}

function FeatureCell({
  index,
  icon: Icon,
  label,
  title,
  body,
  className,
  children,
}: {
  index: string;
  icon: LucideIcon;
  label: string;
  title: string;
  body: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={cx("group flex min-h-[500px] min-w-0 flex-col justify-between", className)}>
      <div className="p-6 sm:p-10">
        <div className="text-white/52">
          <IndexedLabel icon={Icon} index={index} label={label} />
        </div>
        <h3 className="mt-6 max-w-[31rem] text-balance font-geist-pixel text-xl font-medium leading-[1.2] tracking-normal text-white/92 sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-[31rem] text-sm leading-6 text-white/48 sm:text-base sm:leading-7">
          {body}
        </p>
      </div>
      {children}
    </article>
  );
}

function DeveloperExperienceGrid() {
  return (
    <section className="farm-full-rule grid w-full lg:grid-cols-2">
      <FeatureCell
        body="Start the whole app once, then see every page request and response time as you work."
        icon={Terminal}
        index="01.1"
        label="Development"
        title="A blazingly fast dev server"
      >
        <TerminalVisual />
      </FeatureCell>
      <FeatureCell
        body="Define an API route once. Farm.js generates a client with typed inputs and responses."
        className="border-t border-white/12 lg:border-l lg:border-t-0"
        icon={Braces}
        index="01.2"
        label="Typed APIs"
        title="Types from route to client"
      >
        <TypedApiVisual />
      </FeatureCell>
      <FeatureCell
        body="Connect billing, API keys, and more in one place. Pass existing provider instances and call every service through typed APIs."
        className="border-t border-white/12"
        icon={Plug}
        index="01.3"
        label="Integrations"
        title="Connect once. Keep full control."
      >
        <IntegrationVisual />
      </FeatureCell>
      <FeatureCell
        body="Farm.js packages routes, middleware, typed clients, and deployment config into one production build."
        className="border-t border-white/12 lg:border-l"
        icon={Rocket}
        index="01.4"
        label="Production"
        title="Build once. Deploy together."
      >
        <BuildVisual />
      </FeatureCell>
      <FeatureCell
        body="Keep React with zero config, or choose Preact, Solid, Vue, or Svelte. Routing, server features, SSR, and hydration stay on one contract."
        className="border-t border-white/12"
        icon={Code2}
        index="01.5"
        label="Renderers"
        title="Your UI runtime, your choice"
      >
        <RendererVisual />
      </FeatureCell>
      <FeatureCell
        body="Unhandled browser errors map to application source, group repeated failures, and offer copy and reload actions during development."
        className="border-t border-white/12 lg:border-l"
        icon={TriangleAlert}
        index="01.6"
        label="Diagnostics"
        title="Errors that point to the source"
      >
        <RuntimeErrorVisual />
      </FeatureCell>
    </section>
  );
}

function FoundationCanvas({
  children,
  interactive = false,
  spotlight = true,
}: {
  children: ReactNode;
  interactive?: boolean;
  spotlight?: boolean;
}) {
  return (
    <div
      aria-hidden={interactive ? undefined : true}
      className={cx(
        "relative h-[320px] min-w-0 overflow-hidden sm:h-[328px]",
        spotlight && "farm-feature-spotlight",
      )}
    >
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

function FoundationCodeVisual({
  code,
  highlightLines,
  label,
  language,
}: {
  code: string;
  highlightLines?: readonly number[];
  label: string;
  language: string;
}) {
  return (
    <div className="farm-feature-spotlight relative flex h-[320px] min-w-0 items-end justify-end overflow-hidden pl-6 sm:h-[328px] sm:pl-10">
      <HighlightedCode
        className="relative z-10 -mb-px -mr-px flex h-[296px] w-full max-w-full shrink-0 flex-col sm:h-[300px]"
        code={code}
        highlightLines={highlightLines}
        label={label}
        language={language}
      />
    </div>
  );
}

function FoundationCodeTabsVisual({
  compact = false,
  id,
  tabs,
  tabsLabel,
}: {
  compact?: boolean;
  id: string;
  tabs: readonly [HighlightedCodeTab, ...HighlightedCodeTab[]];
  tabsLabel: string;
}) {
  return (
    <div className="farm-feature-spotlight relative flex h-[320px] min-w-0 items-end justify-end overflow-hidden pl-6 sm:h-[328px] sm:pl-10">
      <HighlightedCodeTabs
        className="relative z-10 -mb-px -mr-px flex h-[296px] w-full max-w-full shrink-0 flex-col sm:h-[300px]"
        compact={compact}
        id={id}
        tabs={tabs}
        tabsLabel={tabsLabel}
      />
    </div>
  );
}

function FileTreeVisual() {
  const nodes: readonly FileTreeNode[] = [
    {
      name: "app",
      type: "folder",
      meta: "root",
      defaultOpen: true,
      children: [
        { name: "layout.tsx", type: "file", extension: "tsx", meta: "shell" },
        { name: "page.tsx", type: "file", extension: "tsx", meta: "/" },
        {
          name: "dashboard",
          type: "folder",
          meta: "/dashboard",
          defaultOpen: true,
          children: [{ name: "page.tsx", type: "file", extension: "tsx", meta: "route" }],
        },
        {
          name: "api",
          type: "folder",
          meta: "/api",
          defaultOpen: true,
          children: [
            {
              name: "users",
              type: "folder",
              defaultOpen: true,
              children: [{ name: "route.ts", type: "file", extension: "route", meta: "GET" }],
            },
          ],
        },
      ],
    },
  ];

  return (
    <FoundationCanvas interactive>
      <FileTree
        className="farm-illustration-surface absolute -bottom-px -right-px top-4 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)]"
        data={nodes}
        defaultSelectedPath="app/page.tsx"
      />
    </FoundationCanvas>
  );
}

function DeploymentVisual() {
  return (
    <FoundationCanvas interactive spotlight={false}>
      <a
        aria-label="Explore Farm.js deployment targets"
        className="group/deployment absolute inset-0 flex items-center justify-center overflow-hidden px-6 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:px-10"
        href="/docs/deployment"
        title="Deployment documentation"
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/0.025),transparent_66%)]"
        />
        <div
          aria-hidden
          className="relative size-[19rem] sm:size-[20rem]"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, black 68%, rgb(0 0 0 / 0.76) 86%, transparent 108%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 68%, rgb(0 0 0 / 0.76) 86%, transparent 108%)",
          }}
        >
          {deploymentTiles.map((tile) => (
            <div
              key={`${tile.row}_${tile.col}`}
              className={cx(
                "group/tile absolute flex size-[20%] items-center justify-center overflow-hidden rounded-none border border-white/[0.08] transition-[background-color,border-color] duration-150",
                tile.brand
                  ? "bg-white/[0.055] group-hover/deployment:border-white/[0.14] group-hover/deployment:bg-white/[0.075]"
                  : "bg-white/[0.012]",
              )}
              style={{
                left: `${tile.col * 20}%`,
                top: `${tile.row * 20}%`,
              }}
              title={tile.label}
            >
              {tile.brand ? (
                <>
                  <BrandIcon
                    className="size-7 opacity-72 transition-[opacity,transform] duration-150 group-hover/tile:-translate-y-1 group-hover/tile:opacity-90"
                    src={tile.brand}
                  />
                  <span className="pointer-events-none absolute inset-x-1 bottom-1 translate-y-1 truncate text-center font-mono text-[7px] font-normal uppercase tracking-normal text-white/68 opacity-0 transition-[opacity,transform] duration-150 group-hover/tile:translate-y-0 group-hover/tile:opacity-100">
                    {tile.label}
                  </span>
                </>
              ) : (
                <span className="size-px bg-white/12" />
              )}
            </div>
          ))}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[22%] bg-gradient-to-l from-black via-black/60 to-transparent"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[22%] bg-gradient-to-t from-black via-black/60 to-transparent"
          />
        </div>
      </a>
    </FoundationCanvas>
  );
}

function DocsVisual() {
  return (
    <FoundationCodeVisual
      code={docsConfigCode}
      highlightLines={docsHighlightLines}
      label="farm.config.ts"
      language="ts"
    />
  );
}

function LayersVisual() {
  return (
    <FoundationCodeTabsVisual
      id="farm-layers-code"
      tabs={layersConfigTabs}
      tabsLabel="Farm Layers examples"
    />
  );
}

function StorageVisual() {
  return (
    <FoundationCodeTabsVisual
      id="farm-storage-code"
      tabs={storageCodeTabs}
      tabsLabel="Farm KV storage examples"
    />
  );
}

function AdvancedRoutesVisual() {
  return (
    <FoundationCodeTabsVisual
      compact
      id="farm-advanced-routes-code"
      tabs={routeCodeTabs}
      tabsLabel="Farm advanced route examples"
    />
  );
}

const optimizedBoundaryChecks = [
  ["Host-only tree", "pass"],
  ["Client code", "none"],
  ["Events or refs", "none"],
  ["Size gate", "pass"],
] as const;

function FeatureDiagramFrame({
  ariaLabel,
  href,
  icon: Icon,
  label,
  status,
  footerLabel,
  footerValue,
  children,
}: {
  ariaLabel: string;
  href: string;
  icon: LucideIcon;
  label: string;
  status: string;
  footerLabel: string;
  footerValue: string;
  children: ReactNode;
}) {
  return (
    <FoundationCanvas interactive>
      <a
        aria-label={ariaLabel}
        className="group/diagram absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
        href={href}
      >
        <figure className="farm-illustration-surface absolute -bottom-px -right-px top-4 flex w-[calc(100%-1.5rem)] flex-col overflow-hidden border border-white/10 transition-colors duration-150 group-hover/diagram:border-white/18 sm:w-[calc(100%-2.5rem)]">
          <figcaption className="flex h-10 shrink-0 items-center justify-between border-b border-white/8 px-4 font-mono text-[9px] font-normal uppercase tracking-normal">
            <span className="flex items-center gap-1.5 text-white/54">
              <Icon aria-hidden className="size-3" strokeWidth={1.5} />
              {label}
            </span>
            <span className="border border-white/12 bg-white/[0.035] px-2 py-1 text-white/44">
              {status}
            </span>
          </figcaption>

          <div className="relative min-h-0 flex-1">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.018)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.018)_1px,transparent_1px)] bg-[size:24px_24px] opacity-55"
            />
            <div className="relative z-10 h-full">{children}</div>
          </div>

          <div className="flex h-12 shrink-0 items-center justify-between border-t border-white/10 bg-white/[0.025] px-4 font-mono text-[9px] font-normal uppercase tracking-normal sm:px-5">
            <span className="text-white/32">{footerLabel}</span>
            <span className="flex items-center gap-2 text-white/86">
              {footerValue}
              <ArrowRight
                aria-hidden
                className="size-3 transition-transform duration-150 group-hover/diagram:translate-x-0.5"
                strokeWidth={1.5}
              />
            </span>
          </div>
        </figure>
      </a>
    </FoundationCanvas>
  );
}

function DiagramConnector() {
  return (
    <div aria-hidden className="flex min-w-0 items-center">
      <span className="h-px min-w-0 flex-1 bg-white/12" />
      <span className="grid size-6 shrink-0 place-items-center border border-white/12 bg-black text-white/46">
        <ArrowRight className="size-2.5" strokeWidth={1.5} />
      </span>
      <span className="h-px min-w-0 flex-1 bg-white/12" />
    </div>
  );
}

function OptimizedBoundaryVisual() {
  return (
    <FeatureDiagramFrame
      ariaLabel="Read about automatic optimized boundaries"
      footerLabel="Selected renderer"
      footerValue="Strata / Rust"
      href="/docs/server-rendering#automatic-optimized-boundaries"
      icon={Cpu}
      label="Boundary analysis"
      status="Experimental"
    >
      <div className="grid h-full grid-cols-[minmax(0,0.88fr)_2.25rem_minmax(0,1.12fr)] items-center px-4 sm:grid-cols-[minmax(0,0.82fr)_3rem_minmax(0,1.18fr)] sm:px-5">
        <div className="flex h-[152px] min-w-0 flex-col border border-white/12 bg-black/88">
          <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/8 px-3 font-mono text-[8px] font-normal uppercase tracking-normal">
            <span className="text-white/34">Candidate</span>
            <span className="text-white/58">RSC</span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 text-center font-mono tracking-normal">
            <span className="border border-white/10 bg-white/[0.035] px-2 py-1 text-[7px] uppercase text-white/38 sm:text-[8px]">
              Server component
            </span>
            <span className="mt-3 text-[11px] text-white/86 sm:text-xs">&lt;article&gt;</span>
            <span className="mt-1 text-[8px] text-white/32 sm:text-[9px]">host-only region</span>
          </div>
        </div>

        <DiagramConnector />

        <div className="flex h-[152px] min-w-0 flex-col border border-white/12 bg-black/88">
          <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/8 px-3 font-mono text-[8px] font-normal uppercase tracking-normal">
            <span className="text-white/34">Runtime scan</span>
            <span className="flex items-center gap-1 text-white/68">
              <Check aria-hidden className="size-2.5" strokeWidth={1.8} /> Eligible
            </span>
          </div>
          <div className="min-h-0 flex-1 px-3">
            {optimizedBoundaryChecks.map(([label, value]) => (
              <div
                key={label}
                className="flex h-[30px] items-center justify-between border-b border-white/8 font-mono text-[8px] tracking-normal last:border-b-0 sm:text-[9px]"
              >
                <span className="truncate text-white/38">{label}</span>
                <span className="ml-2 flex shrink-0 items-center gap-1 text-white/68">
                  <Check aria-hidden className="size-2.5" strokeWidth={1.8} />
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FeatureDiagramFrame>
  );
}

function MarkdownMirrorsVisual() {
  return (
    <FeatureDiagramFrame
      ariaLabel="Read about automatic Markdown mirrors"
      footerLabel="Content negotiation"
      footerValue="text/markdown"
      href="/docs/markdown"
      icon={FileOutput}
      label="Representation map"
      status="Automatic"
    >
      <div className="grid h-full grid-cols-[minmax(0,0.88fr)_2.25rem_minmax(0,1.12fr)] items-center px-4 sm:grid-cols-[minmax(0,0.82fr)_3rem_minmax(0,1.18fr)] sm:px-5">
        <div className="flex h-[152px] min-w-0 flex-col border border-white/12 bg-black/88">
          <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/8 px-3 font-mono text-[8px] font-normal uppercase tracking-normal">
            <span className="text-white/34">Source</span>
            <span className="text-white/58">Page</span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 text-center font-mono tracking-normal">
            <span className="border border-white/10 bg-white/[0.035] px-2 py-1 text-[7px] uppercase text-white/38 sm:text-[8px]">
              App route
            </span>
            <span className="mt-3 text-[11px] text-white/86 sm:text-xs">/pricing</span>
            <span className="mt-1 text-[8px] text-white/32 sm:text-[9px]">one source</span>
          </div>
        </div>

        <DiagramConnector />

        <div className="flex h-[152px] min-w-0 flex-col border border-white/12 bg-black/88">
          <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/8 px-3 font-mono text-[8px] font-normal uppercase tracking-normal">
            <span className="text-white/34">Representations</span>
            <span className="text-white/58">2 outputs</span>
          </div>
          <div className="grid min-h-0 flex-1 grid-rows-2">
            <div className="flex min-w-0 items-center justify-between border-b border-white/8 px-3 font-mono tracking-normal">
              <div className="min-w-0">
                <span className="block text-[7px] uppercase text-white/28 sm:text-[8px]">
                  Browser
                </span>
                <span className="mt-1 block truncate text-[9px] text-white/74 sm:text-[10px]">
                  /pricing
                </span>
              </div>
              <span className="ml-2 border border-white/10 bg-white/[0.025] px-2 py-1 text-[7px] uppercase text-white/48 sm:text-[8px]">
                HTML
              </span>
            </div>
            <div className="flex min-w-0 items-center justify-between px-3 font-mono tracking-normal">
              <div className="min-w-0">
                <span className="block text-[7px] uppercase text-white/28 sm:text-[8px]">
                  Agent
                </span>
                <span className="mt-1 block truncate text-[9px] text-white/86 sm:text-[10px]">
                  /pricing.md
                </span>
              </div>
              <span className="ml-2 border border-white/14 bg-white/[0.045] px-2 py-1 text-[7px] uppercase text-white/78 sm:text-[8px]">
                Markdown
              </span>
            </div>
          </div>
        </div>
      </div>
    </FeatureDiagramFrame>
  );
}

function AgentRuntimeVisual() {
  return (
    <FoundationCodeTabsVisual
      compact
      id="farm-agent-runtime-code"
      tabs={agentRuntimeCodeTabs}
      tabsLabel="Farm agent runtime examples"
    />
  );
}

function AgentClientVisual() {
  return (
    <FoundationCodeTabsVisual
      compact
      id="farm-agent-client-code"
      tabs={agentClientCodeTabs}
      tabsLabel="Farm agent client examples"
    />
  );
}

function FoundationGrid() {
  return (
    <section data-foundation-grid className="farm-full-rule grid w-full lg:grid-cols-2">
      <FeatureCell
        body="Build pages, layouts, API routes, loading states, and typed links in one app directory."
        icon={FolderTree}
        index="02.1"
        label="Routing"
        title="The app router you know"
      >
        <FileTreeVisual />
      </FeatureCell>
      <FeatureCell
        body="Ship to Vercel, Cloudflare, Netlify, or self-hosted Node with built-in Nitro presets."
        className="border-t border-white/12 lg:border-l lg:border-t-0"
        icon={CloudCog}
        index="02.2"
        label="Deployment"
        title="Deploy where you want"
      >
        <DeploymentVisual />
      </FeatureCell>
      <FeatureCell
        body="Enable a complete docs surface with MDX, navigation, search, MCP, and agent-ready endpoints from the same source."
        className="border-t border-white/12"
        icon={BookOpenText}
        index="02.3"
        label="Documentation"
        title="Docs for people and agents"
      >
        <DocsVisual />
      </FeatureCell>
      <FeatureCell
        body="Compose routes, middleware, integrations, components, and config from local or package layers. Project files always win."
        className="border-t border-white/12 lg:border-l"
        icon={Layers3}
        index="02.4"
        label="Layers"
        title="Share architecture, not boilerplate"
      >
        <LayersVisual />
      </FeatureCell>
      <FeatureCell
        body="Mount SQLite, Redis, S3, or another key/value driver for caches, settings, counters, idempotency records, and object-backed values."
        className="border-t border-white/12"
        icon={Database}
        index="02.5"
        label="KV Storage"
        title="Key/value storage for the runtime"
      >
        <StorageVisual />
      </FeatureCell>
      <FeatureCell
        body="Validate params, prepare request data, load the page, and run post-load work in one typed route definition."
        className="border-t border-white/12 lg:border-l"
        icon={Route}
        index="02.6"
        label="Advanced routes"
        title="Configure the whole route in one place"
      >
        <AdvancedRoutesVisual />
      </FeatureCell>
      <FeatureCell
        body={
          <>
            Farm detects large, host-only Server Component regions and renders eligible trees
            through{" "}
            <a
              className="font-medium text-white underline decoration-white/45 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href="https://github.com/farming-labs/strata"
              rel="noreferrer"
              target="_blank"
            >
              Strata
            </a>
            {"'s Rust-native renderer. Everything else stays on React."}
          </>
        }
        className="border-t border-white/12"
        icon={Cpu}
        index="02.7"
        label="Experimental rendering"
        title="Native rendering for static regions"
      >
        <OptimizedBoundaryVisual />
      </FeatureCell>
      <FeatureCell
        body="Every app page receives a Markdown representation at a .md URL or through content negotiation. Keep the generated output or override it with page.md."
        className="border-t border-white/12 lg:border-l"
        icon={FileOutput}
        index="02.8"
        label="Markdown mirrors"
        title="Every page, readable by agents"
      >
        <MarkdownMirrorsVisual />
      </FeatureCell>
    </section>
  );
}

function AgentRuntimeIllustration() {
  return (
    <figure className="farm-feature-spotlight farm-agent-spotlight relative mx-auto h-[248px] w-full max-w-[28rem] overflow-hidden md:mx-0 md:h-[280px]">
      <figcaption className="sr-only">
        Farm connects the application origin to Eve on Vercel and Cloudflare Agents on Workers.
      </figcaption>

      <div className="relative z-10 grid h-full grid-cols-[minmax(0,0.82fr)_3rem_minmax(0,1.18fr)] items-center px-2 sm:px-4">
        <div className="border border-white/10 bg-black/80 p-3 sm:p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] font-normal uppercase tracking-normal text-white/72">
            <Route aria-hidden className="size-3.5" strokeWidth={1.5} />
            Farm app
          </div>
          <div className="mt-3 border-t border-white/8 pt-3">
            <span className="block font-mono text-[8px] font-normal uppercase tracking-normal text-white/34 sm:text-[9px]">
              Same origin
            </span>
            <code className="mt-1 block font-mono text-xs text-white/86">/</code>
          </div>
        </div>

        <div aria-hidden className="relative h-[184px]">
          <span className="absolute left-0 top-1/2 h-px w-1/2 bg-white/22" />
          <span className="absolute bottom-1/4 left-1/2 top-1/4 w-px bg-white/22" />
          <span className="absolute left-1/2 right-0 top-1/4 h-px bg-white/22" />
          <span className="absolute bottom-1/4 left-1/2 right-0 h-px bg-white/22" />
          <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 bg-white" />
          <span className="absolute right-0 top-1/4 size-1 -translate-y-1/2 bg-white/52" />
          <span className="absolute bottom-1/4 right-0 size-1 translate-y-1/2 bg-white/52" />
        </div>

        <div className="grid h-[184px] grid-rows-2 gap-3">
          <div className="border border-white/10 bg-black/80 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 font-mono text-[9px] font-normal uppercase tracking-normal text-white/76 sm:text-[10px]">
                <Workflow aria-hidden className="size-3.5 shrink-0" strokeWidth={1.5} />
                Eve
              </span>
              <BrandIcon className="size-3.5 opacity-52" src={vercelIconUrl} />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/8 pt-2">
              <code className="font-mono text-[9px] text-white/76">/eve/*</code>
              <span className="font-mono text-[8px] font-normal uppercase tracking-normal text-white/32">
                Vercel
              </span>
            </div>
          </div>

          <div className="border border-white/10 bg-black/80 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 font-mono text-[9px] font-normal uppercase tracking-normal text-white/76 sm:text-[10px]">
                <BrandIcon className="size-3.5 shrink-0 opacity-72" src={cloudflareIconUrl} />
                <span className="truncate">Cloudflare Agents</span>
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/8 pt-2">
              <code className="font-mono text-[9px] text-white/76">/agents/*</code>
              <span className="font-mono text-[8px] font-normal uppercase tracking-normal text-white/32">
                Workers
              </span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

function AgentSectionIntro() {
  return (
    <section id="agents" className="farm-wide-rule grid w-full lg:grid-cols-[14rem_minmax(0,1fr)]">
      <div className="flex items-start border-b border-white/12 p-6 text-white/36 sm:px-6 sm:py-8 lg:border-b-0 lg:border-r">
        <IndexedLabel icon={Bot} index="03" label="Agent systems" />
      </div>

      <div className="relative grid min-w-0 items-center gap-8 overflow-hidden bg-black px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-[minmax(0,1fr)_20rem] lg:min-h-[420px] lg:gap-10 lg:px-12 xl:h-[420px] xl:grid-cols-[minmax(0,1fr)_28rem]">
        <div className="relative z-10 flex min-w-0 items-center">
          <div className="min-w-0 max-w-lg">
            <h2 className="text-balance text-3xl font-medium leading-[1.06] tracking-normal text-white sm:text-4xl">
              Bring the agent runtime you already use
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/48 sm:text-base sm:leading-7">
              Run Eve on Vercel or Cloudflare Agents on Workers. Farm joins each runtime to your app
              in development and production while its native SDK stays intact.
            </p>
            <div className="mt-8 flex items-center">
              <ButtonLink
                href="/docs/integrations#agent-runtimes"
                icon={<BookOpenText aria-hidden className="size-4" strokeWidth={1.5} />}
              >
                Agent Integrations
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center md:justify-end">
          <AgentRuntimeIllustration />
        </div>
      </div>
    </section>
  );
}

function AgentFeatureGrid() {
  return (
    <section data-agent-grid className="farm-full-rule grid w-full lg:grid-cols-2">
      <FeatureCell
        body="Choose Eve or Cloudflare Agents. Farm starts the runtime in development, owns its same-origin routes, and composes supported production output."
        icon={Bot}
        index="03.1"
        label="Agent runtimes"
        title="Run agents beside the app"
      >
        <AgentRuntimeVisual />
      </FeatureCell>
      <FeatureCell
        body="Use useEveAgent for durable conversations or useAgent for typed WebSocket state and RPC. Farm does not add a duplicate client layer."
        className="border-t border-white/12 lg:border-l lg:border-t-0"
        icon={Network}
        index="03.2"
        label="Native clients"
        title="Keep the provider-native SDK"
      >
        <AgentClientVisual />
      </FeatureCell>
    </section>
  );
}

function IntegrationsSection() {
  return (
    <section
      id="integrations"
      className="farm-wide-rule grid w-full lg:grid-cols-[14rem_minmax(0,1fr)]"
    >
      <div className="flex items-start border-b border-white/12 p-6 text-white/36 sm:px-6 sm:py-8 lg:border-b-0 lg:border-r">
        <IndexedLabel icon={Blocks} index="01" label="Connected systems" />
      </div>

      <div className="relative grid min-w-0 items-center gap-8 overflow-hidden bg-black px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-[minmax(0,1fr)_20rem] lg:min-h-[440px] lg:gap-10 lg:px-12 xl:h-[440px] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="relative z-10 flex items-center">
          <div className="max-w-lg">
            <h2 className="text-balance text-3xl font-medium leading-[1.06] tracking-normal text-white sm:text-4xl">
              Bring the tools you already use
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/48 sm:text-base sm:leading-7">
              Start with built-in Farm Auth, keep full control with Better Auth, then add
              integrations for billing, email, jobs, KV storage, agents, API keys, and UI—or connect
              your own.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <ButtonLink
                href="/docs/integrations"
                icon={<BookOpenText aria-hidden className="size-4" strokeWidth={1.5} />}
              >
                Explore Integrations
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="farm-integration-visual relative z-10 flex items-center justify-center md:h-full md:min-h-0 md:justify-end">
          <div className="farm-integration-directory relative aspect-[5/6] w-full max-w-72 md:w-[21rem] md:max-w-none md:shrink-0 md:translate-x-12 xl:w-96 xl:translate-x-16">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(255 255 255 / 0.11) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.11) 1px, transparent 1px)",
                backgroundSize: "20% 16.6666667%",
                maskImage: "radial-gradient(ellipse at center, black 68%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 68%, transparent 100%)",
              }}
            />

            {integrationDirectoryItems.map((item) => {
              const Icon = "icon" in item ? item.icon : null;

              return (
                <a
                  key={item.label}
                  aria-label={`${item.label} integration documentation`}
                  className="group absolute grid place-items-center bg-white/[0.055] transition-[background-color,color] duration-150 hover:z-10 hover:bg-white focus-visible:z-10 focus-visible:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
                  href={item.href}
                  style={{
                    height: "16.6666667%",
                    left: `${item.col * 20}%`,
                    top: `${item.row * (100 / 6)}%`,
                    width: "20%",
                  }}
                  title={`${item.label} integration`}
                >
                  {"brand" in item ? (
                    <BrandIcon
                      className="size-7 opacity-60 transition-[filter,opacity,transform] duration-150 group-hover:-translate-y-1 group-hover:invert-0 group-hover:opacity-100 group-focus-visible:-translate-y-1 group-focus-visible:invert-0 group-focus-visible:opacity-100"
                      src={item.brand}
                    />
                  ) : Icon ? (
                    <Icon
                      aria-hidden
                      className="size-7 text-white/60 transition-[color,transform] duration-150 group-hover:-translate-y-1 group-hover:text-black group-focus-visible:-translate-y-1 group-focus-visible:text-black"
                      strokeWidth={1.35}
                    />
                  ) : null}
                  <span className="pointer-events-none absolute inset-x-1 bottom-1 translate-y-1 truncate text-center font-mono text-[7px] font-normal uppercase tracking-normal text-black/55 opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {item.label}
                  </span>
                </a>
              );
            })}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[22%] bg-gradient-to-l from-black via-black/60 to-transparent"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[18%] bg-gradient-to-t from-black via-black/60 to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="farm-full-rule w-full">
      <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
        <h2 className="text-balance font-geist-pixel text-xl font-medium leading-[1.15] tracking-normal text-white sm:text-2xl">
          One framework. The whole product.
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-balance text-sm leading-6 text-white/48 sm:text-base">
          Build routing, APIs, integrations, agents, docs, and deployment together in one React
          framework.
        </p>
      </div>
      <div className="farm-top-rule flex items-center justify-center bg-white/[0.035] p-4">
        <ButtonLink
          href="/docs/getting-started"
          icon={<Rocket aria-hidden className="size-4" strokeWidth={1.5} />}
        >
          Get Started
        </ButtonLink>
      </div>
    </section>
  );
}

type FooterLink = readonly [label: string, href: string];

function FooterActionLink({
  brand,
  href,
  icon: Icon,
  label,
}: {
  brand: string | null;
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  const DirectionIcon = href.startsWith("http") ? ArrowUpRight : ArrowRight;

  return (
    <a
      className="group flex h-12 items-center justify-between border-b border-white/12 px-4 font-mono text-[9px] font-normal uppercase !tracking-[0.04em] text-white/58 transition-[background-color,color] duration-150 hover:bg-white/[0.035] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
      href={href}
    >
      <span className="flex min-w-0 items-center gap-2">
        {brand ? (
          <BrandIcon className="size-3.5 shrink-0 opacity-72" src={brand} />
        ) : (
          <Icon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.5} />
        )}
        <span className="truncate">{label}</span>
      </span>
      <DirectionIcon
        aria-hidden
        className="size-3.5 shrink-0 text-white/30 transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-white/72"
        strokeWidth={1.5}
      />
    </a>
  );
}

function FooterLinksGroup({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <div className="px-4 py-4 md:min-h-[154px]">
      <h3 className="mb-2 font-mono text-[10px] font-normal uppercase !tracking-[0.04em] text-white/34">
        {title}
      </h3>
      <ul className="grid">
        {links.map(([label, href]) => {
          const DirectionIcon = href.startsWith("http") ? ArrowUpRight : ArrowRight;
          const isGitHub = href.includes("github.com");

          return (
            <li key={label}>
              <a
                className="group flex min-h-7 items-center justify-between gap-2 font-mono text-[9px] font-normal uppercase !tracking-[0.04em] text-white/48 transition-colors duration-150 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                href={href}
              >
                <span className="flex items-center gap-2">
                  {isGitHub ? <GithubIcon className="size-3.5 opacity-72" /> : null}
                  <span>{label}</span>
                </span>
                <DirectionIcon
                  aria-hidden
                  className="size-3 shrink-0 text-white/0 transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-white/56"
                  strokeWidth={1.5}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full">
      <div className="grid grid-cols-1 divide-y divide-white/12 md:grid-cols-4 md:divide-x md:divide-y-0">
        <div>
          <div className="flex h-12 items-center border-b border-white/12 px-4">
            <BrandLockup />
          </div>
          <div className="px-4 py-4 md:min-h-[154px]">
            <p className="max-w-[15rem] font-mono text-[9px] font-normal uppercase leading-5 !tracking-[0.04em] text-white/42">
              A Framework for Product integrated Apps
            </p>
          </div>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <FooterActionLink
              brand={group.brand}
              href={group.action[1]}
              icon={group.icon}
              label={group.action[0]}
            />
            <FooterLinksGroup links={group.links} title={group.title} />
          </div>
        ))}
      </div>
      <div className="farm-top-rule flex flex-col gap-2 px-4 py-3 font-mono text-[10px] font-normal uppercase !tracking-[0.04em] text-white/34 sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} Farm.js</span>
        <a
          className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          href="https://www.farming-labs.dev"
        >
          farming-labs.dev <ExternalLink aria-hidden className="size-3" strokeWidth={1.5} />
        </a>
      </div>
    </footer>
  );
}

export default function HomePage(_props: PageProps) {
  return (
    <div className="farm-home min-h-screen overflow-x-hidden bg-black font-sans text-white selection:bg-white selection:text-black">
      <AnnouncementBar />
      <div className="farm-page-grid">
        <div aria-hidden className="farm-page-rail" />
        <div className="farm-page-content min-w-0">
          <Header />
          <main>
            <Hero />
            <EcosystemStrip />
            <DeveloperExperienceGrid />
            <BenchmarkSection />
            <IntegrationsSection />
            <FoundationGrid />
            <AgentSectionIntro />
            <AgentFeatureGrid />
            <FinalCta />
          </main>
          <Footer />
        </div>
        <div aria-hidden className="farm-page-rail" />
      </div>
    </div>
  );
}


import { Activity, Rocket, TimerReset } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import nextIconUrl from "simple-icons/icons/nextdotjs.svg?url";
import nuxtIconUrl from "simple-icons/icons/nuxt.svg?url";
import svelteIconUrl from "simple-icons/icons/svelte.svg?url";
import tanstackIconUrl from "simple-icons/icons/tanstack.svg?url";
import { benchmarkReport, formatBenchmarkDuration } from "../../lib/framework-benchmark";

type FrameworkResult = (typeof benchmarkReport.frameworks)[number];
type MetricKey = keyof FrameworkResult["metrics"];

const farmResult = benchmarkReport.frameworks.find((framework) => framework.id === "farm");
const competitorResults = benchmarkReport.frameworks.filter((framework) => framework.id !== "farm");
const frameworkIconUrls = {
  farm: "/favicon.svg",
  next: nextIconUrl,
  nuxt: nuxtIconUrl,
  sveltekit: svelteIconUrl,
  tanstack: tanstackIconUrl,
} as const satisfies Record<FrameworkResult["id"], string>;

const leadMetrics = [
  ["devFirstPageMs", "Dev start"],
  ["devWarmResponseMs", "Warm dev"],
  ["buildMs", "Build"],
  ["productionBootMs", "Prod boot"],
  ["productionResponseMs", "SSR p50"],
  ["responseBytes", "HTML"],
] as const satisfies readonly (readonly [MetricKey, string])[];

const chartMetrics = [
  ["devFirstPageMs", "Dev start"],
  ["devWarmResponseMs", "Warm dev"],
  ["buildMs", "Build"],
  ["productionBootMs", "Prod boot"],
  ["productionResponseMs", "SSR"],
  ["responseBytes", "HTML"],
] as const satisfies readonly (readonly [MetricKey, string])[];

const chartInsetX = 42;
const chartTopY = 250;

function formatByteCount(bytes: number) {
  return bytes >= 1024 ? (bytes / 1024).toFixed(1) + " KB" : Math.round(bytes) + " B";
}

function formatMetricValue(key: MetricKey, value: number) {
  return key === "responseBytes" ? formatByteCount(value) : formatBenchmarkDuration(value);
}

function formatRatio(value: number) {
  return value >= 10 ? value.toFixed(1) + "×" : value.toFixed(2) + "×";
}

function getMetricMinimum(key: MetricKey) {
  return Math.min(...benchmarkReport.frameworks.map((framework) => framework.metrics[key].median));
}

function getMetricExtent(key: MetricKey) {
  const values = benchmarkReport.frameworks.map((framework) => framework.metrics[key].median);

  return {
    maximum: Math.max(...values),
    minimum: Math.min(...values),
  };
}

function getBestCompetitor(key: MetricKey) {
  return competitorResults.reduce((best, framework) =>
    framework.metrics[key].median < best.metrics[key].median ? framework : best,
  );
}

function getAdvantageAgainst(framework: FrameworkResult | undefined, key: MetricKey) {
  if (!farmResult || !framework) {
    return 0;
  }

  return framework.metrics[key].median / farmResult.metrics[key].median;
}

type ChartPoint = {
  label: string;
  metric: MetricKey;
  rawValue: number;
  x: number;
  y: number;
};

function getChartPoints(framework: FrameworkResult, width: number, height: number) {
  const insetX = chartInsetX;
  const insetTop = chartTopY;
  const insetBottom = 96;
  const step = (width - insetX * 2) / Math.max(1, chartMetrics.length - 1);

  return chartMetrics.map(([metric, label], index) => {
    const { maximum, minimum } = getMetricExtent(metric);
    const rawValue = framework.metrics[metric].median;
    const rank = maximum === minimum ? 0 : (rawValue - minimum) / (maximum - minimum);
    const x = insetX + index * step;
    const clamped = Math.max(0, Math.min(1, rank));
    const y = insetTop + (1 - clamped) * (height - insetTop - insetBottom);

    return { label, metric, rawValue, x, y };
  });
}

function buildStepBeforePath(points: readonly ChartPoint[]) {
  if (!points.length) {
    return "";
  }

  return points.slice(1).reduce(
    (path, point, index) => {
      const previous = points[index];

      return `${path} L ${point.x.toFixed(2)} ${previous.y.toFixed(2)} L ${point.x.toFixed(
        2,
      )} ${point.y.toFixed(2)}`;
    },
    `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`,
  );
}

function closeAreaPath(path: string, points: readonly ChartPoint[], baselineY: number) {
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return firstPoint && lastPoint
    ? `${path} L ${lastPoint.x.toFixed(2)} ${baselineY} L ${firstPoint.x.toFixed(2)} ${baselineY} Z`
    : path;
}

function closeCeilingPath(path: string, points: readonly ChartPoint[], ceilingY: number) {
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return firstPoint && lastPoint
    ? `${path} L ${lastPoint.x.toFixed(2)} ${ceilingY} L ${firstPoint.x.toFixed(2)} ${ceilingY} Z`
    : path;
}

function getTooltipX(x: number, width: number) {
  return Math.max(52, Math.min(width - 238, x - 76));
}

function getTooltipY(y: number) {
  return Math.max(252, y - 68);
}

function getColumnRangeLabel(key: MetricKey) {
  const { maximum, minimum } = getMetricExtent(key);

  return `${formatMetricValue(key, minimum)} → ${formatMetricValue(key, maximum)}`;
}

function ComparisonPanel({
  description,
  icon: Icon,
  illustration,
  label,
  title,
}: {
  description: string;
  icon: ComponentType<{
    "aria-hidden"?: boolean;
    className?: string;
    strokeWidth?: number;
  }>;
  illustration: ReactNode;
  label: string;
  title: ReactNode;
}) {
  return (
    <article className="flex min-h-[30rem] flex-col bg-black p-6 sm:min-h-[32rem] sm:p-8 lg:p-10">
      <span className="flex items-center gap-2 font-mono text-[10px] font-normal uppercase tracking-normal text-white/46">
        <Icon aria-hidden className="size-4" strokeWidth={1.5} />
        {label}
      </span>
      {illustration}
      <h3 className="mt-4 max-w-xl text-2xl font-medium leading-tight tracking-normal text-white sm:mt-5 sm:text-3xl">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-white/42">{description}</p>
    </article>
  );
}

function AnimatedComparisonTitle({ lead, metric }: { lead: string; metric: MetricKey }) {
  const comparisons = competitorResults.map((framework) => ({
    framework,
    ratio: getAdvantageAgainst(framework, metric),
  }));
  const accessibleComparison = comparisons
    .map(({ framework, ratio }) => `${formatRatio(ratio)} faster than ${framework.label}`)
    .join("; ");

  return (
    <>
      <span className="sr-only">
        {lead}: {accessibleComparison}.
      </span>
      <span aria-hidden className="block">
        {lead}
      </span>
      <span
        aria-hidden
        className="mt-1 grid h-[2.5em] grid-cols-[3.75ch_auto] items-start gap-x-[0.25em] overflow-hidden text-white/72 sm:flex sm:h-[1.25em] sm:items-start"
      >
        <span className="benchmark-comparison-rotator block h-[1.25em] w-[3.75ch] shrink-0 overflow-hidden">
          {comparisons.map(({ framework, ratio }) => (
            <span key={framework.id} className="benchmark-comparison-item block">
              {formatRatio(ratio)}
            </span>
          ))}
        </span>
        <span className="whitespace-nowrap">faster than</span>
        <span className="benchmark-comparison-rotator col-span-2 block h-[1.25em] w-full overflow-hidden sm:w-[14rem] sm:flex-none">
          {comparisons.map(({ framework }) => (
            <span key={framework.id} className="benchmark-comparison-item block">
              {framework.label}.
            </span>
          ))}
        </span>
      </span>
    </>
  );
}

function StartupIllustration() {
  return (
    <div
      aria-hidden
      className="benchmark-illustration relative mt-4 flex h-52 items-center justify-center sm:h-56"
    >
      <svg
        className="h-full w-full max-w-[28rem] text-white"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 520 300"
      >
        <g className="benchmark-startup-stack">
          <path d="M106 145L260 227L414 145" stroke="currentColor" strokeOpacity="0.2" />
          <path d="M106 145V165L260 247L414 165V145" stroke="currentColor" strokeOpacity="0.2" />
          <path d="M106 185L260 267L414 185" stroke="currentColor" strokeOpacity="0.11" />
          <path d="M106 185V205L260 287L414 205V185" stroke="currentColor" strokeOpacity="0.11" />
          <path d="M106 126V185" stroke="currentColor" strokeDasharray="2 7" strokeOpacity="0.13" />
          <path d="M414 126V185" stroke="currentColor" strokeDasharray="2 7" strokeOpacity="0.13" />
          <path d="M260 208V267" stroke="currentColor" strokeDasharray="2 7" strokeOpacity="0.1" />
        </g>

        <g className="benchmark-startup-top">
          <path
            d="M106 104L260 22L414 104L260 186L106 104Z"
            fill="currentColor"
            fillOpacity="0.025"
            stroke="currentColor"
            strokeOpacity="0.5"
            strokeWidth="1.2"
          />
          <path
            d="M106 104V126L260 208L414 126V104"
            stroke="currentColor"
            strokeOpacity="0.38"
            strokeWidth="1.2"
          />

          <g className="benchmark-startup-page">
            <path
              d="M176 104L260 59L344 104L260 149L176 104Z"
              fill="currentColor"
              fillOpacity="0.018"
              stroke="currentColor"
              strokeOpacity="0.34"
            />
            <path d="M190 104L260 67L330 104" stroke="currentColor" strokeOpacity="0.24" />
            <path d="M208 108L260 81L312 108" stroke="currentColor" strokeOpacity="0.32" />
            <path d="M222 116L260 96L298 116" stroke="currentColor" strokeOpacity="0.19" />
            <path d="M238 124L260 113L282 124" stroke="currentColor" strokeOpacity="0.11" />
            <circle cx="260" cy="104" fill="currentColor" fillOpacity="0.66" r="2.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function BuildIllustration() {
  return (
    <div
      aria-hidden
      className="benchmark-illustration relative mt-4 flex h-52 items-center justify-center sm:h-56"
    >
      <svg
        className="h-full w-full max-w-[28rem] text-white"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 520 300"
      >
        <g className="benchmark-build-module benchmark-build-module--back">
          <path
            d="M194 72L260 37L326 72L260 107L194 72Z"
            fill="currentColor"
            fillOpacity="0.018"
            stroke="currentColor"
            strokeOpacity="0.24"
          />
          <path d="M194 72V125L260 160L326 125V72" stroke="currentColor" strokeOpacity="0.17" />
        </g>

        <g className="benchmark-build-module benchmark-build-module--left">
          <path
            d="M78 139L149 101L220 139L149 177L78 139Z"
            fill="currentColor"
            fillOpacity="0.022"
            stroke="currentColor"
            strokeOpacity="0.36"
          />
          <path d="M78 139V198L149 236L220 198V139" stroke="currentColor" strokeOpacity="0.25" />
          <path d="M123 139L149 125L175 139" stroke="currentColor" strokeOpacity="0.18" />
        </g>

        <g className="benchmark-build-module benchmark-build-module--right">
          <path
            d="M300 139L371 101L442 139L371 177L300 139Z"
            fill="currentColor"
            fillOpacity="0.018"
            stroke="currentColor"
            strokeOpacity="0.3"
          />
          <path d="M300 139V198L371 236L442 198V139" stroke="currentColor" strokeOpacity="0.2" />
        </g>

        <g className="benchmark-build-output">
          <path
            d="M190 190L260 153L330 190L260 227L190 190Z"
            fill="currentColor"
            fillOpacity="0.035"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="1.2"
          />
          <path
            d="M190 190V242L260 279L330 242V190"
            fill="currentColor"
            fillOpacity="0.012"
            stroke="currentColor"
            strokeOpacity="0.42"
            strokeWidth="1.2"
          />
          <path d="M260 227V279" stroke="currentColor" strokeOpacity="0.28" />
          <path d="M218 190L260 168L302 190" stroke="currentColor" strokeOpacity="0.32" />
          <path d="M231 198L260 183L289 198" stroke="currentColor" strokeOpacity="0.17" />
          <circle cx="260" cy="190" fill="currentColor" fillOpacity="0.68" r="2.5" />
        </g>
      </svg>
    </div>
  );
}

function BenchmarkAreaChart() {
  if (!farmResult) {
    return null;
  }

  const width = 960;
  const height = 500;
  const baselineY = height - 72;
  const series = benchmarkReport.frameworks.map((framework) => {
    const points = getChartPoints(framework, width, height);

    return {
      framework,
      path: buildStepBeforePath(points),
      points,
    };
  });
  const farmSeries = series.find((item) => item.framework.id === "farm");
  const seriesOpacity = {
    farm: "0.95",
    next: "0.24",
    sveltekit: "0.36",
    nuxt: "0.2",
    tanstack: "0.58",
  } as const;
  const foregroundSeries = [...series].sort((a, b) => {
    if (a.framework.id === "farm") {
      return 1;
    }

    if (b.framework.id === "farm") {
      return -1;
    }

    return 0;
  });
  return (
    <div className="relative col-span-full min-h-[40rem] overflow-hidden border-t border-white/12 bg-black">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 max-w-2xl px-6 pt-6 sm:px-12 sm:pt-12">
        <span className="flex items-center gap-2 font-mono text-[10px] font-normal uppercase tracking-normal text-white/46">
          <span className="text-white/44">01.5</span>
          <span aria-hidden className="text-white/18">
            /
          </span>
          <Activity aria-hidden className="size-4" strokeWidth={1.5} />
          Benchmark
        </span>

        <p className="my-6 text-2xl font-medium leading-tight tracking-normal text-white sm:text-3xl">
          Farm.js leads the benchmark app across latency and output size.{" "}
          <span className="text-white/42">
            Raw medians for startup, build, boot, SSR, and HTML.
          </span>
        </p>

        <div className="pointer-events-none flex max-w-2xl flex-wrap gap-2">
          {benchmarkReport.frameworks.map((framework) => (
            <span
              key={framework.id}
              className={
                "inline-flex items-center gap-2 bg-black/45 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-normal backdrop-blur transition-colors duration-200 hover:bg-white/[0.045] hover:text-white " +
                (framework.id === "farm" ? "text-white" : "text-white/48")
              }
            >
              <span
                className={
                  "h-0.5 w-5 " +
                  (framework.id === "farm" || framework.id === "tanstack"
                    ? "bg-current"
                    : "border-t border-dashed border-current")
                }
              />
              {framework.label}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute right-6 top-6 z-10 hidden border border-white/12 bg-black/70 px-3 py-2 font-mono text-[9px] uppercase tracking-normal text-white/44 backdrop-blur sm:block">
        <span className="block text-white/68">X: benchmark set</span>
        <span className="mt-1 block">Y: raw median / lower is better</span>
      </div>

      <div className="relative h-[40rem]">
        <svg
          aria-label="Farm.js benchmark comparison area chart"
          className="absolute inset-x-0 bottom-0 h-full w-full text-white"
          preserveAspectRatio="none"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
        >
          <style>
            {`
              .benchmark-series-line,
              .benchmark-point-ring,
              .benchmark-point-tooltip {
                transition-duration: 260ms;
                transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
              }

              .benchmark-series-line {
                transition-property: stroke-opacity, stroke-width, filter;
              }

              .benchmark-series:hover .benchmark-series-line,
              .benchmark-series:focus-within .benchmark-series-line {
                filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.18));
                stroke-opacity: 0.96;
                stroke-width: 1.95;
              }

              .benchmark-point-ring {
                transition-property: opacity, transform, fill-opacity, stroke-opacity;
                transform-box: fill-box;
                transform-origin: center;
              }

              .benchmark-point:hover .benchmark-point-ring,
              .benchmark-point:focus .benchmark-point-ring {
                fill-opacity: 1;
                opacity: 1;
                stroke-opacity: 1;
                transform: scale(1.22);
              }

              .benchmark-point-tooltip {
                filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.42));
                opacity: 0;
                pointer-events: none;
                transform: translateY(8px);
                transition-property: opacity, transform;
              }

              .benchmark-point:hover .benchmark-point-tooltip,
              .benchmark-point:focus .benchmark-point-tooltip {
                opacity: 1;
                transform: translateY(0);
              }

              @media (prefers-reduced-motion: reduce) {
                .benchmark-series-line,
                .benchmark-point-ring,
                .benchmark-point-tooltip {
                  transition-duration: 1ms;
                }
              }
            `}
          </style>
          <defs>
            <linearGradient id="farmBenchmarkFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.095" />
              <stop offset="58%" stopColor="currentColor" stopOpacity="0.034" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="benchmarkRangeFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
              <stop offset="48%" stopColor="currentColor" stopOpacity="0.016" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="tanstackBenchmarkFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.045" />
              <stop offset="55%" stopColor="currentColor" stopOpacity="0.014" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
            <filter id="benchmarkIconInvert">
              <feComponentTransfer>
                <feFuncR tableValues="1 0" type="table" />
                <feFuncG tableValues="1 0" type="table" />
                <feFuncB tableValues="1 0" type="table" />
              </feComponentTransfer>
            </filter>
          </defs>
          <rect
            fill="url(#benchmarkRangeFill)"
            height={baselineY - chartTopY}
            pointerEvents="none"
            width={width - chartInsetX * 2}
            x={chartInsetX}
            y={chartTopY}
          />
          {[250, 295, 339, 384, 428].map((y) => (
            <line
              key={y}
              stroke="currentColor"
              strokeOpacity="0.045"
              strokeWidth="1"
              x1="0"
              x2={width}
              y1={y}
              y2={y}
            />
          ))}
          {chartMetrics.map(([metric, label], index) => {
            const x =
              chartInsetX +
              (index * (width - chartInsetX * 2)) / Math.max(1, chartMetrics.length - 1);
            const { maximum, minimum } = getMetricExtent(metric);
            const textAnchor =
              index === 0 ? "start" : index === chartMetrics.length - 1 ? "end" : "middle";

            return (
              <g key={label}>
                <text
                  fill="currentColor"
                  fillOpacity="0.34"
                  fontFamily="var(--font-geist-mono, monospace)"
                  fontSize="8"
                  textAnchor={textAnchor}
                  x={x}
                  y={chartTopY + 6}
                >
                  {formatMetricValue(metric, maximum)}
                </text>
                <text
                  fill="currentColor"
                  fillOpacity="0.42"
                  fontFamily="var(--font-geist-mono, monospace)"
                  fontSize="8"
                  textAnchor={textAnchor}
                  x={x}
                  y={baselineY + 2}
                >
                  {formatMetricValue(metric, minimum)}
                </text>
                <text
                  fill="currentColor"
                  fillOpacity="0.48"
                  fontFamily="var(--font-geist-mono, monospace)"
                  fontSize="10"
                  textAnchor={textAnchor}
                  x={x}
                  y={height - 48}
                >
                  {label.toUpperCase()}
                </text>
              </g>
            );
          })}
          {series
            .filter((item) => item.framework.id === "tanstack")
            .map(({ framework, path, points }) => (
              <path
                key={framework.id}
                d={closeAreaPath(path, points, baselineY)}
                fill="url(#tanstackBenchmarkFill)"
                pointerEvents="none"
              />
            ))}
          {farmSeries ? (
            <path
              d={closeCeilingPath(farmSeries.path, farmSeries.points, chartTopY)}
              fill="url(#farmBenchmarkFill)"
              pointerEvents="none"
            />
          ) : null}
          {foregroundSeries.map(({ framework, path }) => {
            const title = chartMetrics
              .map(
                ([key, label]) =>
                  `${label}: ${formatMetricValue(key, framework.metrics[key].median)}`,
              )
              .join(" · ");
            const isFarm = framework.id === "farm";

            return (
              <g key={framework.id} className="benchmark-series group">
                <path
                  className="benchmark-series-line"
                  d={path}
                  fill="none"
                  stroke="white"
                  strokeDasharray={!isFarm && framework.id !== "tanstack" ? "8 8" : undefined}
                  strokeOpacity={seriesOpacity[framework.id]}
                  strokeWidth={isFarm ? "1.45" : framework.id === "tanstack" ? "1.2" : "0.8"}
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  aria-label={`${framework.label} — ${title}`}
                  d={path}
                  fill="none"
                  pointerEvents="stroke"
                  stroke="transparent"
                  strokeWidth={isFarm ? "22" : "20"}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}
          {foregroundSeries.map(({ framework, points }) => (
            <g key={`${framework.id}-points`}>
              {points.map((point) => {
                const tooltipX = getTooltipX(point.x, width);
                const tooltipY = getTooltipY(point.y);
                const isFarm = framework.id === "farm";
                const iconUrl = frameworkIconUrls[framework.id];

                return (
                  <g
                    key={point.metric}
                    aria-label={`${framework.label} · ${point.label}: ${formatMetricValue(
                      point.metric,
                      point.rawValue,
                    )} · Column range ${getColumnRangeLabel(point.metric)}`}
                    className="benchmark-point"
                    role="img"
                    tabIndex={0}
                  >
                    <circle
                      className="benchmark-point-ring"
                      cx={point.x}
                      cy={point.y}
                      fill="black"
                      fillOpacity={isFarm ? "0.82" : "0.74"}
                      r={isFarm ? "3.3" : framework.id === "tanstack" ? "2.6" : "2.1"}
                      stroke="white"
                      strokeOpacity={isFarm ? "0.88" : seriesOpacity[framework.id]}
                      strokeWidth={isFarm ? "1.2" : "1"}
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      fill="white"
                      fillOpacity="0.001"
                      pointerEvents="all"
                      r={isFarm ? "14" : "13"}
                    />
                    <g className="benchmark-point-tooltip">
                      <rect
                        fill="black"
                        fillOpacity={isFarm ? "0.96" : "0.94"}
                        height="62"
                        stroke="white"
                        strokeOpacity={isFarm ? "0.16" : "0.12"}
                        width="226"
                        x={tooltipX}
                        y={tooltipY}
                      />
                      <image
                        filter={isFarm ? undefined : "url(#benchmarkIconInvert)"}
                        height="12"
                        href={iconUrl}
                        opacity={isFarm ? "0.9" : "0.82"}
                        width="12"
                        x={tooltipX + 10}
                        y={tooltipY + 10.5}
                      />
                      <text
                        dominantBaseline="middle"
                        fill="currentColor"
                        fontFamily="var(--font-geist-mono, monospace)"
                        fontSize="8.5"
                        x={tooltipX + 29}
                        y={tooltipY + 17}
                      >
                        {framework.label.toUpperCase()}
                      </text>
                      <text
                        fill="currentColor"
                        fillOpacity={isFarm ? "0.68" : "0.62"}
                        fontFamily="var(--font-geist-mono, monospace)"
                        fontSize="9"
                        x={tooltipX + 10}
                        y={tooltipY + 39}
                      >
                        {point.label.toUpperCase()} MEDIAN ·{" "}
                        {formatMetricValue(point.metric, point.rawValue)}
                      </text>
                      <text
                        fill="currentColor"
                        fillOpacity={isFarm ? "0.52" : "0.48"}
                        fontFamily="var(--font-geist-mono, monospace)"
                        fontSize="8"
                        x={tooltipX + 10}
                        y={tooltipY + 53}
                      >
                        RANGE {getColumnRangeLabel(point.metric)}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function MetricStrip() {
  if (!farmResult) {
    return null;
  }

  return (
    <div className="farm-top-rule grid gap-px bg-white/12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {leadMetrics.map(([key, label]) => {
        const farmValue = farmResult.metrics[key].median;
        const isLead = farmValue === getMetricMinimum(key);
        const rival = isLead ? getBestCompetitor(key) : undefined;
        const ratio = rival
          ? rival.metrics[key].median / farmValue
          : getMetricMinimum(key) / farmValue;

        return (
          <div key={key} className="bg-black px-5 py-4">
            <p className="font-mono text-[8px] font-normal uppercase tracking-normal text-white/42">
              {label}
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-mono text-sm font-medium tabular-nums tracking-normal text-white">
                {formatMetricValue(key, farmValue)}
              </span>
              <span
                className={
                  "font-mono text-[8px] font-normal uppercase tracking-normal " +
                  (isLead ? "text-white/56" : "text-white/34")
                }
              >
                {isLead ? formatRatio(ratio) + " edge" : "near lead"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BenchmarkSection() {
  return (
    <section
      aria-labelledby="framework-benchmark-title"
      className="farm-full-rule w-full"
      id="benchmarks"
    >
      <h2 className="sr-only" id="framework-benchmark-title">
        Framework benchmarks
      </h2>

      <div className="grid bg-black lg:grid-cols-2">
        <ComparisonPanel
          description="Cold dev startup through the first rendered SSR page, measured against the same routed fixture."
          icon={Rocket}
          illustration={<StartupIllustration />}
          label="Startup advantage"
          title={
            <AnimatedComparisonTitle
              lead="Farm gets your first page running"
              metric="devFirstPageMs"
            />
          }
        />
        <div className="border-t border-white/12 lg:border-l lg:border-t-0">
          <ComparisonPanel
            description="A complete production compile of the same SSR project, with generated output ready to boot."
            icon={TimerReset}
            illustration={<BuildIllustration />}
            label="Production build"
            title={<AnimatedComparisonTitle lead="Farm builds the same fixture" metric="buildMs" />}
          />
        </div>

        <BenchmarkAreaChart />
      </div>

      <MetricStrip />
    </section>
  );
}

"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type HeroTitleFrameProps = {
  children: ReactNode;
};

export function HeroTitleFrame({ children }: HeroTitleFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.3 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className="farm-hero-title-frame relative mt-7 w-fit max-w-full px-4 py-4 sm:px-5 sm:py-5"
      data-visible={isVisible}
    >
      <div aria-hidden="true" className="farm-hero-title-frame-border">
        <span className="farm-hero-title-frame-corner farm-hero-title-frame-corner-tl" />
        <span className="farm-hero-title-frame-corner farm-hero-title-frame-corner-tr" />
        <span className="farm-hero-title-frame-corner farm-hero-title-frame-corner-bl" />
        <span className="farm-hero-title-frame-corner farm-hero-title-frame-corner-br" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}


"use client";

import { Code2 } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useRef, useState } from "react";
import { highlight } from "sugar-high";

interface HighlightedCodeProps {
  className?: string;
  code: string;
  highlightLines?: readonly number[];
  label: string;
  language: string;
  prefix?: string;
}

export interface HighlightedCodeTab {
  code: string;
  highlightLines?: readonly number[];
  id: string;
  label: string;
  language: string;
}

interface HighlightedCodeTabsProps {
  className?: string;
  compact?: boolean;
  id: string;
  tabs: readonly [HighlightedCodeTab, ...HighlightedCodeTab[]];
  tabsLabel?: string;
}

function figureClassName(className?: string) {
  return [
    "min-w-0 max-w-full overflow-hidden border border-white/10 bg-black shadow-[0_18px_50px_rgba(0,0,0,0.18)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function HighlightedCodeBody({
  ariaLabel,
  ariaLabelledBy,
  code,
  compact = false,
  highlightLines = [],
  id,
  role,
}: {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  code: string;
  compact?: boolean;
  highlightLines?: readonly number[];
  id?: string;
  role?: "tabpanel";
}) {
  const highlightedLineNumbers = new Set(highlightLines);
  const highlightedCode = highlight(code.trim())
    .split("\n")
    .map((line, index) =>
      highlightedLineNumbers.has(index + 1)
        ? line.replace('class="sh__line"', 'class="sh__line sh__line--highlighted"')
        : line,
    )
    .join("");

  return (
    <pre
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={[
        "min-h-0 max-w-full flex-1 overflow-x-auto font-mono tracking-normal",
        compact
          ? "py-2 text-[10px] leading-5 sm:text-[10.5px]"
          : "py-4 text-[10.5px] leading-6 sm:text-[11px]",
      ].join(" ")}
      id={id}
      role={role}
      tabIndex={0}
    >
      <code
        className={[
          "farm-highlighted-code block min-w-full",
          compact && "farm-highlighted-code--compact",
        ]
          .filter(Boolean)
          .join(" ")}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  );
}

export function HighlightedCode({
  className,
  code,
  highlightLines,
  label,
  language,
  prefix,
}: HighlightedCodeProps) {
  return (
    <figure className={figureClassName(className)}>
      <figcaption className="flex h-10 min-w-0 items-center justify-between gap-4 border-b border-white/8 px-4 font-mono text-[9px] tracking-normal text-white/38">
        <span className="flex min-w-0 items-center gap-2">
          <Code2 aria-hidden className="size-3 shrink-0" strokeWidth={1.5} />
          {prefix ? <span className="shrink-0 font-semibold text-white/72">{prefix}</span> : null}
          <span className="truncate">{label}</span>
        </span>
        <span className="shrink-0 uppercase text-white/24">{language}</span>
      </figcaption>
      <HighlightedCodeBody
        ariaLabel={`${prefix ? `${prefix} ` : ""}${label} code`}
        code={code}
        highlightLines={highlightLines}
      />
    </figure>
  );
}

export function HighlightedCodeTabs({
  className,
  compact = false,
  id,
  tabs,
  tabsLabel = "Code examples",
}: HighlightedCodeTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeTab = tabs[activeIndex] ?? tabs[0];
  const panelId = `${id}-panel`;

  function selectTab(index: number) {
    setActiveIndex(index);
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    selectTab(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <figure className={figureClassName(className)}>
      <figcaption className="flex h-10 min-w-0 items-stretch border-b border-white/8 font-mono text-[8px] tracking-normal text-white/38 sm:text-[9px]">
        <span
          aria-hidden
          className="grid w-9 shrink-0 place-items-center border-r border-white/8 text-white/34"
        >
          <Code2 className="size-3" strokeWidth={1.5} />
        </span>
        <span aria-label={tabsLabel} className="flex min-w-0 flex-1 items-stretch" role="tablist">
          {tabs.map((tab, index) => {
            const tabId = `${id}-${tab.id}-tab`;

            return (
              <button
                key={tab.id}
                aria-controls={panelId}
                aria-selected={activeIndex === index}
                className="relative flex h-full min-w-0 flex-1 items-center justify-center border-r border-white/8 px-2 text-white/34 transition-[background-color,color,box-shadow] duration-150 hover:bg-white/[0.035] hover:text-white/68 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white aria-selected:bg-white/[0.045] aria-selected:text-white/82 aria-selected:shadow-[inset_0_-1px_0_rgba(255,255,255,0.85)]"
                id={tabId}
                onClick={() => selectTab(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                role="tab"
                tabIndex={activeIndex === index ? 0 : -1}
                title={tab.label}
                type="button"
              >
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </span>
        <span className="flex shrink-0 items-center px-3 uppercase text-white/24">
          {activeTab.language}
        </span>
      </figcaption>
      <HighlightedCodeBody
        ariaLabelledBy={`${id}-${activeTab.id}-tab`}
        code={activeTab.code}
        compact={compact}
        highlightLines={activeTab.highlightLines}
        id={panelId}
        role="tabpanel"
      />
    </figure>
  );
}

"use client";

import { Bot, Check, Copy, LoaderCircle, RefreshCw, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import bunIconUrl from "simple-icons/icons/bun.svg?url";
import npmIconUrl from "simple-icons/icons/npm.svg?url";
import pnpmIconUrl from "simple-icons/icons/pnpm.svg?url";
import yarnIconUrl from "simple-icons/icons/yarn.svg?url";

type CommandOption = {
  label: string;
  command: string;
  kind: "install" | "agent";
  brand?: string;
  icon?: LucideIcon;
};

function copyWithSelection(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();
  const didCopy = document.execCommand("copy");
  textarea.remove();
  return didCopy;
}

const commands: readonly CommandOption[] = [
  {
    label: "Agent",
    command: [
      "Farm.js is the framework for modern product-integrated apps. Build this as a production-ready Farm.js product app.",
      "Before editing:",
      "1. Read the Farm.js site skill at https://farmjs.dev/skill.md and the agent working rules at https://farmjs.dev/AGENTS.md.",
      "2. Use https://farmjs.dev/llms.txt as the compact framework map. Start with https://farmjs.dev/docs/getting-started.md, https://farmjs.dev/docs/project-structure.md, and https://farmjs.dev/docs/reference.md, then fetch the smallest task-specific pages linked from the map.",
      "3. Inspect package.json, farm.config.*, src/app, and existing project patterns. Match the installed @farm.js/* versions and verify every import against the current docs. Never invent an export.",
      "Farm.js evolves quickly and may not be represented accurately in your training data, so treat the current docs and installed packages as the source of truth. Do not guess APIs or substitute Next.js or TanStack conventions.",
      "Use Farm's documented App Router, typed APIs and server functions, middleware, Cron, integrations, environment boundaries, data loading and cache, and deployment APIs. If the docs are missing or conflict with the project, report the gap instead of silently improvising with another framework's behavior.",
      "Preserve existing conventions, validate untrusted input, keep secrets server-only, add focused tests, and run typecheck, tests, and a production build before finishing.",
    ].join("\n\n"),
    icon: Bot,
    kind: "agent",
  },
  {
    label: "npm",
    command: "npx @farm.js/create-app@beta my-app --template basic --typescript",
    brand: npmIconUrl,
    kind: "install",
  },
  {
    label: "Yarn",
    command: "yarn dlx @farm.js/create-app@beta my-app --template basic --typescript",
    brand: yarnIconUrl,
    kind: "install",
  },
  {
    label: "pnpm",
    command: "pnpm create @farm.js/app@beta my-app --template basic --typescript",
    brand: pnpmIconUrl,
    kind: "install",
  },
  {
    label: "Bun",
    command: "bunx @farm.js/create-app@beta my-app --template basic --typescript",
    brand: bunIconUrl,
    kind: "install",
  },
];

export function InstallCommand() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "failed">("idle");
  const resetTimer = useRef<number | undefined>(undefined);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeCommand = commands[activeIndex];
  const ActiveCommandIcon = activeCommand.kind === "agent" ? Bot : Terminal;
  const copyTarget = activeCommand.kind === "agent" ? "agent instruction" : "install command";
  const copyLabel =
    copyState === "copying"
      ? "Copying"
      : copyState === "copied"
        ? "Copied"
        : copyState === "failed"
          ? "Retry"
          : "Copy";
  const CopyStateIcon =
    copyState === "copying"
      ? LoaderCircle
      : copyState === "copied"
        ? Check
        : copyState === "failed"
          ? RefreshCw
          : Copy;

  useEffect(() => {
    return () => window.clearTimeout(resetTimer.current);
  }, []);

  function selectCommand(index: number) {
    window.clearTimeout(resetTimer.current);
    setActiveIndex(index);
    setCopyState("idle");
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % commands.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + commands.length) % commands.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = commands.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    selectCommand(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  async function copyCommand() {
    let didCopy = false;
    let clipboardTimer: number | undefined;
    setCopyState("copying");
    const fallbackCopySucceeded = copyWithSelection(activeCommand.command);

    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");

      await Promise.race([
        navigator.clipboard.writeText(activeCommand.command),
        new Promise<never>((_, reject) => {
          clipboardTimer = window.setTimeout(
            () => reject(new Error("Clipboard permission timed out")),
            600,
          );
        }),
      ]);
      didCopy = true;
    } catch {
      didCopy = fallbackCopySucceeded;
    } finally {
      window.clearTimeout(clipboardTimer);
    }

    window.clearTimeout(resetTimer.current);
    setCopyState(didCopy ? "copied" : "failed");
    resetTimer.current = window.setTimeout(() => setCopyState("idle"), 1600);
  }

  return (
    <div className="overflow-hidden border border-white/14 bg-black/95 shadow-[0_12px_36px_rgba(0,0,0,0.34)] backdrop-blur-sm">
      <div
        aria-label="Setup method"
        className="grid min-w-0 grid-cols-5 border-b border-white/10"
        role="tablist"
      >
        {commands.map((item, index) => {
          const TabIcon = item.icon;

          return (
            <button
              key={item.label}
              aria-controls="install-command-panel"
              aria-selected={activeIndex === index}
              className="group relative flex h-7 min-w-0 items-center justify-center gap-1 border-r border-white/10 px-1 font-mono text-[8px] font-normal uppercase tracking-normal text-white/42 transition-[background-color,color] duration-150 last:border-r-0 hover:bg-white/[0.055] hover:text-white focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white aria-selected:bg-white aria-selected:text-black sm:h-8 sm:text-[9px]"
              id={`install-tab-${item.label.toLowerCase()}`}
              onClick={() => selectCommand(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              tabIndex={activeIndex === index ? 0 : -1}
              type="button"
            >
              {item.brand ? (
                <img
                  alt=""
                  aria-hidden="true"
                  className={`size-2.5 shrink-0 select-none transition-[filter,opacity] duration-150 ${
                    activeIndex === index
                      ? "brightness-0 opacity-90"
                      : "brightness-0 invert opacity-48 group-hover:opacity-90"
                  }`}
                  src={item.brand}
                />
              ) : TabIcon ? (
                <TabIcon
                  aria-hidden
                  className={`size-2.5 shrink-0 transition-opacity duration-150 ${
                    activeIndex === index ? "opacity-90" : "opacity-48 group-hover:opacity-90"
                  }`}
                  strokeWidth={1.5}
                />
              ) : null}
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`install-tab-${activeCommand.label.toLowerCase()}`}
        className="grid min-h-9 min-w-0 grid-cols-[2rem_minmax(0,1fr)_auto] items-stretch sm:min-h-10 sm:grid-cols-[2.25rem_minmax(0,1fr)_auto]"
        id="install-command-panel"
        role="tabpanel"
      >
        <span
          aria-hidden
          className="grid place-items-center border-r border-white/10 bg-white/[0.035] text-white/48"
        >
          <ActiveCommandIcon className="size-2.5" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 overflow-hidden">
          <code
            className="flex h-full min-w-0 items-center px-2 font-mono text-[9px] tracking-normal text-white/78 sm:px-2.5 sm:text-[10px]"
            title={activeCommand.command}
          >
            <span aria-hidden className="mr-2 shrink-0 text-white/28">
              {activeCommand.kind === "agent" ? "AI" : "$"}
            </span>
            <span className="min-w-0 truncate whitespace-nowrap">{activeCommand.command}</span>
          </code>
        </div>
        <button
          aria-label={`${copyLabel} ${copyTarget}`}
          className="inline-flex min-w-9 shrink-0 items-center justify-center gap-1 border-l border-white/10 bg-white/[0.025] px-1.5 font-mono text-[8px] font-normal uppercase tracking-normal text-white/48 transition-[background-color,color] duration-150 hover:bg-white/[0.075] hover:text-white focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:min-w-[4.25rem] sm:px-2 sm:text-[9px]"
          onClick={copyCommand}
          title={`${copyLabel} ${copyTarget}`}
          type="button"
        >
          <CopyStateIcon
            aria-hidden
            className={copyState === "copying" ? "size-2.5 animate-spin" : "size-2.5"}
            strokeWidth={1.5}
          />
          <span className="hidden sm:inline">{copyLabel}</span>
          <span aria-live="polite" className="sr-only">
            {copyLabel}
          </span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef } from "react";

export type FlickeringGridProps = {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
};

type GridState = {
  cols: number;
  rows: number;
  squares: Float32Array;
  width: number;
  height: number;
};

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(255, 255, 255)",
  width,
  height,
  className,
  maxOpacity = 0.3,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, cssWidth: number, cssHeight: number): GridState => {
      const dpr = window.devicePixelRatio || 1;
      const context = canvas.getContext("2d");

      canvas.width = Math.ceil(cssWidth * dpr);
      canvas.height = Math.ceil(cssHeight * dpr);
      canvas.style.width = cssWidth + "px";
      canvas.style.height = cssHeight + "px";
      context?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cellSize = squareSize + gridGap;
      const cols = Math.ceil(cssWidth / cellSize);
      const rows = Math.ceil(cssHeight / cellSize);
      const squares = new Float32Array(cols * rows);

      for (let index = 0; index < squares.length; index += 1) {
        squares[index] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, width: cssWidth, height: cssHeight };
    },
    [gridGap, maxOpacity, squareSize],
  );

  const drawGrid = useCallback(
    (context: CanvasRenderingContext2D, grid: GridState) => {
      context.clearRect(0, 0, grid.width, grid.height);

      for (let col = 0; col < grid.cols; col += 1) {
        for (let row = 0; row < grid.rows; row += 1) {
          const opacity = grid.squares[col * grid.rows + row];
          context.globalAlpha = opacity;
          context.fillStyle = color;
          context.fillRect(
            col * (squareSize + gridGap),
            row * (squareSize + gridGap),
            squareSize,
            squareSize,
          );
        }
      }

      context.globalAlpha = 1;
    },
    [color, gridGap, squareSize],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !container || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let grid = setupCanvas(
      canvas,
      width || container.clientWidth,
      height || container.clientHeight,
    );
    let animationFrame: number | undefined;
    let isInView = false;
    let lastFrame = 0;

    const draw = () => drawGrid(context, grid);

    const stop = () => {
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
      animationFrame = undefined;
    };

    const animate = (time: number) => {
      if (!isInView || reducedMotion.matches) {
        stop();
        return;
      }

      const elapsed = time - lastFrame;
      if (elapsed >= 42) {
        const chance = flickerChance * (elapsed / 1000);
        for (let index = 0; index < grid.squares.length; index += 1) {
          if (Math.random() < chance) grid.squares[index] = Math.random() * maxOpacity;
        }
        draw();
        lastFrame = time;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    const start = () => {
      if (animationFrame !== undefined || !isInView || reducedMotion.matches) return;
      lastFrame = performance.now();
      animationFrame = requestAnimationFrame(animate);
    };

    const resize = () => {
      grid = setupCanvas(canvas, width || container.clientWidth, height || container.clientHeight);
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isInView = entry?.isIntersecting ?? false;
      if (isInView) start();
      else stop();
    });
    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        stop();
        draw();
      } else {
        start();
      }
    };

    draw();
    resizeObserver.observe(container);
    intersectionObserver.observe(canvas);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, [drawGrid, flickerChance, height, maxOpacity, setupCanvas, width]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={["relative h-full w-full", className].filter(Boolean).join(" ")}
    >
      <canvas ref={canvasRef} className="pointer-events-none block size-full" />
    </div>
  );
}