import type { ImageMetadata } from 'astro';

import ledger from '../assets/light-ledger.png';
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
  /** Omit to hide the "source" link — not every project has a public repo. */
  sourceUrl?: string;
  image: ImageMetadata;
  imageAlt: string;
  /** One <p> each. */
  summary: string[];
  outcomes: string[];
  decision: string;
  /** The admission. Rendered unescaped, so keep any HTML to <b> emphasis. */
  wouldChange: string;
};

/**
 * PLACEHOLDER — every string below is lorem ipsum, on purpose.
 *
 * It replaced a fully written mock project, which read as a real claim: a
 * named client, a team size, a row count. Believable filler on a portfolio is
 * a liability, since nothing marks it as invented. Lorem cannot be mistaken
 * for a claim, so it is the safer thing to leave standing until the real work
 * is written.
 *
 * `imageAlt` stays in plain English — screen-reader users should not be
 * handed lorem. light-persona.png and light-field.png are unused until the
 * next two projects land.
 */
const entries: Omit<Project, 'id'>[] = [
  {
    index: '01',
    name: 'Test',
    company: 'Lorem',
    year: 2025,
    image: ledger,
    imageAlt: 'Placeholder screenshot — a dense editable table.',
    summary: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    ],
    outcomes: ['Lorem · 2025', 'Duis aute irure', 'Excepteur sint occaecat'],
    decision:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis.',
    wouldChange:
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi <b>tempora incidunt</b> ut labore.',
  },
];

/** The anchor is the name, so a deep link reads "#test". */
export const projects: Project[] = entries.map((entry) => ({
  ...entry,
  id: slug(entry.name),
}));
