// Engine for the terminal+browser hero. Reaches into IDs/classes from TerminalBrowser.astro.
// Navigation is click/tap-only (tabs + the prev/next stepper); each tab's own content scrolls independently.

type TerminalBrowserData = {
  PROFILE: Record<string, string>;
  ABOUT: Record<string, string>;
  PROJECTS: Array<Record<string, any>>;
  EXPERIENCE: Array<Record<string, any>>;
  STACK: Array<[string, string]>;
  CHANGED_MY_MIND: Array<[string, string]>;
  SCENES: Array<{ id: string; tab: string; path: string; cmd: string }>;
};

declare global {
  interface Window {
    __TB_DATA__: TerminalBrowserData;
  }
}

export function initTerminalBrowser(data: TerminalBrowserData) {
  const { PROFILE, ABOUT, PROJECTS, EXPERIENCE, STACK, CHANGED_MY_MIND, SCENES } = data;

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
            <span class="tb-mind__old">${esc(before)}</span>
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

  const $ = (id: string) => document.getElementById(id)!;
  const logEl = $('tb-log'),
    typedEl = $('tb-typed'),
    tabsEl = $('tb-tabs');
  const urlEl = $('tb-url'),
    pageEl = $('tb-page');
  const stepperEl = $('tb-stepper'),
    dividerEl = $('tb-stepper-divider');
  const prevEl = $('tb-prev'),
    prevLabelEl = $('tb-prev-label');
  const nextEl = $('tb-next'),
    nextLabelEl = $('tb-next-label');

  const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TYPE_MS = 280;
  // Reveal is time-based, so it always finishes smoothly regardless of device.
  const REVEAL_MS = 500;

  let curIdx = -1;
  let phase: 'typing' | 'reveal' = 'typing';
  let phaseStart = 0;
  let raf = 0;

  function schedule() {
    if (!raf) raf = requestAnimationFrame(render);
  }

  // entries for every tab already opened, optionally including the current one
  function rebuildLog(includeCurrent: boolean) {
    const upTo = includeCurrent ? curIdx + 1 : curIdx;
    logEl.innerHTML = SCENES.slice(0, upTo)
      .map(
        (s) =>
          `<div class="tb-term__entry"><div><span class="tb-term__arrow">➜</span> <span class="tb-term__dir">~</span> ${esc(s.cmd)}</div><span class="tb-term__out">→ opened in a new tab</span></div>`,
      )
      .join('');
  }

  function updateTabs() {
    [...tabsEl.children].forEach((b, i) => {
      const active = i === curIdx;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
      if (active) (b as HTMLElement).scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  }

  function updateStepper() {
    const hasPrev = curIdx > 0;
    const hasNext = curIdx + 1 < SCENES.length;
    stepperEl.classList.toggle('is-visible', phase === 'reveal' && (hasPrev || hasNext));
    prevEl.hidden = !hasPrev;
    nextEl.hidden = !hasNext;
    dividerEl.hidden = !(hasPrev && hasNext);
    if (hasPrev) prevLabelEl.textContent = SCENES[curIdx - 1].tab;
    if (hasNext) nextLabelEl.textContent = SCENES[curIdx + 1].tab;
  }

  function applyReveal(pt: number) {
    pageEl.querySelectorAll<HTMLElement>('[data-r]').forEach((el) => {
      const [s, d = '0.15'] = el.dataset.r!.split(',');
      const k = clamp((pt - parseFloat(s)) / parseFloat(d));
      el.style.opacity = String(k);
      el.style.transform = `translateY(${((1 - k) * 24).toFixed(1)}px)`;
    });
    // "changed my mind": old fades in → gets struck through → new slides in
    pageEl.querySelectorAll<HTMLElement>('[data-mind]').forEach((li) => {
      const s0 = 0.04 + parseInt(li.dataset.mind!, 10) * 0.15;
      (li.children[0] as HTMLElement).style.opacity = String(clamp((pt - s0) / 0.04));
      (li.children[0] as HTMLElement).classList.toggle('is-struck', pt - s0 > 0.03);
      const nk = clamp((pt - s0 - 0.07) / 0.05);
      (li.children[1] as HTMLElement).style.opacity = String(nk);
      (li.children[1] as HTMLElement).style.transform = `translateY(${((1 - nk) * 10).toFixed(1)}px)`;
    });
    const em = pageEl.querySelector('[data-email]');
    if (em) em.textContent = PROFILE.email.slice(0, Math.round(PROFILE.email.length * clamp((pt - 0.1) / 0.4)));
  }

  function render() {
    raf = 0;
    const now = performance.now();
    const scene = SCENES[curIdx];

    if (phase === 'typing') {
      const tk = reduced ? 1 : clamp((now - phaseStart) / TYPE_MS);
      typedEl.textContent = scene.cmd.slice(0, Math.round(scene.cmd.length * tk));
      urlEl.textContent = 'https://' + scene.path.slice(0, Math.round(scene.path.length * tk));
      if (tk >= 1) {
        phase = 'reveal';
        phaseStart = now;
        typedEl.textContent = '';
        rebuildLog(true);
        pageEl.innerHTML = PAGES[scene.id]();
        pageEl.scrollTop = 0;
        applyReveal(reduced ? 1 : 0);
      }
      updateStepper();
      schedule();
      return;
    }

    const pt = reduced ? 1 : clamp((now - phaseStart) / REVEAL_MS);
    applyReveal(pt);
    updateStepper();
    if (pt < 1) schedule();
  }

  function goTo(sceneIndex: number) {
    if (sceneIndex === curIdx) return;
    curIdx = sceneIndex;
    phase = 'typing';
    phaseStart = performance.now();
    rebuildLog(false);
    updateTabs();
    updateStepper();
    schedule();
  }

  SCENES.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'tb-tab';
    b.setAttribute('role', 'tab');
    b.innerHTML = `<span class="tb-tab__favicon"></span>${esc(s.tab)}`;
    b.addEventListener('click', () => goTo(i));
    tabsEl.appendChild(b);
  });

  prevEl.addEventListener('click', () => {
    prevEl.blur();
    if (curIdx > 0) goTo(curIdx - 1);
  });
  nextEl.addEventListener('click', () => {
    nextEl.blur();
    if (curIdx + 1 < SCENES.length) goTo(curIdx + 1);
  });

  goTo(0);
}
