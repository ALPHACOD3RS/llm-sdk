<script setup lang="ts">
import { ref } from "vue";
import BrandMark from "./BrandMark.vue";
import FlickeringGrid from "./FlickeringGrid.vue";
import InstallCommand from "./InstallCommand.vue";
import LiveFailover from "./LiveFailover.vue";

const menuOpen = ref(false);

const nav = [
  { index: "01", label: "Guide", href: "/guide/getting-started" },
  { index: "02", label: "Routes", href: "/guide/routes" },
  { index: "03", label: "Fallback", href: "/guide/fallback" },
  { index: "04", label: "API", href: "/api/create-router" },
] as const;

const providers = [
  { brand: "openai", label: "OpenAI" },
  { brand: "anthropic", label: "Anthropic" },
  { brand: "groq", label: "Groq" },
  { brand: "ollama", label: "Ollama" },
  { brand: "mock", label: "Mock" },
  { brand: "compatible", label: "OpenAI-compatible" },
] as const;

const metrics = [
  { label: "Providers", value: "5", note: "openai → mock" },
  { label: "Runtime deps", value: "0", note: "zod optional" },
  { label: "Public api", value: "1 fn", note: "createRouter" },
  { label: "Attempts", value: "per call", note: "full trace" },
  { label: "Cache", value: "ttl + key", note: "in-process" },
  { label: "Cost", value: "per response", note: "usd" },
] as const;

const year = new Date().getFullYear();

const footerGroups = [
  {
    title: "Guide",
    action: ["Read the guide", "/guide/getting-started"] as const,
    links: [
      ["Getting started", "/guide/getting-started"],
      ["Named routes", "/guide/routes"],
      ["Fallback", "/guide/fallback"],
      ["Caching", "/guide/caching"],
    ] as ReadonlyArray<readonly [string, string]>,
  },
  {
    title: "Reference",
    action: ["Browse the API", "/api/create-router"] as const,
    links: [
      ["createRouter", "/api/create-router"],
      ["Response", "/api/response"],
      ["Errors", "/api/errors"],
      ["extract()", "/api/extract"],
    ] as ReadonlyArray<readonly [string, string]>,
  },
  {
    title: "Project",
    action: ["View source", "https://github.com/ALPHACOD3RS/llm-sdk"] as const,
    links: [
      ["GitHub", "https://github.com/ALPHACOD3RS/llm-sdk"],
      ["Testing / mock", "/guide/testing"],
      ["Providers", "/guide/providers"],
      ["Changelog", "/guide/changelog"],
    ] as ReadonlyArray<readonly [string, string]>,
  },
] as const;

const mosaic = [
  { brand: "openai", label: "OpenAI", col: 0, row: 0 },
  { brand: "anthropic", label: "Anthropic", col: 2, row: 0 },
  { brand: "groq", label: "Groq", col: 4, row: 0 },
  { brand: "ollama", label: "Ollama", col: 1, row: 1 },
  { brand: "mock", label: "Mock", col: 3, row: 1 },
  { brand: "compatible", label: "Compatible", col: 0, row: 2 },
  { brand: "vllm", label: "vLLM", col: 2, row: 2 },
  { brand: "lmstudio", label: "LM Studio", col: 4, row: 2 },
  { brand: "together", label: "Together", col: 1, row: 3 },
  { brand: "fireworks", label: "Fireworks", col: 3, row: 3 },
  { brand: "deepseek", label: "DeepSeek", col: 0, row: 4 },
  { brand: "mistral", label: "Mistral", col: 2, row: 4 },
  { brand: "xai", label: "xAI", col: 4, row: 4 },
  { brand: "gemini", label: "Gemini", col: 1, row: 5 },
  { brand: "custom", label: "Your own", col: 3, row: 5 },
] as const;
</script>

<template>
  <div class="llm-home">
    <a
      class="announce llm-mono"
      href="https://github.com/ALPHACOD3RS/llm-sdk"
      rel="noreferrer"
      target="_blank"
    >
      <span class="announce__muted">Open source</span>
      <span class="announce__sep">/</span>
      <span>Zero runtime deps · your keys · your process</span>
    </a>

    <div class="frame">
    <span class="gutter gutter--left" aria-hidden="true" />
    <span class="gutter gutter--right" aria-hidden="true" />

    <header class="header llm-full-rule">
      <div class="header__inner">
        <a class="brand" href="/">
          <span class="brand__mark" aria-hidden="true" />
          <span class="brand__word llm-mono">LLM<span>-SDK</span></span>
        </a>

        <nav class="nav" aria-label="Primary">
          <a v-for="item in nav" :key="item.label" class="nav__link llm-mono" :href="item.href">
            <span class="idx">{{ item.index }}</span>
            <span class="slash">/</span>
            <span>{{ item.label }}</span>
          </a>
        </nav>

        <div class="header__actions">
          <a
            class="icon-btn"
            href="https://github.com/ALPHACOD3RS/llm-sdk"
            aria-label="GitHub"
            rel="noreferrer"
            target="_blank"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path
                d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.8 1.6 2.7 1.1.1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 0 1 1.2-3.2 4.3 4.3 0 0 1 .1-3.2s1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C16.8 4 17.8 4.3 17.8 4.3a4.3 4.3 0 0 1 .1 3.2 4.7 4.7 0 0 1 1.2 3.2c0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"
              />
            </svg>
          </a>
          <a class="llm-btn" href="/guide/getting-started">Docs</a>
        </div>

        <details
          class="mobile"
          :open="menuOpen"
          @toggle="menuOpen = ($event.target as HTMLDetailsElement).open"
        >
          <summary class="icon-btn" aria-label="Menu">
            <span class="sr">Menu</span>
            <svg
              v-if="!menuOpen"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </summary>
          <nav class="mobile__panel" aria-label="Mobile">
            <a
              v-for="item in [...nav, { index: '05', label: 'Docs', href: '/guide/getting-started' }]"
              :key="item.label"
              class="mobile__link llm-mono"
              :href="item.href"
            >
              <span class="idx">{{ item.index }}</span>
              <span class="slash">/</span>
              <span>{{ item.label }}</span>
            </a>
          </nav>
        </details>
      </div>
    </header>

    <!-- HERO — row: copy + live failover, inset from side hatches -->
    <section class="hero llm-full-rule">
      <span class="llm-corner llm-corner--tl" aria-hidden="true" />
      <span class="llm-corner llm-corner--tr" aria-hidden="true" />
      <span class="llm-corner llm-corner--bl" aria-hidden="true" />
      <span class="llm-corner llm-corner--br" aria-hidden="true" />

      <div class="hero__grid llm-hero-flicker" aria-hidden="true">
        <FlickeringGrid :max-opacity="0.22" :flicker-chance="0.3" />
      </div>

      <div class="hero__shell">
        <div class="hero__copy rise">
          <div class="hero__eyebrow llm-mono">
            <span class="idx">00</span>
            <span class="slash">/</span>
            <span>Route · Fallback · Ship</span>
          </div>

          <div class="title-frame">
            <span class="handle handle--tl" aria-hidden="true" />
            <span class="handle handle--tr" aria-hidden="true" />
            <span class="handle handle--bl" aria-hidden="true" />
            <span class="handle handle--br" aria-hidden="true" />
            <span class="handle handle--tm" aria-hidden="true" />
            <span class="handle handle--bm" aria-hidden="true" />
            <span class="handle handle--ml" aria-hidden="true" />
            <span class="handle handle--mr" aria-hidden="true" />
            <h1>
              <span class="line strike-line">
                <span class="word">primary fails.</span>
                <span class="strike" aria-hidden="true" />
              </span>
              <span class="line glow-line">the next one answers.</span>
            </h1>
          </div>

          <p class="hero__lede">
            Automatic fallbacks across OpenAI, Anthropic, Groq, and local models — with attempts,
            cost, and cache on every response.
          </p>

          <div class="hero__cta">
            <a class="llm-btn" href="/guide/getting-started">Get started →</a>
          </div>

          <div class="hero__install">
            <InstallCommand />
          </div>
        </div>

        <div id="live" class="hero__demo rise rise--delay">
          <LiveFailover />
        </div>
      </div>
    </section>

    <section class="rail llm-full-rule" aria-label="Providers">
      <div class="rail__label llm-mono">
        <span class="idx">01</span>
        <span class="slash">/</span>
        <span>Providers</span>
      </div>
      <div class="llm-logo-viewport rail__track">
        <div class="llm-logo-rail" style="--llm-logo-duration: 26s">
          <div
            v-for="copy in 2"
            :key="copy"
            class="rail__copy"
            :aria-hidden="copy === 2 ? true : undefined"
          >
            <span
              v-for="(p, i) in providers"
              :key="`${copy}-${p.label}`"
              class="rail__tile llm-mono"
              :class="{ alt: i % 2 === 0 }"
            >
              <BrandMark :name="p.brand" />
              <span>{{ p.label }}</span>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Tweetable strip -->
    <section class="quote llm-full-rule">
      <p>
        “Quiet model switches get a reputation fast.
        <em>We don't do quiet.</em>”
      </p>
      <span class="llm-mono">res.provider · res.attempts · res.cost</span>
    </section>

    <section class="features llm-full-rule">
      <article class="feature">
        <div class="feature__copy">
          <div class="feature__label llm-mono">
            <span class="idx">02.1</span>
            <span class="slash">/</span>
            <span>Routes</span>
          </div>
          <h2>Name the tradeoff once</h2>
          <p>
            <code>fast</code> / <code>smart</code> / <code>cheap</code> — change models in one
            config object. Typed route names so <code>route("smrt")</code> fails at compile time.
          </p>
        </div>
        <div class="feature__visual llm-feature-spotlight">
          <figure class="panel">
            <figcaption class="panel__cap llm-mono">
              routes.ts
              <span class="panel__right">typed</span>
            </figcaption>
            <pre class="code-block"><code><span class="c-kw">const</span> llm = createRouter({
  routes: {
    <span class="c-key">fast</span>:  { primary: <span class="c-str">"groq/llama-3.3-70b"</span> },
    <span class="c-key">smart</span>: { primary: <span class="c-str">"anthropic/claude-4-5"</span> },
    <span class="c-key">cheap</span>: { primary: <span class="c-str">"openai/gpt-4o-mini"</span> },
  },
  <span class="c-key">default</span>: <span class="c-str">"smart"</span>,
})

<span class="c-kw">await</span> llm.route(<span class="c-str">"fast"</span>).complete(ticket)</code></pre>
          </figure>
        </div>
      </article>

      <article class="feature feature--border">
        <div class="feature__copy">
          <div class="feature__label llm-mono">
            <span class="idx">02.2</span>
            <span class="slash">/</span>
            <span>Library</span>
          </div>
          <h2>Not a gateway. Not a proxy.</h2>
          <p>
            Runs in your process, with your API keys, over <code>fetch</code>. No hop. No signup.
            Nobody else sees your prompts.
          </p>
        </div>
        <div class="feature__visual llm-feature-spotlight">
          <figure class="panel deps">
            <figcaption class="panel__cap llm-mono">
              package.json
              <span class="panel__right ok">clean</span>
            </figcaption>
            <div class="deps__body">
              <div class="deps__row">
                <span class="llm-mono">dependencies</span>
                <span class="badge">&#123;&#125;</span>
              </div>
              <div class="deps__row">
                <span class="llm-mono">peer (optional)</span>
                <span class="badge soft">zod</span>
              </div>
              <div class="deps__stat">
                <strong>0</strong>
                <span class="llm-mono">runtime deps</span>
              </div>
            </div>
          </figure>
        </div>
      </article>

      <article class="feature feature--border">
        <div class="feature__copy">
          <div class="feature__label llm-mono">
            <span class="idx">02.3</span>
            <span class="slash">/</span>
            <span>Cache</span>
          </div>
          <h2>Pay for the same prompt once</h2>
          <p>
            Deterministic key from model plus messages. Set <code>cache: { ttl: "24h" }</code> and
            repeats come back as <code>cached: true</code> at zero cost.
          </p>
        </div>
        <div class="feature__visual llm-feature-spotlight">
          <figure class="panel">
            <figcaption class="panel__cap llm-mono">
              cache
              <span class="panel__right">ttl 24h</span>
            </figcaption>
            <div class="ledger">
              <div class="ledger__row">
                <span class="llm-mono k">call 01</span>
                <span class="llm-mono v">miss</span>
                <span class="llm-mono n">$0.0042</span>
              </div>
              <div class="ledger__row on">
                <span class="llm-mono k">call 02</span>
                <span class="llm-mono v">hit</span>
                <span class="llm-mono n">$0.0000</span>
              </div>
              <div class="ledger__row on">
                <span class="llm-mono k">call 03</span>
                <span class="llm-mono v">hit</span>
                <span class="llm-mono n">$0.0000</span>
              </div>
              <div class="ledger__foot llm-mono">
                <span>res.cached</span>
                <strong>true</strong>
              </div>
            </div>
          </figure>
        </div>
      </article>

      <article class="feature feature--border">
        <div class="feature__copy">
          <div class="feature__label llm-mono">
            <span class="idx">02.4</span>
            <span class="slash">/</span>
            <span>Testing</span>
          </div>
          <h2>Tests without a network</h2>
          <p>
            The <code>mock</code> provider answers from a queue you control — including failures, so
            you can assert the fallback path instead of hoping for it.
          </p>
        </div>
        <div class="feature__visual llm-feature-spotlight">
          <figure class="panel">
            <figcaption class="panel__cap llm-mono">
              router.test.ts
              <span class="panel__right ok">offline</span>
            </figcaption>
            <pre class="code-block"><code><span class="c-kw">const</span> llm = createRouter({
  primary: <span class="c-str">"mock/fail"</span>,
  fallbacks: [<span class="c-str">"mock/ok"</span>],
})

<span class="c-kw">const</span> res = <span class="c-kw">await</span> llm.complete(<span class="c-str">"hi"</span>)

expect(res.provider).toBe(<span class="c-str">"mock"</span>)
expect(res.attempts).toHaveLength(<span class="c-str">2</span>)</code></pre>
          </figure>
        </div>
      </article>
    </section>

    <!-- 03 — what you get back -->
    <section class="compare llm-full-rule" aria-label="Failover and observability">
      <div class="compare__grid">
        <article class="cmp">
          <div class="cmp__label llm-mono">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
              <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3Z" />
            </svg>
            <span class="idx">03.1</span>
            <span class="slash">/</span>
            <span>Failover</span>
          </div>

          <div class="ill" aria-hidden="true">
            <svg viewBox="0 0 320 180" width="100%" height="100%">
              <g fill="none" stroke="rgb(255 255 255 / 0.16)" stroke-width="1">
                <path d="M8 40h60M8 90h60M8 140h60" stroke-dasharray="3 4" />
                <rect x="68" y="24" width="112" height="32" />
                <rect x="68" y="74" width="112" height="32" />
              </g>
              <g fill="none" stroke="rgb(255 255 255 / 0.3)" stroke-width="1">
                <path d="M104 32l12 12M116 32l-12 12" transform="translate(8 4)" />
                <path d="M104 82l12 12M116 82l-12 12" transform="translate(8 4)" />
              </g>
              <rect x="68" y="124" width="112" height="32" fill="rgb(255 255 255 / 0.06)" stroke="rgb(255 255 255 / 0.55)" />
              <path d="M180 140h72" fill="none" stroke="rgb(255 255 255 / 0.55)" />
              <circle cx="256" cy="140" r="5" fill="#fff" />
              <circle cx="256" cy="140" r="12" fill="none" stroke="rgb(255 255 255 / 0.22)" />
              <circle cx="256" cy="140" r="20" fill="none" stroke="rgb(255 255 255 / 0.1)" />
            </svg>
          </div>

          <h3>One outage never reaches your users</h3>
          <p>
            Attempts walk the chain in order and stop at the first success. If every provider is
            down you get <code>AllProvidersFailed</code> with each error attached.
          </p>
        </article>

        <article class="cmp cmp--border">
          <div class="cmp__label llm-mono">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
              <path d="M4 19V5M4 19h16M8 16V9M13 16v-4M18 16V6" />
            </svg>
            <span class="idx">03.2</span>
            <span class="slash">/</span>
            <span>Observability</span>
          </div>

          <div class="ill" aria-hidden="true">
            <svg viewBox="0 0 320 180" width="100%" height="100%">
              <g fill="none" stroke="rgb(255 255 255 / 0.1)">
                <path d="M24 150h272M24 110h272M24 70h272M24 30h272" stroke-dasharray="3 5" />
              </g>
              <g stroke="rgb(255 255 255 / 0.2)" fill="rgb(255 255 255 / 0.04)">
                <rect x="48" y="96" width="34" height="54" />
                <rect x="104" y="120" width="34" height="30" />
                <rect x="160" y="72" width="34" height="78" />
              </g>
              <rect x="216" y="44" width="34" height="106" fill="rgb(255 255 255 / 0.1)" stroke="rgb(255 255 255 / 0.6)" />
              <path d="M24 150h272" stroke="rgb(255 255 255 / 0.35)" />
              <g fill="none" stroke="rgb(255 255 255 / 0.5)" stroke-dasharray="2 4">
                <path d="M65 96h185" />
              </g>
            </svg>
          </div>

          <h3>Every response comes back priced</h3>
          <p>
            <code>usage</code>, <code>cost</code>, <code>latencyMs</code>, <code>cached</code>, and
            the full <code>attempts</code> trace — no wrapper, no vendor dashboard.
          </p>
        </article>
      </div>

      <div class="metrics llm-top-rule">
        <div v-for="m in metrics" :key="m.label" class="metric">
          <p class="llm-mono metric__label">{{ m.label }}</p>
          <div class="metric__row">
            <span class="llm-mono metric__value">{{ m.value }}</span>
            <span class="llm-mono metric__note">{{ m.note }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 04 — model directory -->
    <section class="models llm-full-rule">
      <div class="models__side llm-mono">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
        </svg>
        <span class="idx">04</span>
        <span class="slash">/</span>
        <span>Connected models</span>
      </div>

      <div class="models__main">
        <div class="models__copy">
          <h2>Bring the models you already use</h2>
          <p>
            Start with one provider, add fallbacks when you need them. Any OpenAI-compatible
            endpoint works with a <code>baseUrl</code>, and local models never leave your machine.
          </p>
          <div class="models__cta">
            <a class="llm-btn" href="/guide/providers">Explore providers →</a>
          </div>
        </div>

        <div class="models__visual" aria-hidden="true">
          <div class="mosaic">
            <span class="mosaic__grid" />
            <span
              v-for="tile in mosaic"
              :key="tile.label"
              class="mosaic__tile"
              :style="{ left: `${tile.col * 20}%`, top: `${tile.row * (100 / 6)}%` }"
              :title="tile.label"
            >
              <BrandMark class="mosaic__mark" :name="tile.brand" />
              <span class="mosaic__name llm-mono">{{ tile.label }}</span>
            </span>
            <span class="mosaic__fade mosaic__fade--x" />
            <span class="mosaic__fade mosaic__fade--y" />
          </div>
        </div>
      </div>
    </section>

    <section class="spotlight llm-full-rule">
      <div class="spotlight__side llm-mono">
        <span class="idx">03</span>
        <span class="slash">/</span>
        <span>Five seconds</span>
      </div>
      <div class="spotlight__main">
        <div class="spotlight__copy">
          <h2>One import.<br />One function.</h2>
          <p>
            <code>createRouter</code> is the entire entry point. Model strings, not classes. Same
            option keys at global, route, and call.
          </p>
          <a class="llm-btn" href="/guide/getting-started">Read the guide</a>
        </div>
        <figure class="panel spotlight__code">
          <figcaption class="panel__cap llm-mono">
            basic.ts
            <span class="panel__right">ts</span>
          </figcaption>
          <pre class="code-block"><code><span class="c-kw">import</span> { createRouter } <span class="c-kw">from</span> <span class="c-str">"llm-sdk"</span>

<span class="c-kw">const</span> llm = createRouter({
  primary: <span class="c-str">"anthropic/claude-sonnet-4-5"</span>,
  fallbacks: [<span class="c-str">"openai/gpt-4o"</span>],
})

<span class="c-kw">const</span> res = <span class="c-kw">await</span> llm.complete(<span class="c-str">"Summarise this…"</span>)
console.log(res.provider, res.attempts)</code></pre>
        </figure>
      </div>
    </section>

    <section class="final llm-full-rule">
      <div class="final__copy">
        <h2>Ship the call.<br />Survive the outage.</h2>
        <p>Router · fallbacks · routes · cache · cost — without an agent framework.</p>
      </div>
      <div class="final__bar llm-top-rule">
        <a class="llm-btn" href="/guide/getting-started">Get started</a>
      </div>
    </section>

    <footer class="footer">
      <div class="footer__grid">
        <div class="footer__col">
          <div class="footer__head">
            <span class="brand__mark" aria-hidden="true" />
            <span class="brand__word llm-mono">LLM<span>-SDK</span></span>
          </div>
          <div class="footer__body">
            <p class="llm-mono footer__tag">A TypeScript router for LLM calls that fail over</p>
          </div>
        </div>

        <div v-for="group in footerGroups" :key="group.title" class="footer__col">
          <a class="footer__action llm-mono" :href="group.action[1]">
            <span>{{ group.action[0] }}</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
              <path v-if="group.action[1].startsWith('http')" d="M7 17L17 7M17 7H8m9 0v9" />
              <path v-else d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </a>
          <div class="footer__body">
            <h3 class="llm-mono footer__title">{{ group.title }}</h3>
            <ul class="footer__links">
              <li v-for="[label, href] in group.links" :key="label">
                <a class="llm-mono" :href="href">
                  <span>{{ label }}</span>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
                    <path v-if="href.startsWith('http')" d="M7 17L17 7M17 7H8m9 0v9" />
                    <path v-else d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer__bottom llm-mono">
        <span>© {{ year }} LLM-SDK · MIT</span>
        <span class="footer__meta">
          <span>Built to fail over</span>
          <a class="footer__credit" href="https://farmjs.dev" rel="noreferrer" target="_blank">
            <span>UI inspiration by Farm.js</span>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
              <path d="M7 17L17 7M17 7H8m9 0v9" />
            </svg>
          </a>
        </span>
      </div>
    </footer>
    </div>
  </div>
</template>

<style scoped>
.idx {
  color: rgb(255 255 255 / 0.26);
}
.slash {
  color: rgb(255 255 255 / 0.16);
  margin: 0 0.35rem;
}

.announce {
  display: flex;
  height: 1.4rem;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--llm-line);
  padding: 0 1rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.78);
  background: rgb(255 255 255 / 0.025);
}
.announce__muted {
  color: rgb(255 255 255 / 0.48);
}
.announce__sep {
  color: rgb(255 255 255 / 0.22);
}
.announce:hover {
  background: rgb(255 255 255 / 0.045);
}

.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgb(3 3 3 / 0.92);
  backdrop-filter: blur(18px);
}
.header__inner {
  display: flex;
  height: 2.85rem;
  align-items: stretch;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0 1.25rem;
}
.brand__mark {
  width: 0.55rem;
  height: 0.55rem;
  background: #fff;
  box-shadow: 0 0 12px rgb(255 255 255 / 0.35);
}
.brand__word {
  font-size: 11px;
  color: #fff;
}
.brand__word span {
  color: rgb(255 255 255 / 0.42);
}

.nav {
  display: none;
  flex: 1;
  border-left: 1px solid var(--llm-line);
}
.nav__link {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  border-right: 1px solid var(--llm-line);
  padding: 0 0.9rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.46);
  transition:
    background 140ms,
    color 140ms;
}
@media (hover: hover) and (pointer: fine) {
  .nav__link:hover {
    background: rgb(255 255 255 / 0.04);
    color: #fff;
  }
}

.header__actions {
  display: none;
  margin-left: auto;
  align-items: stretch;
}
.icon-btn {
  display: grid;
  width: 2.85rem;
  place-items: center;
  border: 0;
  border-left: 1px solid var(--llm-line);
  color: rgb(255 255 255 / 0.5);
  background: transparent;
  cursor: pointer;
}
.icon-btn:hover {
  background: rgb(255 255 255 / 0.04);
  color: #fff;
}
.header__actions .llm-btn {
  border: 0;
  border-left: 1px solid var(--llm-line);
  border-radius: 0;
  height: auto;
}

.mobile {
  position: relative;
  margin-left: auto;
  border-left: 1px solid var(--llm-line);
}
.mobile summary {
  list-style: none;
}
.mobile summary::-webkit-details-marker {
  display: none;
}
.mobile__panel {
  position: absolute;
  top: 2.85rem;
  right: -1px;
  width: 100vw;
  border: 1px solid rgb(255 255 255 / 0.14);
  background: #000;
  box-shadow: 0 28px 70px rgb(0 0 0 / 0.65);
}
.mobile__link {
  display: flex;
  height: 3rem;
  align-items: center;
  border-bottom: 1px solid rgb(255 255 255 / 0.1);
  padding: 0 1rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.58);
}
.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.frame {
  position: relative;
}

.hero {
  position: relative;
  overflow: hidden;
}

/* Farm-style hatched side gutters: page content lives between them */
.gutter {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--llm-gutter, 0px);
  z-index: 46;
  pointer-events: none;
}
.gutter::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 4px,
    rgb(255 255 255 / 0.09) 4px,
    rgb(255 255 255 / 0.09) 5px
  );
  /* hatch fill only around the hero, lines keep running down the page */
  mask-image: linear-gradient(to bottom, #000 0 40rem, transparent 52rem);
  -webkit-mask-image: linear-gradient(to bottom, #000 0 40rem, transparent 52rem);
}
.gutter--left {
  left: 0;
  border-right: 1px solid var(--llm-line);
}
.gutter--right {
  right: 0;
  border-left: 1px solid var(--llm-line);
}

.hero__grid {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  height: 20rem;
  pointer-events: none;
  opacity: 0.85;
}

.hero__shell {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 76rem;
  margin: 0 auto;
  padding: 2.75rem 1.5rem 3.5rem;
}

.rise {
  animation: llm-rise 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.rise--delay {
  animation-delay: 140ms;
}

.hero__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-width: 0;
}

.hero__eyebrow {
  font-size: 10px;
  color: rgb(255 255 255 / 0.42);
  margin-bottom: 1.15rem;
}

.title-frame {
  position: relative;
  width: fit-content;
  max-width: 100%;
  padding: 1.2rem 1.25rem 1.3rem;
  border: 1px dashed rgb(255 255 255 / 0.32);
  background: transparent;
}

.handle {
  position: absolute;
  z-index: 2;
  width: 7px;
  height: 7px;
  background: #030303;
  border: 1px solid rgb(255 255 255 / 0.65);
}

.handle--tl {
  top: -4px;
  left: -4px;
}
.handle--tr {
  top: -4px;
  right: -4px;
}
.handle--bl {
  bottom: -4px;
  left: -4px;
}
.handle--br {
  bottom: -4px;
  right: -4px;
}
.handle--tm {
  top: -4px;
  left: 50%;
  margin-left: -3.5px;
}
.handle--bm {
  bottom: -4px;
  left: 50%;
  margin-left: -3.5px;
}
.handle--ml {
  top: 50%;
  left: -4px;
  margin-top: -3.5px;
}
.handle--mr {
  top: 50%;
  right: -4px;
  margin-top: -3.5px;
}

.hero h1 {
  margin: 0;
  font-size: clamp(1.45rem, 4.2vw, 2.85rem);
  font-weight: 550;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #fff;
  text-align: left;
}
.hero h1 .line {
  display: block;
}
.strike-line {
  position: relative;
  display: block;
  width: fit-content;
  max-width: 100%;
  color: rgb(255 255 255 / 0.48);
}
.strike-line .word {
  position: relative;
  z-index: 1;
}
.strike {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  margin-top: -1px;
  background: rgb(255 255 255 / 0.85);
  transform-origin: left center;
  animation: llm-strike 1100ms 450ms cubic-bezier(0.16, 1, 0.3, 1) both;
  z-index: 2;
  pointer-events: none;
}
.glow-line {
  margin-top: 0.05em;
}

.hero__lede {
  margin: 1.25rem 0 0;
  max-width: 30rem;
  font-size: 0.95rem;
  line-height: 1.65;
  color: rgb(255 255 255 / 0.52);
  text-wrap: balance;
}
.hero__cta {
  display: flex;
  margin-top: 1.5rem;
}
.hero__install {
  width: 100%;
  max-width: 28rem;
  margin-top: 1.5rem;
}

.hero__demo {
  width: 100%;
  min-width: 0;
}
.hero__demo :deep(.demo) {
  width: 100%;
  height: auto;
  min-height: 21rem;
}

.rail {
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  height: 4rem;
}
.rail__label {
  display: flex;
  align-items: center;
  border-right: 1px solid var(--llm-line);
  padding: 0 1rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.34);
}
.rail__track {
  min-width: 0;
  overflow: hidden;
}
.rail__copy {
  display: flex;
  height: 4rem;
  flex-shrink: 0;
}
.rail__tile {
  display: flex;
  width: 11.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border-right: 1px solid var(--llm-line);
  font-size: 10px;
  color: rgb(255 255 255 / 0.5);
  background: #000;
  transition:
    background 150ms,
    color 150ms;
}
.rail__tile :deep(.mark) {
  font-size: 15px;
  color: rgb(255 255 255 / 0.72);
  transition: color 150ms;
}
.rail__tile.alt {
  background: rgb(255 255 255 / 0.04);
}
@media (hover: hover) and (pointer: fine) {
  .rail__tile:hover {
    background: rgb(255 255 255 / 0.08);
    color: rgb(255 255 255 / 0.9);
  }
  .rail__tile:hover :deep(.mark) {
    color: #fff;
  }
}

.quote {
  padding: 3.5rem 1.5rem;
  text-align: center;
  background: radial-gradient(ellipse 60% 80% at 50% 0%, rgb(255 255 255 / 0.045), transparent 60%);
}
.quote p {
  margin: 0 auto;
  max-width: 40rem;
  font-size: clamp(1.25rem, 3.5vw, 2rem);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: rgb(255 255 255 / 0.88);
  text-wrap: balance;
}
.quote em {
  font-style: normal;
  color: #fff;
  text-shadow: 0 0 28px rgb(255 255 255 / 0.2);
}
.quote .llm-mono {
  display: inline-block;
  margin-top: 1.15rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.32);
}

.features {
  display: grid;
}
.feature {
  display: flex;
  min-height: 34rem;
  flex-direction: column;
  justify-content: space-between;
}
.feature--border {
  border-top: 1px solid var(--llm-line);
}
.feature__copy {
  padding: 2.5rem 1.5rem;
}
.feature__label {
  font-size: 10px;
  color: rgb(255 255 255 / 0.5);
}
.feature h2 {
  margin: 1.5rem 0 0;
  max-width: 31rem;
  font-size: clamp(1.35rem, 2.6vw, 1.85rem);
  font-weight: 550;
  line-height: 1.18;
  letter-spacing: -0.025em;
  color: #fff;
}
.feature p {
  margin: 0.85rem 0 0;
  max-width: 31rem;
  font-size: 0.95rem;
  line-height: 1.65;
  color: rgb(255 255 255 / 0.48);
}
.feature code {
  font-family: var(--llm-mono);
  font-size: 0.9em;
  color: rgb(255 255 255 / 0.75);
}
.feature__visual {
  display: flex;
  min-height: 23.5rem;
  align-items: flex-end;
  justify-content: flex-end;
  overflow: hidden;
  padding-left: 1.5rem;
}

.panel {
  position: relative;
  z-index: 10;
  display: flex;
  width: 100%;
  height: 23rem;
  margin: 0 -1px -1px 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.14);
  background: #000;
  box-shadow: 0 22px 60px rgb(0 0 0 / 0.35);
}
.panel__cap {
  display: flex;
  height: 2.6rem;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(255 255 255 / 0.12);
  padding: 0 1.05rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.62);
}
.panel__right {
  color: rgb(255 255 255 / 0.28);
}
.panel__right.ok {
  color: rgb(170 255 200 / 0.75);
}

.code-block {
  margin: 0;
  flex: 1;
  overflow: auto;
  padding: 1.15rem 1.15rem 1.25rem;
  font-family: var(--llm-mono);
  font-size: 14.5px;
  line-height: 1.8;
  color: rgb(255 255 255 / 0.84);
  text-align: left;
}
.c-kw {
  color: #fff;
  font-weight: 500;
}
.c-key {
  color: rgb(255 255 255 / 0.9);
}
.c-str {
  color: rgb(255 255 255 / 0.62);
}

.deps__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 0.7rem;
  padding: 1.25rem;
}
.deps__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.85rem;
  border: 1px solid rgb(255 255 255 / 0.1);
  font-size: 10px;
  color: rgb(255 255 255 / 0.48);
}
.badge {
  border: 1px solid rgb(255 255 255 / 0.16);
  padding: 0.18rem 0.4rem;
  font-family: var(--llm-mono);
  font-size: 10px;
  color: #fff;
}
.badge.soft {
  color: rgb(255 255 255 / 0.55);
}
.deps__stat {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-top: 0.35rem;
}
.deps__stat strong {
  font-size: 3.4rem;
  font-weight: 550;
  line-height: 1;
  letter-spacing: -0.05em;
  color: #fff;
}
.deps__stat span {
  font-size: 10px;
  color: rgb(255 255 255 / 0.38);
}

.ledger {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1rem 1.1rem;
  font-size: 11.5px;
}
.ledger__row {
  display: grid;
  grid-template-columns: 4.5rem 1fr auto;
  gap: 0.6rem;
  padding: 0.5rem 0.55rem;
  border: 1px solid rgb(255 255 255 / 0.1);
  color: rgb(255 255 255 / 0.5);
}
.ledger__row .k {
  color: rgb(255 255 255 / 0.72);
}
.ledger__row.on {
  border-color: rgb(255 255 255 / 0.22);
  background: rgb(255 255 255 / 0.055);
}
.ledger__row.on .v {
  color: #fff;
}
.ledger__foot {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: auto;
  border-top: 1px solid rgb(255 255 255 / 0.1);
  padding-top: 0.7rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.34);
}
.ledger__foot strong {
  font-size: 12px;
  color: #fff;
}

.compare__grid {
  display: grid;
}
.cmp {
  display: flex;
  min-height: 27rem;
  flex-direction: column;
  padding: 2rem 1.5rem 2.25rem;
}
.cmp--border {
  border-top: 1px solid var(--llm-line);
}
.cmp__label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.46);
}
.ill {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 11.5rem;
  margin: 1.25rem 0 0;
  mask-image: radial-gradient(ellipse 78% 92% at 50% 50%, #000 62%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 78% 92% at 50% 50%, #000 62%, transparent 100%);
}
.cmp h3 {
  margin: 1.35rem 0 0;
  max-width: 24rem;
  font-size: clamp(1.35rem, 2.6vw, 1.8rem);
  font-weight: 550;
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: #fff;
}
.cmp p {
  margin: 0.8rem 0 0;
  max-width: 26rem;
  font-size: 0.92rem;
  line-height: 1.6;
  color: rgb(255 255 255 / 0.44);
}
.cmp code {
  font-family: var(--llm-mono);
  font-size: 0.9em;
  color: rgb(255 255 255 / 0.75);
}

.metrics {
  display: grid;
  gap: 1px;
  background: var(--llm-line);
}
.metric {
  padding: 0.95rem 1.25rem 1.05rem;
  background: var(--llm-black);
}
.metric__label {
  margin: 0;
  font-size: 9px;
  color: rgb(255 255 255 / 0.42);
}
.metric__row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 0.3rem;
}
.metric__value {
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  text-transform: none;
}
.metric__note {
  font-size: 9px;
  color: rgb(255 255 255 / 0.34);
}

.models {
  display: grid;
}
.models__side {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--llm-line);
  padding: 1.5rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.38);
}
.models__main {
  display: grid;
  align-items: center;
  gap: 2rem;
  overflow: hidden;
  padding: 2.5rem 1.5rem;
}
.models__copy h2 {
  margin: 0;
  max-width: 30rem;
  font-size: clamp(1.6rem, 3.4vw, 2.4rem);
  font-weight: 550;
  line-height: 1.06;
  letter-spacing: -0.035em;
  color: #fff;
}
.models__copy p {
  margin: 1.15rem 0 0;
  max-width: 30rem;
  font-size: 0.95rem;
  line-height: 1.65;
  color: rgb(255 255 255 / 0.46);
}
.models__copy code {
  font-family: var(--llm-mono);
  font-size: 0.9em;
  color: rgb(255 255 255 / 0.75);
}
.models__cta {
  margin-top: 1.85rem;
}
.models__visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mosaic {
  position: relative;
  width: 100%;
  max-width: 18rem;
  aspect-ratio: 5 / 6;
}
.mosaic__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgb(255 255 255 / 0.11) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(255 255 255 / 0.11) 1px, transparent 1px);
  background-size: 20% 16.6667%;
  mask-image: radial-gradient(ellipse at center, #000 68%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 68%, transparent 100%);
}
.mosaic__tile {
  position: absolute;
  display: grid;
  width: 20%;
  height: 16.6667%;
  place-items: center;
  background: rgb(255 255 255 / 0.055);
  transition:
    background 150ms ease,
    color 150ms ease;
}
.mosaic__mark {
  font-size: 26px;
  color: rgb(255 255 255 / 0.6);
  transition:
    color 150ms ease,
    transform 150ms ease;
}
.mosaic__name {
  position: absolute;
  inset-inline: 3px;
  bottom: 3px;
  font-size: 7px;
  text-align: center;
  color: rgb(0 0 0 / 0.55);
  opacity: 0;
  transform: translateY(3px);
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
@media (hover: hover) and (pointer: fine) {
  .mosaic__tile:hover {
    z-index: 3;
    background: #fff;
  }
  .mosaic__tile:hover .mosaic__mark {
    color: #000;
    transform: translateY(-4px);
  }
  .mosaic__tile:hover .mosaic__name {
    opacity: 1;
    transform: translateY(0);
  }
}

.mosaic__fade {
  position: absolute;
  z-index: 2;
  pointer-events: none;
}
.mosaic__fade--x {
  inset-block: 0;
  right: 0;
  width: 22%;
  background: linear-gradient(to left, var(--llm-black), rgb(3 3 3 / 0.6), transparent);
}
.mosaic__fade--y {
  inset-inline: 0;
  bottom: 0;
  height: 18%;
  background: linear-gradient(to top, var(--llm-black), rgb(3 3 3 / 0.6), transparent);
}

.spotlight {
  display: grid;
}
.spotlight__side {
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid var(--llm-line);
  padding: 2rem 1.5rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.34);
}
.spotlight__main {
  display: grid;
  gap: 2rem;
  padding: 2.5rem 1.5rem;
}
.spotlight__copy h2 {
  margin: 0;
  font-size: clamp(1.7rem, 3.5vw, 2.5rem);
  font-weight: 550;
  line-height: 1.06;
  letter-spacing: -0.035em;
  color: #fff;
}
.spotlight__copy p {
  margin: 1.15rem 0 1.5rem;
  max-width: 28rem;
  font-size: 0.95rem;
  line-height: 1.65;
  color: rgb(255 255 255 / 0.48);
}
.spotlight__copy code {
  font-family: var(--llm-mono);
  font-size: 0.9em;
  color: rgb(255 255 255 / 0.75);
}
.spotlight__code {
  height: auto;
  min-height: 22.5rem;
  margin: 0;
}

.final__copy {
  padding: 3.5rem 1.5rem;
  text-align: center;
}
.final__copy h2 {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  font-weight: 550;
  line-height: 1.08;
  letter-spacing: -0.035em;
  color: #fff;
}
.final__copy p {
  margin: 0.85rem auto 0;
  max-width: 28rem;
  color: rgb(255 255 255 / 0.45);
}
.final__bar {
  display: flex;
  justify-content: center;
  background: rgb(255 255 255 / 0.035);
  padding: 1.15rem;
}

.footer__grid {
  display: grid;
  border-top: 1px solid var(--llm-line);
}
.footer__col {
  border-bottom: 1px solid var(--llm-line);
}
.footer__col:last-child {
  border-bottom: 0;
}
.footer__head,
.footer__action {
  display: flex;
  height: 3rem;
  align-items: center;
  gap: 0.6rem;
  border-bottom: 1px solid var(--llm-line);
  padding: 0 1rem;
  font-size: 9px;
}
.footer__action {
  justify-content: space-between;
  color: rgb(255 255 255 / 0.58);
  transition:
    background 150ms,
    color 150ms;
}
.footer__action svg {
  color: rgb(255 255 255 / 0.3);
  transition:
    color 150ms,
    transform 150ms;
}
@media (hover: hover) and (pointer: fine) {
  .footer__action:hover {
    background: rgb(255 255 255 / 0.035);
    color: #fff;
  }
  .footer__action:hover svg {
    color: rgb(255 255 255 / 0.72);
    transform: translateX(2px);
  }
}
.footer__body {
  padding: 1rem;
}
.footer__tag {
  margin: 0;
  max-width: 15rem;
  font-size: 9px;
  line-height: 1.7;
  color: rgb(255 255 255 / 0.42);
}
.footer__title {
  margin: 0 0 0.5rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.34);
}
.footer__links {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.footer__links a {
  display: flex;
  min-height: 1.85rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 9px;
  color: rgb(255 255 255 / 0.48);
  transition: color 150ms;
}
.footer__links svg {
  color: transparent;
  transition:
    color 150ms,
    transform 150ms;
}
@media (hover: hover) and (pointer: fine) {
  .footer__links a:hover {
    color: #fff;
  }
  .footer__links a:hover svg {
    color: rgb(255 255 255 / 0.56);
    transform: translateX(2px);
  }
}
.footer__bottom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid var(--llm-line);
  padding: 0.95rem 1.5rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.26);
}
.footer__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.15rem;
}
.footer__credit {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: rgb(255 255 255 / 0.34);
  transition: color 150ms;
}
.footer__credit svg {
  color: rgb(255 255 255 / 0.22);
  transition:
    color 150ms,
    transform 150ms;
}
@media (hover: hover) and (pointer: fine) {
  .footer__credit:hover {
    color: #fff;
  }
  .footer__credit:hover svg {
    color: rgb(255 255 255 / 0.6);
    transform: translate(1px, -1px);
  }
}

@media (min-width: 640px) {
  .rail {
    grid-template-columns: 14rem minmax(0, 1fr);
  }
  .rail__label {
    padding: 0 2rem;
  }
  .hero__shell {
    padding: 3.25rem 2.5rem 4.25rem;
  }
  .title-frame {
    padding: 1.45rem 1.75rem 1.55rem;
  }
  .hero__grid {
    height: 24rem;
  }
  .feature__copy {
    padding: 2.5rem 2.5rem 1.5rem;
  }
  .feature__visual {
    padding-left: 2.5rem;
  }
  .quote {
    padding: 4rem 2.5rem;
  }
  .footer__bottom {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .cmp {
    padding: 2.25rem 2rem 2.5rem;
  }
  .metrics {
    grid-template-columns: 1fr 1fr;
  }
  .models__side {
    padding: 2rem 1.5rem;
  }
  .models__main {
    padding: 3rem 2.5rem;
  }
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }
  .footer__col:nth-last-child(-n + 2) {
    border-bottom: 0;
  }
  .footer__col:nth-child(2n) {
    border-left: 1px solid var(--llm-line);
  }
}

@media (min-width: 1024px) {
  .nav,
  .header__actions {
    display: flex;
  }
  .mobile {
    display: none;
  }
  .frame {
    --llm-gutter: 4rem;
    padding-inline: var(--llm-gutter);
  }
  .gutter {
    display: block;
  }
  .hero__shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: 3rem;
    padding: 3.5rem 2.5rem 4.5rem;
  }
  .hero__demo {
    align-self: center;
  }
  .features {
    grid-template-columns: 1fr 1fr;
  }
  .feature--border {
    border-top: 0;
    border-left: 1px solid var(--llm-line);
  }
  .feature__copy {
    padding: 2.75rem 2.75rem 1.75rem;
  }
  .compare__grid {
    grid-template-columns: 1fr 1fr;
  }
  .cmp {
    padding: 2.5rem;
  }
  .cmp--border {
    border-top: 0;
    border-left: 1px solid var(--llm-line);
  }
  .metrics {
    grid-template-columns: repeat(3, 1fr);
  }
  .models {
    grid-template-columns: 14rem minmax(0, 1fr);
  }
  .models__side {
    align-items: flex-start;
    border-bottom: 0;
    border-right: 1px solid var(--llm-line);
    padding: 2.5rem 1.5rem;
  }
  .models__main {
    grid-template-columns: minmax(0, 1fr) 20rem;
    gap: 2.5rem;
    min-height: 27rem;
    padding: 3rem 3.25rem;
  }
  .models__visual {
    height: 100%;
    justify-content: flex-end;
  }
  .mosaic {
    width: 21rem;
    max-width: none;
    transform: translateX(2.5rem);
  }
  .footer__grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .footer__col {
    border-bottom: 0;
  }
  .footer__col + .footer__col {
    border-left: 1px solid var(--llm-line);
  }
  .footer__body {
    min-height: 9.5rem;
  }
  .spotlight {
    grid-template-columns: 14rem minmax(0, 1fr);
  }
  .spotlight__side {
    border-bottom: 0;
    border-right: 1px solid var(--llm-line);
    padding: 2.5rem 1.5rem;
  }
  .spotlight__main {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    align-items: center;
    gap: 2.5rem;
    min-height: 26rem;
    padding: 3rem 3.25rem;
  }
}

@media (min-width: 1280px) {
  .frame {
    --llm-gutter: 4.25rem;
  }
  .hero__shell {
    padding-left: 3rem;
    padding-right: 3rem;
  }
  .metrics {
    grid-template-columns: repeat(6, 1fr);
  }
  .models__main {
    grid-template-columns: minmax(0, 1fr) 22rem;
  }
  .mosaic {
    width: 24rem;
    transform: translateX(3.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rise,
  .strike {
    animation: none !important;
  }
  .strike {
    transform: scaleX(1);
  }
}
</style>
