/* The calculator versions' shared engine. Each version is markup and CSS;
   this fills it from calculator-data.json and keeps it live:
     [data-copy="path"]    copy from the data file ({tokens} filled, **bold**)
     [data-link="name"]    href from data.links
     [data-input="key"]    a field: label, hint with its source, number, slider
                           (data-field="inline" for a bare number field,
                           data-field="vc" for design 05's field and its
                           shader-filled slider; data-label="short|simple"
                           picks the label, data-hint="off" drops the hint)
     [data-out="key"]      a live value, data-format compact|full|count|pct0|pct1|decimal,
                           data-animate to count to each new value
     [data-share="key"]    a bar as wide as that value's share of the total
     [data-when="eligible|ineligible"]  shown either side of the 200-employee line
     [data-gated]          below that line: a fieldset is disabled, anything else dimmed
     [data-benchmark="key"]  shown once a value is typed over its benchmark; puts it back
     [data-products="path"], [data-method], [data-sources]   lists from the data
     [data-copy-button="path"]   copies that copy's text
     [data-announce="path"]  a live region read out after each change
     [data-sticky-total] appears once [data-sticky-anchor] scrolls away (and,
                           with [data-sticky-end], leaves once that reaches the
                           screen), or while the data-sticky-zone selector is on screen
   The numbers come from calculator-v21.js, Matt's formulas exactly. */
(function () {
  'use strict';
  const root = document.querySelector('[data-calculator]');
  if (!root || !window.PaveCalculatorV21) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const full = (n) => '$' + Math.round(n).toLocaleString('en-US');
  // Matt's compact format: $1.21B, $38.2M, $540K
  const compact = (n) => n >= 1e9 ? '$' + (n / 1e9).toFixed(2) + 'B' : n >= 1e6 ? '$' + (n / 1e6).toFixed(1) + 'M'
    : n >= 1e3 ? '$' + Math.round(n / 1e3).toLocaleString('en-US') + 'K' : full(n);
  const FORMAT = {
    compact, full, money: full,
    count: (n) => Math.round(n).toLocaleString('en-US'),
    pct0: (n) => (n * 100).toFixed(0) + '%',
    pct1: (n) => (n * 100).toFixed(1) + '%',
    decimal: (n) => n.toFixed(1),
  };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const at = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

  fetch(root.getAttribute('data-calculator')).then((r) => r.json()).then(start);

  function start(data) {
    const model = PaveCalculatorV21.create(data);
    let state = Object.assign({}, model.defaults);
    let r = model.calculate(state);

    // The total as a share of comp spend (design 05's "of your spend" line).
    const share = () => (r.spend > 0 ? r.total / r.spend : 0);
    const tokens = () => ({
      spend: compact(r.spend), spendFull: full(r.spend), total: compact(r.total), totalFull: full(r.total), share: FORMAT.pct1(share()),
      headcount: FORMAT.count(r.headcount), avgComp: full(r.avgComp),
      benchmarkComp: full(r.size.comp), benchmarkLabel: r.size.label, teamBenchmark: FORMAT.decimal(r.teamBenchmark),
      fte: FORMAT.decimal(r.fte), outOfRangeEmployees: FORMAT.count(r.outOfRangeEmployees),
      outOfBand: FORMAT.pct1(r.outOfBand), precision: FORMAT.pct1(r.precision), hires: FORMAT.count(r.hires),
    });
    // Copy: escape, fill {tokens}, then **bold** and line breaks.
    const fill = (text, t) => esc(text).replace(/\{(\w+)\}/g, (m, k) => (k in t ? esc(t[k]) : m)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    const plain = (text, t) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in t ? t[k] : m)).replace(/\*\*(.+?)\*\*/g, '$1').replace(/\n/g, ' ');

    // Static copy and links, once; copy with tokens is redrawn on every change.
    const live = [];
    root.querySelectorAll('[data-copy]').forEach((el) => {
      const text = at(data, el.getAttribute('data-copy'));
      if (typeof text !== 'string') return;
      if (/\{\w+\}/.test(text)) live.push([el, text]);
      else el.innerHTML = fill(text, {});
    });
    root.querySelectorAll('[data-link]').forEach((el) => { el.href = data.links[el.getAttribute('data-link')] || '#'; });
    root.querySelectorAll('[data-products]').forEach((el) => {
      el.innerHTML = (at(data, el.getAttribute('data-products')) || []).map((p) => `<li>${esc(p)}</li>`).join('');
    });
    root.querySelectorAll('[data-method]').forEach((el) => {
      el.innerHTML = data.method.sections.map((s) => `<div class="cm-row"><h3 class="cm-head">${esc(s.title)}</h3><p class="cm-text">${fill(s.text, {})}</p></div>`).join('');
    });
    root.querySelectorAll('[data-sources]').forEach((el) => {
      el.innerHTML = data.method.sources.map((s) => `<li><a href="${esc(data.links[s.link])}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('');
    });

    // Fields
    const fields = [];
    root.querySelectorAll('[data-input]').forEach((mount, n) => {
      const key = mount.getAttribute('data-input');
      const spec = data.inputs[key];
      if (!spec) return;
      const id = `cf-${key}-${n}`;
      const kind = mount.getAttribute('data-field');
      const label = spec[mount.getAttribute('data-label')] || spec.label;
      const hint = spec.hint && mount.getAttribute('data-hint') !== 'off'
        ? `<span data-hint></span>${spec.source ? ` · Source: <a href="${esc(data.links[spec.source])}" target="_blank" rel="noopener">Pave Report</a>` : ''}` : '';
      const input = (cls, extra) => `<input class="${cls}" id="${id}" type="text" inputmode="${spec.format === 'count' ? 'numeric' : 'decimal'}" autocomplete="off" spellcheck="false"${extra || ''}>`;
      if (kind === 'inline') {
        mount.classList.add('cf-inline');
        mount.innerHTML = input('cf-num', ` aria-label="${esc(spec.label)}"`);
      } else if (kind === 'vc') {
        // Design 05's field, as calculator-experience.js draws it: the number
        // beside its label, then the capsule slider whose filled side is a
        // live mesh (calculator-sliders.js).
        mount.innerHTML = `<div class="vc-field-top"><label for="${id}">${esc(label)}</label><div class="vc-input-wrap">${input('vc-number')}</div></div>` +
          (hint ? `<p class="vc-hint">${hint}</p>` : '') +
          `<div class="vc-slider"><div class="vc-slider-track" aria-hidden="true"><div class="vc-slider-fill"><canvas class="vc-slider-canvas" width="512" height="64"></canvas></div></div>` +
          `<input class="vc-range" type="range" aria-label="${esc(label)}"></div>`;
      } else {
        mount.classList.add('cf');
        mount.innerHTML = `<div class="cf-top"><label class="cf-label" for="${id}">${esc(label)}</label>${input('cf-num')}</div>` +
          (hint ? `<p class="cf-hint">${hint}</p>` : '') +
          `<div class="cf-slider"><input class="cf-range" type="range" aria-label="${esc(label)}"></div>`;
      }
      const number = mount.querySelector('.cf-num, .vc-number');
      const range = mount.querySelector('.cf-range, .vc-range');
      const slider = mount.querySelector('.vc-slider');
      const hintEl = mount.querySelector('[data-hint]');
      // Log sliders map 0-1000 the way v21 does; linear ones step natively.
      const log = spec.scale === 'log';
      const toPos = (v) => log ? Math.round(1000 * Math.log(v / spec.min) / Math.log(spec.max / spec.min)) : v;
      const fromPos = (p) => log ? spec.min * Math.pow(spec.max / spec.min, p / 1000) : p;
      if (range) {
        range.min = log ? 0 : spec.min; range.max = log ? 1000 : spec.max; range.step = log ? 1 : spec.step;
        range.addEventListener('input', () => { state = model.set(state, key, fromPos(Number(range.value))); render(); });
      }
      const pct = spec.format.startsWith('pct');
      const commit = () => {
        const value = parseFloat(number.value.replace(/[^0-9.]/g, ''));
        if (Number.isFinite(value)) state = model.set(state, key, pct ? value / 100 : value);
        render(true);
      };
      number.addEventListener('change', commit);
      number.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); number.select(); } });
      number.addEventListener('focus', () => number.select());
      fields.push({ key, spec, number, range, slider, hintEl, toPos });
    });
    // Design 05's sliders share one small WebGL mesh for their filled sides.
    const surfaces = fields.filter((f) => f.slider).map((f) => ({ slider: f.slider, range: f.range, canvas: f.slider.querySelector('canvas') }));
    const sliderMotion = surfaces.length && window.PaveSliderMesh ? window.PaveSliderMesh.mount(surfaces, reduced) : null;

    // Live numbers, counting to each new value.
    const outs = [...root.querySelectorAll('[data-out]')].map((el) => ({ el, key: el.getAttribute('data-out'),
      format: FORMAT[el.getAttribute('data-format') || 'full'], animate: el.hasAttribute('data-animate') && !reduced.matches, shown: null, raf: 0 }));
    // The first paint counts the animated numbers up from zero, over the
    // calculator's 1.4s; later changes take 420ms from where they are.
    for (const o of outs) if (o.animate) { o.shown = 0; o.intro = true; }
    function show(o, value) {
      if (!o.animate || o.shown === null || o.shown === value) { o.shown = value; o.el.textContent = o.format(value); return; }
      cancelAnimationFrame(o.raf); clearTimeout(o.settle);
      const from = o.shown, start = performance.now(), dur = o.intro ? 1400 : 420;
      o.intro = false;
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - t, 3);
        o.el.textContent = o.format(from + (value - from) * e);
        if (t < 1) o.raf = requestAnimationFrame(step); else clearTimeout(o.settle);
      };
      o.shown = value; o.raf = requestAnimationFrame(step);
      // Where frames are held back (a tab opened in the background), the
      // number still lands on its value.
      o.settle = setTimeout(() => { cancelAnimationFrame(o.raf); o.el.textContent = o.format(value); }, dur + 150);
    }

    const shares = [...root.querySelectorAll('[data-share]')];
    const gated = [...root.querySelectorAll('[data-gated]')];
    const benchmarks = [...root.querySelectorAll('[data-benchmark]')];
    const announcers = [...root.querySelectorAll('[data-announce]')];
    let announced = false, announceTimer = 0;

    function render(force) {
      r = model.calculate(state);
      const t = tokens();
      for (const [el, text] of live) el.innerHTML = fill(text, t);
      for (const f of fields) {
        const value = f.key === 'avgComp' ? r.avgComp : f.key === 'team' ? r.team : r[f.key];
        if (force || document.activeElement !== f.number) f.number.value = FORMAT[f.spec.format](value);
        if (f.range) {
          if (document.activeElement !== f.range) f.range.value = f.toPos(value);
          const p = Math.max(0, Math.min(1, (f.toPos(value) - Number(f.range.min)) / (Number(f.range.max) - Number(f.range.min))));
          f.range.style.setProperty('--p', (p * 100).toFixed(2) + '%');
          f.range.setAttribute('aria-valuetext', FORMAT[f.spec.format](value));
          if (f.slider) {
            // 05's capsule: the fill reaches 16px past the thumb's centre.
            f.slider.style.setProperty('--fill', (p * 100).toFixed(2) + '%');
            f.slider.style.setProperty('--thumb-offset', (32 - 32 * p).toFixed(2) + 'px');
            f.slider.dataset.empty = String(p <= 0);
            f.slider.dataset.full = String(p >= 1);
          }
        }
        if (f.hintEl) f.hintEl.innerHTML = fill(f.spec.hint, t);
      }
      // Below 200 employees questions 3 and 4 carry nothing, so neither do
      // their parts (Matt's page hides them; 05 zeroes them).
      const values = Object.assign({}, r, { share: share() });
      if (!r.eligible) for (const k of ['capacity', 'range', 'merit', 'acceptance', 'proactive', 'clarity']) values[k] = 0;
      for (const o of outs) if (o.key in values) show(o, values[o.key]);
      for (const el of shares) el.style.width = (r.total > 0 ? (values[el.getAttribute('data-share')] || 0) / r.total * 100 : 0).toFixed(2) + '%';
      root.querySelectorAll('[data-when]').forEach((el) => { el.hidden = (el.getAttribute('data-when') === 'eligible') !== r.eligible; });
      for (const el of gated) { if (el.tagName === 'FIELDSET') el.disabled = !r.eligible; else el.classList.toggle('is-gated', !r.eligible); }
      for (const btn of benchmarks) btn.hidden = state[btn.getAttribute('data-benchmark')] === null;
      root.classList.toggle('is-small', !r.eligible);
      if (sliderMotion) sliderMotion.refresh();
      // Read the new total out once the slider settles (not on load).
      if (announcers.length && announced) {
        clearTimeout(announceTimer);
        announceTimer = setTimeout(() => { for (const el of announcers) el.textContent = plain(at(data, el.getAttribute('data-announce')), tokens()); }, 550);
      }
      announced = true;
    }

    // Copy a piece of copy as plain text (the CFO talk track).
    root.querySelectorAll('[data-copy-button]').forEach((btn) => {
      const label = btn.textContent;
      btn.addEventListener('click', async () => {
        const text = plain(at(data, btn.getAttribute('data-copy-button')), tokens());
        try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied'; } catch { btn.textContent = 'Select and copy'; }
        setTimeout(() => { btn.textContent = label; }, 1600);
      });
    });

    // The running total: once the hero's total has scrolled away, or (05's
    // phone pill) while the fields are on screen.
    const bar = root.querySelector('[data-sticky-total]'), anchor = root.querySelector('[data-sticky-anchor]');
    const zone = bar && bar.hasAttribute('data-sticky-zone') ? root.querySelector(bar.getAttribute('data-sticky-zone')) : null;
    if (bar && zone && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => bar.classList.toggle('is-on', entry.isIntersecting), { rootMargin: '-80px 0px -80px 0px' }).observe(zone);
    } else if (bar && anchor && 'IntersectionObserver' in window) {
      // Past the hero's total, and (where the page marks one) not yet at the
      // end of the calculator (Teresa, Oct 20: "stop at the end of the calculator").
      const end = root.querySelector('[data-sticky-end]');
      let past = false, ended = false;
      const sync = () => bar.classList.toggle('is-on', past && !ended);
      new IntersectionObserver(([entry]) => { past = !entry.isIntersecting && entry.boundingClientRect.top < 0; sync(); }).observe(anchor);
      if (end) new IntersectionObserver(([entry]) => { ended = entry.isIntersecting || entry.boundingClientRect.top < 0; sync(); }).observe(end);
    }

    // Back to a benchmark, and reset to Matt's defaults.
    for (const btn of benchmarks) btn.addEventListener('click', () => { state = Object.assign({}, state, { [btn.getAttribute('data-benchmark')]: null }); render(true); });
    root.querySelectorAll('[data-reset]').forEach((btn) => btn.addEventListener('click', () => {
      state = Object.assign({}, model.defaults);
      root.querySelectorAll('details[data-reset-close]').forEach((d) => { d.open = false; });
      render(true);
    }));

    render(true);
    root.classList.add('is-ready');
  }
})();
