<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

const { theme } = useData();

const version = computed(() => (theme.value as { version?: string }).version);
</script>

<template>
  <div class="sh llm-mono">
    <div class="sh__row">
      <span class="sh__label">Documentation</span>
      <span v-if="version" class="sh__version">v{{ version }}</span>
    </div>
    <div class="sh__hatch" aria-hidden="true" />
  </div>
</template>

<style scoped>
.sh {
  margin: 0 0 1.5rem;
  font-size: 9.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sh__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0 0.35rem 0.6rem;
  color: rgb(255 255 255 / 0.34);
}

.sh__version {
  border: 1px solid var(--llm-line);
  padding: 0.1rem 0.35rem;
  color: rgb(255 255 255 / 0.5);
}

.sh__hatch {
  height: 0.45rem;
  border-top: 1px solid var(--llm-line);
  border-bottom: 1px solid var(--llm-line);
  opacity: 0.3;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 4px,
    rgb(255 255 255 / 0.12) 4px,
    rgb(255 255 255 / 0.12) 5px
  );
}

</style>
