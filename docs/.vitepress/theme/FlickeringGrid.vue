<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    color?: string;
    squareSize?: number;
    gridGap?: number;
    maxOpacity?: number;
    flickerChance?: number;
  }>(),
  {
    color: "rgb(255, 255, 255)",
    squareSize: 2,
    gridGap: 7,
    maxOpacity: 0.36,
    flickerChance: 0.9,
  },
);

const canvasRef = ref<HTMLCanvasElement | null>(null);
let raf = 0;
let disposed = false;

function parseRgb(color: string) {
  const m = color.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!m) return { r: 255, g: 255, b: 255 };
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
}

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { r, g, b } = parseRgb(props.color);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let last = 0;

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener("resize", resize);

  const cell = props.squareSize + props.gridGap;

  const paint = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    for (let y = 0; y < h; y += cell) {
      for (let x = 0; x < w; x += cell) {
        const opacity = reduce
          ? props.maxOpacity * 0.28
          : Math.random() < props.flickerChance
            ? Math.random() * props.maxOpacity
            : props.maxOpacity * 0.07;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fillRect(x, y, props.squareSize, props.squareSize);
      }
    }
  };

  const loop = (t: number) => {
    if (disposed) return;
    if (t - last > 160) {
      last = t;
      paint();
    }
    if (!reduce) raf = requestAnimationFrame(loop);
  };

  paint();
  if (!reduce) raf = requestAnimationFrame(loop);

  onBeforeUnmount(() => {
    disposed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  });
});
</script>

<template>
  <canvas ref="canvasRef" aria-hidden="true" />
</template>

<style scoped>
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
