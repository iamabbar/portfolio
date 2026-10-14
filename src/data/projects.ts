import type { ImageMetadata } from 'astro';
import path from 'node:path';

import sharp from 'sharp';

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
  /** The project card's big-type hook. Short — this is the one-line pitch, not a summary. */
  headline: string;
  /** One short line under the headline — the core action or feature set. */
  hook: string;
  /** Fake address-bar text for the "peeking" screenshot preview. */
  previewUrl: string;
  /** Background + text color, derived from the screenshot's dominant color. */
  theme: { bg: string; fg: string };
  /** One <p> each. */
  summary: string[];
  /** What it was built with. Omit or leave empty to drop the tag row. */
  tools?: string[];
};

/** Matches --tb-ink / --tb-paper in TerminalBrowser.astro. */
const INK = '#1a1816';
const PAPER = '#fbfaf7';

/** Cycled for image-less entries, so they don't all render as the same flat block. */
const FALLBACK_THEMES: Project['theme'][] = [
  { bg: INK, fg: PAPER },
  { bg: '#3a2a5e', fg: PAPER },
  { bg: '#1f6feb', fg: PAPER },
];

// process.cwd()-relative — import.meta.url breaks once this is bundled for build.
async function themeFrom(assetFilename: string): Promise<Project['theme']> {
  const fsPath = path.join(process.cwd(), 'src/assets', assetFilename);
  const { dominant } = await sharp(fsPath).stats();
  const yiq = (dominant.r * 299 + dominant.g * 587 + dominant.b * 114) / 1000;
  return {
    bg: `rgb(${dominant.r} ${dominant.g} ${dominant.b})`,
    fg: yiq >= 128 ? INK : PAPER,
  };
}

const entries: Omit<Project, 'id' | 'theme'>[] = [
  {
    index: '01',
    name: 'Trace',
    company: 'Personal',
    year: 2026,
    liveUrl: 'https://trace-performance.vercel.app/',
    sourceUrl: 'https://github.com/iamabbar/trace',
    image: trace,
    imageAlt: 'Trace landing page: a URL field with Desktop and Mobile options below the headline.',
    headline: 'Why is it slow?',
    hook: 'Paste a URL → get fixes',
    previewUrl: 'trace.app',
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
    headline: 'Your nutritionist, one tap away.',
    hook: 'Book · Track · Chat',
    previewUrl: 'ultrahealth.app/chat',
    summary: [
      'Ultra Health connects people with nutritionists. Clients track their health over time and book sessions; nutritionists keep up with their clients, publish articles, and collect ratings. The two sides share one app, message each other in real time, and each only ever sees their own half of it.',
    ],
    tools: ['React', 'Laravel', 'MySQL', 'Firebase'],
  },
];

const imageFilenames: Record<string, string> = {
  Trace: 'trace.png',
  'Ultra Health': 'ultra-health.png',
};

/** The anchor is the name, so a deep link reads "#trace". */
let fallbackThemeIndex = 0;
export const projects: Project[] = await Promise.all(
  entries.map(async (entry) => ({
    ...entry,
    id: slug(entry.name),
    theme: entry.image
      ? await themeFrom(imageFilenames[entry.name])
      : FALLBACK_THEMES[fallbackThemeIndex++ % FALLBACK_THEMES.length],
  })),
);
