import { experienceWords, reviewingSince } from './career';

/** Identity, contact details, and the copy not tied to a project. */
export const site = {
  name: 'Mohamad Abbar',
  /** The header wordmark — lowercase, followed by a violet underscore. */
  wordmark: 'mohamad abbar',
  initials: 'MA',
  role: 'frontend engineer',

  location: 'Beirut, Lebanon',
  timezone: 'GMT+3',
  workMode: 'Remote',

  /** Drives the contact status line. */
  availability: 'open to new work',

  email: 'alabbar.mh@gmail.com',
  links: {
    github: 'https://github.com/iamabbar',
    // TODO: real URL — the CV links to LinkedIn but not the address.
    linkedin: 'https://linkedin.com/in/',
  },

  seo: {
    title: 'Mohamad Alabbar — frontend engineer',
    description:
      'A portfolio written as a code review of my own work: what I built, the decision I made, and what I would change now.',
  },
} as const;

export const intro = {
  cardTitle: 'Who I am',
  /** Name and role, set above the prose. */
  lead: `${site.name} — Frontend Engineer`,
  // One entry per paragraph — each renders as its own <p>. A "\n" inside a
  // string will not break the line: HTML collapses every run of whitespace
  // into a single space.
  paragraphs: [
    'I spend most of my days turning complicated things into interfaces that feel simple.',
    // The duration is interpolated, not written out, so the bio cannot fall
    // out of step with the timeline the rest of the page reads.
    `${experienceWords} of frontend have taught me that making things work is only half the job. The other half is making them feel right, from how information is laid out to the tiny details people notice without realizing.`,
  ],
  /* The stack sits here rather than in the prose: Skills is ~2000px down, so
     this is the only early signal of what he builds with. No experience pill —
     the prose already opens with the same derived value. */
  pills: [site.location, site.timezone, 'React · TypeScript'],
  note: {
    label: 'Note to self',
    body: "Make it make sense to someone who wasn't there.",
  },
  avatarAlt: `${site.name}`,
};

export const reviewer = {
  label: 'Reviewer',
  lines: [
    `${site.name}, ${site.workMode.toLowerCase()}`,
    `Reviewing my own work since ${reviewingSince}`,
  ],
};

export const contact = {
  status: `All checks passed · ${site.availability}`,
  headline: 'Ready to merge into your team.',
  footer: `${site.workMode} · ${site.timezone} · reviewed by the author, which is the only kind of review this file gets`,
};
