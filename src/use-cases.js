/* Pave Agent use cases: one renderer for the three index directions and the
   detail page, all from use-cases-data.json (Pave's records, as their product
   team wrote them). The body says which page this is:
     data-uc="hub"      search first, a featured use case, then each category
     data-uc="grid"     a filter bar over one grid of cards
     data-uc="ledger"   the research index's ruled rows
     data-uc="detail"   one use case, from ?case=<id> (&from=<index> for the way back)
   Filters (search, category, role, product) are shared by the three indexes. */
(function () {
  'use strict';
  var body = document.body, kind = body.getAttribute('data-uc');
  var root = document.querySelector('[data-uc-root]');
  if (!root || !kind) return;
  var params = new URLSearchParams(location.search);
  // V2 (Teresa, Oct 27, on Grid, Pave's pick): text-only cards, a new hover,
  // and the detail page's related use cases as the same cards.
  var v2 = body.getAttribute('data-uc-version') === '2';
  var INDEX = { hub: 'use-cases-hub.html', grid: v2 ? 'use-cases-grid-v2.html' : 'use-cases-grid.html', ledger: 'use-cases-ledger.html' };
  var from = INDEX[params.get('from')] ? params.get('from') : (INDEX[kind] ? kind : 'ledger');
  var ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var uniq = function (a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); };
  // A handoff copy names its own addresses: data-uc-href="/use-cases/{id}.html", data-uc-index="/use-cases/".
  var HREF = body.getAttribute('data-uc-href');
  if (body.hasAttribute('data-uc-index')) INDEX[from] = body.getAttribute('data-uc-index');
  var href = function (u) { return HREF ? HREF.replace('{id}', encodeURIComponent(u.id)) : (v2 ? 'use-case-v2.html' : 'use-case.html') + '?case=' + encodeURIComponent(u.id) + '&from=' + from; };
  // [Placeholders] in a prompt are what the reader fills in.
  var prompt = function (p) { return esc(p).replace(/\[([^\]]+)\]/g, '<mark>[$1]</mark>'); };
  var set = function (sel, html) { root.querySelectorAll(sel).forEach(function (el) { el.innerHTML = html; }); };

  fetch(root.getAttribute('data-uc-root')).then(function (r) { return r.json(); }).then(function (data) {
    var all = data.useCases, P = data.page;
    root.querySelectorAll('[data-copy]').forEach(function (el) {
      var v = el.getAttribute('data-copy').split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, data);
      if (typeof v === 'string') el.textContent = v;
    });
    root.querySelectorAll('[data-link]').forEach(function (el) { el.href = data.links[el.getAttribute('data-link')]; });
    if (kind === 'detail') detail(data);
    else index(data);
    root.classList.add('is-ready');
  });

  /* ── The three indexes ──────────────────────────────────────────────── */
  function index(data) {
    var all = data.useCases, P = data.page;
    var CATS = uniq(all.map(function (u) { return u.category; }));
    var ROLES = uniq([].concat.apply([], all.map(function (u) { return u.roles; }))).sort();
    var PRODUCTS = uniq([].concat.apply([], all.map(function (u) { return u.products; }))).sort();
    var state = { q: '', cat: P.all, role: '', product: '' };

    // Filters: search, category chips with counts, role and product.
    var opts = function (list, label) { return '<option value="">' + esc(label) + '</option>' + list.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join(''); };
    set('[data-filters]',
      '<div class="uc-filter-row"><label class="uc-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
      '<input type="search" data-q placeholder="' + esc(P.search) + '" aria-label="Search use cases"></label>' +
      '<select data-role aria-label="Filter by role">' + opts(ROLES, P.anyRole) + '</select>' +
      '<select data-product aria-label="Filter by product">' + opts(PRODUCTS, P.anyProduct) + '</select></div>' +
      '<div class="uc-cats" role="group" aria-label="Category">' + [P.all].concat(CATS).map(function (c) {
        var n = c === P.all ? all.length : all.filter(function (u) { return u.category === c; }).length;
        return '<button class="uc-cat" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (c === P.all) + '">' + esc(c) + '<span>' + n + '</span></button>';
      }).join('') + '</div>');
    root.querySelectorAll('[data-q]').forEach(function (el) { el.addEventListener('input', function () { state.q = el.value; root.querySelectorAll('[data-q]').forEach(function (o) { if (o !== el) o.value = el.value; }); draw(); }); });
    root.querySelectorAll('[data-role]').forEach(function (el) { el.addEventListener('change', function () { state.role = el.value; draw(); }); });
    root.querySelectorAll('[data-product]').forEach(function (el) { el.addEventListener('change', function () { state.product = el.value; draw(); }); });
    root.querySelectorAll('[data-cat]').forEach(function (el) { el.addEventListener('click', function () { pick(el.getAttribute('data-cat')); }); });
    // The hub's suggestion chips jump to a category and bring the list into view.
    set('[data-suggestions]', CATS.map(function (c) { return '<button class="uc-suggest" type="button" data-suggest="' + esc(c) + '">' + esc(c) + '</button>'; }).join(''));
    root.querySelectorAll('[data-suggest]').forEach(function (el) {
      el.addEventListener('click', function () { pick(el.getAttribute('data-suggest')); var t = root.querySelector('[data-list-top]'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    });
    function pick(c) {
      state.cat = c;
      root.querySelectorAll('[data-cat]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === c)); });
      draw();
    }
    function match(u) {
      if (state.cat !== P.all && u.category !== state.cat) return false;
      if (state.role && u.roles.indexOf(state.role) < 0) return false;
      if (state.product && u.products.indexOf(state.product) < 0) return false;
      var q = state.q.trim().toLowerCase();
      return !q || [u.title, u.outcome, u.problem, u.prompt, u.category].concat(u.roles, u.products).join(' ').toLowerCase().indexOf(q) >= 0;
    }

    if (kind === 'hub') set('[data-featured]', featured(all[0], data));
    function draw() {
      var list = all.filter(match);
      set('[data-count]', list.length + ' use case' + (list.length === 1 ? '' : 's'));
      var html;
      if (!list.length) html = '<p class="uc-empty">' + esc(P.empty) + '</p>';
      else if (kind === 'ledger') html = rows(list);
      else if (kind === 'grid') html = '<div class="uc-grid">' + list.map(tile).join('') + '</div>';
      else html = '<div class="uc-hub-sections">' + CATS.map(function (c) {
        var inCat = list.filter(function (u) { return u.category === c; });
        if (!inCat.length) return '';
        return '<section class="uc-cat-sec"><div class="uc-cat-head"><h2>' + esc(c) + '</h2><span>' + inCat.length + '</span></div>' +
          '<div class="uc-cards">' + inCat.map(card).join('') + '</div></section>';
      }).join('') + '</div>';
      set('[data-list]', html);
    }
    draw();
  }

  // Hub: the lead use case opened up, its prompt and the answer's first line.
  function featured(u, data) {
    return '<a class="uc-feature" href="' + href(u) + '">' +
      '<div class="uc-feature-copy"><p class="lt-kicker"><b>' + esc(data.page.featured) + '</b><span>' + esc(u.category) + '</span></p>' +
      '<h2>' + esc(u.title) + '</h2><p class="uc-feature-outcome">' + esc(u.outcome) + '</p>' +
      '<span class="p1-button">' + esc(data.page.open) + '</span></div>' +
      '<div class="uc-feature-chat" aria-hidden="true"><p class="uc-bubble">' + prompt(u.prompt) + '</p>' +
      '<div class="uc-answer"><p class="uc-agent"><i></i>' + esc(data.detail.agent) + '</p><p>' + esc(u.output.summary) + '</p></div></div></a>';
  }
  // Hub card: category, title, outcome, products.
  function card(u) {
    return '<a class="uc-card" href="' + href(u) + '"><h3>' + esc(u.title) + '</h3><p>' + esc(u.outcome) + '</p>' +
      '<ul class="uc-chips">' + u.products.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' +
      '<span class="uc-go" aria-hidden="true">' + ARROW + '</span></a>';
  }
  // Grid tile: the prompt as the Agent page asks it, then what it is.
  function tile(u) {
    if (v2) return '<a class="uc-tile uc-tile--text" href="' + href(u) + '"><p class="uc-tile-cat">' + esc(u.category) + '</p><h3>' + esc(u.title) + '</h3><p>' + esc(u.outcome) + '</p>' +
      '<ul class="uc-chips">' + u.products.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul><span class="uc-go" aria-hidden="true">' + ARROW + '</span></a>';
    return '<a class="uc-tile" href="' + href(u) + '"><div class="uc-tile-chat" aria-hidden="true"><p class="uc-bubble"><span>' + esc(u.prompt) + '</span></p></div>' +
      '<div class="uc-tile-copy"><p class="uc-tile-cat">' + esc(u.category) + '</p><h3>' + esc(u.title) + '</h3><p>' + esc(u.outcome) + '</p>' +
      '<ul class="uc-chips">' + u.products.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div></a>';
  }
  // Ledger: the research index's rows.
  function rows(list) {
    return '<div class="lg uc-lg"><div class="lg-head" aria-hidden="true"><span>Category</span><span>Use case</span><span>For</span><span>Uses</span><span></span></div>' +
      list.map(function (u) {
        return '<a class="lg-row" href="' + href(u) + '"><span class="lg-topic uc-lg-cat">' + esc(u.category) + '</span>' +
          '<span class="lg-main"><strong>' + esc(u.title) + '</strong><span>' + esc(u.outcome) + '</span></span>' +
          '<span class="lg-topic">' + u.roles.map(esc).join(', ') + '</span>' +
          '<span class="lg-topic">' + u.products.map(esc).join(', ') + '</span>' +
          '<span class="lg-arrow">' + ARROW + '</span></a>';
      }).join('') + '</div>';
  }

  /* ── One use case ───────────────────────────────────────────────────── */
  function detail(data) {
    var all = data.useCases, D = data.detail;
    var u = all.filter(function (x) { return x.id === (body.getAttribute('data-uc-case') || params.get('case')); })[0] || all[0];
    document.title = u.title + ' | Pave Agent use cases';
    set('[data-crumbs]', '<a href="' + INDEX[from] + '">' + esc(D.crumb) + '</a><span aria-hidden="true">/</span><span>' + esc(u.category) + '</span>');
    set('[data-title]', esc(u.title));
    set('[data-outcome]', esc(u.outcome));
    set('[data-meta]', '<div><dt>' + esc(D.for) + '</dt><dd>' + u.roles.map(esc).join(', ') + '</dd></div>' +
      '<div><dt>' + esc(D.uses) + '</dt><dd>' + u.products.map(esc).join(', ') + '</dd></div>');
    set('[data-prompt]', prompt(u.prompt));
    set('[data-follow]', u.followUps.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join(''));
    var t = u.output.table;
    set('[data-output]', '<div class="uc-output-head"><p class="uc-agent"><i></i>' + esc(D.agent) + '</p><span>' + esc(D.sample) + '</span></div>' +
      '<p class="uc-output-summary">' + esc(u.output.summary) + '</p>' +
      '<div class="uc-table"><table><thead><tr>' + t.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' +
      '<p class="uc-sources"><span>' + esc(D.sources) + '</span>' + u.output.sources.map(function (s) { return '<b>' + esc(s) + '</b>'; }).join('') + '</p>');
    set('[data-problem]', esc(u.problem));
    set('[data-old]', u.oldWay.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join(''));
    set('[data-why]', u.why.map(function (w) { return '<div><h3>' + esc(w.h) + '</h3><p>' + esc(w.p) + '</p></div>'; }).join(''));
    var list = function (items) { return items.map(function (d) { return '<li><b>' + esc(d.name) + '</b><span>' + esc(d.detail) + '</span></li>'; }).join(''); };
    set('[data-yours]', list(u.data.yours));
    set('[data-pave]', list(u.data.pave));
    set('[data-need]', u.products.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join(''));
    // Related: same category first, then shared products (Pave's rule).
    var related = all.filter(function (x) { return x !== u; }).map(function (x) {
      return { x: x, s: (x.category === u.category ? 2 : 0) + x.products.filter(function (p) { return u.products.indexOf(p) >= 0; }).length };
    }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3).map(function (r) { return r.x; });
    set('[data-related]', v2 ? '<div class="uc-grid">' + related.map(tile).join('') + '</div>' : rows(related));
    // Copy the prompt as plain text.
    root.querySelectorAll('[data-copy-prompt]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var done = function (t) { btn.textContent = t; setTimeout(function () { btn.textContent = D.copy; }, 1600); };
        try { navigator.clipboard.writeText(u.prompt).then(function () { done(D.copied); }, function () { done('Select and copy'); }); } catch (e) { done('Select and copy'); }
      });
    });
  }
})();
