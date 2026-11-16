/* Product updates, round two: renders the feed (filter chips, the ticker on
   the side, a light box per update) or the detail page (?u=<id>) from
   updates-v2-data.js, and plays videos in place. */
(function () {
  'use strict';
  var D = window.PaveUpdates, body = document.body;
  if (!D) return;
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var day = function (d) { var p = d.split('-'); return MONTHS[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0]; };
  var short = function (d) { var p = d.split('-'); return MONTHS[+p[1] - 1] + ' ' + (+p[2]); };
  // Handoff copies (pave-pages) name their own addresses on the body:
  // data-up-href="/product-updates/{id}.html", data-up-index, data-up-id.
  var tpl = body.getAttribute('data-up-href'), index = body.getAttribute('data-up-index') || 'updates-v2.html';
  var href = function (u) { return tpl ? tpl.replace('{id}', encodeURIComponent(u.id)) : 'update-v2.html?u=' + encodeURIComponent(u.id); };
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';

  function media(m, big) {
    if (!m) return '';
    if (m.type === 'video') return '<figure class="up2-video"><video src="' + esc(m.src) + '" poster="' + esc(m.poster) + '" playsinline preload="none" aria-label="' + esc(m.label || 'Video') + '"></video><button class="up2-play" type="button" aria-label="Play video">' + PLAY + '</button></figure>';
    if (m.type === 'embed') return '<figure class="up2-video"><iframe src="' + esc(m.src) + '" title="' + esc(m.label || 'Video') + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></figure>';
    return '<figure class="up-media' + (big ? ' up2-media--big' : '') + '" aria-hidden="true"><canvas data-mesh="card"></canvas>' + m.html + '</figure>';
  }
  function meta(u) { return '<time datetime="' + u.date + '">' + day(u.date) + '</time><span class="up-tag">' + esc(u.product) + '</span>'; }
  function card(u) {
    return '<article class="up2-card up2-entry" id="' + u.id + '" data-product="' + esc(u.product) + '">' +
      '<p class="up-meta">' + meta(u) + '</p>' +
      '<h2><a href="' + href(u) + '">' + esc(u.title) + '</a></h2>' +
      '<p class="up-benefit">' + esc(u.summary) + '</p>' + media(u.media) +
      '<a class="up-more" href="' + href(u) + '">Read more</a></article>';
  }
  function mini(u) {
    return '<a class="up2-card up2-mini" href="' + href(u) + '"><p class="up-meta">' + meta(u) + '</p><h3>' + esc(u.title) + '</h3><p>' + esc(u.summary) + '</p></a>';
  }
  function wireVideos(root) {
    root.querySelectorAll('.up2-play').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = btn.parentNode.querySelector('video');
        v.controls = true; btn.hidden = true; v.play();
      });
    });
  }

  /* ── The feed ──────────────────────────────────────────────────────── */
  if (body.getAttribute('data-up') === 'feed') {
    var list = document.querySelector('[data-up-list]'), ticker = document.querySelector('[data-up-ticker]'), filter = document.querySelector('[data-up-filter]');
    list.innerHTML = D.updates.map(card).join('') + '<p class="up2-card up-empty" hidden>No updates for this product yet.</p>';
    ticker.innerHTML = D.updates.map(function (u) {
      return '<li data-product="' + esc(u.product) + '"><a href="#' + u.id + '"><time datetime="' + u.date + '">' + short(u.date) + '</time><i class="up2-dot" aria-hidden="true"></i><span>' + esc(u.title) + '</span></a></li>';
    }).join('');
    filter.innerHTML = ['All'].concat(D.products).map(function (p, i) {
      return '<button class="up-chip" type="button" data-filter="' + (i ? esc(p) : '') + '" aria-pressed="' + (i ? 'false' : 'true') + '">' + esc(p) + '</button>';
    }).join('');
    wireVideos(list);

    var entries = [].slice.call(list.querySelectorAll('.up2-entry'));
    var ticks = [].slice.call(ticker.querySelectorAll('a'));
    var chips = [].slice.call(filter.querySelectorAll('[data-filter]'));
    var empty = list.querySelector('.up-empty');
    var mark = function (id) { ticks.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + id)); }); };

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var want = chip.getAttribute('data-filter'), shown = 0, first = null;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        entries.forEach(function (e) { var on = !want || e.getAttribute('data-product') === want; e.hidden = !on; if (on) { shown++; first = first || e.id; } });
        ticker.querySelectorAll('li').forEach(function (li) { li.hidden = !!want && li.getAttribute('data-product') !== want; });
        empty.hidden = shown > 0;
        if (first) mark(first);
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });
    if (entries[0]) mark(entries[0].id);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (seen) {
        seen.forEach(function (en) { if (en.isIntersecting) mark(en.target.id); });
      }, { rootMargin: '-35% 0px -55% 0px' });
      entries.forEach(function (e) { io.observe(e); });
    }
    return;
  }

  /* ── One update ────────────────────────────────────────────────────── */
  var id = body.getAttribute('data-up-id') || new URLSearchParams(location.search).get('u');
  var all = D.updates, i = Math.max(0, all.findIndex(function (u) { return u.id === id; }));
  var u = all[i];
  document.title = u.title + ' | Product updates | Pave';
  var set = function (sel, html) { var el = document.querySelector(sel); if (el) el.innerHTML = html; };
  set('[data-up-crumbs]', '<a href="' + index + '">Product updates</a><span aria-hidden="true">/</span><span>' + esc(u.product) + '</span>');
  set('[data-up-title]', esc(u.title));
  set('[data-up-meta]', meta(u));
  set('[data-up-summary]', esc(u.summary));
  set('[data-up-article]', media(u.media, true) + '<div class="up2-prose">' + u.body.map(function (b) {
    if (b.h) return '<h2>' + esc(b.h) + '</h2>';
    if (b.ul) return '<ul>' + b.ul.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    return '<p>' + esc(b.p) + '</p>';
  }).join('') + '</div><div class="up2-article-cta"><a class="p1-button" href="https://www.pave.com/request-demo">Book a demo</a><a class="up-more" href="' + index + '">All product updates</a></div>');
  var newer = all[i - 1], older = all[i + 1];
  set('[data-up-pager]', (newer ? '<a class="up2-card up2-pager-link" href="' + href(newer) + '"><span>Newer</span><b>' + esc(newer.title) + '</b></a>' : '<span></span>') +
    (older ? '<a class="up2-card up2-pager-link is-older" href="' + href(older) + '"><span>Older</span><b>' + esc(older.title) + '</b></a>' : ''));
  var related = all.filter(function (x) { return x !== u; }).sort(function (a, b) { return (b.product === u.product) - (a.product === u.product); }).slice(0, 3);
  set('[data-up-related]', related.map(mini).join(''));
  wireVideos(document);
})();
