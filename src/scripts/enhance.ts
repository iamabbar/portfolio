/**
 * The only client-side JavaScript on the page: which nav item is active, and
 * revealing a section the first time it scrolls into view. Everything else the
 * prototype tracked in state is CSS or <details>.
 */

/**
 * Breathing room below the line, so a section that has just been navigated to
 * is comfortably past it rather than balanced on it.
 */
const REST_SLACK = 8;

/** Scroll given to each section that cannot reach the line — see update(). */
const TAIL_SCROLL = 170;

/**
 * Where a section counts as current, in px from the top of the viewport.
 *
 * It has to sit at or below where a clicked section comes to rest, otherwise
 * following a nav link leaves the *previous* item lit until you nudge the
 * page. That resting place is two CSS values added together — scroll-padding
 * on <html>, which clears the sticky header, and scroll-margin on the section,
 * which keeps its separator title on screen. Both are fluid, so their sum
 * ranges from 125px to 157px across the breakpoints; a fixed number here was
 * correct at some widths and too small at others. Read them instead.
 *
 * Every section shares one scroll-margin rule, so measuring one speaks for all.
 */
function activationLine(section: HTMLElement): number {
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  const margin = parseFloat(getComputedStyle(section).scrollMarginTop);
  return (pad || 0) + (margin || 0) + REST_SLACK;
}

const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'));

if (sections.length > 0) {
  initScrollSpy(sections);
  initReveal(sections);
}

function initScrollSpy(sections: HTMLElement[]) {
  const links = sections.map((section) =>
    document.querySelector<HTMLAnchorElement>(`[data-nav="${section.id}"]`),
  );

  let active = -1;
  /* Fluid, so it is re-measured on resize rather than read every frame. */
  let line = activationLine(sections[0]);

  /*
   * The active section is the last one whose top has crossed the line.
   *
   * That rule alone breaks at the end of the page: the final sections never
   * get enough scroll left to push their tops up to the line, so they were
   * skipped entirely — on a 1080px window "Changed my mind" could never be
   * selected, and "Get in touch" only lit up in the last few pixels.
   *
   * So the sections that genuinely cannot reach the line share the leftover
   * scroll between them instead. Everything above that tail keeps the plain
   * rule, untouched — an earlier attempt slid the line itself, which moved
   * the mid-page sections around too and made them trade places early.
   */
  /**
   * Measures the page and works out where the tail begins.
   *
   * The tail takes a fixed slice off the end rather than a share of what is
   * left — handing over earlier stole range from the section above and lit
   * the wrong item while you were still looking at it. When there is not even
   * that much scroll left, everyone shares equally instead; otherwise the
   * section above would be squeezed out entirely.
   */
  function measure() {
    const doc = document.documentElement;
    const y = doc.scrollTop;
    const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
    const tops = sections.map((section) => section.getBoundingClientRect().top + y);

    // The last section that can still be scrolled up to the line.
    let lastReachable = 0;
    tops.forEach((top, i) => {
      if (top - line <= maxScroll) lastReachable = i;
    });

    const tail = sections.length - 1 - lastReachable;
    const from = tops[lastReachable] - line;
    const handover =
      tail > 0
        ? Math.max(from + (maxScroll - from) / (tail + 1), maxScroll - tail * TAIL_SCROLL)
        : maxScroll;

    return { y, maxScroll, tops, lastReachable, tail, handover, span: maxScroll - handover };
  }

  function update() {
    const { y, tops, lastReachable, tail, handover, span } = measure();

    let next = 0;
    for (let i = 0; i <= lastReachable; i++) {
      if (tops[i] - y <= line) next = i;
    }

    if (tail > 0 && next === lastReachable && y > handover && span > 0) {
      const step = Math.ceil(((y - handover) / span) * tail);
      next = Math.min(lastReachable + Math.max(0, step), sections.length - 1);
    }

    if (next === active) return;

    links[active]?.classList.remove('is-active');
    links[active]?.removeAttribute('aria-current');
    active = next;
    links[active]?.classList.add('is-active');
    links[active]?.setAttribute('aria-current', 'true');
  }

  let queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }

  /*
   * A section in the tail cannot be scrolled to its resting place — the page
   * runs out first — so the browser stops at the bottom, where a later
   * section owns the highlight and you appear to have clicked the wrong item.
   * Aim at the middle of the section's own slice of the tail instead. It
   * comes to rest lower in the viewport than the others, which is the honest
   * outcome: there is no scroll position that puts it any higher.
   */
  links.forEach((link, i) => {
    link?.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;

      const { maxScroll, tops, lastReachable, tail, handover, span } = measure();
      if (tops[i] - line <= maxScroll || tail < 1 || span <= 0) return;

      event.preventDefault();
      history.replaceState(null, '', `#${sections[i].id}`);
      window.scrollTo({ top: handover + (span * (i - lastReachable - 0.5)) / tail });
    });
  });

  function onResize() {
    line = activationLine(sections[0]);
    onScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  update();
}

function initReveal(sections: HTMLElement[]) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reduced.matches) {
    sections.forEach((section) => section.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const section = entry.target as HTMLElement;
        section.classList.add('in-view');

        section.querySelectorAll<HTMLElement>('[data-line]').forEach((line, i) => {
          line.style.animationDelay = `${110 + i * 70}ms`;
        });

        observer.unobserve(section);
      }
    },
    /*
     * Fire on entry, not on a fraction of the section.
     *
     * A ratio threshold scales with the element, so a tall section had to
     * travel further before it revealed: at 0.12 the 609px project card
     * needed 73px of itself inside a root already shortened 8%, leaving
     * 145px of scroll where its header sat on screen at opacity 0 — about a
     * second of blank card, and worse the taller the section.
     *
     * threshold 0 fires the moment the first pixel crosses the fold, so the
     * fade runs while the section arrives instead of after. Measured at a
     * slow scroll, that took the project card from 73 faded-but-visible
     * frames to 0. A positive bottom margin tested no better and started the
     * animation below the fold, where nobody sees it.
     *
     * Still one threshold, so `isIntersecting` alone decides: the observer
     * only reports crossings, and a callback that gets filtered is the last
     * one that section ever gets.
     */
    { threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}
