/* Pave Insights, refreshed in the approved research system (Teresa's Oct 8
   ask: Insights, Articles, Guides & Reports, Events & Webinars; plus the
   case study templates Sasha and Teresa asked about on Customers). One
   renderer for every page, from insights-data.json (pave.com's own content).
   The body says which page this is:
     data-insights="hub"       the Insights hub: a featured article, then a section per type
     data-insights="articles"  every article, by category
     data-insights="article"   one article, ?post=<slug>
     data-insights="guides"    guides and reports
     data-insights="events"    events and webinars, upcoming and on demand
     data-insights="cases"     customer stories
     data-insights="case"      one customer story, ?case=<slug> (&layout=video
                               for the video-only template, not a modal)
   V2 (data-insights-version="2", the -v2.html pages) is the Oct 27 round:
   Teresa's hero options (?hero=glow|top|corners, carried from page to page),
   no Compensation 101 on the listings, a chosen featured article, no counts,
   reports apart from guides, events typed with their hosts and date ranges,
   the article's Updated date, mid CTA and FAQ, and featured products and
   embedded video on customer stories. V1 renders as it was. */
(function () {
  'use strict';
  var body = document.body, kind = body.getAttribute('data-insights');
  var root = document.querySelector('[data-insights-root]');
  if (!root || !kind) return;
  var q = new URLSearchParams(location.search);
  // A pre-rendered copy carries its query on the body instead (data-in-post, data-in-case-slug, data-in-layout).
  var param = function (k) { return q.get(k) || body.getAttribute('data-in-' + (k === 'case' ? 'case-slug' : k)); };
  var v2 = body.getAttribute('data-insights-version') === '2';
  // The hero option picks the mesh before research-v3-animations.js starts it.
  var MESH = { glow: 'inGlow', top: 'inTop', corners: 'inCorners', glow2: 'inGlow2' };
  var hero = v2 && MESH[q.get('hero')] ? q.get('hero') : (body.getAttribute('data-hero') || 'glow');
  if (v2) {
    body.setAttribute('data-hero', hero);
    document.querySelectorAll('canvas[data-hero-mesh]').forEach(function (c) { c.setAttribute('data-mesh', MESH[hero] || 'inGlow'); });
  }
  // Sasha: Compensation 101 is the SEO/AEO set, kept off the listings.
  var HIDDEN = v2 ? ['Compensation 101'] : [];
  var ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var day = function (iso) { var p = (iso || '').split('-'); return p.length < 3 ? '' : MONTHS[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0]; };
  var set = function (sel, html) { root.querySelectorAll(sel).forEach(function (el) { el.innerHTML = html; }); return root.querySelector(sel); };
  var img = function (src, alt, cls) { return src ? '<img class="' + (cls || '') + '" src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy">' : ''; };
  // Handoff copies can name their own addresses: <body data-in-article="/insights/articles/{slug}.html"
  // data-in-case="…/{slug}.html" data-in-hub="/insights/" data-in-articles="/insights/articles/">.
  var to = function (name, slug) { var t = body.getAttribute('data-in-' + name); return t && t.replace('{slug}', encodeURIComponent(slug || '')); };
  var link = { article: function (a) { return to('article', a.slug) || (v2 ? 'insights-article-v2.html' : 'insights-article.html') + '?post=' + encodeURIComponent(a.slug); },
    kase: function (c) { return to('case', c.slug) || (v2 ? 'insights-case-study-v2.html' : 'insights-case-study.html') + '?case=' + encodeURIComponent(c.slug) + (c.video ? '&layout=video' : ''); } };
  // V2 can pin "today" (data-today) so the design shows an Upcoming list from real events.
  var TODAY = (v2 && body.getAttribute('data-today')) || new Date().toISOString().slice(0, 10);

  fetch(root.getAttribute('data-insights-root')).then(function (r) { return r.json(); }).then(function (data) {
    // One story per company: some companies have an older, shorter story too.
    var seen = {};
    data.caseStudies = data.caseStudies.filter(function (c) { if (seen[c.company]) return false; seen[c.company] = 1; return true; });
    ({ hub: hub, articles: articles, article: article, guides: guides, events: events, cases: cases, case: kase })[kind](data);
    if (v2) { keepHero(); throughFeature(); }
    root.classList.add('is-ready');
  });

  /* ── Parts ──────────────────────────────────────────────────────────── */
  function articleCard(a) {
    return '<a class="in-card" href="' + link.article(a) + '"><div class="in-card-img">' + img(a.cover) + '</div>' +
      '<p class="in-meta"><b>' + esc(a.category) + '</b><span>' + (a.read ? a.read + ' min read' : '') + '</span></p>' +
      '<h3>' + esc(a.title) + '</h3></a>';
  }
  // Sasha: reports have data, guides don't. Each says which it is.
  var KIND = { guide: { label: 'Guide', go: 'Get the guide' }, report: { label: 'Report', go: 'Read the report' } };
  function guideCard(g) {
    var k = v2 ? KIND[g.kind] || KIND.guide : KIND.guide;
    return '<a class="in-card in-card--guide" href="' + esc(g.link) + '" target="_blank" rel="noopener"><div class="in-card-img">' + img(g.cover) + '</div>' +
      '<p class="in-meta"><b>' + k.label + '</b></p><h3>' + esc(g.title) + '</h3>' + (g.summary ? '<p class="in-card-text">' + esc(g.summary) + '</p>' : '') +
      '<span class="in-go">' + k.go + ' ' + ARROW + '</span></a>';
  }
  function caseCard(c) {
    return '<a class="in-card in-card--case" href="' + link.kase(c) + '"><div class="in-card-img">' + img(c.image) + (c.video ? '<span class="in-play" aria-hidden="true"></span>' : '') + '</div>' +
      '<p class="in-meta"><b>' + esc(c.company) + '</b>' + (c.video ? '<span>Video</span>' : '') + '</p><h3>' + esc(c.title) + '</h3></a>';
  }
  function eventRow(w) {
    if (v2) return eventRowV2(w);
    var p = (w.date || '').split('-'), upcoming = w.date >= TODAY;
    return '<a class="lg-row in-event" href="' + esc(w.link) + '" target="_blank" rel="noopener">' +
      '<span class="in-date"><b>' + (p[2] ? +p[2] : '') + '</b><span>' + (p[1] ? MONTHS[+p[1] - 1] + ' ' + p[0] : '') + '</span></span>' +
      '<span class="lg-main"><strong>' + esc(w.title) + '</strong>' + (w.summary ? '<span>' + esc(w.summary) + '</span>' : '') + '</span>' +
      '<span class="lg-topic">' + (upcoming ? 'Register' : w.video ? 'Watch on demand' : 'Event recap') + '</span>' +
      '<span class="in-event-img">' + img(w.cover) + '</span>' +
      '<span class="lg-arrow">' + ARROW + '</span></a>';
  }
  // V2: the day (or the days), what kind of session, who runs it, and what you can do now.
  function eventRowV2(w) {
    var p = (w.date || '').split('-'), e = (w.dateTo || '').split('-'), upcoming = (w.dateTo || w.date) >= TODAY;
    var range = e[2] && w.dateTo !== w.date;
    var days = p[2] ? +p[2] + (range ? '–' + (+e[2]) : '') : '';
    var month = p[1] ? MONTHS[+p[1] - 1] + (range && e[1] !== p[1] ? '–' + MONTHS[+e[1] - 1] : '') + ' ' + p[0] : '';
    var act = upcoming ? (w.host === 'Pave' ? 'Register' : 'Meet us there') : w.video ? 'Watch on demand' : 'See the recap';
    return '<a class="lg-row in-event' + (upcoming ? ' is-upcoming' : '') + '" href="' + esc(w.link) + '" target="_blank" rel="noopener">' +
      '<span class="in-date"><b>' + days + '</b><span>' + month + '</span></span>' +
      '<span class="lg-main"><strong>' + esc(w.title) + '</strong><span class="in-tags"><span class="in-tag">' + esc(w.format || 'Webinar') + '</span>' +
      '<span class="in-tag in-tag--host">' + (w.host === 'Pave' ? 'Hosted by Pave' : w.host && w.host.indexOf('Pave and') === 0 ? 'With ' + esc(w.host.slice(9)) : 'Pave attending, run by ' + esc(w.host)) + '</span></span></span>' +
      '<span class="in-event-act">' + act + '</span>' +
      '<span class="in-event-img">' + img(w.cover) + '</span>' +
      '<span class="lg-arrow">' + ARROW + '</span></a>';
  }
  function articleRow(a) {
    return '<a class="lg-row in-row" href="' + link.article(a) + '" data-cat="' + esc(a.category) + '">' +
      '<span class="lg-topic in-row-cat">' + esc(a.category) + '</span>' +
      '<span class="lg-main"><strong>' + esc(a.title) + '</strong><span>' + esc(a.summary) + '</span></span>' +
      '<span class="lg-topic">' + (a.read ? a.read + ' min read' : '') + '</span>' +
      '<span class="lg-arrow">' + ARROW + '</span></a>';
  }
  // V2: the article with Feature on Insights switched on, else the newest.
  function pick(list) { return list.filter(function (a) { return a.featured; })[0] || list[0]; }
  function listed(data) { return data.articles.filter(function (a) { return HIDDEN.indexOf(a.category) < 0; }); }
  // Glow V2: the hero's gradient carries on behind the featured band below it.
  function throughFeature() {
    if (hero !== 'glow2') return;
    var head = document.querySelector('.in-hero'), art = head && head.querySelector('.in-hero-art');
    var next = head && head.nextElementSibling;
    if (!art || !next || !next.querySelector('[data-featured]')) return;
    next.classList.add('in-through');
    var fit = function () { art.style.height = (head.offsetHeight + next.offsetHeight) + 'px'; };
    new ResizeObserver(fit).observe(next); fit();
  }
  function keepHero() {
    if (!q.get('hero')) return;
    document.querySelectorAll('a[href*="-v2.html"]').forEach(function (a) {
      var h = a.getAttribute('href'), i = h.indexOf('#');
      var base = i < 0 ? h : h.slice(0, i), hash = i < 0 ? '' : h.slice(i);
      if (/[?&]hero=/.test(base)) return;
      a.setAttribute('href', base + (base.indexOf('?') < 0 ? '?' : '&') + 'hero=' + hero + hash);
    });
  }
  function featured(a, kicker) {
    return '<a class="in-feature" href="' + link.article(a) + '"><div class="in-feature-copy"><p class="lt-kicker"><b>' + esc(kicker) + '</b><span>' + esc(a.category) + '</span></p>' +
      '<h2>' + esc(a.title) + '</h2><p class="in-feature-text">' + esc(a.summary) + '</p><span class="p1-button">Read the article</span></div>' +
      '<div class="in-feature-img">' + img(a.cover) + '</div></a>';
  }
  // Rows past the first page wait for Show more, as on the research index.
  function more(listSel, rowSel, page, label) {
    var rows = [].slice.call(root.querySelectorAll(rowSel)).filter(function (r) { return !r.hidden; });
    rows.forEach(function (r, i) { r.classList.toggle('is-later', i >= page); });
    var btn = root.querySelector(listSel + ' + .lg-more') || null;
    var rest = rows.length - page;
    if (btn) btn.remove();
    if (rest <= 0) return;
    var b = document.createElement('button');
    b.className = 'lg-more'; b.type = 'button'; b.innerHTML = v2 ? 'Show more' : esc(label) + ' <span>' + rest + '</span>';
    b.addEventListener('click', function () { rows.forEach(function (r) { r.classList.remove('is-later'); }); b.remove(); });
    root.querySelector(listSel).after(b);
  }

  /* ── Pages ──────────────────────────────────────────────────────────── */
  function hub(data) {
    if (v2) return hubV2(data);
    set('[data-featured]', featured(data.articles[0], 'Latest'));
    set('[data-articles]', data.articles.slice(1, 4).map(articleCard).join(''));
    set('[data-guides]', data.guides.slice(0, 3).map(guideCard).join(''));
    set('[data-events]', '<div class="lg in-lg in-lg--events">' + data.webinars.slice(0, 4).map(eventRow).join('') + '</div>');
    set('[data-cases]', data.caseStudies.slice(0, 3).map(caseCard).join(''));
  }

  function hubV2(data) {
    var list = listed(data), top = pick(list);
    set('[data-featured]', featured(top, top.featured ? 'Featured' : 'Latest'));
    set('[data-articles]', list.filter(function (a) { return a !== top; }).slice(0, 3).map(articleCard).join(''));
    set('[data-guides]', data.guides.slice(0, 3).map(guideCard).join(''));
    // What's coming first (soonest first), then the latest past ones.
    var up = data.webinars.filter(function (w) { return (w.dateTo || w.date) >= TODAY; }).reverse();
    var past = data.webinars.filter(function (w) { return (w.dateTo || w.date) < TODAY; });
    set('[data-events]', '<div class="lg in-lg in-lg--events">' + up.concat(past).slice(0, 4).map(eventRow).join('') + '</div>');
    set('[data-cases]', data.caseStudies.slice(0, 3).map(caseCard).join(''));
  }

  function articles(data) {
    if (v2) return articlesV2(data);
    set('[data-featured]', featured(data.articles[0], 'Latest'));
    var list = data.articles.slice(1);
    var cats = data.categories.filter(function (c) { return list.some(function (a) { return a.category === c; }); });
    set('[data-cats]', ['All'].concat(cats).map(function (c, i) {
      var n = i ? list.filter(function (a) { return a.category === c; }).length : list.length;
      return '<button class="in-cat" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + '<span>' + n + '</span></button>';
    }).join(''));
    set('[data-rows]', '<div class="lg in-lg">' + list.map(articleRow).join('') + '</div>');
    var draw = function (cat) {
      root.querySelectorAll('.in-row').forEach(function (r) { r.hidden = cat !== 'All' && r.getAttribute('data-cat') !== cat; });
      more('[data-rows]', '.in-row', 8, 'Show more articles');
    };
    root.querySelectorAll('[data-cat]').forEach(function (b) {
      if (!b.classList.contains('in-cat')) return;
      b.addEventListener('click', function () {
        root.querySelectorAll('.in-cat').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        draw(b.getAttribute('data-cat'));
      });
    });
    set('[data-count]', list.length + ' articles');
    draw('All');
  }

  function articlesV2(data) {
    var all = listed(data), top = pick(all);
    set('[data-featured]', featured(top, top.featured ? 'Featured' : 'Latest'));
    var list = all.filter(function (a) { return a !== top; });
    var cats = data.categories.filter(function (c) { return list.some(function (a) { return a.category === c; }); });
    set('[data-cats]', ['All'].concat(cats).map(function (c, i) {
      return '<button class="in-cat" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + '</button>';
    }).join(''));
    set('[data-rows]', '<div class="lg in-lg">' + list.map(articleRow).join('') + '</div>');
    var draw = function (cat) {
      root.querySelectorAll('.in-row').forEach(function (r) { r.hidden = cat !== 'All' && r.getAttribute('data-cat') !== cat; });
      more('[data-rows]', '.in-row', 8);
    };
    root.querySelectorAll('.in-cat').forEach(function (b) {
      b.addEventListener('click', function () {
        root.querySelectorAll('.in-cat').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        draw(b.getAttribute('data-cat'));
      });
    });
    draw('All');
  }

  // Embedded video stays in the story, at 16:9 (Sasha: the hole was the video).
  var EMBED = /youtube|youtu\.be|vimeo|wistia|loom|vidyard|hubspotvideo/i;
  function clean(html, dropVideo) {
    var holder = document.createElement('div');
    holder.innerHTML = html;
    holder.querySelectorAll('script, style').forEach(function (n) { n.remove(); });
    holder.querySelectorAll('iframe').forEach(function (f) {
      if (!v2 || dropVideo || !EMBED.test(f.getAttribute('src') || '')) {
        var fig = f.closest('figure'); (fig && v2 ? fig : f).remove(); return;
      }
      var box = document.createElement('div'); box.className = 'in-embed';
      f.removeAttribute('width'); f.removeAttribute('height'); f.removeAttribute('style'); f.setAttribute('loading', 'lazy');
      var fig2 = f.closest('figure') || f; fig2.replaceWith(box); box.appendChild(f);
    });
    // Pull quotes: the quote, then who said it on its own line (the CMS
    // writes both in one italic run, split by a line break and a dash).
    if (v2) holder.querySelectorAll('blockquote').forEach(function (bq) {
      var m = bq.textContent.replace(/\u200b/g, '').trim().match(/^([\s\S]*?[”"])\s*[–—-]\s*([\s\S]+)$/);
      if (!m) return;
      var src = bq.querySelector('a[href]');
      bq.innerHTML = '<p>' + esc(m[1].trim()) + '</p><cite>' + (src ? '<a href="' + esc(src.getAttribute('href')) + '">' + esc(m[2].trim()) + '</a>' : esc(m[2].trim())) + '</cite>';
    });
    return holder;
  }

  function article(data) {
    if (v2) return articleV2(data);
    var a = data.articles.filter(function (x) { return x.slug === param('post'); })[0] || data.articles[0];
    document.title = a.title + ' | Pave';
    set('[data-crumbs]', '<a href="insights.html">Insights</a><span aria-hidden="true">/</span><a href="insights-articles.html">Articles</a><span aria-hidden="true">/</span><span>' + esc(a.category) + '</span>');
    set('[data-title]', esc(a.title));
    set('[data-dek]', esc(a.summary));
    set('[data-meta]', (a.author && a.author.name ? '<div><dt>Written by</dt><dd><span class="rs-byline">' + img(a.author.photo, '', '') + '<b>' + esc(a.author.name) + '</b></span></dd></div>' : '') +
      (a.date ? '<div><dt>Published</dt><dd>' + day(a.date) + '</dd></div>' : '') + (a.read ? '<div><dt>Reading time</dt><dd>' + a.read + ' min</dd></div>' : '') +
      '<div><dt>Topic</dt><dd>' + esc(a.category) + '</dd></div>');
    set('[data-cover]', img(a.cover, a.title));
    // The article's own HTML from the CMS, its h2s numbered into the contents.
    var holder = document.createElement('div');
    holder.innerHTML = a.body || '<p>' + esc(a.summary) + '</p>';
    holder.querySelectorAll('script, style, iframe').forEach(function (n) { n.remove(); });
    var toc = [];
    holder.querySelectorAll('h2').forEach(function (h, i) { h.id = 's' + (i + 1); toc.push('<li><a href="#s' + (i + 1) + '">' + esc(h.textContent) + '</a></li>'); });
    set('[data-body]', holder.innerHTML);
    set('[data-toc]', '<i class="toc-progress" aria-hidden="true"></i>' + toc.join(''));
    var tocEl = root.querySelector('.toc'); if (tocEl) tocEl.hidden = toc.length < 2;
    if (a.author && a.author.name) set('[data-author]', img(a.author.photo, '', '') + '<div><small>Written by</small><span class="author-name">' + esc(a.author.name) + '</span>' + (a.author.title ? '<small>' + esc(a.author.title) + '</small>' : '') + '</div>');
    else { var card = root.querySelector('[data-author]'); if (card) card.remove(); }
    var others = data.articles.filter(function (x) { return x !== a; });
    var same = others.filter(function (x) { return x.category === a.category; }).concat(others.filter(function (x) { return x.category !== a.category; }));
    set('[data-more]', same.slice(0, 3).map(articleCard).join(''));
  }

  function articleV2(data) {
    var pool = data.articles.concat(data.extra || []);
    var a = pool.filter(function (x) { return x.slug === param('post'); })[0] || data.articles[0];
    document.title = a.title + ' | Pave';
    set('[data-crumbs]', '<a href="' + (to('hub') || 'insights-v2.html') + '">Insights</a><span aria-hidden="true">/</span><a href="' + (to('articles') || 'insights-articles-v2.html') + '">Articles</a><span aria-hidden="true">/</span><span>' + esc(a.category) + '</span>');
    set('[data-title]', esc(a.title));
    set('[data-dek]', esc(a.summary));
    // Daydream's Updated date sits next to Published when it's set.
    set('[data-meta]', (a.author && a.author.name ? '<div><dt>Written by</dt><dd><span class="rs-byline">' + img(a.author.photo, '', '') + '<b>' + esc(a.author.name) + '</b></span></dd></div>' : '') +
      (a.date ? '<div><dt>Published</dt><dd>' + day(a.date) + '</dd></div>' : '') + (a.updated ? '<div><dt>Updated</dt><dd>' + day(a.updated) + '</dd></div>' : '') +
      (a.read ? '<div><dt>Reading time</dt><dd>' + a.read + ' min</dd></div>' : '') + '<div><dt>Topic</dt><dd>' + esc(a.category) + '</dd></div>');
    set('[data-cover]', img(a.cover, a.title));
    var holder = clean(a.body || '<p>' + esc(a.summary) + '</p>');
    var toc = [], h2s = holder.querySelectorAll('h2');
    h2s.forEach(function (h, i) { h.id = 's' + (i + 1); toc.push('<li><a href="#s' + (i + 1) + '">' + esc(h.textContent) + '</a></li>'); });
    // The CMS's Mid CTA lands on its {{mid-cta}} token, else before the middle section.
    var token = [].filter.call(holder.querySelectorAll('p'), function (p) { return p.textContent.trim() === '{{mid-cta}}'; })[0];
    if (a.midCta) {
      var cta = document.createElement('aside'); cta.className = 'mid-cta';
      cta.innerHTML = '<h3>' + esc(a.midCta.heading) + '</h3>' + (a.midCta.text ? '<p>' + esc(a.midCta.text) + '</p>' : '') +
        '<a class="p1-button" href="' + esc(a.midCta.link) + '">' + esc(a.midCta.button) + '</a>';
      var at = h2s[Math.floor(h2s.length / 2)];
      if (token) token.replaceWith(cta); else if (at && h2s.length > 1) at.before(cta); else holder.appendChild(cta);
    } else if (token) token.remove();
    set('[data-body]', holder.innerHTML);
    // The CMS's SEO FAQ: each question opens in place.
    var faq = root.querySelector('[data-faq]');
    if (faq && a.faq) {
      var f = document.createElement('div'); f.innerHTML = a.faq;
      var items = [], cur = null;
      [].forEach.call(f.children, function (n) {
        var head = /^H[2-6]$/.test(n.tagName) || (n.tagName === 'P' && n.querySelector('strong') && n.textContent.trim() === n.querySelector('strong').textContent.trim());
        // The CMS's own "Frequently Asked Questions" heading is the section title, not a question.
        if (head && /^frequently asked questions/i.test(n.textContent.trim())) { cur = null; return; }
        if (head) { cur = { q: n.textContent.trim(), a: [] }; items.push(cur); }
        else if (cur) cur.a.push(n.outerHTML);
      });
      faq.innerHTML = '<h2>Frequently asked questions</h2>' + items.map(function (it) {
        return '<details><summary>' + esc(it.q) + '</summary><div class="prose">' + it.a.join('') + '</div></details>';
      }).join('');
      toc.push('<li><a href="#faq">Frequently asked questions</a></li>');
      faq.id = 'faq';
    } else if (faq) faq.remove();
    set('[data-toc]', '<i class="toc-progress" aria-hidden="true"></i>' + toc.join(''));
    var tocEl = root.querySelector('.toc'); if (tocEl) tocEl.hidden = toc.length < 2;
    if (a.author && a.author.name) set('[data-author]', img(a.author.photo, '', '') + '<div><small>Written by</small><span class="author-name">' + esc(a.author.name) + '</span>' + (a.author.title && a.author.title !== a.author.name ? '<small>' + esc(a.author.title) + '</small>' : '') + '</div>');
    else { var card = root.querySelector('[data-author]'); if (card) card.remove(); }
    // Sasha: yes, the newest from the same category, then the newest overall.
    var others = listed(data).filter(function (x) { return x !== a; });
    var same = others.filter(function (x) { return x.category === a.category; });
    set('[data-more-title]', same.length ? 'More in ' + esc(a.category) : 'More articles');
    set('[data-more]', same.concat(others.filter(function (x) { return x.category !== a.category; })).slice(0, 3).map(articleCard).join(''));
  }

  function guides(data) {
    if (v2) return guidesV2(data);
    set('[data-featured]', '<a class="in-feature" href="' + esc(data.guides[0].link) + '" target="_blank" rel="noopener"><div class="in-feature-copy"><p class="lt-kicker"><b>Latest guide</b></p>' +
      '<h2>' + esc(data.guides[0].title) + '</h2><p class="in-feature-text">' + esc(data.guides[0].summary) + '</p><span class="p1-button">Get the guide</span></div>' +
      '<div class="in-feature-img">' + img(data.guides[0].cover) + '</div></a>');
    set('[data-grid]', data.guides.slice(1).map(guideCard).join(''));
    set('[data-count]', data.guides.length + ' guides and reports');
  }

  // Sasha: reports apart from guides, a few at a time with Show more.
  function guidesV2(data) {
    var f = data.guides[0], k = KIND[f.kind] || KIND.guide;
    set('[data-featured]', '<a class="in-feature" href="' + esc(f.link) + '" target="_blank" rel="noopener"><div class="in-feature-copy"><p class="lt-kicker"><b>Latest ' + k.label.toLowerCase() + '</b></p>' +
      '<h2>' + esc(f.title) + '</h2><p class="in-feature-text">' + esc(f.summary) + '</p><span class="p1-button">' + k.go + '</span></div>' +
      '<div class="in-feature-img">' + img(f.cover) + '</div></a>');
    ['report', 'guide'].forEach(function (kind) {
      var sel = '[data-' + kind + 's]';
      if (!root.querySelector(sel)) return;
      set(sel, data.guides.slice(1).filter(function (g) { return g.kind === kind; }).map(guideCard).join(''));
      more(sel, sel + ' .in-card', 6);
    });
  }

  function events(data) {
    if (v2) return eventsV2(data);
    var up = data.webinars.filter(function (w) { return w.date >= TODAY; }), past = data.webinars.filter(function (w) { return w.date < TODAY; });
    var upSec = root.querySelector('[data-upcoming-sec]');
    if (up.length) set('[data-upcoming]', '<div class="lg in-lg in-lg--events">' + up.map(eventRow).join('') + '</div>');
    else if (upSec) upSec.hidden = true;
    set('[data-past]', '<div class="lg in-lg in-lg--events">' + past.map(eventRow).join('') + '</div>');
    set('[data-count]', past.length + ' on demand');
    more('[data-past]', '[data-past] .lg-row', 8, 'Show more events');
  }

  // Sasha: what's coming, apart from what already happened.
  function eventsV2(data) {
    var up = data.webinars.filter(function (w) { return (w.dateTo || w.date) >= TODAY; }).reverse();
    var past = data.webinars.filter(function (w) { return (w.dateTo || w.date) < TODAY; });
    set('[data-upcoming]', up.length ? '<div class="lg in-lg in-lg--events">' + up.map(eventRow).join('') + '</div>'
      : '<p class="in-none">Nothing on the calendar right now. Every past session is below.</p>');
    set('[data-past]', '<div class="lg in-lg in-lg--events">' + past.map(eventRow).join('') + '</div>');
    more('[data-past]', '[data-past] .lg-row', 8);
  }

  function cases(data) {
    var f = data.caseStudies[0];
    set('[data-featured]', '<a class="in-feature in-feature--case" href="' + link.kase(f) + '"><div class="in-feature-copy"><p class="lt-kicker"><b>Customer story</b><span>' + esc(f.company) + '</span></p>' +
      '<h2>' + esc(f.title) + '</h2><p class="in-feature-text">' + esc(f.summary) + '</p><span class="p1-button">' + (f.video ? 'Watch the story' : 'Read the story') + '</span></div>' +
      '<div class="in-feature-img">' + img(f.image) + (f.video ? '<span class="in-play" aria-hidden="true"></span>' : '') + '</div></a>');
    set('[data-grid]', data.caseStudies.slice(1).map(caseCard).join(''));
    set('[data-count]', data.caseStudies.length + ' customer stories');
  }

  function kase(data) {
    if (v2) return kaseV2(data);
    var c = data.caseStudies.filter(function (x) { return x.slug === param('case'); })[0] || data.caseStudies[0];
    var video = param('layout') === 'video' && c.video;
    document.title = c.title + ' | Pave customer story';
    body.classList.toggle('in-case--video', !!video);
    set('[data-crumbs]', '<a href="insights-case-studies.html">Customer stories</a><span aria-hidden="true">/</span><span>' + esc(c.company) + '</span>');
    set('[data-title]', esc(c.title));
    set('[data-dek]', esc(c.summary));
    set('[data-meta]', '<div><dt>Company</dt><dd>' + esc(c.company) + '</dd></div><div><dt>Format</dt><dd>' + (video ? 'Video' : 'Story') + '</dd></div>');
    // The video-only template plays in the page (Teresa: not a modal).
    set('[data-hero]', video
      ? '<div class="in-video"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(c.video) + '?rel=0" title="' + esc(c.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>'
      : img(c.image, c.title, 'in-case-img'));
    var holder = document.createElement('div');
    holder.innerHTML = c.body || '<p>' + esc(c.summary) + '</p>';
    holder.querySelectorAll('script, style, iframe').forEach(function (n) { n.remove(); });
    set('[data-body]', holder.innerHTML);
    set('[data-more]', data.caseStudies.filter(function (x) { return x !== c; }).slice(0, 3).map(caseCard).join(''));
  }

  // Sasha: featured products in place of Format, the whole description, and
  // the story's own video kept in the body (dropped in the video-only
  // template, where it already plays at the top).
  function kaseV2(data) {
    var c = data.caseStudies.filter(function (x) { return x.slug === param('case'); })[0] || data.caseStudies[0];
    var video = param('layout') === 'video' && c.video;
    document.title = c.title + ' | Pave customer story';
    body.classList.toggle('in-case--video', !!video);
    set('[data-crumbs]', '<a href="https://www.pave.com/customers">Customers</a><span aria-hidden="true">/</span><span>' + esc(c.company) + '</span>');
    set('[data-title]', esc(c.title));
    set('[data-dek]', esc(c.dek || c.summary.replace(/[^.!?]*…$/, '').trim() || c.summary));
    set('[data-meta]', '<div><dt>Company</dt><dd>' + esc(c.company) + '</dd></div>' + (c.products && c.products.length
      ? '<div><dt>Featured product' + (c.products.length > 1 ? 's' : '') + '</dt><dd class="in-products">' + c.products.map(function (p) { return '<span class="in-tag">' + esc(p) + '</span>'; }).join('') + '</dd></div>' : ''));
    set('[data-hero]', video
      ? '<div class="in-video"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(c.video) + '?rel=0" title="' + esc(c.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>'
      : img(c.image, c.title, 'in-case-img'));
    // Sasha: stat callouts (the Stat Block collection), only when a story has them.
    var stats = root.querySelector('[data-stats]');
    if (stats && c.stats && c.stats.length) stats.innerHTML = c.stats.map(function (st) {
      return '<div class="in-stat"><b>' + esc(st.statistic) + (st.unit ? '<span>' + esc(st.unit) + '</span>' : '') + '</b><p>' + esc(st.label) + '</p></div>';
    }).join('');
    else if (stats) stats.remove();
    var holder = clean(c.story || c.body || '<p>' + esc(c.summary) + '</p>', !!video);
    // A contents rail, as on articles, when the story has sections.
    var toc = [];
    holder.querySelectorAll('h2').forEach(function (h, i) { h.id = 's' + (i + 1); toc.push('<li><a href="#s' + (i + 1) + '">' + esc(h.textContent) + '</a></li>'); });
    set('[data-body]', holder.innerHTML);
    set('[data-toc]', '<i class="toc-progress" aria-hidden="true"></i>' + toc.join(''));
    var grid = root.querySelector('.in-story-grid');
    if (grid && toc.length < 2) { grid.classList.add('is-solo'); var rail = grid.querySelector('.article-rail'); if (rail) rail.remove(); }
    set('[data-more]', data.caseStudies.filter(function (x) { return x !== c; }).slice(0, 3).map(caseCard).join(''));
  }
})();
