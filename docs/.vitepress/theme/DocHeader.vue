<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useData, useRoute } from "vitepress";
import { useDocPosition } from "./useDocPosition";

/** Raw markdown for "Copy page" (lazy glob, prefetched on mount). */
const sources = import.meta.glob("../../**/*.md", { query: "?raw", import: "default" }) as Record<
  string,
  () => Promise<string>
>;

const markdown = ref("");

async function loadMarkdown() {
  markdown.value = (await sources[`../../${page.value.relativePath}`]?.()) ?? "";
}

const { page, frontmatter, theme } = useData();
const route = useRoute();
const position = useDocPosition();

const updated = computed(() => {
  const stamp = page.value.lastUpdated;
  if (!stamp) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(stamp));
});

const minutes = ref(0);

function measure() {
  const words = document.querySelector(".vp-doc")?.textContent?.trim().split(/\s+/).length ?? 0;
  minutes.value = Math.max(1, Math.round(words / 210));
}

onMounted(() => {
  measure();
  void loadMarkdown();
});

watch(
  () => route.path,
  () => {
    void nextTick(measure);
    void loadMarkdown();
  },
);

const editUrl = computed(() => {
  const pattern = theme.value.editLink?.pattern;
  if (!pattern) return null;
  return typeof pattern === "string"
    ? pattern.replace(":path", page.value.relativePath)
    : pattern(page.value);
});

const copied = ref<"page" | "link" | null>(null);

async function copy(kind: "page" | "link", text: string) {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = kind;
    setTimeout(() => (copied.value = copied.value === kind ? null : copied.value), 1800);
  } catch {
    // clipboard unavailable (insecure context) — leave the label alone
  }
}

function copyPage() {
  const body = markdown.value.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
  void copy("page", `${body}\n\n<!-- source: ${location.href} -->\n`);
}

function copyLink() {
  void copy("link", `${location.origin}${location.pathname}`);
}
</script>

<template>
  <header class="dh">
    <div class="dh__rail llm-mono">
      <span v-if="position" class="dh__where">
        <span class="dh__section">{{ position.section }}</span>
        <span class="dh__count">{{ String(position.index).padStart(2, "0") }}/{{ String(position.total).padStart(2, "0") }}</span>
      </span>
      <span class="dh__facts">
        <span v-if="minutes">{{ minutes }} min read</span>
        <span v-if="updated">Updated {{ updated }}</span>
      </span>
    </div>

    <div class="dh__title">
      <span class="tick tick--tl" />
      <span class="tick tick--tr" />
      <span class="tick tick--bl" />
      <span class="tick tick--br" />
      <h1>{{ page.title }}</h1>
    </div>

    <p v-if="frontmatter.description" class="dh__deck">{{ frontmatter.description }}</p>

    <div class="dh__actions llm-mono">
      <button class="dh__btn dh__btn--lead" type="button" @click="copyPage">
        <svg aria-hidden="true" fill="none" height="13" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" width="13">
          <rect height="11" width="11" x="9" y="9" />
          <path d="M5 15V6a1 1 0 0 1 1-1h9" />
        </svg>
        {{ copied === "page" ? "Copied as markdown" : "Copy page for LLM" }}
      </button>
      <button class="dh__btn" type="button" @click="copyLink">
        {{ copied === "link" ? "Copied" : "Copy link" }}
      </button>
      <a v-if="editUrl" class="dh__btn" :href="editUrl" rel="noreferrer" target="_blank">
        Edit
        <svg aria-hidden="true" fill="none" height="11" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" width="11">
          <path d="M7 17L17 7M17 7H8m9 0v9" />
        </svg>
      </a>
    </div>
  </header>
</template>

<style scoped>
.dh {
  /* Pulled left into the index gutter so the header spans the full rail width (see style.css). */
  margin-left: calc(var(--llm-gutter) * -1);
  margin-bottom: 2.75rem;
}

.dh__rail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: 2.1rem;
  border-bottom: 1px solid var(--llm-line);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.34);
}

.dh__where,
.dh__facts {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.dh__section {
  color: rgb(255 255 255 / 0.72);
}

.dh__count {
  border: 1px solid var(--llm-line);
  padding: 0.15rem 0.4rem;
  color: rgb(255 255 255 / 0.5);
}

.dh__facts span + span::before {
  content: "· ";
  color: rgb(255 255 255 / 0.2);
}

.dh__title {
  position: relative;
  padding: 2rem 0 1.4rem;
}

.dh__title h1 {
  margin: 0;
  border: 0;
  padding: 0;
  font-family: var(--llm-display);
  font-size: clamp(2.3rem, 5.2vw, 3.4rem);
  font-weight: 550;
  letter-spacing: -0.035em;
  line-height: 0.98;
  color: #fff;
}

/* Corner ticks — the quiet sibling of the dashed selection frame on the landing hero. */
.tick {
  position: absolute;
  width: 7px;
  height: 7px;
  opacity: 0.55;
}

.tick--tl {
  top: 0.9rem;
  left: 0;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
}

.tick--tr {
  top: 0.9rem;
  right: 0;
  border-top: 1px solid #fff;
  border-right: 1px solid #fff;
}

.tick--bl {
  bottom: 0.5rem;
  left: 0;
  border-bottom: 1px solid #fff;
  border-left: 1px solid #fff;
}

.tick--br {
  bottom: 0.5rem;
  right: 0;
  border-bottom: 1px solid #fff;
  border-right: 1px solid #fff;
}

.dh__deck {
  max-width: 46ch;
  margin: 0 0 1.75rem;
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgb(255 255 255 / 0.5);
}

.dh__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.dh__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 2rem;
  padding: 0 0.7rem;
  border: 1px solid var(--llm-line);
  background: rgb(255 255 255 / 0.03);
  color: rgb(255 255 255 / 0.56);
  font-size: 9.5px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
  transition:
    background 140ms ease,
    border-color 140ms ease,
    color 140ms ease;
}

.dh__btn:hover {
  border-color: rgb(255 255 255 / 0.26);
  background: rgb(255 255 255 / 0.08);
  color: #fff;
}

.dh__btn--lead {
  border-color: rgb(255 255 255 / 0.24);
  color: rgb(255 255 255 / 0.86);
}

.dh__btn svg {
  flex-shrink: 0;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .dh {
    margin-left: 0;
  }

  .dh__facts {
    display: none;
  }
}
</style>
