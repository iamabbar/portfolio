import { experienceWords, reviewingSince } from './career';

/* Hoisted so the SEO title can be built from them — it used to carry its own
   copy of the name, and the two had already drifted apart. */
const name = 'Mohamad Abbar';
const role = 'Software Engineer';

export const site = {
  name,
  wordmark: 'mohamad abbar',
  role,

  location: 'Beirut, Lebanon',
  timezone: 'GMT+3',
  workMode: 'Remote',

  /** Drives the contact status line. */
  availability: 'open to new work',

  email: 'alabbar.mh@gmail.com',
  links: {
    github: 'https://github.com/iamabbar',
    linkedin: 'https://linkedin.com/in/mohamad-al-abbar',
  },

  seo: {
    title: `${name} — ${role}`,
    description:
      'A portfolio written as a code review of my own work: what I built, what I use, and the things I have changed my mind about.',
  },
} as const;

export const intro = {
  cardTitle: 'Who I am',
  paragraphs: [
    "I'm a software engineer specialized in frontend, shipping products that turn complex problems into simple, AI-powered experiences.",
    `${experienceWords} of frontend have taught me that making things work is only half the job. The other half is making them feel right, from how information is laid out to the tiny details people notice without realizing.`,
  ],
  pills: [site.location, site.timezone, 'React · TypeScript'],
  note: {
    label: 'Note to self',
    body: "Most apps are fine until something takes time. That's where the design usually stops.",
  },
  avatarAlt: `${site.name}`,
};

export const reviewer = {
  label: 'Reviewer',
  /* No name line: it sits directly above this card, beside the avatar. */
  lines: [`Reviewing my own work since ${reviewingSince}`],
};

export const contact = {
  status: `All checks passed · ${site.availability}`,
  headline: 'Ready to merge into your team.',
  footer: `${site.workMode} · ${site.timezone} · reviewed by the author, which is the only kind of review this file gets`,
};
