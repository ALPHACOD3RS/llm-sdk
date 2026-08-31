import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import { h } from "vue";
import "./style.css";
import AsideMeta from "./AsideMeta.vue";
import DocChrome from "./DocChrome.vue";
import DocEnd from "./DocEnd.vue";
import DocHeader from "./DocHeader.vue";
import SidebarHead from "./SidebarHead.vue";

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "layout-top": () => h(DocChrome),
      "nav-bar-title-after": () => h("span", { class: "llm-nav-breadcrumb" }, "/ Docs"),
      "sidebar-nav-before": () => h(SidebarHead),
      "doc-before": () => h(DocHeader),
      "doc-footer-before": () => h(DocEnd),
      "aside-outline-after": () => h(AsideMeta),
    }),
} satisfies Theme;
