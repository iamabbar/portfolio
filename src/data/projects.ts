import type { ImageMetadata } from 'astro';

import trace from '../assets/trace.png';
import ultraHealth from '../assets/ultra-health.png';
import { slug } from './slug';

export type Project = {
  /** Anchor id — used by the sidebar, the scroll spy and deep links. */
  id: string;
  /** Two-digit violet index shown before the name. Derived from position. */
  index: string;
  /** Two words. The sidebar reuses this verbatim so the labels cannot drift. */
  name: string;
  company: string;
  year: number;
  /** Omit to hide the "site" link — not every project is deployed somewhere public. */
  liveUrl?: string;
  /** Omit to hide the "source" link — not every project has a public repo. */
  sourceUrl?: string;
  /** Omit both to render a text-only card — not every project has a shot. */
  image?: ImageMetadata;
  imageAlt?: string;
  /** One <p> each. */
  summary: string[];
  /** What it was built with. Omit or leave empty to drop the tag row. */
  tools?: string[];
};

const entries: Omit<Project, 'id'>[] = [
  {
    index: '01',
    name: 'Trace',
    company: 'Personal',
    year: 2026,
    liveUrl: 'https://trace-performance.vercel.app/',
    sourceUrl: 'https://github.com/iamabbar/trace',
    image: trace,
    imageAlt: 'Trace landing page: a URL field with Desktop and Mobile options below the headline.',
    summary: [
      'Trace tells you why a website feels slow. You paste in a link, it runs the checks, and you get back a short list of what is actually costing you time. The worst thing comes first, with the fix written out ready to copy.',
      'Most tools hand you forty things to read and leave you to work out which ones matter. Trace puts a number next to each one: this fix saves about a second. That tells you where to start.',
    ],
    tools: ['React', 'TypeScript', 'Node.js', 'PageSpeed Insights API'],
  },
  {
    index: '02',
    name: 'Ultra Health',
    company: 'Bootcamp project',
    year: 2021,
    image: ultraHealth,
    imageAlt: 'Ultra Health sign-in page — the brand panel beside a sign-in card.',
    summary: [
      'Ultra Health connects people with nutritionists. Clients track their health over time and book sessions; nutritionists keep up with their clients, publish articles, and collect ratings. The two sides share one app, message each other in real time, and each only ever sees their own half of it.',
    ],
    tools: ['React', 'Laravel', 'MySQL', 'Firebase'],
  },
];

/** The anchor is the name, so a deep link reads "#trace". */
export const projects: Project[] = entries.map((entry) => ({
  ...entry,
  id: slug(entry.name),
}));
