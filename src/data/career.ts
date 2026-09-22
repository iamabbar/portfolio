/**
 * The career timeline, and every date derived from it — the intro copy,
 * reviewer card and contact status all read their years from here.
 */

export type TimelineEntry = {
  /** 'education' renders the small grey node and a smaller title. */
  kind: 'education' | 'role';
  title: string;
  company?: string;
  description?: string;
  /** Shown as a chip beside the title. Only needed for overlapping roles. */
  employment?: 'FULL-TIME' | 'PART-TIME';
  from: number;
  /** 'now' renders the green current-role node. */
  to: number | 'now';
  /** Which side of the wave the entry card sits on. */
  side: 'above' | 'below';
};

/**
 * Oldest first — the order is load-bearing. Overlapping roles each get their
 * own column plus an employment chip. The wave path is generated from this
 * array's length, so adding or removing an entry needs no other change.
 */
export const timeline: TimelineEntry[] = [
  {
    kind: 'education',
    title: 'BSc computer science',
    company: 'Lebanese International University',
    from: 2017,
    to: 2021,
    side: 'above',
  },
  {
    // TODO: confirm the months — the year is inferred from the gap between
    // graduating and Hovi.
    kind: 'education',
    title: 'Full-stack bootcamp',
    company: 'SE Factory',
    description: 'Full-stack fundamentals, before specialising.',
    from: 2021,
    to: 2021,
    side: 'below',
  },
  {
    kind: 'role',
    title: 'Frontend engineer',
    company: 'Hovi Digital Lab',
    description: 'The design system several products ran on.',
    from: 2021,
    to: 2024,
    side: 'above',
  },
  {
    kind: 'role',
    title: 'Frontend engineer',
    company: 'Portalys',
    description: 'Booking flows, and a 300+ user dashboard.',
    employment: 'PART-TIME',
    from: 2023,
    to: 2024,
    side: 'below',
  },
  {
    kind: 'role',
    title: 'Frontend engineer',
    company: 'Grower AI',
    description: 'AI modules, and a no-code prompt system.',
    from: 2024,
    to: 'now',
    side: 'above',
  },
];

/** Resolved at build time — rebuilding the site keeps every duration current. */
const thisYear = new Date().getFullYear();

export const careerStartYear = Math.min(
  ...timeline.filter((entry) => entry.kind === 'role').map((entry) => entry.from),
);

export const yearsOfExperience = Math.max(1, thisYear - careerStartYear);

const WORDS = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
  'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
];

/** Prose spells durations out; the timeline chips do not. */
export function spellOut(n: number): string {
  return WORDS[n] ?? String(n);
}

export const experienceWords = `${spellOut(yearsOfExperience)} years`;

/** Shown on the reviewer card. */
export const reviewingSince = careerStartYear;

/** "2024 → now", "2021 → 2024", "2017 → 2021". */
export function yearLabel(entry: TimelineEntry): string {
  if (entry.to === 'now') return `${entry.from} → now`;
  if (entry.to === entry.from) return String(entry.from);
  return `${entry.from} → ${entry.to}`;
}
