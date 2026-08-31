<script setup lang="ts">
import { brands, type BrandName } from "./brands";

const props = defineProps<{ name: BrandName }>();
</script>

<template>
  <span class="mark" aria-hidden="true" v-html="brands[props.name]" />
</template>

<style scoped>
.mark {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  line-height: 1;
}
.mark :deep(svg) {
  width: 1em;
  height: 1em;
}
</style>
