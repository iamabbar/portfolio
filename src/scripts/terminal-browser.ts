/**
 * The terminal+browser hero's scroll-driven engine. Pulled out of
 * TerminalBrowser.astro so the component file is template+CSS only —
 * everything here reaches into the IDs/classes that component renders, so
 * the two only make sense read together, but at least this part is scannable
 * on its own instead of buried after a thousand lines of CSS.
 */

type TerminalBrowserData = {
  PROFILE: Record<string, string>;
  ABOUT: Record<string, string>;
  PROJECTS: Array<Record<string, any>>;
  EXPERIENCE: Array<Record<string, any>>;
  STACK: Array<[string, string]>;
  CHANGED_MY_MIND: Array<[string, string]>;
  SCENES: Array<{ id: string; start: number; tab: string; path: string; cmd: string }>;
};

declare global {
  interface Window {
    /** Handed off from the `define:vars` script in TerminalBrowser.astro,
        which is the only place that can see the frontmatter-computed data. */
    __TB_DATA__: TerminalBrowserData;
  }
}

export function initTerminalBrowser(data: TerminalBrowserData) {
  const { PROFILE, ABOUT, PROJECTS, EXPERIENCE, STACK, CHANGED_MY_MIND, SCENES } = data;

  /* ================================================================
     PAGE TEMPLATES — one per scene.
     data-r="start,dur" marks an element that fades/slides in during the reveal phase.
     ================================================================ */
  const esc = (s: unknown) =>
    String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

  const PAGES: Record<string, () => string> = {
    home: () => `
      <div class="tb-page__center">
        <span class="tb-mono tb-muted tb-home-role" data-r="0">${esc(PROFILE.role)}</span>
        <div class="tb-home-head">
          <h1 class="tb-display" data-r="0.12">${esc(PROFILE.firstName)}<br>${esc(PROFILE.lastName)}<span class="tb-accent">.</span></h1>
          <img class="tb-avatar" data-r="0.12" src="${esc(PROFILE.avatar)}" alt="${esc(PROFILE.firstName)} ${esc(PROFILE.lastName)}">
        </div>
        <p class="tb-lead" data-r="0.26">${esc(PROFILE.tagline)}<br>${esc(PROFILE.taglineHighlight)}</p>
        <span class="tb-mono tb-muted" data-r="0.34">${esc(PROFILE.locationLine)}</span>
      </div>`,
    about: () => `
      <div class="tb-stack-col tb-narrow">
        <h2 class="tb-h2" data-r="0">${esc(ABOUT.heading)}</h2>
        <p class="tb-lead tb-ink" data-r="0.12">${esc(ABOUT.lead)}</p>
        <p class="tb-body" data-r="0.26">${esc(ABOUT.body)}</p>
        <p class="tb-note" data-r="0.4"><strong>Note to self:</strong> ${esc(ABOUT.note)}</p>
      </div>`,
    projects: () => {
      const step = Math.min(0.25, 0.8 / PROJECTS.length);
      return `
      <div class="tb-grid">
        ${PROJECTS.map(
          (p, i) => `
          <article class="tb-project" data-r="${(0.05 + i * step).toFixed(3)},0.2">
            <div class="tb-project__hero" style="background:${esc(p.theme.bg)};color:${esc(p.theme.fg)};">
              <div class="tb-project__hero-text">
                <h4 class="tb-project__headline">${esc(p.headline)}</h4>
                <p class="tb-project__hook">${esc(p.hook)}</p>
              </div>
              ${
                p.image
                  ? `<div class="tb-project__peek">
                      <div class="tb-project__peek-bar">
                        <span></span><span></span><span></span>
                        <span class="tb-project__peek-url">${esc(p.previewUrl)}</span>
                      </div>
                      <img class="tb-project__peek-img" src="${esc(p.image)}" alt="${esc(p.imageAlt)}">
                    </div>`
                  : ''
              }
            </div>
            <div class="tb-project__head"><h3>${esc(p.name)}</h3><span class="tb-mono tb-muted">${esc(p.meta)}</span></div>
            ${p.summary.map((s: string) => `<p class="tb-body">${esc(s)}</p>`).join('')}
            <span class="tb-mono tb-muted">${esc(p.tech)}</span>
            <div class="tb-links">
              ${p.liveUrl ? `<a href="${esc(p.liveUrl)}">Live ↗</a>` : ''}
              ${p.sourceUrl ? `<a href="${esc(p.sourceUrl)}">Source ↗</a>` : ''}
            </div>
          </article>`,
        ).join('')}
      </div>`;
    },
    experience: () => `
      <ol class="tb-list">
        ${EXPERIENCE.map(
          (j, i) => `
          <li class="tb-job" data-r="${0.05 + i * 0.14},0.14">
            <span class="tb-job__org">${esc(j.org)}</span>
            <span class="tb-job__role">${esc(j.role)}</span>
            <span class="tb-job__when tb-mono ${j.current ? 'tb-link-color' : 'tb-muted'}">${esc(j.when)}</span>
          </li>`,
        ).join('')}
      </ol>`,
    stack: () => {
      const step = Math.min(0.08, 0.8 / STACK.length);
      return `
      <dl class="tb-cards">
        ${STACK.map(
          ([k, v], i) => `
          <div class="tb-card" data-r="${(0.04 + i * step).toFixed(3)},0.12"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`,
        ).join('')}
      </dl>`;
    },
    changelog: () => `
      <ol class="tb-mind">
        ${CHANGED_MY_MIND.map(
          ([before, now], i) => `
          <li data-mind="${i}">
            <span class="tb-mind__old">${esc(before)}<span class="tb-mind__strike"></span></span>
            <span class="tb-mind__new">${esc(now)}</span>
          </li>`,
        ).join('')}
      </ol>`,
    contact: () => `
      <div class="tb-page__center">
        <span class="tb-mono tb-ok" data-r="0">${esc(PROFILE.statusLine)}</span>
        <a class="tb-email" href="mailto:${esc(PROFILE.email)}" data-email></a>
        <div class="tb-actions" data-r="0.26">
          <a class="tb-btn tb-btn--primary" href="mailto:${esc(PROFILE.email)}">Send an email</a>
          <a class="tb-btn" href="${esc(PROFILE.github)}" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a class="tb-btn" href="${esc(PROFILE.linkedin)}" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </div>`,
  };

  const SKELETON = `
    <div class="tb-skeleton" aria-label="Loading">
      <div class="tb-sk" style="height:44px;width:60%"></div>
      <div class="tb-sk" style="height:16px;width:90%"></div>
      <div class="tb-sk" style="height:16px;width:80%"></div>
      <div class="tb-sk" style="height:160px;width:100%"></div>
    </div>`;

  /* ================================================================
     ENGINE
     ================================================================ */
  const $ = (id: string) => document.getElementById(id)!;
  const track = $('tb-track'),
    stage = $('tb-stage'),
    wrap = $('tb-wrap');
  const logEl = $('tb-log'),
    typedEl = $('tb-typed'),
    tabsEl = $('tb-tabs');
  const urlEl = $('tb-url'),
    progEl = $('tb-progress'),
    pageEl = $('tb-page');
  const nextEl = $('tb-next'),
    nextLabelEl = $('tb-next-label');

  const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const sceneEnd = (i: number) => (i < SCENES.length - 1 ? SCENES[i + 1].start : 1.0001);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const BOOT_MS = 1800;
  /* Once a page is ready, it reveals itself over this much real time,
     regardless of whether the user keeps scrolling — otherwise stopping
     right as the skeleton disappears freezes everything at 0 opacity
     until more scroll input arrives. */
  const REVEAL_MS = 500;
  const t0 = performance.now();
  let lastLogKey = '',
    lastPageKey = '',
    lastNextIdx = -2,
    lastIdx = -1,
    revealStart = 0,
    raf = 0;

  function progress() {
    const rect = track.getBoundingClientRect();
    const total = rect.height - stage.offsetHeight;
    return total > 0 ? clamp(-rect.top / total) : 0;
  }

  /**
   * Jumps instantly, no scroll animation — clicking a tab (or the Next
   * button) should snap straight there, not fly past every scene in
   * between. The animated, "scroll past each scene" experience is still
   * what you get from actually scrolling by hand.
   */
  function goTo(sceneIndex: number) {
    const scene = SCENES[sceneIndex];
    const end = sceneEnd(sceneIndex);
    const target = scene.start + 0.99 * (end - scene.start);
    const total = track.offsetHeight - stage.offsetHeight;
    const top = window.scrollY + track.getBoundingClientRect().top + target * total;
    window.scrollTo({ top, behavior: 'instant' });
  }

  // a nudge for anyone who hasn't noticed the tabs are clickable
  let curIdx = 0;
  nextEl.addEventListener('click', () => {
    if (curIdx + 1 < SCENES.length) goTo(curIdx + 1);
  });

  function render() {
    raf = 0;
    const p = progress();
    const boot = reduced ? 1 : Math.min(1, (performance.now() - t0) / BOOT_MS);

    let idx = 0;
    SCENES.forEach((s, i) => {
      if (p >= s.start) idx = i;
    });
    const cur = SCENES[idx];
    let t = clamp((p - cur.start) / (sceneEnd(idx) - cur.start));
    if (idx === 0) t = Math.max(t, boot * 0.8);
    if (reduced) t = 1;

    // entering a new scene: snap the loading bar back to 0% with no
    // transition first, so it doesn't visibly retract from the previous
    // scene's 100% before growing forward again
    if (idx !== lastIdx) {
      lastIdx = idx;
      progEl.style.transition = 'none';
      progEl.style.width = '0%';
      void progEl.offsetWidth;
      progEl.style.transition = '';
    }

    const typeDur = idx === 0 ? 0.3 : 0.14,
      loadDur = 0.14;
    const tk = clamp(t / typeDur);
    const lk = clamp((t - typeDur) / loadDur);
    const ready = lk >= 1;

    // background glow + browser grow-in
    stage.style.setProperty('--tb-glow', (0.05 + p * 0.18).toFixed(3));
    const grow = idx === 0 && !reduced ? clamp((t - 0.3) / 0.25) : 1;
    wrap.style.flexBasis = Math.round(900 * grow) + 'px';
    wrap.style.opacity = String(grow);

    // terminal log (rebuild only when it changes)
    const logKey = idx + '|' + (tk >= 1) + '|' + ready;
    if (logKey !== lastLogKey) {
      lastLogKey = logKey;
      const entries: [string, string][] = SCENES.slice(0, idx).map((s) => [s.cmd, '→ opened in a new tab']);
      if (tk >= 1) entries.push([cur.cmd, ready ? '→ opened in a new tab' : '… loading']);
      logEl.innerHTML = entries
        .map(
          ([c, o]) =>
            `<div class="tb-term__entry"><div><span class="tb-term__arrow">➜</span> <span class="tb-term__dir">~</span> ${esc(c)}</div><span class="tb-term__out">${esc(o)}</span></div>`,
        )
        .join('');
    }
    typedEl.textContent = tk >= 1 ? '' : cur.cmd.slice(0, Math.round(cur.cmd.length * tk));

    // address bar + loading bar
    const urlK = clamp((t - typeDur * 0.5) / (typeDur * 0.6));
    urlEl.textContent = 'https://' + (tk >= 1 ? cur.path : cur.path.slice(0, Math.round(cur.path.length * urlK)));
    progEl.style.width = Math.round(clamp(lk) * 100) + '%';
    progEl.style.opacity = ready ? '0' : '1';

    // tabs: all open from the start (click any one to jump straight to it, no scrolling required)
    const visible = SCENES;
    for (let i = tabsEl.children.length; i < visible.length; i++) {
      const s = visible[i];
      const b = document.createElement('button');
      b.className = 'tb-tab';
      b.setAttribute('role', 'tab');
      b.innerHTML = `<span class="tb-tab__favicon"></span>${esc(s.tab)}`;
      b.addEventListener('click', () => goTo(i));
      tabsEl.appendChild(b);
    }
    [...tabsEl.children].forEach((b, i) => {
      const active = i === idx;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });

    // "Next" nudge: visible once the page has loaded, hidden on the last tab
    curIdx = idx;
    const nextIdx = idx + 1 < SCENES.length ? idx + 1 : -1;
    nextEl.classList.toggle('is-visible', ready && nextIdx !== -1);
    if (nextIdx !== lastNextIdx) {
      lastNextIdx = nextIdx;
      if (nextIdx !== -1) nextLabelEl.textContent = SCENES[nextIdx].tab;
    }

    // page: skeleton for the whole pre-ready stretch (typing included —
    // no blank frame while the command is still being typed), scene
    // template once ready
    const pageKey = cur.id + '|' + (ready ? 'R' : 'L');
    if (pageKey !== lastPageKey) {
      lastPageKey = pageKey;
      pageEl.innerHTML = ready ? PAGES[cur.id]() : SKELETON;
      if (ready) revealStart = performance.now();
    }

    // reveal driven by real time since the page mounted, not by further
    // scrolling — so it always finishes on its own even if you stop
    // scrolling the instant the skeleton disappears
    const pt = ready ? (reduced ? 1 : clamp((performance.now() - revealStart) / REVEAL_MS)) : 0;

    if (ready) {
      // staged reveals
      pageEl.querySelectorAll<HTMLElement>('[data-r]').forEach((el) => {
        const [s, d = '0.15'] = el.dataset.r!.split(',');
        const k = clamp((pt - parseFloat(s)) / parseFloat(d));
        el.style.opacity = String(k);
        el.style.transform = `translateY(${((1 - k) * 24).toFixed(1)}px)`;
      });
      // "changed my mind": old fades in → red strike draws → new slides in
      pageEl.querySelectorAll<HTMLElement>('[data-mind]').forEach((li) => {
        const s0 = 0.04 + parseInt(li.dataset.mind!, 10) * 0.15;
        (li.children[0] as HTMLElement).style.opacity = String(clamp((pt - s0) / 0.04));
        (li.querySelector('.tb-mind__strike') as HTMLElement).style.width =
          clamp((pt - s0 - 0.03) / 0.05) * 100 + '%';
        const nk = clamp((pt - s0 - 0.07) / 0.05);
        (li.children[1] as HTMLElement).style.opacity = String(nk);
        (li.children[1] as HTMLElement).style.transform = `translateY(${((1 - nk) * 10).toFixed(1)}px)`;
      });
      // email types itself out
      const em = pageEl.querySelector('[data-email]');
      if (em) em.textContent = PROFILE.email.slice(0, Math.round(PROFILE.email.length * clamp((pt - 0.1) / 0.4)));
    }

    // keep animating while the first command auto-types, or while a
    // just-mounted page is still revealing itself
    if (boot < 1 || (ready && pt < 1)) schedule();
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(render);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  render();
}
