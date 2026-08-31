<script setup lang="ts">
import { computed } from "vue";
import { useDocPosition } from "./useDocPosition";
import { useScrollProgress } from "./useScrollProgress";

const progress = useScrollProgress();
const position = useDocPosition();

const percent = computed(() => Math.round(progress.value * 100));
</script>

<template>
  <div class="am llm-mono">
    <div class="am__row">
      <span>Progress</span>
      <span class="am__value">{{ String(percent).padStart(2, "0") }}%</span>
    </div>
    <div class="am__track">
      <span class="am__fill" :style="{ transform: `scaleX(${progress})` }" />
    </div>

    <div v-if="position" class="am__keys">
      <span class="am__key">[</span>
      <span class="am__keylabel">{{ position.prev?.text ?? "—" }}</span>
    </div>
    <div v-if="position" class="am__keys">
      <span class="am__key">]</span>
      <span class="am__keylabel">{{ position.next?.text ?? "—" }}</span>
    </div>
  </div>
</template>

<style scoped>
.am {
  margin-top: 1.5rem;
  border-top: 1px solid var(--llm-line);
  padding-top: 0.85rem;
  font-size: 9.5px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.3);
}

.am__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.am__value {
  color: rgb(255 255 255 / 0.72);
  font-variant-numeric: tabular-nums;
}

.am__track {
  height: 1px;
  margin: 0.55rem 0 0.9rem;
  background: rgb(255 255 255 / 0.12);
}

.am__fill {
  display: block;
  height: 100%;
  background: rgb(255 255 255 / 0.85);
  transform-origin: 0 50%;
  transition: transform 90ms linear;
}

.am__keys {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.35rem;
}

.am__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
  border: 1px solid var(--llm-line);
  color: rgb(255 255 255 / 0.55);
}

.am__keylabel {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: none;
  letter-spacing: 0.02em;
  font-size: 10px;
  color: rgb(255 255 255 / 0.42);
}
</style>
