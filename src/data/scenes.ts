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

// `start` is a fraction of the 2520px track height set in TerminalBrowser.astro.
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
