<script setup lang="ts">
import { ref } from "vue";

const command = "npm install llm-sdk";
const copied = ref(false);

async function copy() {
  try {
    await navigator.clipboard.writeText(command);
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <div class="install">
    <div class="install__meta llm-mono">
      <span class="dim">$</span>
      <span>terminal</span>
    </div>
    <button class="install__row" type="button" @click="copy">
      <code>
        <span class="prompt">›</span>
        <span class="cmd">{{ command }}</span>
      </code>
      <span class="copy llm-mono">{{ copied ? "copied" : "copy" }}</span>
    </button>
  </div>
</template>

<style scoped>
.install {
  border: 1px solid var(--llm-line);
  background: rgb(255 255 255 / 0.02);
  overflow: hidden;
}

.install__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 1.75rem;
  padding: 0 0.85rem;
  border-bottom: 1px solid var(--llm-line-soft);
  font-size: 9px;
  color: rgb(255 255 255 / 0.34);
}

.dim {
  color: rgb(255 255 255 / 0.2);
}

.install__row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.install__row:hover {
  background: rgb(255 255 255 / 0.03);
}

.install__row:focus-visible {
  outline: 2px solid #fff;
  outline-offset: -2px;
}

code {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--llm-mono);
  font-size: 13.5px;
}

.prompt {
  color: rgb(255 255 255 / 0.34);
}

.cmd {
  color: #fff;
}

.copy {
  flex-shrink: 0;
  font-size: 10px;
  color: rgb(255 255 255 / 0.45);
}
</style>
