<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

const routes = [
  { key: "fast", model: "groq/llama-3.3-70b" },
  { key: "smart", model: "anthropic/claude-sonnet-4-5" },
  { key: "cheap", model: "openai/gpt-4o-mini" },
] as const;

const route = ref<(typeof routes)[number]["key"]>("fast");
const current = computed(() => routes.find((r) => r.key === route.value) ?? routes[0]);

const install = "npm i llm-sdk-js";
const snippets = {
  npm: install,
  cta: install,
  code: `import { createRouter } from "llm-sdk-js"

const llm = createRouter({
  primary: "anthropic/claude-sonnet-4-5",
  fallbacks: ["openai/gpt-4o"],
})

const res = await llm.complete("Summarise this.")
console.log(res.provider, res.attempts)`,
};

const copied = ref<"" | keyof typeof snippets>("");
let timer: ReturnType<typeof setTimeout> | undefined;

function copy(key: keyof typeof snippets) {
  navigator.clipboard?.writeText(snippets[key]).catch(() => {});
  copied.value = key;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = ""), 1600);
}

onBeforeUnmount(() => clearTimeout(timer));

const year = new Date().getFullYear();
</script>

<template>
<div class="lp" style="line-height:normal; min-height:100vh; font-family:'Geist',ui-sans-serif,system-ui,sans-serif; color:#EDEDED; background:#0A0A0A; -webkit-font-smoothing:antialiased; overflow-x:hidden">

<!-- ANNOUNCEMENT -->
<div style="border-bottom:1px solid #1F1F1F; padding:9px 16px; display:flex; justify-content:center; flex-wrap:wrap; gap:6px 14px; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#A1A1A1">
<span>Open source</span><span aria-hidden="true" style="color:#3A3A3A">/</span><span style="color:#FFFFFF">Zero runtime deps</span><span aria-hidden="true" style="color:#3A3A3A">/</span><span>Your keys</span><span aria-hidden="true" style="color:#3A3A3A">/</span><span>Your process</span>
</div>

<!-- NAV -->
<header style="position:sticky; top:0; z-index:30; background:rgba(10,10,10,.82); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-bottom:1px solid #1F1F1F">
<div style="max-width:1240px; margin:0 auto; padding:0 20px; height:60px; display:flex; align-items:center; justify-content:space-between; gap:16px">
<a href="#top" aria-label="LLM-SDK home" style="display:flex; align-items:center; gap:10px; font-family:'Geist Mono',ui-monospace,monospace; font-size:13px; letter-spacing:.08em">
<span aria-hidden="true" style="position:relative; width:16px; height:16px; border:1px solid #FFFFFF; display:inline-block"><span style="position:absolute; inset:3px; background:#FFFFFF"></span></span>
LLM-SDK
</a>
<nav class="navlinks" aria-label="Primary" style="align-items:center; gap:2px; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.08em; text-transform:uppercase">
<a class="navlink" href="#features" style="display:flex; align-items:center; gap:8px; height:44px; padding:0 14px; color:#A1A1A1"><span style="color:#5E5E5E">01</span>Features</a>
<a class="navlink" href="#providers" style="display:flex; align-items:center; gap:8px; height:44px; padding:0 14px; color:#A1A1A1"><span style="color:#5E5E5E">02</span>Providers</a>
<a class="navlink" href="/guide/getting-started" style="display:flex; align-items:center; gap:8px; height:44px; padding:0 14px; color:#A1A1A1"><span style="color:#5E5E5E">03</span>Guide</a>
<a class="navlink" href="https://github.com/ALPHACOD3RS/llm-sdk" rel="noreferrer" style="display:flex; align-items:center; gap:8px; height:44px; padding:0 14px; color:#A1A1A1"><span style="color:#5E5E5E">04</span>GitHub</a>
</nav>
<a class="btn" href="/guide/getting-started" style="display:inline-flex; align-items:center; height:40px; padding:0 16px; background:#EDEDED; color:#0A0A0A; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; font-weight:500; letter-spacing:.1em; text-transform:uppercase">Docs</a>
</div>
</header>

<!-- HERO -->
<section id="top" style="position:relative; overflow:hidden; border-bottom:1px solid #1F1F1F">
<div aria-hidden="true" style="position:absolute; inset:0; background-image:linear-gradient(#151515 1px, transparent 1px), linear-gradient(90deg, #151515 1px, transparent 1px); background-size:64px 64px; -webkit-mask-image:radial-gradient(ellipse 60% 55% at 50% 30%, #000 20%, transparent 75%); mask-image:radial-gradient(ellipse 60% 55% at 50% 30%, #000 20%, transparent 75%)"></div>
<div style="position:relative; max-width:1240px; margin:0 auto; border-left:1px solid #1F1F1F; border-right:1px solid #1F1F1F; padding:clamp(72px,10vw,136px) 20px clamp(64px,8vw,104px); display:flex; flex-direction:column; align-items:center; text-align:center">

<a href="#features" style="display:inline-flex; align-items:stretch; border:1px solid #2A2A2A; background:#0D0D0D; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; animation:lp-rise .6s ease both">
<span style="padding:7px 10px; background:#FFFFFF; color:#0A0A0A; font-weight:500">Open source</span>
<span style="padding:7px 12px; color:#C8C8C8">Route · Fallback · Ship</span>
</a>

<h1 style="margin:34px 0 0; max-width:1000px; font-size:clamp(2.75rem,8vw,6.5rem); font-weight:500; line-height:.98; letter-spacing:-.055em; text-wrap:balance; animation:lp-rise .7s .08s ease both">LLM calls that <span style="color:#FFFFFF; text-shadow:0 0 48px rgba(255,255,255,.45)">never</span> <span style="color:#5A5A5A">go&nbsp;down.</span></h1>

<p style="margin:28px 0 0; max-width:560px; font-size:clamp(16px,1.6vw,19px); line-height:1.55; color:#A1A1A1; text-wrap:pretty; animation:lp-rise .7s .16s ease both">Automatic fallbacks across OpenAI, Anthropic, Groq and local models — with attempts, cost and cache on every response.</p>

<div style="margin-top:36px; display:flex; flex-wrap:wrap; justify-content:center; gap:12px; animation:lp-rise .7s .24s ease both">
<a class="btn" href="/guide/getting-started" style="display:inline-flex; align-items:center; gap:10px; height:52px; padding:0 24px; background:#EDEDED; color:#0A0A0A; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; font-weight:500; letter-spacing:.1em; text-transform:uppercase; box-shadow:0 0 28px -4px rgba(255,255,255,0.300)">Get started
<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 8h11M9 4l4 4-4 4"></path></svg>
</a>
<div style="display:flex; align-items:center; height:52px; border:1px solid #2A2A2A; background:#0D0D0D; font-family:'Geist Mono',ui-monospace,monospace; font-size:13px; max-width:100%">
<span style="padding:0 10px 0 18px; color:#6E6E6E">$</span>
<span style="white-space:nowrap">npm i llm-sdk-js</span>
<button type="button" @click="copy('npm')" :style="{ color: copied === 'npm' ? '#FFFFFF' : '#A1A1A1' }" aria-label="Copy install command" style="margin-left:16px; height:100%; min-width:80px; padding:0 14px; border:0; border-left:1px solid #2A2A2A; background:transparent; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; cursor:pointer">{{ copied === 'npm' ? 'COPIED' : 'COPY' }}</button>
</div>
</div>

<!-- relay -->
<div style="position:relative; width:100%; max-width:1060px; margin-top:clamp(56px,7vw,88px); padding:10px; border:1px solid #262626; background:#0D0D0D; box-shadow:0 0 0 1px rgba(255,255,255,0.030), 0 40px 140px -40px rgba(255,255,255,0.160); animation:lp-rise .8s .32s ease both">
<span aria-hidden="true" style="position:absolute; top:-6px; left:-6px; width:11px; height:11px; border-top:1px solid #FFFFFF; border-left:1px solid #FFFFFF"></span>
<span aria-hidden="true" style="position:absolute; top:-6px; right:-6px; width:11px; height:11px; border-top:1px solid #FFFFFF; border-right:1px solid #FFFFFF"></span>
<span aria-hidden="true" style="position:absolute; bottom:-6px; left:-6px; width:11px; height:11px; border-bottom:1px solid #FFFFFF; border-left:1px solid #FFFFFF"></span>
<span aria-hidden="true" style="position:absolute; bottom:-6px; right:-6px; width:11px; height:11px; border-bottom:1px solid #FFFFFF; border-right:1px solid #FFFFFF"></span>
<div aria-hidden="true" style="position:absolute; top:-1px; left:0; right:0; height:1px; overflow:hidden">
<span style="position:absolute; top:0; width:20%; height:1px; background:linear-gradient(90deg, transparent, #FFFFFF, transparent); animation:lp-travel 4s linear infinite"></span>
</div>
<div style="display:flex; justify-content:space-between; gap:12px; padding:4px 6px 12px; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585">
<span style="display:inline-flex; align-items:center; gap:8px"><span aria-hidden="true" style="width:6px; height:6px; background:#FFFFFF; animation:lp-blink 1.2s steps(1) infinite"></span>Live failover</span>
<span class="hide-sm">await llm.complete("Summarise this.")</span>
</div>
<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(min(210px,100%),1fr)); gap:10px; text-align:left">

<div style="padding:20px; border:1px solid #262626; background:#0A0A0A; display:flex; flex-direction:column; gap:26px">
<div style="display:flex; justify-content:space-between; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.1em; color:#858585"><span>01 · REQUEST</span><span aria-hidden="true">→</span></div>
<div style="display:flex; flex-direction:column; gap:6px">
<span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:14px">llm.complete()</span>
<span style="font-size:13px; color:#858585">"Summarise this."</span>
</div>
</div>

<div style="padding:20px; border:1px solid #262626; background:#0A0A0A; display:flex; flex-direction:column; gap:26px; animation:lp-failstep 4s ease infinite">
<div style="display:flex; justify-content:space-between; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.1em; color:#858585"><span>02 · PRIMARY</span><span>✕ 503</span></div>
<div style="display:flex; flex-direction:column; gap:6px">
<span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:14px; color:#6E6E6E; text-decoration:line-through">openai/gpt-4o</span>
<span style="font-size:13px; color:#858585">Unavailable — moving on</span>
</div>
</div>

<div style="padding:20px; border:1px solid #262626; background:#0A0A0A; display:flex; flex-direction:column; gap:26px; animation:lp-okstep 4s ease infinite">
<div style="display:flex; justify-content:space-between; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.1em; color:#858585"><span>03 · FALLBACK</span><span style="color:#FFFFFF">✓ 200</span></div>
<div style="display:flex; flex-direction:column; gap:6px">
<span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:14px; color:#FFFFFF">anthropic/claude-sonnet-4-5</span>
<span style="font-size:13px; color:#C8C8C8">Answered</span>
</div>
</div>

<div style="padding:20px; border:1px solid #FFFFFF; background:#EDEDED; color:#0A0A0A; display:flex; flex-direction:column; gap:26px">
<div style="display:flex; justify-content:space-between; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.1em; color:#4A4A4A"><span>04 · RESPONSE</span><span aria-hidden="true">■</span></div>
<div style="display:flex; flex-wrap:wrap; gap:6px 14px; font-family:'Geist Mono',ui-monospace,monospace; font-size:13px">
<span>2 attempts</span><span>$0.0042</span><span>412ms</span>
</div>
</div>

</div>
</div>
<p style="margin:18px 0 0; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585">Your user never sees step 02.</p>

</div>
</section>

<!-- PROVIDERS -->
<section id="providers" aria-label="Supported providers" style="border-bottom:1px solid #1F1F1F">
<div style="max-width:1240px; margin:0 auto; border-left:1px solid #1F1F1F; border-right:1px solid #1F1F1F; display:grid; grid-template-columns:repeat(auto-fit,minmax(min(150px,100%),1fr)); gap:1px; background:#1F1F1F">
<div style="background:#0A0A0A; padding:22px 20px; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585">Works with</div>
<div style="background:#0A0A0A; padding:22px 20px; display:flex; align-items:center; gap:10px; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase"><span aria-hidden="true" style="width:8px; height:8px; border:1px solid #FFFFFF"></span>OpenAI</div>
<div style="background:#0A0A0A; padding:22px 20px; display:flex; align-items:center; gap:10px; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase"><span aria-hidden="true" style="width:8px; height:8px; background:#FFFFFF"></span>Anthropic</div>
<div style="background:#0A0A0A; padding:22px 20px; display:flex; align-items:center; gap:10px; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase"><span aria-hidden="true" style="width:8px; height:8px; border:1px solid #FFFFFF; transform:rotate(45deg)"></span>Groq</div>
<div style="background:#0A0A0A; padding:22px 20px; display:flex; align-items:center; gap:10px; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase"><span aria-hidden="true" style="width:8px; height:8px; background:#FFFFFF; transform:rotate(45deg)"></span>Ollama</div>
<div style="background:#0A0A0A; padding:22px 20px; display:flex; align-items:center; gap:10px; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase"><span aria-hidden="true" style="width:8px; height:8px; border:1px dashed #FFFFFF"></span>Mock</div>
<div style="background:#0A0A0A; padding:22px 20px; display:flex; align-items:center; gap:10px; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase"><span aria-hidden="true" style="width:8px; height:8px; border:1px solid #FFFFFF; box-shadow:3px 3px 0 #5A5A5A"></span>OpenAI-compat.</div>
</div>
</section>

<!-- BENTO -->
<section id="features" style="border-bottom:1px solid #1F1F1F">
<div style="max-width:1240px; margin:0 auto; border-left:1px solid #1F1F1F; border-right:1px solid #1F1F1F; padding:clamp(64px,8vw,112px) clamp(16px,2.5vw,32px)">
<div style="display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:20px 40px; margin-bottom:clamp(36px,5vw,56px)">
<div style="display:flex; flex-direction:column; gap:18px; max-width:640px">
<span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:#858585"><span style="color:#FFFFFF">01</span> / Features</span>
<h2 style="margin:0; font-size:clamp(2rem,4.6vw,3.5rem); font-weight:500; line-height:1.02; letter-spacing:-.045em; text-wrap:balance">Everything a model call needs. Nothing it doesn’t.</h2>
</div>
<p style="margin:0; max-width:340px; font-size:15px; line-height:1.6; color:#A1A1A1">Routes, fallbacks, cache, cost and test doubles — one function, in your own code.</p>
</div>

<div style="display:flex; flex-direction:column; gap:12px">

<!-- ROW 1 · ISOMETRIC -->
<div style="position:relative; display:grid; grid-template-columns:repeat(auto-fit,minmax(min(330px,100%),1fr)); gap:1px; background:#1F1F1F; border:1px solid #262626; box-shadow:0 0 70px -24px rgba(255,255,255,0.140)">
<span aria-hidden="true" style="position:absolute; top:-6px; left:-6px; width:11px; height:11px; border-top:1px solid #FFFFFF; border-left:1px solid #FFFFFF; z-index:1"></span>
<span aria-hidden="true" style="position:absolute; bottom:-6px; right:-6px; width:11px; height:11px; border-bottom:1px solid #FFFFFF; border-right:1px solid #FFFFFF; z-index:1"></span>

<article class="iso" style="background:#0C0C0C; display:flex; flex-direction:column; min-width:0">
<div class="stage" style="min-height:300px; padding:36px 22px 18px; display:flex; align-items:center; justify-content:center; background-image:radial-gradient(#181818 1px, transparent 1px); background-size:20px 20px; transition:box-shadow .3s">
<svg role="img" aria-label="Isometric diagram: your app sends a request to llm-sdk; openai fails with 503, groq times out, anthropic answers with 200" viewBox="-149.3 -124 359 228.2" width="100%" style="display:block; max-height:300px; overflow:visible"><path d="M-91.5 -56.8 L0 -4" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="3 4" style="animation:lp-isodash 1.1s linear infinite;filter:drop-shadow(0 0 4px rgba(255,255,255,.6))"></path><path d="M0 -4 L91.5 -56.8" fill="none" stroke="#4A4A4A" stroke-width="1" stroke-dasharray="3 4"></path><path d="M0 -4 L91.5 48.8" fill="none" stroke="#4A4A4A" stroke-width="1" stroke-dasharray="3 4"></path><path d="M0 -4 L-91.5 48.8" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="3 4" style="animation:lp-isodash 1.1s linear infinite;filter:drop-shadow(0 0 4px rgba(255,255,255,.6))"></path><path d="M-87.6 -71.5 L-30.5 -38.5 L-70.5 -15.4 L-127.7 -48.4 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-91.5 -81.4 L-55.3 -60.5 L-91.5 -39.6 L-127.7 -60.5 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-55.3 -60.5 L-91.5 -39.6 L-91.5 -31.9 L-55.3 -52.8 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-127.7 -60.5 L-91.5 -39.6 L-91.5 -31.9 L-127.7 -52.8 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-91.5 -76.6 L-63.6 -60.5 L-91.5 -44.4 L-119.3 -60.5 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="-101.6" cy="-41.6" r="1.6" fill="#5A5A5A"></circle><circle cx="-81.3" cy="-41.6" r="1.6" fill="#5A5A5A"></circle><path d="M-91.5 -90.2 L-74.3 -80.3 L-91.5 -70.4 L-108.6 -80.3 Z" fill="#2C2C2C" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-74.3 -80.3 L-91.5 -70.4 L-91.5 -50.6 L-74.3 -60.5 Z" fill="#161616" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-108.6 -80.3 L-91.5 -70.4 L-91.5 -50.6 L-108.6 -60.5 Z" fill="#1F1F1F" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M95.3 -71.5 L152.4 -38.5 L112.4 -15.4 L55.3 -48.4 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M91.5 -81.4 L127.7 -60.5 L91.5 -39.6 L55.3 -60.5 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M127.7 -60.5 L91.5 -39.6 L91.5 -31.9 L127.7 -52.8 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M55.3 -60.5 L91.5 -39.6 L91.5 -31.9 L55.3 -52.8 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M91.5 -76.6 L119.3 -60.5 L91.5 -44.4 L63.6 -60.5 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="81.3" cy="-41.6" r="1.6" fill="#5A5A5A"></circle><circle cx="101.6" cy="-41.6" r="1.6" fill="#5A5A5A"></circle><path d="M91.5 -77 L91.5 -110" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M91.5 -77 L120 -60.5" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M91.5 -77 L62.9 -60.5" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M91.5 -110 L120 -93.5 L91.5 -77 L62.9 -93.5 Z" fill="rgba(255,255,255,.025)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M120 -93.5 L91.5 -77 L91.5 -44 L120 -60.5 Z" fill="rgba(255,255,255,.01)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M62.9 -93.5 L91.5 -77 L91.5 -44 L62.9 -60.5 Z" fill="rgba(255,255,255,.015)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M91.5 -84.3 L105.2 -76.3 L91.5 -68.4 L77.7 -76.3 Z" fill="#2C2C2C" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M105.2 -76.3 L91.5 -68.4 L91.5 -52.6 L105.2 -60.5 Z" fill="#161616" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M77.7 -76.3 L91.5 -68.4 L91.5 -52.6 L77.7 -60.5 Z" fill="#1F1F1F" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M62.9 -93.5 L91.5 -77 L91.5 -44 L62.9 -60.5 Z" fill="rgba(255,255,255,.03)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M120 -93.5 L91.5 -77 L91.5 -44 L120 -60.5 Z" fill="rgba(255,255,255,.02)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M91.5 -110 L120 -93.5 L91.5 -77 L62.9 -93.5 Z" fill="rgba(255,255,255,.02)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M3.8 -28.6 L78.1 14.3 L21 47.3 L-53.3 4.4 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M0 -39.6 L53.3 -8.8 L0 22 L-53.3 -8.8 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M53.3 -8.8 L0 22 L0 30.8 L53.3 0 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-53.3 -8.8 L0 22 L0 30.8 L-53.3 0 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M0 -34.8 L45 -8.8 L0 17.2 L-45 -8.8 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="-14.9" cy="17.8" r="1.6" fill="#5A5A5A"></circle><circle cx="14.9" cy="17.8" r="1.6" fill="#5A5A5A"></circle><path d="M0 -29.7 L0 -71.5" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M0 -29.7 L36.2 -8.8" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M0 -29.7 L-36.2 -8.8" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M0 -71.5 L36.2 -50.6 L0 -29.7 L-36.2 -50.6 Z" fill="rgba(255,255,255,.025)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M36.2 -50.6 L0 -29.7 L0 12.1 L36.2 -8.8 Z" fill="rgba(255,255,255,.01)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-36.2 -50.6 L0 -29.7 L0 12.1 L-36.2 -8.8 Z" fill="rgba(255,255,255,.015)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><g style="filter:drop-shadow(0 0 10px rgba(255,255,255,.35))"><path d="M0 -41.8 L19.1 -30.8 L0 -19.8 L-19.1 -30.8 Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M19.1 -30.8 L0 -19.8 L0 2.2 L19.1 -8.8 Z" fill="#9E9E9E" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-19.1 -30.8 L0 -19.8 L0 2.2 L-19.1 -8.8 Z" fill="#D6D6D6" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path></g><path d="M-36.2 -50.6 L0 -29.7 L0 12.1 L-36.2 -8.8 Z" fill="rgba(255,255,255,.03)" stroke="#4A4A4A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M36.2 -50.6 L0 -29.7 L0 12.1 L36.2 -8.8 Z" fill="rgba(255,255,255,.02)" stroke="#4A4A4A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M0 -71.5 L36.2 -50.6 L0 -29.7 L-36.2 -50.6 Z" fill="rgba(255,255,255,.02)" stroke="#4A4A4A" stroke-width="0.8" stroke-linejoin="round"></path><circle cx="-8.6" cy="21.4" r="2" fill="#FFFFFF"></circle><path d="M95.3 34.1 L152.4 67.1 L112.4 90.2 L55.3 57.2 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M91.5 24.2 L127.7 45.1 L91.5 66 L55.3 45.1 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M127.7 45.1 L91.5 66 L91.5 73.7 L127.7 52.8 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M55.3 45.1 L91.5 66 L91.5 73.7 L55.3 52.8 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M91.5 29 L119.3 45.1 L91.5 61.2 L63.6 45.1 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="81.3" cy="64" r="1.6" fill="#5A5A5A"></circle><circle cx="101.6" cy="64" r="1.6" fill="#5A5A5A"></circle><path d="M91.5 28.6 L91.5 -4.4" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M91.5 28.6 L120 45.1" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M91.5 28.6 L62.9 45.1" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M91.5 -4.4 L120 12.1 L91.5 28.6 L62.9 12.1 Z" fill="rgba(255,255,255,.025)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M120 12.1 L91.5 28.6 L91.5 61.6 L120 45.1 Z" fill="rgba(255,255,255,.01)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M62.9 12.1 L91.5 28.6 L91.5 61.6 L62.9 45.1 Z" fill="rgba(255,255,255,.015)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M91.5 21.3 L105.2 29.3 L91.5 37.2 L77.7 29.3 Z" fill="#2C2C2C" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M105.2 29.3 L91.5 37.2 L91.5 53 L105.2 45.1 Z" fill="#161616" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M77.7 29.3 L91.5 37.2 L91.5 53 L77.7 45.1 Z" fill="#1F1F1F" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M62.9 12.1 L91.5 28.6 L91.5 61.6 L62.9 45.1 Z" fill="rgba(255,255,255,.03)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M120 12.1 L91.5 28.6 L91.5 61.6 L120 45.1 Z" fill="rgba(255,255,255,.02)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M91.5 -4.4 L120 12.1 L91.5 28.6 L62.9 12.1 Z" fill="rgba(255,255,255,.02)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-87.6 34.1 L-30.5 67.1 L-70.5 90.2 L-127.7 57.2 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-91.5 24.2 L-55.3 45.1 L-91.5 66 L-127.7 45.1 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-55.3 45.1 L-91.5 66 L-91.5 73.7 L-55.3 52.8 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-127.7 45.1 L-91.5 66 L-91.5 73.7 L-127.7 52.8 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-91.5 29 L-63.6 45.1 L-91.5 61.2 L-119.3 45.1 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="-101.6" cy="64" r="1.6" fill="#5A5A5A"></circle><circle cx="-81.3" cy="64" r="1.6" fill="#5A5A5A"></circle><path d="M-91.5 28.6 L-91.5 -4.4" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M-91.5 28.6 L-62.9 45.1" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M-91.5 28.6 L-120 45.1" fill="none" stroke="#3E3E3E" stroke-width="0.8" stroke-dasharray="3 4"></path><path d="M-91.5 -4.4 L-62.9 12.1 L-91.5 28.6 L-120 12.1 Z" fill="rgba(255,255,255,.025)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-62.9 12.1 L-91.5 28.6 L-91.5 61.6 L-62.9 45.1 Z" fill="rgba(255,255,255,.01)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-120 12.1 L-91.5 28.6 L-91.5 61.6 L-120 45.1 Z" fill="rgba(255,255,255,.015)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><g style="filter:drop-shadow(0 0 10px rgba(255,255,255,.35))"><path d="M-91.5 21.3 L-77.7 29.3 L-91.5 37.2 L-105.2 29.3 Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-77.7 29.3 L-91.5 37.2 L-91.5 53 L-77.7 45.1 Z" fill="#9E9E9E" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-105.2 29.3 L-91.5 37.2 L-91.5 53 L-105.2 45.1 Z" fill="#D6D6D6" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path></g><path d="M-120 12.1 L-91.5 28.6 L-91.5 61.6 L-120 45.1 Z" fill="rgba(255,255,255,.03)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-62.9 12.1 L-91.5 28.6 L-91.5 61.6 L-62.9 45.1 Z" fill="rgba(255,255,255,.02)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-91.5 -4.4 L-62.9 12.1 L-91.5 28.6 L-120 12.1 Z" fill="rgba(255,255,255,.02)" stroke="#3E3E3E" stroke-width="0.8" stroke-linejoin="round"></path><path d="M44.5 -37.6 L54.5 -27.6 M54.5 -37.6 L44.5 -27.6" stroke="#A1A1A1" stroke-width="1.4" fill="none"></path><path d="M44.5 19.6 L54.5 29.6 M54.5 19.6 L44.5 29.6" stroke="#A1A1A1" stroke-width="1.4" fill="none"></path><path d="M-40.2 -22.6 L-34.8 -24 L-36.2 -29.5" fill="none" stroke="#FFFFFF" stroke-width="1.1"></path><path d="M-53.4 22.3 L-54.9 27.7 L-49.4 29.2" fill="none" stroke="#FFFFFF" stroke-width="1.1"></path><text transform="matrix(0.866 -0.5 0.866 0.5 11.4 -82.5)" font-family="Geist Mono, ui-monospace, monospace" font-size="10" font-weight="500" fill="#EDEDED">llm-sdk</text><text transform="matrix(0.866 0.5 -0.866 0.5 -135.3 -48.4)" font-family="Geist Mono, ui-monospace, monospace" font-size="9" font-weight="400" fill="#A1A1A1">your app</text><text transform="matrix(0.866 -0.5 0.866 0.5 98.1 -28)" font-family="Geist Mono, ui-monospace, monospace" font-size="9" font-weight="400" fill="#858585">openai · 503</text><text transform="matrix(0.866 -0.5 0.866 0.5 98.1 77.5)" font-family="Geist Mono, ui-monospace, monospace" font-size="9" font-weight="400" fill="#858585">groq · timeout</text><text transform="matrix(0.866 0.5 -0.866 0.5 -135.3 57.2)" font-family="Geist Mono, ui-monospace, monospace" font-size="9.5" font-weight="500" fill="#FFFFFF">anthropic</text><text transform="matrix(0.866 -0.5 0.866 0.5 -52.4 14.2)" font-family="Geist Mono, ui-monospace, monospace" font-size="8.5" font-weight="400" fill="#FFFFFF">200</text><text transform="matrix(0.866 0.5 -0.866 0.5 -56.2 -46.3)" font-family="Geist Mono, ui-monospace, monospace" font-size="8.5" font-weight="400" fill="#A1A1A1">request</text></svg>
</div>
<div style="padding:8px 28px 30px; display:flex; flex-direction:column; gap:10px; border-top:1px solid #1A1A1A">
<span style="padding-top:18px; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585">01.1 / Failover</span>
<h3 style="margin:0; font-size:22px; font-weight:500; letter-spacing:-.03em">One outage never reaches your users</h3>
<p style="margin:0; font-size:15px; line-height:1.6; color:#A1A1A1">Attempts walk the chain in order and stop at the first success. If all fail, you get <code style="font-family:'Geist Mono',ui-monospace,monospace; font-size:13.5px; color:#FFFFFF">AllProvidersFailed</code> with every error attached.</p>
</div>
</article>

<article class="iso" style="background:#0C0C0C; display:flex; flex-direction:column; min-width:0">
<div class="stage" style="min-height:300px; padding:36px 22px 18px; display:flex; align-items:center; justify-content:center; background-image:radial-gradient(#181818 1px, transparent 1px); background-size:20px 20px; transition:box-shadow .3s">
<svg role="img" aria-label="Isometric diagram: your API key goes directly to the model provider; there is no gateway or proxy in between" viewBox="-124.5 -135.9 362.9 258.8" width="100%" style="display:block; max-height:300px; overflow:visible"><path d="M0 -4.4 L106.7 -66" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="3 4" style="animation:lp-isodash 1.1s linear infinite;filter:drop-shadow(0 0 4px rgba(255,255,255,.6))"></path><path d="M0 -4.4 L95.3 59.4" fill="none" stroke="#4A4A4A" stroke-width="1" stroke-dasharray="3 4"></path><path d="M121.9 -91.3 L186.7 -53.9 L139.1 -26.4 L74.3 -63.8 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M118.1 -101.2 L161.9 -75.9 L118.1 -50.6 L74.3 -75.9 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M161.9 -75.9 L118.1 -50.6 L118.1 -42.9 L161.9 -68.2 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M74.3 -75.9 L118.1 -50.6 L118.1 -42.9 L74.3 -68.2 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M118.1 -96.4 L153.6 -75.9 L118.1 -55.4 L82.7 -75.9 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="105.9" cy="-53.8" r="1.6" fill="#5A5A5A"></circle><circle cx="130.4" cy="-53.8" r="1.6" fill="#5A5A5A"></circle><path d="M118.1 -103.4 L150.5 -84.7 L118.1 -66 L85.7 -84.7 Z" fill="#2C2C2C" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M150.5 -84.7 L118.1 -66 L118.1 -59 L150.5 -77.7 Z" fill="#161616" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M85.7 -84.7 L118.1 -66 L118.1 -59 L85.7 -77.7 Z" fill="#1F1F1F" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M118.1 -112.6 L150.5 -93.9 L118.1 -75.2 L85.7 -93.9 Z" fill="#2C2C2C" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M150.5 -93.9 L118.1 -75.2 L118.1 -68.2 L150.5 -86.9 Z" fill="#161616" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M85.7 -93.9 L118.1 -75.2 L118.1 -68.2 L85.7 -86.9 Z" fill="#1F1F1F" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M118.1 -121.9 L150.5 -103.2 L118.1 -84.5 L85.7 -103.2 Z" fill="#2C2C2C" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M150.5 -103.2 L118.1 -84.5 L118.1 -77.4 L150.5 -96.1 Z" fill="#161616" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M85.7 -103.2 L118.1 -84.5 L118.1 -77.4 L85.7 -96.1 Z" fill="#1F1F1F" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M140 -93.6 L128.6 -87 Z" fill="none" stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round"></path><path d="M0 -50.6 L87.6 0 L0 50.6 L-87.6 0 Z" fill="none" stroke="#6A6A6A" stroke-width="0.9" stroke-linejoin="round" stroke-dasharray="4 4"></path><path d="M3.8 -37.4 L93.4 14.3 L21 56.1 L-68.6 4.4 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M0 -48.8 L68.6 -9.2 L0 30.4 L-68.6 -9.2 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M68.6 -9.2 L0 30.4 L0 39.6 L68.6 0 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-68.6 -9.2 L0 30.4 L0 39.6 L-68.6 0 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M0 -44 L60.2 -9.2 L0 25.5 L-60.2 -9.2 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="-19.2" cy="23.9" r="1.6" fill="#5A5A5A"></circle><circle cx="19.2" cy="23.9" r="1.6" fill="#5A5A5A"></circle><path d="M23.8 4.5 L19.3 6.7 L14.2 8.4 L8.7 9.5 L2.9 10.1 L-2.9 10.1 L-8.7 9.5 L-14.2 8.4 L-19.3 6.7 L-23.8 4.5 L-27.6 1.9 L-30.5 -1 L-32.5 -4.2 L-33.6 -7.5 L-33.6 -10.9 L-32.5 -14.3 L-30.5 -17.5 L-27.6 -20.4 L-23.8 -23 L-19.3 -25.2 L-14.2 -26.9 L-8.7 -28 L-2.9 -28.6 L2.9 -28.6 L8.7 -28 L14.2 -26.9 L19.3 -25.2 L23.8 -23 L27.6 -20.4 L30.5 -17.5 L32.5 -14.3 L33.6 -10.9 L33.6 -7.5 L32.5 -4.2 L30.5 -1 L27.6 1.9 Z" fill="none" stroke="#2E2E2E" stroke-width="0.8" stroke-linejoin="round" stroke-dasharray="2 3"></path><path d="M-2.5 -10.7 L-5 -9.5 L-7.9 -8.6 L-11 -8 L-14.3 -7.8 L-17.5 -8 L-20.7 -8.6 L-23.6 -9.5 L-26.1 -10.7 L-28.2 -12.1 L-29.7 -13.8 L-30.7 -15.6 L-31 -17.5 L-30.7 -19.4 L-29.7 -21.2 L-28.2 -22.8 L-26.1 -24.3 L-23.6 -25.5 L-20.7 -26.4 L-17.5 -26.9 L-14.3 -27.1 L-11 -26.9 L-7.9 -26.4 L-5 -25.5 L-2.5 -24.3 L-0.4 -22.8 L1.1 -21.2 L2.1 -19.4 L2.4 -17.5 L2.1 -15.6 L1.1 -13.8 L-0.4 -12.1 Z M-7.4 -13.5 L-8.9 -12.8 L-10.6 -12.3 L-12.4 -12 L-14.3 -11.9 L-16.2 -12 L-18 -12.3 L-19.7 -12.8 L-21.1 -13.5 L-22.4 -14.4 L-23.3 -15.3 L-23.8 -16.4 L-24 -17.5 L-23.8 -18.6 L-23.3 -19.6 L-22.4 -20.6 L-21.1 -21.4 L-19.7 -22.1 L-18 -22.7 L-16.2 -23 L-14.3 -23.1 L-12.4 -23 L-10.6 -22.7 L-8.9 -22.1 L-7.4 -21.5 L-6.2 -20.6 L-5.3 -19.6 L-4.8 -18.6 L-4.6 -17.5 L-4.8 -16.4 L-5.3 -15.3 L-6.2 -14.4 Z" fill="rgba(255,255,255,.05)" fill-rule="evenodd"></path><path d="M-0.8 -12.3 L28 4.3 L23.4 6.9 L20.6 5.3 L13.3 9.5 L9.9 7.5 L17.1 3.3 L14.1 1.5 L8.4 4.8 L5 2.9 L10.7 -0.4 L-5.3 -9.7 Z" fill="rgba(255,255,255,.05)"></path><g style="filter:drop-shadow(0 0 10px rgba(255,255,255,.35))"><path d="M-2.5 -22.8 L-5 -21.6 L-7.9 -20.7 L-11 -20.1 L-14.3 -19.9 L-17.5 -20.1 L-20.7 -20.7 L-23.6 -21.6 L-26.1 -22.8 L-28.2 -24.2 L-29.7 -25.9 L-30.7 -27.7 L-31 -29.6 L-30.7 -31.5 L-29.7 -33.3 L-28.2 -34.9 L-26.1 -36.4 L-23.6 -37.6 L-20.7 -38.5 L-17.5 -39 L-14.3 -39.2 L-11 -39 L-7.9 -38.5 L-5 -37.6 L-2.5 -36.4 L-0.4 -34.9 L1.1 -33.3 L2.1 -31.5 L2.4 -29.6 L2.1 -27.7 L1.1 -25.9 L-0.4 -24.2 Z M-7.4 -25.6 L-8.9 -24.9 L-10.6 -24.4 L-12.4 -24.1 L-14.3 -24 L-16.2 -24.1 L-18 -24.4 L-19.7 -24.9 L-21.1 -25.6 L-22.4 -26.5 L-23.3 -27.4 L-23.8 -28.5 L-24 -29.6 L-23.8 -30.7 L-23.3 -31.7 L-22.4 -32.7 L-21.1 -33.5 L-19.7 -34.2 L-18 -34.8 L-16.2 -35.1 L-14.3 -35.2 L-12.4 -35.1 L-10.6 -34.8 L-8.9 -34.2 L-7.4 -33.5 L-6.2 -32.7 L-5.3 -31.7 L-4.8 -30.7 L-4.6 -29.6 L-4.8 -28.5 L-5.3 -27.4 L-6.2 -26.5 Z" fill="#8A8A8A" fill-rule="evenodd"></path><path d="M-0.8 -24.4 L28 -7.8 L23.4 -5.2 L20.6 -6.8 L13.3 -2.6 L9.9 -4.6 L17.1 -8.8 L14.1 -10.6 L8.4 -7.3 L5 -9.2 L10.7 -12.5 L-5.3 -21.8 Z" fill="#8A8A8A"></path><path d="M-2.5 -24.3 L-5 -23.1 L-7.9 -22.2 L-11 -21.7 L-14.3 -21.5 L-17.5 -21.7 L-20.7 -22.2 L-23.6 -23.1 L-26.1 -24.3 L-28.2 -25.8 L-29.7 -27.4 L-30.7 -29.2 L-31 -31.1 L-30.7 -33 L-29.7 -34.8 L-28.2 -36.5 L-26.1 -38 L-23.6 -39.1 L-20.7 -40 L-17.5 -40.6 L-14.3 -40.8 L-11 -40.6 L-7.9 -40 L-5 -39.1 L-2.5 -38 L-0.4 -36.5 L1.1 -34.8 L2.1 -33 L2.4 -31.1 L2.1 -29.2 L1.1 -27.4 L-0.4 -25.8 Z M-7.4 -27.2 L-8.9 -26.5 L-10.6 -26 L-12.4 -25.6 L-14.3 -25.5 L-16.2 -25.6 L-18 -26 L-19.7 -26.5 L-21.1 -27.2 L-22.4 -28 L-23.3 -29 L-23.8 -30 L-24 -31.1 L-23.8 -32.2 L-23.3 -33.3 L-22.4 -34.2 L-21.1 -35.1 L-19.7 -35.8 L-18 -36.3 L-16.2 -36.6 L-14.3 -36.7 L-12.4 -36.6 L-10.6 -36.3 L-8.9 -35.8 L-7.4 -35.1 L-6.2 -34.2 L-5.3 -33.3 L-4.8 -32.2 L-4.6 -31.1 L-4.8 -30 L-5.3 -29 L-6.2 -28 Z" fill="#B5B5B5" fill-rule="evenodd"></path><path d="M-0.8 -26 L28 -9.4 L23.4 -6.7 L20.6 -8.4 L13.3 -4.2 L9.9 -6.2 L17.1 -10.3 L14.1 -12.1 L8.4 -8.8 L5 -10.8 L10.7 -14.1 L-5.3 -23.3 Z" fill="#B5B5B5"></path><path d="M-2.5 -25.8 L-5 -24.7 L-7.9 -23.8 L-11 -23.2 L-14.3 -23 L-17.5 -23.2 L-20.7 -23.8 L-23.6 -24.7 L-26.1 -25.8 L-28.2 -27.3 L-29.7 -29 L-30.7 -30.8 L-31 -32.7 L-30.7 -34.6 L-29.7 -36.4 L-28.2 -38 L-26.1 -39.5 L-23.6 -40.7 L-20.7 -41.6 L-17.5 -42.1 L-14.3 -42.3 L-11 -42.1 L-7.9 -41.6 L-5 -40.7 L-2.5 -39.5 L-0.4 -38 L1.1 -36.4 L2.1 -34.6 L2.4 -32.7 L2.1 -30.8 L1.1 -29 L-0.4 -27.3 Z M-7.4 -28.7 L-8.9 -28 L-10.6 -27.5 L-12.4 -27.2 L-14.3 -27.1 L-16.2 -27.2 L-18 -27.5 L-19.7 -28 L-21.1 -28.7 L-22.4 -29.6 L-23.3 -30.5 L-23.8 -31.6 L-24 -32.7 L-23.8 -33.8 L-23.3 -34.8 L-22.4 -35.8 L-21.1 -36.6 L-19.7 -37.3 L-18 -37.8 L-16.2 -38.2 L-14.3 -38.3 L-12.4 -38.2 L-10.6 -37.8 L-8.9 -37.3 L-7.4 -36.6 L-6.2 -35.8 L-5.3 -34.8 L-4.8 -33.8 L-4.6 -32.7 L-4.8 -31.6 L-5.3 -30.5 L-6.2 -29.6 Z" fill="#FFFFFF" fill-rule="evenodd"></path><path d="M-0.8 -27.5 L28 -10.9 L23.4 -8.2 L20.6 -9.9 L13.3 -5.7 L9.9 -7.7 L17.1 -11.9 L14.1 -13.6 L8.4 -10.3 L5 -12.3 L10.7 -15.6 L-5.3 -24.9 Z" fill="#FFFFFF"></path></g><circle cx="-17.1" cy="25.1" r="2.4" fill="#FFFFFF"></circle><path d="M112.4 52.8 L169.6 85.8 L129.6 108.9 L72.4 75.9 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M108.6 42.9 L144.8 63.8 L108.6 84.7 L72.4 63.8 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M144.8 63.8 L108.6 84.7 L108.6 92.4 L144.8 71.5 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M72.4 63.8 L108.6 84.7 L108.6 92.4 L72.4 71.5 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M108.6 47.7 L136.4 63.8 L108.6 79.9 L80.8 63.8 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="98.5" cy="82.7" r="1.6" fill="#5A5A5A"></circle><circle cx="118.7" cy="82.7" r="1.6" fill="#5A5A5A"></circle><path d="M108.6 34.1 L125.7 44 L108.6 53.9 L91.5 44 Z" fill="#2C2C2C" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M125.7 44 L108.6 53.9 L108.6 73.7 L125.7 63.8 Z" fill="#161616" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M91.5 44 L108.6 53.9 L108.6 73.7 L91.5 63.8 Z" fill="#1F1F1F" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M40.2 20.9 L51.2 31.9 M51.2 20.9 L40.2 31.9" stroke="#EDEDED" stroke-width="1.4" fill="none"></path><path d="M57.2 -32.8 L58.7 -38.3 L53.2 -39.7" fill="none" stroke="#FFFFFF" stroke-width="1.1"></path><path d="M71.1 -40.8 L72.6 -46.3 L67.1 -47.8" fill="none" stroke="#FFFFFF" stroke-width="1.1"></path><text transform="matrix(0.866 0.5 -0.866 0.5 -91.5 4.4)" font-family="Geist Mono, ui-monospace, monospace" font-size="10" font-weight="500" fill="#EDEDED">your key</text><text transform="matrix(0.866 0.5 -0.866 0.5 -110.5 15.4)" font-family="Geist Mono, ui-monospace, monospace" font-size="8.5" font-weight="400" fill="#858585">sk-••••</text><text transform="matrix(0.866 -0.5 0.866 0.5 66.7 -31.9)" font-family="Geist Mono, ui-monospace, monospace" font-size="9" font-weight="400" fill="#FFFFFF">direct</text><text transform="matrix(0.866 -0.5 0.866 0.5 126.7 -39)" font-family="Geist Mono, ui-monospace, monospace" font-size="9" font-weight="400" fill="#A1A1A1">model provider</text><text transform="matrix(0.866 0.5 -0.866 0.5 37.2 37.9)" font-family="Geist Mono, ui-monospace, monospace" font-size="8.5" font-weight="400" fill="#858585">no hop</text><text transform="matrix(0.866 -0.5 0.866 0.5 116.2 96.8)" font-family="Geist Mono, ui-monospace, monospace" font-size="9" font-weight="400" fill="#858585">gateway</text></svg>
</div>
<div style="padding:8px 28px 30px; display:flex; flex-direction:column; gap:10px; border-top:1px solid #1A1A1A">
<span style="padding-top:18px; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585">01.2 / Your keys</span>
<h3 style="margin:0; font-size:22px; font-weight:500; letter-spacing:-.03em">Not a gateway. Not a proxy.</h3>
<p style="margin:0; font-size:15px; line-height:1.6; color:#A1A1A1">Runs in your process with your API keys, over <code style="font-family:'Geist Mono',ui-monospace,monospace; font-size:13.5px; color:#FFFFFF">fetch</code>. No hop. No signup. Nobody else sees your prompts.</p>
</div>
</article>

<article class="iso" style="background:#0C0C0C; display:flex; flex-direction:column; min-width:0">
<div class="stage" style="min-height:300px; padding:36px 22px 18px; display:flex; align-items:center; justify-content:center; background-image:radial-gradient(#181818 1px, transparent 1px); background-size:20px 20px; transition:box-shadow .3s">
<svg role="img" aria-label="Isometric diagram: call 1 misses and goes to the provider, the response is stored in the cache; call 2 is a hit served from the cache at zero cost" viewBox="-152.1 -104.9 415.5 216.8" width="100%" style="display:block; max-height:300px; overflow:visible"><path d="M-102.9 -19.4 L3.8 -59" fill="none" stroke="#5A5A5A" stroke-width="1" stroke-dasharray="3 4"></path><path d="M3.8 -59 L41.9 42.2" fill="none" stroke="#5A5A5A" stroke-width="1" stroke-dasharray="3 4"></path><path d="M129.6 -21.6 L41.9 42.2" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="3 4" style="animation:lp-isodash 1.1s linear infinite;filter:drop-shadow(0 0 4px rgba(255,255,255,.6))"></path><path d="M-102.9 -19.4 L41.9 42.2" fill="none" stroke="#3A3A3A" stroke-width="0.8" stroke-dasharray="1 4"></path><path d="M7.6 -73.7 L64.8 -40.7 L24.8 -17.6 L-32.4 -50.6 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M3.8 -83.6 L40 -62.7 L3.8 -41.8 L-32.4 -62.7 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M40 -62.7 L3.8 -41.8 L3.8 -34.1 L40 -55 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-32.4 -62.7 L3.8 -41.8 L3.8 -34.1 L-32.4 -55 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M3.8 -78.8 L31.6 -62.7 L3.8 -46.6 L-24 -62.7 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="-6.3" cy="-43.8" r="1.6" fill="#5A5A5A"></circle><circle cx="13.9" cy="-43.8" r="1.6" fill="#5A5A5A"></circle><path d="M3.8 -82.9 L26.7 -69.7 L3.8 -56.5 L-19.1 -69.7 Z" fill="#2C2C2C" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M26.7 -69.7 L3.8 -56.5 L3.8 -50.8 L26.7 -64 Z" fill="#161616" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-19.1 -69.7 L3.8 -56.5 L3.8 -50.8 L-19.1 -64 Z" fill="#1F1F1F" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M3.8 -90.9 L26.7 -77.7 L3.8 -64.5 L-19.1 -77.7 Z" fill="#2C2C2C" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M26.7 -77.7 L3.8 -64.5 L3.8 -58.7 L26.7 -71.9 Z" fill="#161616" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-19.1 -77.7 L3.8 -64.5 L3.8 -58.7 L-19.1 -71.9 Z" fill="#1F1F1F" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M133.4 -35.2 L188.6 -3.3 L150.5 18.7 L95.3 -13.2 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M129.6 -45.1 L163.9 -25.3 L129.6 -5.5 L95.3 -25.3 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M163.9 -25.3 L129.6 -5.5 L129.6 2.2 L163.9 -17.6 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M95.3 -25.3 L129.6 -5.5 L129.6 2.2 L95.3 -17.6 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M129.6 -40.3 L155.5 -25.3 L129.6 -10.3 L103.6 -25.3 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="120" cy="-7.2" r="1.6" fill="#5A5A5A"></circle><circle cx="139.2" cy="-7.2" r="1.6" fill="#5A5A5A"></circle><g style="filter:drop-shadow(0 0 10px rgba(255,255,255,.35))"><path d="M129.6 -53 L145.6 -43.8 L129.6 -34.5 L113.6 -43.8 Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M145.6 -43.8 L129.6 -34.5 L129.6 -16.1 L145.6 -25.3 Z" fill="#9E9E9E" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M113.6 -43.8 L129.6 -34.5 L129.6 -16.1 L113.6 -25.3 Z" fill="#D6D6D6" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path></g><path d="M-99.1 -33 L-43.8 -1.1 L-81.9 20.9 L-137.2 -11 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-102.9 -42.9 L-68.6 -23.1 L-102.9 -3.3 L-137.2 -23.1 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-68.6 -23.1 L-102.9 -3.3 L-102.9 4.4 L-68.6 -15.4 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-137.2 -23.1 L-102.9 -3.3 L-102.9 4.4 L-137.2 -15.4 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-102.9 -38.1 L-77 -23.1 L-102.9 -8.1 L-128.8 -23.1 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="-112.5" cy="-5" r="1.6" fill="#5A5A5A"></circle><circle cx="-93.3" cy="-5" r="1.6" fill="#5A5A5A"></circle><path d="M-102.9 -50.8 L-86.9 -41.6 L-102.9 -32.3 L-118.9 -41.6 Z" fill="#2C2C2C" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-86.9 -41.6 L-102.9 -32.3 L-102.9 -13.9 L-86.9 -23.1 Z" fill="#161616" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-118.9 -41.6 L-102.9 -32.3 L-102.9 -13.9 L-118.9 -23.1 Z" fill="#1F1F1F" stroke="#5A5A5A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M45.7 13.2 L127.7 60.5 L62.9 97.9 L-19.1 50.6 Z" fill="rgba(255,255,255,0.045)" stroke="none" stroke-width="0.8" stroke-linejoin="round"></path><path d="M41.9 2.2 L102.9 37.4 L41.9 72.6 L-19.1 37.4 Z" fill="#161616" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M102.9 37.4 L41.9 72.6 L41.9 81.4 L102.9 46.2 Z" fill="#0B0B0B" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-19.1 37.4 L41.9 72.6 L41.9 81.4 L-19.1 46.2 Z" fill="#101010" stroke="#3A3A3A" stroke-width="0.8" stroke-linejoin="round"></path><path d="M41.9 7 L94.5 37.4 L41.9 67.8 L-10.7 37.4 Z" fill="none" stroke="#2A2A2A" stroke-width="0.7" stroke-linejoin="round" stroke-dasharray="2 3"></path><circle cx="24.8" cy="67.1" r="1.6" fill="#5A5A5A"></circle><circle cx="59" cy="67.1" r="1.6" fill="#5A5A5A"></circle><g style="filter:drop-shadow(0 0 10px rgba(255,255,255,.35))"><path d="M41.9 1.5 L85.7 26.8 L41.9 52.1 L-1.9 26.8 Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M85.7 26.8 L41.9 52.1 L41.9 61.4 L85.7 36.1 Z" fill="#9E9E9E" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-1.9 26.8 L41.9 52.1 L41.9 61.4 L-1.9 36.1 Z" fill="#D6D6D6" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M41.9 -9.5 L85.7 15.8 L41.9 41.1 L-1.9 15.8 Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M85.7 15.8 L41.9 41.1 L41.9 50.4 L85.7 25.1 Z" fill="#9E9E9E" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-1.9 15.8 L41.9 41.1 L41.9 50.4 L-1.9 25.1 Z" fill="#D6D6D6" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M41.9 -20.5 L85.7 4.8 L41.9 30.1 L-1.9 4.8 Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M85.7 4.8 L41.9 30.1 L41.9 39.4 L85.7 14.1 Z" fill="#9E9E9E" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path><path d="M-1.9 4.8 L41.9 30.1 L41.9 39.4 L-1.9 14.1 Z" fill="#D6D6D6" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"></path></g><path d="M16.2 41.9 L27.6 48.5 Z" fill="none" stroke="#0A0A0A" stroke-width="1.4" stroke-linejoin="round"></path><path d="M16.2 30.9 L27.6 37.5 Z" fill="none" stroke="#0A0A0A" stroke-width="1.4" stroke-linejoin="round"></path><path d="M16.2 19.9 L27.6 26.5 Z" fill="none" stroke="#0A0A0A" stroke-width="1.4" stroke-linejoin="round"></path><path d="M75.3 15.5 H113.3" stroke="#5A5A5A" stroke-width="0.8" stroke-dasharray="1 3"></path><text x="117.3" y="18.5" font-family="Geist Mono, ui-monospace, monospace" font-size="9" fill="#A1A1A1">key</text><path d="M75.3 26.5 H113.3" stroke="#5A5A5A" stroke-width="0.8" stroke-dasharray="1 3"></path><text x="117.3" y="29.5" font-family="Geist Mono, ui-monospace, monospace" font-size="9" fill="#A1A1A1">ttl 24h</text><path d="M75.3 37.5 H113.3" stroke="#5A5A5A" stroke-width="0.8" stroke-dasharray="1 3"></path><text x="117.3" y="40.5" font-family="Geist Mono, ui-monospace, monospace" font-size="9" fill="#A1A1A1">response</text><path d="M-46.6 -36 L-44.2 -41.1 L-49.3 -43.5" fill="none" stroke="#8A8A8A" stroke-width="1.1"></path><path d="M15.8 -15.8 L21 -13.4 L23.3 -18.6" fill="none" stroke="#8A8A8A" stroke-width="1.1"></path><path d="M86.6 4.8 L85.7 10.3 L91.3 11.2" fill="none" stroke="#FFFFFF" stroke-width="1.1"></path><text transform="matrix(0.866 0.5 -0.866 0.5 -138.1 -8.2)" font-family="Geist Mono, ui-monospace, monospace" font-size="9" font-weight="400" fill="#A1A1A1">call 1 · miss</text><text transform="matrix(0.866 -0.5 0.866 0.5 11.4 -29.7)" font-family="Geist Mono, ui-monospace, monospace" font-size="9" font-weight="400" fill="#858585">provider</text><text transform="matrix(0.866 -0.5 0.866 0.5 137.2 6.6)" font-family="Geist Mono, ui-monospace, monospace" font-size="9" font-weight="500" fill="#FFFFFF">call 2 · hit · $0</text><text transform="matrix(0.866 0.5 -0.866 0.5 -15.2 57.2)" font-family="Geist Mono, ui-monospace, monospace" font-size="10" font-weight="500" fill="#EDEDED">/cache</text></svg>
</div>
<div style="padding:8px 28px 30px; display:flex; flex-direction:column; gap:10px; border-top:1px solid #1A1A1A">
<span style="padding-top:18px; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585">01.3 / Cache</span>
<h3 style="margin:0; font-size:22px; font-weight:500; letter-spacing:-.03em">Pay for the same prompt once</h3>
<p style="margin:0; font-size:15px; line-height:1.6; color:#A1A1A1">Deterministic key from model plus messages. Set <code style="font-family:'Geist Mono',ui-monospace,monospace; font-size:13.5px; color:#FFFFFF">cache: { ttl: "24h" }</code> and repeats come back at zero cost.</p>
</div>
</article>

</div>

<!-- ROW 2 -->
<div style="display:flex; flex-wrap:wrap; gap:12px">

<!-- Routes (interactive) -->
<article class="card" style="position:relative; flex:1 1 300px; min-width:0; border:1px solid #262626; background:#0D0D0D; display:flex; flex-direction:column">
<span class="tick" aria-hidden="true" style="position:absolute; top:-1px; left:-1px; width:10px; height:10px; border-top:1px solid #6A6A6A; border-left:1px solid #6A6A6A; transition:border-color .3s"></span>
<span class="tick" aria-hidden="true" style="position:absolute; bottom:-1px; right:-1px; width:10px; height:10px; border-bottom:1px solid #6A6A6A; border-right:1px solid #6A6A6A; transition:border-color .3s"></span>
<div style="margin:10px; min-height:220px; padding:20px; border:1px solid #1C1C1C; background:#090909; display:flex; flex-direction:column; justify-content:center; gap:14px">
<div role="group" aria-label="Pick a route" style="display:flex; border:1px solid #2A2A2A">
<button v-for="r in routes" :key="r.key" type="button" @click="route = r.key" :aria-pressed="r.key === route" :style="{ background: r.key === route ? '#FFFFFF' : 'transparent', color: r.key === route ? '#0A0A0A' : '#A1A1A1' }" style="flex:1; min-height:44px; border:0; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; transition:background .2s, color .2s">{{ r.key }}</button>
</div>
<div style="padding:14px 16px; border:1px solid #1F1F1F; background:#0D0D0D; font-family:'Geist Mono',ui-monospace,monospace; font-size:12.5px; line-height:1.8; overflow-x:auto">
<div style="color:#858585; white-space:nowrap">llm.route("<span style="color:#FFFFFF">{{ current.key }}</span>")</div>
<div style="color:#FFFFFF; white-space:nowrap">→ {{ current.model }}</div>
</div>
</div>
<div style="padding:16px 28px 30px; display:flex; flex-direction:column; gap:10px">
<span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585">01.4 / Routes</span>
<h3 style="margin:0; font-size:22px; font-weight:500; letter-spacing:-.03em">Name the tradeoff once</h3>
<p style="margin:0; font-size:15px; line-height:1.6; color:#A1A1A1">fast / smart / cheap in one config. Route names are typed, so a typo fails at compile time.</p>
</div>
</article>

<!-- Cache -->
<article class="card" style="position:relative; flex:1 1 300px; min-width:0; border:1px solid #262626; background:#0D0D0D; display:flex; flex-direction:column">
<span class="tick" aria-hidden="true" style="position:absolute; top:-1px; left:-1px; width:10px; height:10px; border-top:1px solid #6A6A6A; border-left:1px solid #6A6A6A; transition:border-color .3s"></span>
<span class="tick" aria-hidden="true" style="position:absolute; bottom:-1px; right:-1px; width:10px; height:10px; border-bottom:1px solid #6A6A6A; border-right:1px solid #6A6A6A; transition:border-color .3s"></span>
<div style="position:relative; margin:10px; min-height:220px; border:1px solid #1C1C1C; background:#090909; display:flex; align-items:center; justify-content:center; overflow:hidden">
<div aria-hidden="true" style="position:absolute; width:200px; height:200px; border:1px dashed #2A2A2A; animation:lp-spin 40s linear infinite"></div>
<div aria-hidden="true" style="position:absolute; width:130px; height:130px; border:1px solid #1F1F1F"></div>
<span style="position:relative; font-size:132px; font-weight:300; line-height:1; letter-spacing:-.06em; color:#FFFFFF; text-shadow:0 0 40px rgba(255,255,255,.25)">0</span>
<span style="position:absolute; bottom:12px; right:14px; font-family:'Geist Mono',ui-monospace,monospace; font-size:10px; letter-spacing:.14em; color:#858585">RUNTIME DEPS</span>
</div>
<div style="padding:16px 28px 30px; display:flex; flex-direction:column; gap:10px">
<span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585">01.5 / Library</span>
<h3 style="margin:0; font-size:22px; font-weight:500; letter-spacing:-.03em">Zero runtime dependencies</h3>
<p style="margin:0; font-size:15px; line-height:1.6; color:#A1A1A1"><code style="font-family:'Geist Mono',ui-monospace,monospace; font-size:13.5px; color:#FFFFFF">"dependencies": {}</code> — nothing to audit but the router itself.</p>
</div>
</article>

<!-- Cost -->
<article class="card" style="position:relative; flex:1 1 300px; min-width:0; border:1px solid #262626; background:#0D0D0D; display:flex; flex-direction:column">
<span class="tick" aria-hidden="true" style="position:absolute; top:-1px; left:-1px; width:10px; height:10px; border-top:1px solid #6A6A6A; border-left:1px solid #6A6A6A; transition:border-color .3s"></span>
<span class="tick" aria-hidden="true" style="position:absolute; bottom:-1px; right:-1px; width:10px; height:10px; border-bottom:1px solid #6A6A6A; border-right:1px solid #6A6A6A; transition:border-color .3s"></span>
<div style="margin:10px; min-height:220px; padding:20px; border:1px solid #1C1C1C; background:#090909; display:flex; flex-direction:column; justify-content:center; gap:14px">
<span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; color:#858585">RES.COST</span>
<span style="font-size:56px; font-weight:400; line-height:1; letter-spacing:-.045em; color:#FFFFFF; text-shadow:0 0 34px rgba(255,255,255,.2)">$0.0042</span>
<div style="display:flex; flex-wrap:wrap; gap:6px; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; color:#C8C8C8">
<span style="padding:5px 8px; border:1px solid #2A2A2A">usage</span>
<span style="padding:5px 8px; border:1px solid #2A2A2A">latencyMs</span>
<span style="padding:5px 8px; border:1px solid #2A2A2A">cached</span>
<span style="padding:5px 8px; border:1px solid #2A2A2A">attempts</span>
</div>
</div>
<div style="padding:16px 28px 30px; display:flex; flex-direction:column; gap:10px">
<span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585">01.6 / Observability</span>
<h3 style="margin:0; font-size:22px; font-weight:500; letter-spacing:-.03em">Every response is priced</h3>
<p style="margin:0; font-size:15px; line-height:1.6; color:#A1A1A1">Usage, cost, latency and the full attempts trace — no wrapper, no vendor dashboard.</p>
</div>
</article>

</div>

<!-- ROW 3 -->
<div style="display:flex; flex-wrap:wrap; gap:12px">

<!-- Testing -->
<article class="card" style="position:relative; flex:1 1 300px; min-width:0; border:1px solid #262626; background:#0D0D0D; display:flex; flex-direction:column">
<span class="tick" aria-hidden="true" style="position:absolute; top:-1px; left:-1px; width:10px; height:10px; border-top:1px solid #6A6A6A; border-left:1px solid #6A6A6A; transition:border-color .3s"></span>
<span class="tick" aria-hidden="true" style="position:absolute; bottom:-1px; right:-1px; width:10px; height:10px; border-bottom:1px solid #6A6A6A; border-right:1px solid #6A6A6A; transition:border-color .3s"></span>
<div style="margin:10px; min-height:220px; padding:20px; border:1px solid #1C1C1C; background:#090909; display:flex; flex-direction:column; justify-content:center; gap:10px; font-family:'Geist Mono',ui-monospace,monospace; font-size:13px; line-height:1.6">
<span style="color:#858585">$ npm test</span>
<div style="display:flex; gap:10px"><span style="color:#FFFFFF">✓</span><span>falls back to mock/ok</span></div>
<div style="display:flex; gap:10px"><span style="color:#FFFFFF">✓</span><span>records both attempts</span></div>
<span style="margin-top:6px; padding:6px 10px; align-self:flex-start; background:#FFFFFF; color:#0A0A0A; font-size:11px; letter-spacing:.1em">0 NETWORK CALLS</span>
</div>
<div style="padding:16px 28px 30px; display:flex; flex-direction:column; gap:10px">
<span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585">01.7 / Testing</span>
<h3 style="margin:0; font-size:22px; font-weight:500; letter-spacing:-.03em">Tests without a network</h3>
<p style="margin:0; font-size:15px; line-height:1.6; color:#A1A1A1">The <code style="font-family:'Geist Mono',ui-monospace,monospace; font-size:13.5px; color:#FFFFFF">mock</code> provider answers from a queue you control — failures included.</p>
</div>
</article>

<!-- Providers (large) -->
<article class="card" style="position:relative; flex:2 1 560px; min-width:0; border:1px solid #262626; background:#0D0D0D; display:flex; flex-wrap:wrap; box-shadow:0 0 70px -24px rgba(255,255,255,0.140)">
<span class="tick" aria-hidden="true" style="position:absolute; top:-1px; left:-1px; width:10px; height:10px; border-top:1px solid #6A6A6A; border-left:1px solid #6A6A6A; transition:border-color .3s"></span>
<span class="tick" aria-hidden="true" style="position:absolute; bottom:-1px; right:-1px; width:10px; height:10px; border-bottom:1px solid #6A6A6A; border-right:1px solid #6A6A6A; transition:border-color .3s"></span>
<div style="flex:1 1 240px; padding:30px; display:flex; flex-direction:column; justify-content:space-between; gap:28px">
<div style="display:flex; justify-content:space-between; gap:12px; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585"><span>01.8 / Providers</span><span style="padding:3px 7px; border:1px solid #2A2A2A; color:#C8C8C8">5 + any</span></div>
<div style="display:flex; flex-direction:column; gap:12px">
<h3 style="margin:0; font-size:clamp(24px,2.4vw,30px); font-weight:500; line-height:1.08; letter-spacing:-.035em">Bring the models you already use.</h3>
<p style="margin:0; font-size:15px; line-height:1.6; color:#A1A1A1">Start with one, add fallbacks later. Any OpenAI-compatible endpoint works with a <code style="font-family:'Geist Mono',ui-monospace,monospace; font-size:13.5px; color:#FFFFFF">baseURL</code>, and local models never leave your machine.</p>
</div>
</div>
<div style="flex:1 1 280px; margin:10px; display:grid; grid-template-columns:repeat(auto-fit,minmax(min(120px,100%),1fr)); gap:1px; background:#1F1F1F; border:1px solid #1F1F1F; align-content:stretch">
<div style="padding:18px 16px; background:#090909; display:flex; flex-direction:column; justify-content:space-between; gap:22px"><span aria-hidden="true" style="width:16px; height:16px; border:1px solid #FFFFFF"></span><span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.08em; text-transform:uppercase">OpenAI</span></div>
<div style="padding:18px 16px; background:#090909; display:flex; flex-direction:column; justify-content:space-between; gap:22px"><span aria-hidden="true" style="width:16px; height:16px; background:#FFFFFF"></span><span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.08em; text-transform:uppercase">Anthropic</span></div>
<div style="padding:18px 16px; background:#090909; display:flex; flex-direction:column; justify-content:space-between; gap:22px"><span aria-hidden="true" style="width:12px; height:12px; margin:2px; border:1px solid #FFFFFF; transform:rotate(45deg)"></span><span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.08em; text-transform:uppercase">Groq</span></div>
<div style="padding:18px 16px; background:#EDEDED; color:#0A0A0A; display:flex; flex-direction:column; justify-content:space-between; gap:22px"><span aria-hidden="true" style="width:12px; height:12px; margin:2px; background:#0A0A0A; transform:rotate(45deg)"></span><span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.08em; text-transform:uppercase">Ollama · local</span></div>
<div style="padding:18px 16px; background:#090909; display:flex; flex-direction:column; justify-content:space-between; gap:22px"><span aria-hidden="true" style="width:16px; height:16px; border:1px dashed #FFFFFF"></span><span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.08em; text-transform:uppercase">Mock</span></div>
<div style="padding:18px 16px; background:#090909; display:flex; flex-direction:column; justify-content:space-between; gap:22px"><span aria-hidden="true" style="font-family:'Geist Mono',ui-monospace,monospace; font-size:18px; line-height:16px; color:#A1A1A1">+</span><span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:#C8C8C8">Compatible</span></div>
</div>
</article>

</div>
</div>
</div>
</section>

<!-- CODE -->
<section id="code" style="border-bottom:1px solid #1F1F1F; position:relative; overflow:hidden">
<div aria-hidden="true" style="position:absolute; inset:0; background-image:radial-gradient(#202020 1px, transparent 1px); background-size:22px 22px; -webkit-mask-image:radial-gradient(ellipse 50% 70% at 72% 50%, #000 10%, transparent 70%); mask-image:radial-gradient(ellipse 50% 70% at 72% 50%, #000 10%, transparent 70%)"></div>
<div style="position:relative; max-width:1240px; margin:0 auto; border-left:1px solid #1F1F1F; border-right:1px solid #1F1F1F; padding:clamp(64px,8vw,112px) clamp(16px,3vw,44px); display:flex; flex-wrap:wrap; align-items:center; gap:48px 64px">
<div style="flex:1 1 340px; min-width:0; display:flex; flex-direction:column; gap:20px">
<span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:#858585"><span style="color:#FFFFFF">02</span> / Quickstart</span>
<h2 style="margin:0; font-size:clamp(2rem,4.6vw,3.5rem); font-weight:500; line-height:1.02; letter-spacing:-.045em">One import.<br><span style="color:#5A5A5A">One function.</span></h2>
<p style="margin:0; max-width:420px; font-size:16px; line-height:1.6; color:#A1A1A1"><code style="font-family:'Geist Mono',ui-monospace,monospace; font-size:14px; color:#FFFFFF">createRouter</code> is the whole entry point. Model strings, not classes.</p>
<a class="ghost" href="/guide/getting-started" style="align-self:flex-start; display:inline-flex; align-items:center; gap:10px; height:48px; padding:0 20px; border:1px solid #3A3A3A; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase; transition:border-color .25s, box-shadow .25s">Read the guide
<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 8h11M9 4l4 4-4 4"></path></svg>
</a>
</div>
<div style="position:relative; flex:1.3 1 420px; min-width:0; border:1px solid #2A2A2A; background:#0D0D0D; box-shadow:0 0 0 1px rgba(255,255,255,0.030), 0 40px 140px -40px rgba(255,255,255,0.160)">
<span aria-hidden="true" style="position:absolute; top:-6px; right:-6px; width:11px; height:11px; border-top:1px solid #FFFFFF; border-right:1px solid #FFFFFF"></span>
<span aria-hidden="true" style="position:absolute; bottom:-6px; left:-6px; width:11px; height:11px; border-bottom:1px solid #FFFFFF; border-left:1px solid #FFFFFF"></span>
<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding-left:18px; border-bottom:1px solid #1F1F1F; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.1em; color:#858585">
<div style="display:flex; align-items:center; gap:18px"><span style="color:#FFFFFF; padding:14px 0; box-shadow:inset 0 -1px 0 #FFFFFF">BASIC.TS</span><span class="hide-sm">TYPESCRIPT</span></div>
<button type="button" @click="copy('code')" :style="{ color: copied === 'code' ? '#FFFFFF' : '#A1A1A1' }" aria-label="Copy example code" style="min-height:44px; min-width:80px; padding:0 16px; border:0; border-left:1px solid #1F1F1F; background:transparent; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; cursor:pointer">{{ copied === 'code' ? 'COPIED' : 'COPY' }}</button>
</div>
<pre style="margin:0; padding:24px; overflow-x:auto; font-family:'Geist Mono',ui-monospace,monospace; font-size:13.5px; line-height:1.85; color:#7A7A7A"><span style="color:#FFFFFF">import</span> { createRouter } <span style="color:#FFFFFF">from</span> <span style="color:#C8C8C8">"llm-sdk-js"</span>

<span style="color:#FFFFFF">const</span> llm = <span style="color:#FFFFFF">createRouter</span>({
  primary: <span style="color:#C8C8C8">"anthropic/claude-sonnet-4-5"</span>,
  fallbacks: [<span style="color:#C8C8C8">"openai/gpt-4o"</span>],
})

<span style="color:#FFFFFF">const</span> res = <span style="color:#FFFFFF">await</span> llm.<span style="color:#FFFFFF">complete</span>(<span style="color:#C8C8C8">"Summarise this."</span>)
console.<span style="color:#FFFFFF">log</span>(res.provider, res.attempts)</pre>
</div>
</div>
</section>

<!-- FINAL CTA -->
<section style="border-bottom:1px solid #1F1F1F">
<div style="max-width:1240px; margin:0 auto; border-left:1px solid #1F1F1F; border-right:1px solid #1F1F1F; padding:clamp(72px,10vw,140px) 16px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:24px">
<h2 style="margin:0; font-size:clamp(2.4rem,6vw,4.75rem); font-weight:500; line-height:.98; letter-spacing:-.05em; text-wrap:balance; text-shadow:0 0 60px rgba(255,255,255,.12)">Ship the call.<br><span style="color:#5A5A5A">Survive the outage.</span></h2>
<p style="margin:0; max-width:420px; font-size:16px; line-height:1.6; color:#A1A1A1">Routes, fallbacks, cache and cost — without an agent framework.</p>
<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:12px; margin-top:8px">
<a class="btn" href="/guide/getting-started" style="display:inline-flex; align-items:center; gap:10px; height:52px; padding:0 24px; background:#EDEDED; color:#0A0A0A; font-family:'Geist Mono',ui-monospace,monospace; font-size:12px; font-weight:500; letter-spacing:.1em; text-transform:uppercase; box-shadow:0 0 28px -4px rgba(255,255,255,0.300)">Get started
<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 8h11M9 4l4 4-4 4"></path></svg>
</a>
<div style="display:flex; align-items:center; height:52px; border:1px solid #2A2A2A; background:#0D0D0D; font-family:'Geist Mono',ui-monospace,monospace; font-size:13px; max-width:100%">
<span style="padding:0 10px 0 18px; color:#6E6E6E">$</span>
<span style="white-space:nowrap">npm i llm-sdk-js</span>
<button type="button" @click="copy('cta')" :style="{ color: copied === 'cta' ? '#FFFFFF' : '#A1A1A1' }" aria-label="Copy install command" style="margin-left:16px; height:100%; min-width:80px; padding:0 14px; border:0; border-left:1px solid #2A2A2A; background:transparent; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; cursor:pointer">{{ copied === 'cta' ? 'COPIED' : 'COPY' }}</button>
</div>
</div>
</div>
</section>

<!-- FOOTER -->
<footer id="source">
<div style="max-width:1240px; margin:0 auto; border-left:1px solid #1F1F1F; border-right:1px solid #1F1F1F; padding:28px 20px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px 24px">
<a href="#top" style="display:flex; align-items:center; gap:10px; font-family:'Geist Mono',ui-monospace,monospace; font-size:13px; letter-spacing:.08em">
<span aria-hidden="true" style="position:relative; width:16px; height:16px; border:1px solid #FFFFFF; display:inline-block"><span style="position:absolute; inset:3px; background:#FFFFFF"></span></span>
LLM-SDK
</a>
<nav aria-label="Footer" style="display:flex; flex-wrap:wrap; gap:0 4px; font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.1em; text-transform:uppercase">
<a class="navlink" href="/guide/getting-started" style="color:#A1A1A1; padding:12px 10px">Guide</a>
<a class="navlink" href="/api/create-router" style="color:#A1A1A1; padding:12px 10px">API</a>
<a class="navlink" href="#providers" style="color:#A1A1A1; padding:12px 10px">Providers</a>
<a class="navlink" href="https://github.com/ALPHACOD3RS/llm-sdk" rel="noreferrer" style="color:#A1A1A1; padding:12px 10px">GitHub</a>
<a class="navlink" href="https://github.com/ALPHACOD3RS/llm-sdk/blob/main/CHANGELOG.md" rel="noreferrer" style="color:#A1A1A1; padding:12px 10px">Changelog</a>
</nav>
<span style="font-family:'Geist Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#858585">© {{ year }} LLM-SDK · MIT</span>
</div>
<div aria-hidden="true" style="max-width:1240px; margin:0 auto; border-left:1px solid #1F1F1F; border-right:1px solid #1F1F1F; overflow:hidden; text-align:center; font-size:clamp(64px,17vw,250px); font-weight:600; letter-spacing:-.06em; line-height:.78; color:#121212; white-space:nowrap; user-select:none">llm-sdk</div>
</footer>

</div>
</template>

<style>
/* Unscoped on purpose: the keyframes are referenced from inline styles, which
   scoped CSS can't rewrite. Everything is namespaced under .lp / lp-*. */
.lp,
.lp * {
  box-sizing: border-box;
  border-radius: 0;
}
.lp h1,
.lp h2,
.lp h3 {
  line-height: normal;
}
.lp a {
  color: #ededed;
  text-decoration: none;
}
.lp a:hover {
  color: #ffffff;
}
.lp ::selection {
  background: #ffffff;
  color: #0a0a0a;
}
.lp button {
  font: inherit;
}
.lp .navlinks {
  display: flex;
}
.lp .card {
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.lp .card:hover {
  border-color: #4a4a4a !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06), 0 0 60px -14px rgba(255, 255, 255, 0.22) !important;
  transform: translateY(-2px);
}
.lp .card:hover .tick {
  border-color: #ffffff !important;
}
.lp .btn {
  transition: box-shadow 0.25s ease, background 0.25s ease;
}
.lp .btn:hover {
  background: #ffffff !important;
  box-shadow: 0 0 0 1px #ffffff, 0 0 36px -2px rgba(255, 255, 255, 0.45) !important;
}
.lp .ghost:hover {
  border-color: #ffffff !important;
  box-shadow: 0 0 30px -8px rgba(255, 255, 255, 0.3);
}
.lp .navlink:hover {
  color: #ffffff !important;
  background: #141414;
}
.lp .iso {
  transition: background 0.3s ease;
}
.lp .iso:hover {
  background: #101010 !important;
}
.lp .iso:hover .stage {
  box-shadow: inset 0 0 80px -30px rgba(255, 255, 255, 0.12);
}
@keyframes lp-travel {
  0% { left: -20%; }
  100% { left: 100%; }
}
@keyframes lp-failstep {
  0%, 18% { border-color: #262626; }
  26%, 62% { border-color: #8a8a8a; }
  78%, 100% { border-color: #262626; }
}
@keyframes lp-okstep {
  0%, 40% { border-color: #262626; box-shadow: none; }
  50%, 100% {
    border-color: #ffffff;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 0 50px -10px rgba(255, 255, 255, 0.35);
  }
}
@keyframes lp-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}
@keyframes lp-spin {
  to { transform: rotate(360deg); }
}
@keyframes lp-blink {
  50% { opacity: 0; }
}
@keyframes lp-isodash {
  to { stroke-dashoffset: -14; }
}
@media (max-width: 760px) {
  .lp .navlinks { display: none; }
  .lp .hide-sm { display: none !important; }
}
@media (prefers-reduced-motion: reduce) {
  .lp * { animation: none !important; transition: none !important; }
}
</style>
