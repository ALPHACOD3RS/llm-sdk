<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type Step =
  | { kind: "idle" }
  | { kind: "trying"; provider: string; model: string }
  | { kind: "fail"; provider: string; model: string; error: string; ms: number }
  | { kind: "ok"; provider: string; model: string; ms: number; text: string };

const timeline: Array<{ at: number; step: Step }> = [
  { at: 0, step: { kind: "trying", provider: "anthropic", model: "claude-sonnet-4-5" } },
  {
    at: 4000,
    step: {
      kind: "fail",
      provider: "anthropic",
      model: "claude-sonnet-4-5",
      error: "rate_limit",
      ms: 210,
    },
  },
  { at: 5500, step: { kind: "trying", provider: "openai", model: "gpt-4o" } },
  {
    at: 9500,
    step: { kind: "fail", provider: "openai", model: "gpt-4o", error: "timeout", ms: 5000 },
  },
  { at: 11_000, step: { kind: "trying", provider: "groq", model: "llama-3.3-70b" } },
  {
    at: 15_000,
    step: {
      kind: "ok",
      provider: "groq",
      model: "llama-3.3-70b",
      ms: 184,
      text: "The diff renames AuthService → IdentityGateway.",
    },
  },
];

const attempts = ref<
  Array<{ provider: string; model: string; error?: string; ms: number; ok?: boolean }>
>([]);
const provider = ref<string>("—");
const status = ref<"routing" | "failed" | "ok">("routing");
const responseText = ref("");

let timers: number[] = [];
let loopTimer = 0;

function clearTimers() {
  for (const t of timers) window.clearTimeout(t);
  timers = [];
  if (loopTimer) window.clearTimeout(loopTimer);
}

function runCycle() {
  clearTimers();
  attempts.value = [];
  provider.value = "—";
  status.value = "routing";
  responseText.value = "";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    attempts.value = [
      { provider: "anthropic", model: "claude-sonnet-4-5", error: "rate_limit", ms: 210 },
      { provider: "openai", model: "gpt-4o", error: "timeout", ms: 5000 },
      { provider: "groq", model: "llama-3.3-70b", ms: 184, ok: true },
    ];
    provider.value = "groq";
    status.value = "ok";
    responseText.value = "The diff renames AuthService → IdentityGateway.";
    return;
  }

  for (const event of timeline) {
    const id = window.setTimeout(() => {
      const s = event.step;
      if (s.kind === "trying") {
        provider.value = s.provider;
        status.value = "routing";
      } else if (s.kind === "fail") {
        attempts.value = [
          ...attempts.value,
          { provider: s.provider, model: s.model, error: s.error, ms: s.ms },
        ];
        status.value = "failed";
      } else if (s.kind === "ok") {
        attempts.value = [
          ...attempts.value,
          { provider: s.provider, model: s.model, ms: s.ms, ok: true },
        ];
        provider.value = s.provider;
        status.value = "ok";
        responseText.value = s.text;
      }
    }, event.at);
    timers.push(id);
  }

  // Hold success ~8s, full cycle ~23s
  loopTimer = window.setTimeout(runCycle, 23_000);
}

onMounted(runCycle);
onBeforeUnmount(clearTimers);

const statusLabel = computed(() => {
  if (status.value === "ok") return "served";
  if (status.value === "failed") return "failover";
  return "routing";
});
</script>

<template>
  <figure class="demo">
    <figcaption class="demo__cap llm-mono">
      <span class="live" aria-hidden="true"><i /><i /><i /></span>
      <span>live failover</span>
      <span class="demo__status" :data-state="status">{{ statusLabel }}</span>
    </figcaption>

    <div class="demo__provider">
      <span class="llm-mono label">res.provider</span>
      <span class="provider" :data-state="status">{{ provider }}</span>
    </div>

    <div class="demo__attempts" aria-live="polite">
      <div
        v-for="(a, i) in attempts"
        :key="`${a.provider}-${i}-${a.error ?? 'ok'}`"
        class="row"
        :class="a.ok ? 'ok' : 'fail'"
      >
        <span class="p">{{ a.provider }}</span>
        <span class="e">{{ a.ok ? "ok" : a.error }}</span>
        <span class="m">{{ a.ms }}ms</span>
      </div>
      <div v-if="attempts.length === 0" class="row ghost">
        <span class="p">waiting</span>
        <span class="e">…</span>
        <span class="m">—</span>
      </div>
    </div>

    <div class="demo__out" :class="{ on: !!responseText }">
      <span class="llm-mono label">res.text</span>
      <p>{{ responseText || "—" }}</p>
    </div>
  </figure>
</template>

<style scoped>
.demo {
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.22);
  background: linear-gradient(to bottom, rgb(255 255 255 / 0.05), rgb(255 255 255 / 0.02)), #050505;
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.06),
    0 30px 90px rgb(0 0 0 / 0.65);
  backdrop-filter: blur(8px);
}

.demo__cap {
  display: flex;
  height: 2.6rem;
  align-items: center;
  gap: 0.55rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.16);
  padding: 0 1rem;
  font-size: 10px;
  color: rgb(255 255 255 / 0.68);
  background: rgb(255 255 255 / 0.03);
}

.demo__status {
  margin-left: auto;
  border: 1px solid rgb(255 255 255 / 0.2);
  padding: 0.2rem 0.5rem;
  color: rgb(255 255 255 / 0.6);
}
.demo__status[data-state="failed"] {
  border-color: rgb(255 120 120 / 0.35);
  color: rgb(255 170 170 / 0.85);
}
.demo__status[data-state="ok"] {
  border-color: rgb(140 255 180 / 0.35);
  color: rgb(170 255 200 / 0.9);
}

.live {
  display: inline-flex;
  gap: 3px;
}
.live i {
  width: 4px;
  height: 4px;
  border-radius: 99px;
  background: rgb(255 255 255 / 0.4);
  animation: pulse 2.4s ease infinite;
}
.live i:nth-child(2) {
  animation-delay: 0.15s;
}
.live i:nth-child(3) {
  animation-delay: 0.3s;
}

.demo__provider {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.1rem 0.95rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.14);
}

.label {
  font-size: 10px;
  color: rgb(255 255 255 / 0.45);
}

.provider {
  font-family: var(--llm-display);
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
  color: rgb(255 255 255 / 0.45);
  transition: color 180ms ease;
}
.provider[data-state="routing"] {
  color: rgb(255 255 255 / 0.68);
}
.provider[data-state="failed"] {
  color: rgb(255 180 180 / 0.75);
}
.provider[data-state="ok"] {
  color: #fff;
  text-shadow: 0 0 24px rgb(255 255 255 / 0.2);
}

.demo__attempts {
  display: grid;
  gap: 0.45rem;
  min-height: 9.5rem;
  padding: 0.9rem 1rem;
  font-family: var(--llm-mono);
  font-size: 12.5px;
}

.row {
  display: grid;
  grid-template-columns: 6rem 1fr auto;
  gap: 0.6rem;
  padding: 0.6rem 0.6rem;
  border: 1px solid rgb(255 255 255 / 0.14);
  background: rgb(255 255 255 / 0.045);
  animation: row-in 480ms ease both;
}
.row.fail .e {
  color: rgb(255 150 150 / 0.95);
}
.row.ok {
  border-color: rgb(255 255 255 / 0.28);
  background: rgb(255 255 255 / 0.09);
}
.row.ok .e {
  color: rgb(150 255 190 / 0.95);
}
.row.ghost {
  opacity: 0.4;
}
.p {
  color: rgb(255 255 255 / 0.88);
}
.e {
  color: rgb(255 255 255 / 0.6);
}
.m {
  color: rgb(255 255 255 / 0.42);
}

.demo__out {
  border-top: 1px solid rgb(255 255 255 / 0.14);
  padding: 1rem 1.1rem 1.15rem;
  opacity: 0.45;
  transition: opacity 220ms ease;
}
.demo__out.on {
  opacity: 1;
}
.demo__out p {
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgb(255 255 255 / 0.92);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}
@keyframes row-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .live i,
  .row {
    animation: none !important;
  }
}
</style>
