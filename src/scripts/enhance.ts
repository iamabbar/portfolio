/**
 * The only client-side JavaScript on the page: which nav item is active, and
 * revealing a section the first time it scrolls into view.
 */

/** Breathing room below the line, so a navigated-to section clears it. */
const REST_SLACK = 8;

/** Scroll given to each section that cannot reach the line — see update(). */
const TAIL_SCROLL = 170;

/**
 * Where a section counts as current, in px from the top of the viewport.
 *
 * It has to sit at or below where a clicked section comes to rest, otherwise
 * following a nav link leaves the *previous* item lit until you nudge the
 * page. That resting place is scroll-padding on <html> plus scroll-margin on
 * the section, both fluid — their sum ranges from 125px to 157px across the
 * breakpoints, so a fixed number here was wrong at some widths. Read them.
 *
 * Every section shares one scroll-margin rule, so measuring one speaks for all.
 */
function activationLine(section: HTMLElement): number {
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  const margin = parseFloat(getComputedStyle(section).scrollMarginTop);
  return (pad || 0) + (margin || 0) + REST_SLACK;
}

const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'));

/* Separators reveal with the card they introduce, so a heading is never on
   screen above an empty space. */
const revealTargets = Array.from(
  document.querySelectorAll<HTMLElement>('main > section[id], main > .separator'),
);

if (sections.length > 0) initScrollSpy(sections);
if (revealTargets.length > 0) initReveal(revealTargets);

function initScrollSpy(sections: HTMLElement[]) {
  const links = sections.map((section) =>
    document.querySelector<HTMLAnchorElement>(`[data-nav="${section.id}"]`),
  );

  let active = -1;
  /* Fluid, so it is re-measured on resize rather than read every frame. */
  let line = activationLine(sections[0]);

  /**
   * The active section is the last one whose top has crossed the line.
   *
   * That rule alone breaks at the end of the page: the final sections never
   * get enough scroll to push their tops up to the line, so they were skipped
   * entirely — on a 1080px window "Changed my mind" could never be selected.
   * So the sections that cannot reach the line share the leftover scroll
   * between them, and everything above that tail keeps the plain rule.
   *
   * The tail takes a fixed slice off the end rather than a share of what is
   * left — handing over earlier stole range from the section above and lit the
   * wrong item while you were still looking at it. When there is not even that
   * much scroll left, everyone shares equally instead.
   */
  function measure() {
    const doc = document.documentElement;
    const y = doc.scrollTop;
    const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
    const tops = sections.map((section) => section.getBoundingClientRect().top + y);

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
   * runs out first — so the browser stops at the bottom, where a later section
   * owns the highlight and you appear to have clicked the wrong item. Aim at
   * the middle of the section's own slice of the tail instead.
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
     * Fire on entry, not on a fraction of the section. A ratio threshold
     * scales with the element, so a tall section had to travel further before
     * it revealed: at 0.12 the 609px project card sat on screen at opacity 0
     * for ~145px of scroll. threshold 0 took that to zero frames.
     *
     * Keep it a single threshold, so `isIntersecting` alone decides.
     */
    { threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}
