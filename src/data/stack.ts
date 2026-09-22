export type StackCategory = 'languages' | 'frontend' | 'data' | 'craft';

export type StackItem = {
  name: string;
  category: StackCategory;
  /** One line, and an opinion — not a description. */
  opinion: string;
};

/** The legend renders from this, so a new category cannot go unlabelled. */
export const categories: Record<StackCategory, { label: string; color: string }> = {
  languages: { label: 'Languages', color: 'var(--cat-languages)' },
  frontend: { label: 'Frontend', color: 'var(--cat-frontend)' },
  data: { label: 'State & data', color: 'var(--cat-data)' },
  craft: { label: 'Craft', color: 'var(--cat-craft)' },
};

/**
 * Source order is display order. Twelve items fill the 4x3 grid exactly.
 *
 * The tools are from the CV, the opinions are Mohamad's own.
 */
export const stack: StackItem[] = [
  {
    name: 'TypeScript',
    category: 'languages',
    opinion: 'A little more ceremony. A lot less guessing.',
  },
  {
    name: 'JavaScript',
    category: 'languages',
    opinion: "Still the language underneath. Know what's actually happening.",
  },
  {
    name: 'CSS',
    category: 'languages',
    opinion: 'Most layout bugs are a missing constraint, not a missing property.',
  },
  {
    name: 'React',
    category: 'frontend',
    opinion: "Boring, and that's the point.",
  },
  {
    name: 'Next.js',
    category: 'frontend',
    opinion: 'A lot of power. A lot of places to accidentally use it wrong.',
  },
  {
    name: 'Tailwind',
    category: 'frontend',
    opinion: 'Ugly in the file, fast in the browser. I will take it.',
  },
  {
    name: 'Zustand',
    category: 'data',
    opinion: 'Most state is local. What is left rarely needs more than this.',
  },
  {
    name: 'TanStack Query',
    category: 'data',
    opinion: 'It ended the argument about where server state lives.',
  },
  {
    name: 'Zod',
    category: 'data',
    opinion: 'One schema for the form and the type. The duplication was the bug.',
  },
  {
    name: 'Recharts',
    category: 'data',
    opinion: "Fine until the design gets specific. Then you're drawing SVG.",
  },
  {
    name: 'Design systems',
    category: 'craft',
    opinion: 'The components are the easy part. Agreement is the real system.',
  },
  {
    name: 'Playwright',
    category: 'craft',
    opinion: 'If breaking it costs money, it gets a test.',
  },
];
