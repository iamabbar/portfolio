import { projects } from './projects';
import { slug } from './slug';

/**
 * Sidebar labels, and the only place they are written. The anchor id for each
 * is derived from the label, so a URL always names the section it lands on and
 * the two cannot drift apart.
 */
const LABELS = {
  intro: 'Who I am',
  experience: "Where I've worked",
  skills: 'My stack',
  beliefs: 'Changed my mind',
  contact: 'Get in touch',
} as const;

type SectionKey = keyof typeof LABELS;

/** ids.contact === "get-in-touch". Components anchor to these, never strings. */
export const ids = Object.fromEntries(
  Object.entries(LABELS).map(([key, label]) => [key, slug(label)]),
) as Record<SectionKey, string>;

const link = (key: SectionKey): SectionLink => ({ id: ids[key], label: LABELS[key] });

/**
 * The page outline: one source for the separator titles, the sidebar labels
 * and the scroll-spy order. The handoff warned these drifted repeatedly; they
 * cannot now, since both render from this array.
 *
 * The order is deliberate — evidence, then credibility, then reference, then
 * character, then the ask. Do not rearrange.
 */

export type SectionLink = {
  id: string;
  /** Sidebar label. */
  label: string;
  /** Violet two-digit prefix, projects only. */
  index?: string;
};

export type SectionGroup = {
  /** Separator title rendered above the group. */
  title: string;
  links: SectionLink[];
};

export const groups: SectionGroup[] = [
  {
    title: 'Intro',
    links: [link('intro')],
  },
  {
    title: 'Projects',
    links: projects.map((project) => ({
      id: project.id,
      label: project.name,
      index: project.index,
    })),
  },
  {
    title: 'Experience',
    links: [link('experience')],
  },
  {
    title: 'Skills',
    links: [link('skills')],
  },
  {
    title: 'Changed my mind',
    links: [link('beliefs')],
  },
  {
    title: 'Contact',
    links: [link('contact')],
  },
];

/** Document order of every section — what the scroll spy walks. */
export const sectionIds = groups.flatMap((group) => group.links.map((link) => link.id));

/** The separator title above a section. */
export function separatorFor(id: string): string {
  const group = groups.find((candidate) => candidate.links.some((link) => link.id === id));
  if (!group) throw new Error(`No section group contains "${id}"`);
  return group.title;
}

/** Sidebar label. Card titles that must match their nav entry read it here. */
export function labelFor(id: string): string {
  const link = groups.flatMap((group) => group.links).find((candidate) => candidate.id === id);
  if (!link) throw new Error(`No section link with id "${id}"`);
  return link.label;
}
