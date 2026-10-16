/* Renders attempts A ("board"), B ("notes") and the light attempts C ("the
   index"), D ("figures") and E ("evidence"), with their articles, from
   research-posts.js. <body data-research="index|article" data-variant="a|b|c|d|e|light">.
   Static markup only; research-v3-animations.js owns motion, count-ups and
   the accordion. */
(function () {
  var posts = window.PaveResearch || [];
  var body = document.body, page = body.getAttribute('data-research'), variant = body.getAttribute('data-variant') || 'a';
  // C, D and E share the light posts; a post remembers which index it came
  // from (D, Hunter's pick, by default; a page can name its own default with
  // data-from) and links on to posts in its own layout, so each post
  // variation keeps you in it.
  var from = new URLSearchParams(location.search).get('from');
  var light = /^(c3|c2|c|d|e|light)$/.test(variant);
  var tag = variant === 'light' ? (/^(c3|c2|c|d|e)$/.test(from) ? from : (body.getAttribute('data-from') || 'd')) : variant;
  var self = location.pathname.split('/').pop() || 'research-light-post.html';
  var pages = { a: ['research-a.html', 'research-a-post.html'], b: ['research-b.html', 'research-b-post.html'],
    c: ['research-c.html', 'research-light-post.html'], c2: ['research-c2.html', 'research-light-post.html'], c3: ['research-c3.html', 'research-light-post-v2.html'], d: ['research-d.html', 'research-light-post.html'], e: ['research-e.html', 'research-light-post.html'],
    light: ['research-' + tag + '.html', page === 'article' ? self : 'research-light-post.html'] }[variant];
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var fmt = function (iso) { var p = iso.split('-'); return months[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0]; };
  var href = function (post) { return pages[1] + '?' + (light ? 'from=' + tag + '&' : '') + 'post=' + encodeURIComponent(post.slug); };
  var no = function (post) { return String(posts.indexOf(post) + 1).padStart(2, '0'); };
  var set = function (sel, html) { var el = document.querySelector(sel); if (el) el.innerHTML = html; return el; };
  var ARROW = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 10.5L10.5 3.5M4.5 3.5h6v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var count = function (text, cls) { return '<b class="' + (cls || '') + '" data-count="' + esc(text) + '">' + esc(text) + '</b>'; };
  function byline(post) {
    var a = post.author;
    return '<span class="rs-byline"><img src="' + esc(a.photo) + '" alt="" width="32" height="32" loading="lazy"><b>' + esc(a.name) + '</b>' + (a.title ? '<span>' + esc(a.title) + '</span>' : '') + '</span>';
  }
  // Optional date: an empty field leaves no tag and no meta entry.
  var when = function (post) { return post.date ? '<time datetime="' + post.date + '">' + fmt(post.date) + '</time>' : ''; };

  /* The chart: y axis with ticks, gridlines, bars, gap markers, counting labels. */
  function steps(max) {
    var options = [1, 2, 2.5, 5, 10, 20, 25, 30, 50, 100];
    for (var i = 0; i < options.length; i++) if (max / options[i] <= 5 && Math.abs(max / options[i] - Math.round(max / options[i])) < 1e-9) return options[i];
    return max / 4;
  }
  function tickLabel(v, c) { return c.unit === '%' ? v + '%' : c.unit === '×' ? v + '×' : String(v); }
  function chart(post, small) {
    var c = post.chart, cls = 'rc' + (small ? ' rc--sm' : '');
    if (c.kind === 'figure') {
      return '<div class="' + cls + '"><div class="rc-head"><p class="rc-title">' + esc(c.title) + '</p></div>' +
        (c.pipeline ? pipeline(c, small) : '<div class="rc-sheet"><img src="' + esc(c.src) + '" alt="' + esc(c.alt) + '" width="1600" height="875" loading="lazy"></div>') +
        (c.note && !small ? '<p class="rc-note">' + esc(c.note) + '</p>' : '') + '</div>';
    }
    var step = steps(c.max), ticks = Math.round(c.max / step), y = '';
    for (var v = 0; v <= c.max + 1e-9; v += step) {
      var p = (v / c.max * 100).toFixed(3) + '%';
      y += '<span style="--p:' + p + '"><b>' + tickLabel(+v.toFixed(2), c) + (!small && Math.abs(v - c.max) < 1e-9 && c.unit !== '%' && c.unit !== '×' ? ' ' + esc(c.unit) : '') + '</b></span><i class="rc-tick" style="--p:' + p + '"></i>';
    }
    var single = c.groups.every(function (g) { return g.bars.length === 1; });
    var label = c.title + '. ' + c.groups.map(function (g) { return g.label + ': ' + g.bars.map(function (b) { return b.t; }).join(', '); }).join('. ');
    return '<div class="' + cls + '" style="--cols:' + c.groups.length + ';--ticks:' + ticks + '" role="img" aria-label="' + esc(label) + '">' +
      '<div class="rc-head"><p class="rc-title">' + esc(c.title) + '</p><span class="rc-key"><span><i></i>' + esc(c.key[0]) + '</span><span><i></i>' + esc(c.key[1]) + '</span></span></div>' +
      '<div class="rc-area"><div class="rc-y">' + y + '</div><div class="rc-plot" style="--cols:' + c.groups.length + ';--ticks:' + ticks + '">' + c.groups.map(function (g) {
        var bars = g.bars.map(function (b) {
          var k = b.on ? ' is-result' : (single ? ' is-dim' : '');
          return '<span class="rc-bar' + k + '" style="--h:' + Math.max(b.v / c.max * 100, 2) + '%">' + count(b.t) + '</span>';
        }).join('');
        // A gap marker, as on the compression chart, where the post's own numbers allow a delta.
        var gap = '';
        if (c.deltas && g.bars.length === 2) {
          var a = g.bars[0].v, b2 = g.bars[1].v, hi = Math.max(a, b2) / c.max * 100, lo = Math.min(a, b2) / c.max * 100;
          var delta = Math.round((b2 - a) / a * 100);
          gap = '<i class="rc-gap" style="--hi:' + hi + '%;--lo:' + lo + '%"><b>' + (delta > 0 ? '+' : '−') + Math.abs(delta) + '%</b></i>';
        }
        return '<div class="rc-group">' + bars + gap + '</div>';
      }).join('') + '</div></div>' +
      '<div class="rc-x" style="--cols:' + c.groups.length + '">' + c.groups.map(function (g) { return '<span>' + esc(g.label) + '</span>'; }).join('') + '</div>' +
      (c.note ? '<p class="rc-note">' + esc(c.note) + '</p>' : '') + '</div>';
  }
  function pipeline(c, small) {
    var d = c.pipeline, status = { ok: '✓', maybe: '?', no: '×' };
    var step = function (i) { return '<p class="pl-step"><b>' + esc(d.steps[i][0]) + '</b>' + esc(d.steps[i][1]) + '</p>'; };
    // Long and short labels both render; the container query shows one.
    var both = function (long, short) { return '<span class="pl-long">' + esc(long) + '</span><span class="pl-short">' + esc(short || long) + '</span>'; };
    return '<div class="pl' + (small ? ' pl--sm' : '') + '" role="img" aria-label="' + esc(c.alt) + '"><svg class="pl-wires" aria-hidden="true"></svg>' +
      '<div class="pl-col pl-col--sources">' + step(0) + '<div class="pl-rows">' + d.sources.map(function (sr, i) { return '<span class="pl-row pl-src"><i class="pl-mark pl-mark--' + i + '">' + esc(sr[0]) + '</i>' + esc(sr[1]) + '</span>'; }).join('') + '</div><p class="pl-foot" aria-hidden="true">&nbsp;</p></div>' +
      '<div class="pl-col pl-col--tasks">' + step(1) + '<div class="pl-rows">' + d.tasks.map(function (t, i) { return '<span class="pl-row pl-task"><span>' + both(t, d.tasksShort && d.tasksShort[i]) + '</span><i class="pl-dot"></i></span>'; }).join('') + '</div><p class="pl-foot">' + esc(d.inputs[0]) + '</p></div>' +
      '<div class="pl-col pl-col--votes">' + step(2) + '<div class="pl-rows">' + d.votes.map(function (v, i) { return '<span class="pl-row pl-vote" data-status="' + v[0] + '"><i class="pl-status">' + status[v[0]] + '</i><span>' + both(v[1], d.votesShort && d.votesShort[i]) + '</span></span>'; }).join('') + '</div><p class="pl-foot">' + esc(d.inputs[1]) + '</p></div>' +
      '<div class="pl-col pl-col--result">' + step(3) + '<div class="pl-resultwrap"><div class="pl-result"><span class="p1-ready-stamp"><i></i>' + esc(d.result[0]) + '</span><b>' + both(d.result[1], d.resultShort) + '</b><span>' + esc(d.result[2]) + '</span></div></div><p class="pl-foot" aria-hidden="true">&nbsp;</p></div>' +
      '</div>';
  }

  /* The ledger: a ruled results table. */
  function ledger(list, head) {
    return '<div class="lg">' + (head ? '<div class="lg-head" aria-hidden="true"><span>Result</span><span>Post</span><span>Topic</span><span>Author</span><span></span></div>' : '') +
      list.map(function (p) {
        return '<a class="lg-row" href="' + href(p) + '" data-reveal>' +
          '<span class="lg-fig">' + count(p.figure.value) + '</span>' +
          '<span class="lg-main"><strong>' + esc(p.title) + '</strong><span>' + esc(p.figure.label) + '</span></span>' +
          '<span class="lg-topic">' + esc(p.topics[0]) + '</span>' +
          '<span class="lg-who">' + byline(p) + when(p) + '</span>' +
          '<span class="lg-arrow">' + ARROW + '</span></a>';
      }).join('') + '</div>';
  }
  /* The readings strip. */
  function readings(items) {
    return items.map(function (it, i) {
      var tag = it.href ? 'a' : 'div';
      return '<' + tag + (it.href ? ' href="' + it.href + '"' : '') + ' class="' + (i ? '' : 'is-lead') + '"><i class="rd-tick" aria-hidden="true"></i>' + count(it.value) + '<span>' + esc(it.label) + '</span></' + tag + '>';
    }).join('');
  }

  /* ── Index A: the board, then the Agent's use-case accordion ─────────── */
  function indexA() {
    set('[data-board]', ledger(posts, true));
    set('[data-count-posts]', posts.length + ' posts');
    set('[data-stack]', posts.map(function (p, i) {
      return '<article class="snav-item' + (i ? '' : ' active') + '"><h3><button class="snav-btn" id="post-' + i + '" type="button" aria-expanded="' + (i ? 'false' : 'true') + '" aria-controls="post-body-' + i + '" data-post="' + i + '">' +
        '<span><em data-count="' + esc(p.figure.value) + '">' + esc(p.figure.value) + '</em><span>' + esc(p.title) + '</span></span><span class="snav-plus" aria-hidden="true">+</span></button></h3>' +
        '<div class="snav-body" id="post-body-' + i + '" role="region" aria-labelledby="post-' + i + '"' + (i ? ' inert aria-hidden="true"' : '') + '><div><p>' + esc(p.figure.label.charAt(0).toUpperCase() + p.figure.label.slice(1)) + '. ' + esc(p.summary) + '</p>' +
        '<div class="snav-foot">' + byline(p) + '<a class="snav-link" href="' + href(p) + '">Read the post</a></div></div></div></article>';
    }).join(''));
    set('[data-surface]', '<div class="p1-result-light" aria-hidden="true"></div><div data-chart-host>' + chart(posts[0]) + '</div>');
  }
  /* ── Index B: the homepage feature card, the readings strip, ruled rows ── */
  function indexB() {
    var f = posts[0];
    set('[data-featured]', '<a class="fb-card2" href="' + href(f) + '"><canvas class="fb2-mesh" data-mesh="card" aria-hidden="true"></canvas>' +
      '<div class="fb2-copy"><div class="fb2-top"><b>Latest</b><span>' + esc(f.topics[0]) + '</span>' + when(f) + '</div>' +
      '<h2 class="feat-name">' + esc(f.title) + '</h2><p class="feat-copy">' + esc(f.summary) + '</p>' +
      '<p class="fb2-fig">' + count(f.figure.value) + '<span>' + esc(f.figure.label) + '</span></p>' +
      '<div class="fb2-foot">' + byline(f) + '<span class="p1-button">Read the post</span></div></div>' +
      '<div class="fb2-stage">' + chart(f) + '</div></a>');
    set('[data-readings]', readings(posts.map(function (p) { return { value: p.figure.value, label: p.figure.label, href: href(p) }; })));
    set('[data-rows]', ledger(posts, true));
    set('[data-count-posts]', posts.length + ' posts');
    var RESOURCES = [
      { type: 'Guides & Reports', title: 'The Merit Cycle State of the Union 2026', cta: 'Download', img: 'media/resources/res-merit-sotu.png' },
      { type: 'Guides & Reports', title: 'The Comp Data Upgrade: Evaluating a New Provider', cta: 'Download', img: 'media/resources/res-compdata.png' },
      { type: 'Webinar Replay', title: 'Scaling Smart: Databricks’ Compensation Strategy for Hypergrowth', cta: 'Watch the replay', img: 'media/resources/res-people.jpg' },
      { type: 'Case Study', title: 'How Workato Achieved On-Time Merit Cycles with Pave', cta: 'Read the story', img: 'media/resources/res-workato.jpg' },
      { type: 'Guides & Reports', title: 'The New Age of Equity: 2026 Equity Program Trends', cta: 'Download', img: 'media/resources/res-purple.jpg' },
      { type: 'Articles', title: '7 AI Prompts Every Compensation Analyst Should Know', cta: 'Read the article', img: 'media/resources/res-green.jpg' },
      { type: 'Events', title: 'Total Rewards Live — September 9–10, San Francisco', cta: 'Save your seat', img: 'media/resources/res-blue.jpg' }
    ];
    set('[data-resources]', RESOURCES.map(function (r) {
      return '<a class="res-card" href="https://www.pave.com/insights"><span class="res-img"><img src="' + r.img + '" alt="" loading="lazy"></span><span class="res-type">' + esc(r.type) + '</span><span class="res-title">' + esc(r.title) + '</span><span class="res-cta">' + esc(r.cta) + ' ' + ARROW + '</span></a>';
    }).join(''));
  }

  /* ── Light attempts ───────────────────────────────────────────────────── */
  /* The gradient shapes: the footer puzzle's checkerboard of rounded squares and
     circles over one brand gradient laid across the whole grid, so a tile takes
     the colour of wherever it sits. Every tile is a rect (rx 1.7 square, 4.1
     circle) so the motion can slide one into a gap and turn it as it lands.
     data-shapes="cols,rows,gap,gap..." */
  var GS_STOPS = {
    block: [[0, '#0e1d42'], [.26, '#1b3f9e'], [.48, '#235cf3'], [.72, '#7aa4fa'], [1, '#a46fef']],
    strip: [[0, '#0e1d42'], [.18, '#1b3f9e'], [.36, '#235cf3'], [.52, '#7aa4fa'], [.66, '#a46fef'], [.84, '#235cf3'], [1, '#0e1d42']]
  };
  function shapes() {
    document.querySelectorAll('[data-shapes]').forEach(function (el, n) {
      var a = el.getAttribute('data-shapes').split(',').map(Number), cols = a[0], rows = a[1], gaps = a.slice(2), u = 10, w = cols * u, h = rows * u;
      var strip = el.classList.contains('gs--strip'), id = 'gs-fill-' + n;
      // The CSS angle (125deg, strips 90deg) as a line corner to corner.
      var ang = (strip ? 90 : 125) * Math.PI / 180, dx = Math.sin(ang), dy = -Math.cos(ang), len = Math.abs(w * dx) + Math.abs(h * dy);
      var line = 'x1="' + (w / 2 - dx * len / 2) + '" y1="' + (h / 2 - dy * len / 2) + '" x2="' + (w / 2 + dx * len / 2) + '" y2="' + (h / 2 + dy * len / 2) + '"';
      var stops = GS_STOPS[strip ? 'strip' : 'block'].map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>'; }).join('');
      var tiles = '';
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        if (gaps.indexOf(r * cols + c) >= 0) continue;
        tiles += '<rect data-c="' + c + '" data-r="' + r + '" x="' + (c * u + .9) + '" y="' + (r * u + .9) + '" width="8.2" height="8.2" rx="' + ((r + c) % 2 ? 4.1 : 1.7) + '"/>';
      }
      el.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" data-gs-cols="' + cols + '" data-gs-gaps="' + gaps.join(',') + '" focusable="false">' +
        '<defs><linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" ' + line + '>' + stops + '</linearGradient></defs>' +
        '<g fill="url(#' + id + ')">' + tiles + '</g></svg>';
      el.style.aspectRatio = cols + ' / ' + rows;
    });
  }
  /* C: an open featured post, then every post in one ruled index. */
  function indexC() {
    var f = posts[0];
    set('[data-featured]', '<a class="lt-feature-link" href="' + href(f) + '">' +
      '<div class="lt-feature-copy"><p class="lt-kicker"><b>Latest</b><span>' + esc(f.topics[0]) + '</span>' + when(f) + '</p>' +
      '<h2 class="lt-feature-title">' + esc(f.title) + '</h2><p class="lt-dek">' + esc(f.summary) + '</p>' +
      '<p class="lt-figure">' + count(f.figure.value) + '<span>' + esc(f.figure.label) + '</span></p>' +
      '<div class="lt-feature-foot">' + byline(f) + '<span class="lt-read">Read the post</span></div></div>' +
      '<div class="lt-feature-art">' + chart(f) + '</div></a>');
    set('[data-rows]', ledger(posts, true));
    set('[data-count-posts]', posts.length + ' posts');
  }
  /* Ruled V2 (Pave's October 14 comments on Ruled): the featured post is text
     only (title and stat, no subhead or diagram), its byline reads "Name,
     Title" on one line, each row's figure carries a short context line, and
     the list shows a page at a time behind "Show more". Ruled itself (indexC)
     is unchanged: Pave has seen it. */
  var PAGE = 3; // three so the button shows with today's four posts; production would use 8 to 10
  function bylineComma(post) {
    var a = post.author;
    return '<span class="rs-byline rs-byline--comma"><img src="' + esc(a.photo) + '" alt="" width="32" height="32" loading="lazy"><span class="rs-who"><b>' + esc(a.name) + '</b>' +
      (a.title ? '<span class="rs-title">, ' + esc(a.title) + '</span>' : '') + '</span></span>';
  }
  function ledgerV2(list) {
    var rows = list.map(function (p, i) {
      return '<a class="lg-row" href="' + href(p) + '" data-reveal' + (i >= PAGE ? ' data-more hidden' : '') + '>' +
        '<span class="lg-fig">' + count(p.figure.value) + '<em class="lg-context">' + esc(p.figure.context || p.figure.label) + '</em></span>' +
        '<span class="lg-main"><strong>' + esc(p.title) + '</strong></span>' +
        '<span class="lg-topic">' + esc(p.topics[0]) + '</span>' +
        '<span class="lg-who">' + byline(p) + when(p) + '</span>' +
        '<span class="lg-arrow">' + ARROW + '</span></a>';
    }).join('');
    var rest = Math.max(0, list.length - PAGE);
    return '<div class="lg lg--v2"><div class="lg-head" aria-hidden="true"><span>Result</span><span>Post</span><span>Topic</span><span>Author</span><span></span></div>' + rows + '</div>' +
      (rest ? '<button class="lg-more" type="button" data-page="' + PAGE + '">Show more research <span data-more-count>' + rest + '</span></button>' : '');
  }
  function indexC2() {
    var f = posts[0];
    set('[data-featured]', '<a class="lt-feature-link lt-feature-link--text" href="' + href(f) + '">' +
      '<div class="lt-feature-copy"><p class="lt-kicker"><b>Latest</b><span>' + esc(f.topics[0]) + '</span>' + when(f) + '</p>' +
      '<h2 class="lt-feature-title">' + esc(f.title) + '</h2>' +
      '<div class="lt-feature-foot">' + bylineComma(f) + '<span class="lt-read">Read the post</span></div></div>' +
      '<p class="lt-figure lt-figure--feature">' + count(f.figure.value) + '<span>' + esc(f.figure.label) + '</span></p></a>');
    set('[data-rows]', ledgerV2(posts));
    set('[data-count-posts]', posts.length + ' posts');
  }

  /* D's cell: topic and date, the figure at display size, its label, a chart
     with axes, then the title and byline. The lead cell carries "Latest" and
     its full chart. */
  function mxCell(p, lead) {
    return '<li><a class="mx-cell" href="' + href(p) + '" data-reveal>' +
      '<p class="mx-top">' + (lead ? '<b>Latest</b>' : '') + '<span>' + esc(p.topics[0]) + '</span>' + when(p) + '<span class="lg-arrow" aria-hidden="true">' + ARROW + '</span></p>' +
      '<p class="mx-fig" data-count="' + esc(p.figure.value) + '">' + esc(p.figure.value) + '</p>' +
      '<p class="mx-label">' + esc(p.figure.label) + '</p>' +
      '<div class="mx-art">' + chart(p, !lead) + '</div>' +
      '<div class="mx-foot"><h3>' + esc(p.title) + '</h3>' + byline(p) + '</div></a></li>';
  }
  /* D: one hairline matrix; the latest runs across, the rest sit in threes. */
  function indexD() {
    set('[data-matrix]', posts.map(function (p, i) { return mxCell(p, !i); }).join(''));
  }
  /* E: a list of figures, then each post as a figure section with its chart. */
  function indexE() {
    var mark = function (i) { return '<i class="ev-mark' + (i % 2 ? ' ev-mark--round' : '') + '" aria-hidden="true"></i>'; };
    set('[data-contents]', '<p>List of figures</p>' + posts.map(function (p, i) {
      return '<a href="#fig-' + no(p) + '"><span>' + mark(i) + 'Fig. ' + no(p) + '</span><span>' + esc(p.title) + '</span><b data-count="' + esc(p.figure.value) + '">' + esc(p.figure.value) + '</b></a>';
    }).join(''));
    set('[data-evidence]', posts.map(function (p, i) {
      return '<div class="ev-band"><div class="p1-container"><article class="ev" id="fig-' + no(p) + '" data-reveal>' +
        '<p class="ev-meta"><b>' + mark(i) + 'Fig. ' + no(p) + '</b><span>' + esc(p.topics.join(' / ')) + '</span>' + when(p) + '</p>' +
        '<div class="ev-copy"><h2><a href="' + href(p) + '">' + esc(p.title) + '</a></h2>' +
        '<p class="lt-figure">' + count(p.figure.value) + '<span>' + esc(p.figure.label) + '</span></p>' +
        '<p class="lt-dek">' + esc(p.summary) + '</p>' +
        '<div class="ev-foot">' + byline(p) + '<a class="lt-read" href="' + href(p) + '">Read the post</a></div></div>' +
        '<div class="ev-art">' + chart(p) + '</div></article></div></div>';
    }).join(''));
  }

  /* ── Articles ─────────────────────────────────────────────────────────── */
  function article() {
    var slug = new URLSearchParams(location.search).get('post');
    var post = posts.filter(function (p) { return p.slug === slug; })[0] || posts[0];
    if (!post) return;
    /* Split Header V2 (Teresa's October 15 comments; Split Header itself is
       unchanged): the headline number and the figure image are optional, and
       Results only shows when the header has no number. ?without=figure,image
       previews a post that has neither. */
    var v2 = body.getAttribute('data-post') === 'v2';
    var without = v2 ? (new URLSearchParams(location.search).get('without') || '').split(',') : [];
    var figure = without.indexOf('figure') < 0 ? post.figure : null, image = without.indexOf('image') < 0 ? post.chart : null;
    document.title = post.title + ' | Pave';
    set('[data-crumbs]', '<a href="' + pages[0] + '">Research</a><span aria-hidden="true">/</span><span>' + esc(post.topics[0]) + '</span>');
    set('[data-title]', esc(post.title));
    set('[data-dek]', esc(post.summary));
    set('[data-meta]', byline(post) + (post.date ? '<span class="hero-dot" aria-hidden="true"></span>' + when(post) : '') + '<span class="hero-dot" aria-hidden="true"></span><span>' + post.read + ' min read</span>');
    set('[data-meta-dl]', '<div><dt>Author</dt><dd>' + byline(post) + '</dd></div>' + (post.date ? '<div><dt>Published</dt><dd>' + when(post) + '</dd></div>' : '') +
      '<div><dt>Reading time</dt><dd>' + post.read + ' min</dd></div><div><dt>Topics</dt><dd>' + esc(post.topics.join(' / ')) + '</dd></div>');
    // No number to feature: the stat leaves and the author details move up.
    if (figure) set('[data-hero-stat]', '<p class="hero-stat" data-count="' + esc(figure.value) + '">' + esc(figure.value) + '</p><p class="hero-stat-label">' + esc(figure.label) + '</p>');
    else { var statEl = document.querySelector('[data-hero-stat]'); if (statEl) statEl.remove(); }
    // Where the header already carries the headline figure, Results skips it;
    // V2 leaves Results out whenever the header has a number.
    var stats = v2 ? (figure || without.indexOf('figure') >= 0 ? [] : post.stats || [])
      : document.querySelector('[data-hero-stat]') ? post.stats.filter(function (s) { return s.value !== post.figure.value; }) : post.stats;
    var results = set('[data-results]', readings(stats.map(function (s) { return { value: s.value, label: s.label }; })));
    if (results) {
      results.style.setProperty('--n', Math.max(stats.length, 1));
      var block = results.closest('section') || results.parentElement;
      if (!stats.length && block) block.hidden = true;
    }
    set('[data-source]', esc(post.source));
    if (image) set('[data-figure]', chart(post));
    else { var figEl = document.querySelector('[data-figure]'); if (figEl) (figEl.closest('section') || figEl).hidden = true; }

    var toc = [], n = 0, blocks = [], c = post.chart || {};
    post.body.forEach(function (b) {
      if (b.h2) { var id = 's' + (++n), nn = String(n).padStart(2, '0'); toc.push('<li><a href="#' + id + '" data-no="' + nn + '">' + b.h2 + '</a></li>'); blocks.push('<h2 id="' + id + '" data-no="' + nn + '">' + b.h2 + '</h2>'); }
      else if (b.p) blocks.push('<p>' + b.p + '</p>');
      else if (b.ul) blocks.push('<ul>' + b.ul.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>');
      else if (b.img && b.img.src !== c.src) blocks.push('<figure><img src="' + esc(b.img.src) + '" alt="' + esc(b.img.alt) + '" loading="lazy"><figcaption>' + esc(b.img.caption) + '</figcaption></figure>');
    });
    if (post.cta && blocks.join('').indexOf(esc(post.cta.text).slice(0, 40)) < 0 && n > 1) {
      var heads = blocks.map(function (b, i) { return b.indexOf('<h2') === 0 ? i : -1; }).filter(function (i) { return i >= 0; });
      blocks.splice(heads[Math.floor(heads.length / 2)], 0, '<aside class="mid-cta"><p>' + esc(post.cta.text) + '</p><a class="p1-button" href="' + esc(post.cta.url) + '">' + (/download/i.test(post.cta.text) ? 'Download the report' : 'Book a demo') + '</a></aside>');
    }
    set('[data-body]', blocks.join(''));
    set('[data-toc]', '<i class="toc-progress" aria-hidden="true"></i>' + toc.join(''));
    var tocEl = document.querySelector('.toc'); if (tocEl) tocEl.hidden = toc.length < 2;
    set('[data-author]', '<img src="' + esc(post.author.photo) + '" alt="" width="64" height="64" loading="lazy"><div><small>Written by</small><span class="author-name">' + esc(post.author.name) + '</span>' +
      (post.author.title ? '<small>' + esc(post.author.title) + '</small>' : '') + (post.author.linkedin ? '<small><a href="' + esc(post.author.linkedin) + '">LinkedIn</a></small>' : '') + '</div>');
    var others = posts.filter(function (p) { return p !== post; });
    set('[data-more]', ledger(others, false));
    set('[data-more-row]', others.slice(0, 3).map(function (p) { return mxCell(p, false); }).join(''));
  }

  shapes();
  if (page === 'index') ({ a: indexA, b: indexB, c: indexC, c2: indexC2, c3: indexC2, d: indexD, e: indexE }[variant] || indexA)();
  if (page === 'article') article();
  window.PaveResearchChart = chart;
})();
