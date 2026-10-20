import { site } from './site';

export type Scene = {
  /** Matches a key in the PAGES map in src/scripts/terminal-browser.ts. */
  id: string;
  tab: string;
  /** Fake URL shown in the address bar — cosmetic, not a real route. */
  path: string;
  /** Fake command the terminal types to "open" this tab. */
  cmd: string;
};

export const scenes: Scene[] = [
  { id: 'home', tab: 'Home', path: 'abbar.dev', cmd: 'open abbar.dev' },
  { id: 'about', tab: 'About', path: 'abbar.dev/about', cmd: 'open -t abbar.dev/about' },
  { id: 'projects', tab: 'Projects', path: 'abbar.dev/projects', cmd: 'open -t abbar.dev/projects' },
  { id: 'experience', tab: 'Experience', path: 'abbar.dev/experience', cmd: 'open -t abbar.dev/experience' },
  { id: 'stack', tab: 'Stack', path: 'abbar.dev/stack', cmd: 'open -t abbar.dev/stack' },
  {
    id: 'changelog',
    tab: 'Changed my mind',
    path: 'abbar.dev/changelog',
    cmd: 'open -t abbar.dev/changelog',
  },
  {
    id: 'contact',
    tab: 'Contact',
    path: 'abbar.dev/contact',
    cmd: `open -t mailto:${site.email.split('@')[0]}`,
  },
];
