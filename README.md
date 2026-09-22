# Self-Review Portfolio — Astro implementation

The handoff design (`../portfolio-g-self-review.dc.html`) rebuilt as a static
Astro site. The first pass was verified pixel-identical to the prototype —
every section's top offset and height matching to 0.0px — and the layout,
spacing and colour work still follows it closely. The design has since moved
on in the deliberate ways listed below, so heights no longer match the
prototype and are no longer asserted against it.

Deliberate departures from the design:

- The card column is capped at **1200px** (`--content-max`) rather than the
  handoff's 1342px. Below a 1538px viewport nothing changes — the layout is
  still identical to the prototype.
- The sidebar's right edge and the header's bottom edge use `--border-strong`
  (`#232935`) instead of the handoff's `#1e232c`, so they match the weight of
  the section separator rules. Both are full-length rules rather than card
  outlines, which is the distinction those two tokens already draw.
- The primary action colour is violet (`--action` → `#7b3fd4`, hover
  `#8748db`) rather than the handoff's blue `#1f6feb`. This keeps actions
  distinct from `--green`, which the design reserves for status. Revert by
  pointing `--action` / `--action-hover` back at `--blue` / `--blue-hover` —
  one edit in `tokens.css`.
- "Changed my mind" is a GitHub pull-request list rather than the handoff's
  two-column before/after grid. Each row is a merged PR: the current view is
  the title, and the belief it replaced is the meta line. See
  `src/components/ChangedMyMind.astro`.
- The type scale is a **12 / 14 / 16** ladder (`--size-label` /
  `--size-meta` / `--size-ui`) rather than the handoff's fifteen sizes. Nine
  of those sat between 10px and 14px at 4–5% intervals — too close to read as
  distinct, so every component became a fresh judgement call. Nothing
  informational is now below 12px, which also clears the handoff's own 11px
  floor that the 10.5px reviewer card had breached. The four fluid steps
  (prose, section titles, wordmark, contact headline) are unchanged.
- "My stack" is a grid of opinion cards rather than the handoff's four columns
  of monogram tiles. Each card carries one tool and one opinion, with a
  category dot; on hover the card's border takes the dot's colour and the card
  lifts 2px. The `--tile-1..4` monogram tokens are gone with the component
  they served, replaced by `--cat-*`. See `src/components/Stack.astro`.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview
npm run check    # astro check (TypeScript + template diagnostics)
```

The tab icon is generated from the intro avatar at build time via
`astro:assets` in `src/layouts/Base.astro`, so swapping
`src/assets/avatar-green.jpeg` updates the portrait *and* the favicon — there
is no second image to keep in sync.

## What ships

One HTML file with the CSS and the single client script inlined — no external
requests beyond the self-hosted woff2 subsets and the images. The only
JavaScript is the scroll spy and the reveal-on-scroll observer.

## Where the content lives

All copy is in `src/data/`. Nothing in `src/components/` needs editing to
change what the page says.

| File | Holds |
| --- | --- |
| `site.ts` | Name, contact details, SEO strings, intro copy, reviewer card, contact block |
| `projects.ts` | The three project cards — summary, outcomes, decision, "what I'd change" |
| `career.ts` | The timeline **and every date derived from it** |
| `stack.ts` | The stack cards — one tool, one opinion, one category each |
| `beliefs.ts` | The "changed my mind" rows |
| `sections.ts` | The page outline — separator titles, sidebar labels, scroll-spy order |

Two things the handoff called out as repeated failure points are structural
here rather than a matter of discipline:

- **Dates.** `career.ts` is the only place a year is written. Years of
  experience, the reviewer card's "since", and the intro copy are all computed
  from the timeline at build time, so a rebuild keeps them current.
- **Label drift.** The sidebar and the separators both render from
  `sections.ts`, and the project entries are generated from `projects.ts`.
  A card title that must match its nav entry reads it via `labelFor()`.

Design values live in `src/styles/tokens.css`, one custom property per row of
the handoff's token tables. No component contains a raw hex code.

## What the prototype did in JS, and what does it here

| Prototype state | Here |
| --- | --- |
| `hoverShot` | `.card.interactive:hover` + a descendant selector on the image |
| `narrow` | `@media (max-width: 719px)` |
| `open` (per-project panels) | `<details>` / `<summary>` — keyboard-accessible, works with JS off |
| `active` (scroll spy) | `src/scripts/enhance.ts` |

The reveal animation is gated behind a `.js` class set by an inline script in
`<head>`, so the page stays fully readable if the bundle never loads.

## Before launch

- [ ] Replace every string in `src/data/` — it is all mock data (Alex Rivera,
      Meridian / Bright Harbor / Ridgeline).
- [ ] Replace `src/assets/light-*.png` with real product screenshots. They are
      placeholder graphics; the avatar is real and can stay.
- [ ] Set the real domain in `astro.config.mjs` (`site:`) — canonical and OG
      URLs are built from it.
- [ ] Add `public/resume.pdf`, or point `site.links.resume` elsewhere. The
      `source ↗` links on the project cards are `#repo` placeholders too.
- [ ] The tab icon follows the avatar automatically; no separate favicon to swap.

## Notes

- `grid-template-rows: subgrid` on the timeline columns needs Safari 16+,
  Chrome 117+, Firefox 71+.
- The timeline wave is one stretched SVG path whose mid-line crossings land on
  the five column centres. Changing the number of timeline entries means
  regenerating that path — `src/components/Timeline.astro` says so at the top.
- The handoff's contrast rule holds by construction: colours are unchanged from
  the design, informational text clears 4.5:1, and nothing informational is
  below 11px.
