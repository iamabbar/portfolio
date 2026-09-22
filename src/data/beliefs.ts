export type Belief = {
  /** What the row is about. Editorial only — not rendered. */
  theme: string;
  before: string;
  /** Reads as the row's title. */
  after: string;
  /** 'open' renders as an unresolved issue. Defaults to 'merged'. */
  status?: 'merged' | 'open';
};

/**
 * Mohamad's own, in his order: design systems, abstraction, complexity, AI,
 * edge cases, maintenance. The `theme` is not rendered — it names what each
 * row is about so the set stays balanced when one is edited.
 */
export const beliefs: Belief[] = [
  {
    theme: 'Design systems',
    before: 'I used to think a design system was a component library.',
    after: "It's an agreement. The components are just where it gets written down.",
  },
  {
    theme: 'Abstraction',
    before: 'I used to abstract things because they looked similar.',
    after: 'Now I wait until they actually behave the same.',
  },
  {
    theme: 'Complexity',
    before: 'I used to think complexity was something you could remove.',
    after: 'Now I think good UX is often about hiding the right amount of it.',
  },
  {
    theme: 'AI',
    before: 'I used to think building AI features was mostly a model problem.',
    after:
      "It's an interface problem too. The hard part is deciding what people should be able to control.",
  },
  {
    theme: 'Edge cases',
    before: 'I used to build the happy path first.',
    after: "Now I think about the weird states while I'm building the normal one.",
  },
  {
    theme: 'Maintenance',
    before: 'I used to ask, “Does this work?”',
    after: 'Now I also ask, “What happens when someone has to change it?”',
  },
];

export const statusOf = (belief: Belief) => belief.status ?? 'merged';

export const counts = {
  merged: beliefs.filter((b) => statusOf(b) === 'merged').length,
  open: beliefs.filter((b) => statusOf(b) === 'open').length,
};
