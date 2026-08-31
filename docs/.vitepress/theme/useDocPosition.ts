import { computed, type ComputedRef } from "vue";
import { useData } from "vitepress";

/** Current page index within its sidebar group (for pager / keyboard nav). */
export interface DocPosition {
  section: string;
  index: number;
  total: number;
  prev: DocNeighbour | null;
  next: DocNeighbour | null;
}

export interface DocNeighbour {
  text: string;
  link: string;
}

interface SidebarItem {
  text?: string;
  link?: string;
}

interface SidebarGroup {
  text?: string;
  items?: SidebarItem[];
}

/** Strip HTML from sidebar labels (icons). */
export function stripMarkup(text = ""): string {
  return text.replace(/<[^>]*>/g, "").trim();
}

export function useDocPosition(): ComputedRef<DocPosition | null> {
  const { page, theme } = useData();

  return computed(() => {
    const sidebar = theme.value.sidebar as Record<string, SidebarGroup[]> | undefined;
    if (!sidebar) return null;

    const path = `/${page.value.relativePath.replace(/\.md$/, "")}`;

    for (const [prefix, groups] of Object.entries(sidebar)) {
      if (!path.startsWith(prefix)) continue;

      for (const group of groups) {
        const items = group.items ?? [];
        const index = items.findIndex((item) => item.link === path);
        if (index === -1) continue;

        return {
          section: stripMarkup(group.text),
          index: index + 1,
          total: items.length,
          prev: neighbour(items[index - 1]),
          next: neighbour(items[index + 1]),
        };
      }
    }

    return null;
  });
}

function neighbour(item: SidebarItem | undefined): DocNeighbour | null {
  return item?.link ? { text: stripMarkup(item.text), link: item.link } : null;
}
