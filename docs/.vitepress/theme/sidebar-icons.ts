/** Inline SVG icons for sidebar items (`v-html`-safe). */

function icon(paths: string): string {
  return `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

export const icons = {
  book: icon(
    `<path d="M4 5c3-1.5 6-1.5 8 0v14c-2-1.5-5-1.5-8 0V5Z"/><path d="M20 5c-3-1.5-6-1.5-8 0v14c2-1.5 5-1.5 8 0V5Z"/>`,
  ),
  terminal: icon(`<path d="M4 5h16v14H4z"/><path d="m7 9 3 3-3 3"/><path d="M13 15h4"/>`),
  play: icon(`<path d="M6 4l14 8-14 8V4Z"/>`),
  sliders: icon(
    `<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h13M20 18h1"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>`,
  ),
  gitBranch: icon(
    `<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 7v10"/><path d="M6 9c0 4 4 4 8 4h4"/>`,
  ),
  refresh: icon(
    `<path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/>`,
  ),
  braces: icon(
    `<path d="M8 4c-2 0-3 1-3 3v3c0 1-1 2-2 2 1 0 2 1 2 2v3c0 2 1 3 3 3"/><path d="M16 4c2 0 3 1 3 3v3c0 1 1 2 2 2-1 0-2 1-2 2v3c0 2-1 3-3 3"/>`,
  ),
  wrench: icon(
    `<path d="M14.7 6.3a4 4 0 1 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2 2.3-2.3Z"/>`,
  ),
  database: icon(
    `<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>`,
  ),
  alertTriangle: icon(
    `<path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v5"/><path d="M12 17.3v.1"/>`,
  ),
  checkCircle: icon(`<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>`),
  parens: icon(`<path d="M9 4c-3 3-3 13 0 16"/><path d="M15 4c3 3 3 13 0 16"/>`),
  brackets: icon(`<path d="M8 4 3 12l5 8"/><path d="M16 4l5 8-5 8"/>`),
} as const;

export type IconName = keyof typeof icons;
