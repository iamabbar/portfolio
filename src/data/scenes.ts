import { site } from './site';

export type Scene = {
  /** Matches a key in the PAGES map in src/scripts/terminal-browser.ts. */
  id: string;
  start: number;
  /** Label shown on the browser tab. */
  tab: string;
  /** Fake URL shown in the address bar — cosmetic, not a real route. */
  path: string;
  /** Fake command the terminal types to "open" this tab. */
  cmd: string;
};

/*
 * `start` is a fraction of the track height set in TerminalBrowser.astro
 * (2520px). Each scene's own share of that track is ~320px (600px for home,
 * which types a longer command) — sized to match how much of it is actually
 * scroll-driven: typing + the loading skeleton (~90px worth at these
 * lengths), plus a short dwell buffer after the reveal finishes. The reveal
 * itself is time-based, not scroll-based (REVEAL_MS in
 * src/scripts/terminal-browser.ts), so it doesn't need its own scroll budget
 * — padding the track further here would just be dead scroll with nothing
 * on screen changing, which is the bug this sizing avoids.
 */
export const scenes: Scene[] = [
  { id: 'home', start: 0, tab: 'Home', path: 'abbar.dev', cmd: 'open abbar.dev' },
  { id: 'about', start: 0.2381, tab: 'About', path: 'abbar.dev/about', cmd: 'open -t abbar.dev/about' },
  {
    id: 'projects',
    start: 0.3651,
    tab: 'Projects',
    path: 'abbar.dev/projects',
    cmd: 'open -t abbar.dev/projects',
  },
  {
    id: 'experience',
    start: 0.4921,
    tab: 'Experience',
    path: 'abbar.dev/experience',
    cmd: 'open -t abbar.dev/experience',
  },
  { id: 'stack', start: 0.619, tab: 'Stack', path: 'abbar.dev/stack', cmd: 'open -t abbar.dev/stack' },
  {
    id: 'changelog',
    start: 0.746,
    tab: 'Changed my mind',
    path: 'abbar.dev/changelog',
    cmd: 'open -t abbar.dev/changelog',
  },
  {
    id: 'contact',
    start: 0.873,
    tab: 'Contact',
    path: 'abbar.dev/contact',
    cmd: `open -t mailto:${site.email.split('@')[0]}`,
  },
];
