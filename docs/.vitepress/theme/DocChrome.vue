<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vitepress";
import { useDocPosition } from "./useDocPosition";
import { useScrollProgress } from "./useScrollProgress";

const router = useRouter();
const position = useDocPosition();
const progress = useScrollProgress();

/** `[` / `]` navigate prev/next in sidebar order. */
function onKey(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey) return;

  const target = event.target as HTMLElement | null;
  if (target?.isContentEditable || /^(input|textarea|select)$/i.test(target?.tagName ?? "")) return;

  const to = event.key === "[" ? position.value?.prev : event.key === "]" ? position.value?.next : null;
  if (!to) return;

  event.preventDefault();
  void router.go(to.link);
}

onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <div class="progress" aria-hidden="true">
    <span class="progress__bar" :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>

<style scoped>
.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  z-index: 100;
  pointer-events: none;
}

.progress__bar {
  display: block;
  height: 100%;
  background: #fff;
  transform-origin: 0 50%;
  transition: transform 90ms linear;
}
</style>
