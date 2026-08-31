import { onMounted, onUnmounted, ref, type Ref } from "vue";

/** Shared 0–1 scroll progress (single listener). */
const progress = ref(0);
let listeners = 0;

function read() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
}

export function useScrollProgress(): Ref<number> {
  onMounted(() => {
    if (listeners++ === 0) {
      window.addEventListener("scroll", read, { passive: true });
      window.addEventListener("resize", read, { passive: true });
    }
    read();
  });

  onUnmounted(() => {
    if (--listeners === 0) {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    }
  });

  return progress;
}
