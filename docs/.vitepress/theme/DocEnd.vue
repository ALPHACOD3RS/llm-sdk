<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const host = ref("");
onMounted(() => (host.value = location.host));

const command = computed(() => `curl ${host.value || "llm-sdk.dev"}/llms.txt`);
const copied = ref(false);

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(command.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1800);
  } catch {
    // clipboard unavailable (insecure context) — leave the label alone
  }
}
</script>

<template>
  <aside class="agents">
    <div class="agents__hatch" aria-hidden="true" />
    <div class="agents__body">
      <p class="agents__label llm-mono">Reading this with an agent?</p>
      <p class="agents__copy">
        Every page of these docs, concatenated into one plain-text file. Point a model at it instead
        of crawling the site.
      </p>
      <div class="agents__cmd llm-mono">
        <code>
          <span class="agents__prompt">$</span>
          <span>{{ command }}</span>
        </code>
        <button class="agents__act" type="button" @click="copyCommand">
          {{ copied ? "Copied" : "Copy" }}
        </button>
        <a class="agents__act" href="/llms.txt" rel="noreferrer" target="_blank">Open</a>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.agents {
  display: flex;
  /* The footer band is already pulled into the gutter, so this only needs its own breathing room. */
  margin: 1.5rem 0 0;
  border: 1px solid var(--llm-line);
  background: rgb(255 255 255 / 0.02);
}

.agents__hatch {
  width: 2.25rem;
  flex-shrink: 0;
  border-right: 1px solid var(--llm-line);
  opacity: 0.4;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 4px,
    rgb(255 255 255 / 0.1) 4px,
    rgb(255 255 255 / 0.1) 5px
  );
}

.agents__body {
  flex: 1;
  min-width: 0;
  padding: 1.25rem 1.35rem 1.4rem;
}

.agents__label {
  margin: 0 0 0.5rem;
  font-size: 9.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.4);
}

.agents__copy {
  max-width: 52ch;
  margin: 0 0 1rem;
  font-size: 0.94rem;
  line-height: 1.6;
  color: rgb(255 255 255 / 0.6);
}

.agents__cmd {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--llm-line);
  background: #000;
}

.agents__cmd code {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  flex: 1;
  min-width: 0;
  padding: 0 0.85rem;
  border: 0;
  background: none;
  font-size: 12.5px;
  letter-spacing: 0;
  text-transform: none;
  white-space: nowrap;
  color: rgb(255 255 255 / 0.9);
}

.agents__prompt {
  color: rgb(255 255 255 / 0.3);
}

.agents__act {
  display: inline-flex;
  align-items: center;
  height: 2.35rem;
  flex-shrink: 0;
  padding: 0 0.8rem;
  border-left: 1px solid var(--llm-line);
  font-size: 9.5px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.5);
  transition:
    background 140ms ease,
    color 140ms ease;
}

.agents__act:hover {
  background: rgb(255 255 255 / 0.07);
  color: #fff;
}

@media (max-width: 640px) {
  .agents__hatch {
    display: none;
  }
}
</style>
