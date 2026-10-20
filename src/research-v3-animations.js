/* Motion for attempts A and B, on the Agent page's rules: one entry point,
   named initializers, GSAP ScrollTrigger reveals (32px, .85s, once), the
   meshes and the living light on GSAP's ticker at 30fps and asleep
   offscreen, Lenis on the ticker, gsap.matchMedia() settling everything
   under reduced motion. Numbers count up once as they enter (the
   calculator's 1.4s count). No pins. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, PaveMesh = window.PaveMesh;
  if (!gsap || !ST) return;
  gsap.registerPlugin(ST);
  var mm = gsap.matchMedia();
  var still = false, lenis = null, elapsed = 0, lastDraw = 0, ticking = false;
  var meshes = [], lights = [];
  var posts = window.PaveResearch || [];

  /* Meshes: the Agent hero (speed .3, flipped), the closing panel (.9, pointer
     pull), the pricing band and the homepage feature card (their plate values). */
  var configs = {
    hero: function () { var c = PaveMesh.defaultConfig(); c.params.speed = .3; return c; },
    closing: function () { var c = PaveMesh.defaultConfig(); Object.assign(c.params, { speed: .9, darkness: .34, brightness: 1.58, mouseStrength: 1.7, mouseRadius: .5 }); return c; },
    band: function () { var c = PaveMesh.defaultConfig(); Object.assign(c.params, { darkness: .42, brightness: 1.32, blur: .85, spread: 1.3 }); return c; },
    card: function () { var c = PaveMesh.defaultConfig(); Object.assign(c.params, { darkness: .46, brightness: 1.3 }); return c; },
    // Design 05's calculator stage, as Hunter tuned it (calculator.html heroTune)
    calculator: function () {
      var c = PaveMesh.defaultConfig();
      Object.assign(c.params, { darkness: .2, brightness: 1.35, saturation: 1.35, hue: 0, blur: .88, spread: 1.18, speed: .65 });
      c.colors = [[2, 19, 64], [2, 19, 64], [9, 34, 100], [35, 92, 243], [35, 92, 243], [35, 92, 243], [164, 111, 239],
        [9, 34, 100], [35, 92, 243], [2, 19, 64], [164, 111, 239]].map(function (rgb) { return rgb.map(function (v) { return v / 255; }); });
      return c;
    },
    // Ruled V4's shapes: the purple colourway with less pink (Teresa, Oct 20:
    // "there can be a little but it's not officially a brand color")
    violet: function () {
      var c = configs.purple();
      Object.assign(c.params, { hue: .06, saturation: 2.7 });
      c.colors[10] = [.6, .6, .96];
      c.colors[5] = [.62, .58, .95];
      return c;
    },
    // The Customers page's purple colourway, as Hunter dialled it (customers.html, Aug 27)
    purple: function () {
      var c = PaveMesh.defaultConfig();
      Object.assign(c.params, { darkness: .49, aqua: 2, saturation: 3.44, brightness: 2.02, hue: .23, greenTrim: 0, blur: .6, spread: 1.35, speed: 1.31, mouseStrength: 0, mouseRadius: .38 });
      c.colors = [[.055, .035, .105], [.055, .035, .105], [.15, .075, .29], [.33, .23, .52], [.11, .06, .215],
        [.7, .59, .93], [.815, .745, .96], [.925, .895, .995], [.96, .945, .992], [.76, .75, .78], [.82, .64, .94]];
      c.weights = [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1];
      return c;
    }
  };
  function initMeshes() {
    if (!PaveMesh) return;
    document.querySelectorAll('canvas[data-mesh]').forEach(function (canvas) {
      var make = configs[canvas.dataset.mesh]; if (!make) return;
      var renderer = PaveMesh.createMesh(canvas, make());
      var host = canvas.parentElement;
      // No WebGL: mesh-painted shapes fall back to their SVG gradient
      if (!renderer) { canvas.hidden = true; host.classList.remove('gs--mesh'); return; }
      var entry = { renderer: renderer, canvas: canvas, visible: false, x: .5, y: .45, tx: .5, ty: .45, pull: canvas.dataset.mesh === 'closing',
        paint: host.querySelector('canvas.gs-paint'), svg: host.querySelector('svg') };
      meshes.push(entry);
      var resize = function () {
        var b = host.getBoundingClientRect();
        var ratio = Math.min(devicePixelRatio || 1, 1.5, 1500 / Math.max(1, b.width));
        renderer.resize(Math.max(1, Math.round(b.width * ratio)), Math.max(1, Math.round(b.height * ratio)));
        if (entry.paint) { entry.paint.width = Math.max(1, Math.round(b.width * ratio)); entry.paint.height = Math.max(1, Math.round(b.height * ratio)); }
        renderer.draw(elapsed, entry.x, entry.y); paintShapes(entry); wake();
      };
      new ResizeObserver(resize).observe(host);
      if (entry.pull) {
        host.addEventListener('pointermove', function (e) { var r = host.getBoundingClientRect(); entry.tx = (e.clientX - r.left) / r.width; entry.ty = 1 - (e.clientY - r.top) / r.height; wake(); });
        host.addEventListener('pointerleave', function () { entry.tx = .5; entry.ty = .45; });
      }
      ST.create({ trigger: host, start: 'top bottom', end: 'bottom top', onToggle: function (self) { entry.visible = self.isActive; wake(); }, onRefresh: function (self) { entry.visible = self.isActive; } });
      resize();
    });
  }
  /* Mesh-painted shapes (Ruled V2's hero, Teresa: "full send with the purple
     bloopy gradient"): the SVG tiles stay the geometry, so initShapes still
     slides and rounds them; every frame the canvas copies their positions and
     fills them with the purple mesh, as the footer puzzle fills its tiles. */
  function tilePath(ctx, x, y, s, r) {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + s, y, x + s, y + s, r); ctx.arcTo(x + s, y + s, x, y + s, r);
    ctx.arcTo(x, y + s, x, y, r); ctx.arcTo(x, y, x + s, y, r);
    ctx.closePath();
  }
  function paintShapes(m) {
    var paint = m.paint, svg = m.svg;
    if (!paint || !svg || !svg.viewBox || !svg.viewBox.baseVal) return;
    var ctx = paint.getContext('2d'), w = paint.width, h = paint.height, vb = svg.viewBox.baseVal;
    if (!w || !h || !vb.width) return;
    var k = Math.min(w / vb.width, h / vb.height), ox = (w - vb.width * k) / 2, oy = (h - vb.height * k) / 2;
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    svg.querySelectorAll('rect').forEach(function (r) {
      var s = r.width.baseVal.value * k;
      tilePath(ctx, ox + r.x.baseVal.value * k, oy + r.y.baseVal.value * k, s, Math.min(r.rx.baseVal.value * k, s / 2));
    });
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(m.canvas, 0, 0, w, h);
    ctx.restore();
  }

  /* The Agent's living light behind the result surface (agent-orb-living.js). */
  function initLivingLight() {
    var host = document.querySelector('.p1-result-light');
    if (!host || !window.PaveLivingLight || !window.PaveAgentMaterials || !window.PaveOrbPresets) return;
    var materials = PaveAgentMaterials.create(PaveOrbPresets.living.cfg);
    var light = PaveLivingLight.create(host, { size: 320, cfg: Object.assign({}, materials.states.results, { shadow: 0 }) });
    var surface = host.parentElement, entry = { light: light, host: surface, visible: false };
    lights.push(entry);
    var draw = function () { light.draw(elapsed * .28, { thinking: 0, quiet: 1, lightTurn: elapsed * .11, calmTime: elapsed * .45, surface: { expansion: 1, width: surface.clientWidth, height: surface.clientHeight, radius: 28 } }); };
    entry.draw = draw;
    new ResizeObserver(function () { draw(); wake(); }).observe(surface);
    ST.create({ trigger: surface, start: 'top bottom', end: 'bottom top', onToggle: function (self) { entry.visible = self.isActive; wake(); }, onRefresh: function (self) { entry.visible = self.isActive; } });
    draw();
  }
  function tick(time, delta) {
    if (still || document.hidden) { ticking = false; gsap.ticker.remove(tick); return; }
    elapsed += delta / 1000;
    if (time - lastDraw < 1 / 30) return; // ticker time is in seconds
    lastDraw = time;
    var any = false;
    meshes.forEach(function (m) {
      // The closing mesh keeps drawing while the footer shows: it is the puzzle's texture.
      var feeds = footerVisible && m.pull;
      if (!m.visible && !feeds) return; any = true;
      m.x += (m.tx - m.x) * .08; m.y += (m.ty - m.y) * .08; m.renderer.draw(elapsed, m.x, m.y);
      if (feeds) footer.render(m.canvas);
      if (m.paint) paintShapes(m);
    });
    lights.forEach(function (l) { if (!l.visible) return; any = true; l.draw(); });
    if (footerVisible) {
      any = true;
      if (!meshes.some(function (m) { return m.pull; })) footer.render(null);
      if (elapsed - footerBeat > .9) { footer.step(); footerBeat = elapsed; }
    }
    if (!any) { ticking = false; gsap.ticker.remove(tick); }
  }
  function wake() { if (!still && !ticking && !document.hidden) { ticking = true; gsap.ticker.add(tick); } }

  /* The footer's sliding puzzle, as the Agent page runs it (animations.js
     initFooter): five rows of circles and rounded squares in a checkerboard,
     a few holes that tiles slide into on a .9s beat (never straight back),
     click a tile beside a hole to slide it, the closing mesh as the texture
     (flat brand colours if WebGL is out). */
  var footer = null, footerVisible = false, footerBeat = 0;
  function initFooterPuzzle() {
    var cnv = document.getElementById('footerPz');
    if (!cnv) return null;
    var ctx = cnv.getContext('2d');
    var paused = false, source = null;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var GAP = 10, ROWS = 5;
    var FLAT = ['#0e1d42', '#132c6b', '#1b3f9e', '#235cf3', '#7aa4fa'];
    var cell, cols, W, H, tiles, grid, holes;
    function build() {
      if (tiles) tiles.forEach(function (t) { gsap.killTweensOf(t); });
      var wCss = cnv.parentNode.clientWidth || window.innerWidth;
      cell = Math.max(40, Math.min(58, Math.round(window.innerWidth / 26)));
      cols = Math.ceil((wCss + GAP) / (cell + GAP));
      var hCss = ROWS * cell + (ROWS - 1) * GAP;
      W = Math.round(wCss * DPR); H = Math.round(hCss * DPR);
      cnv.width = W; cnv.height = H; cnv.style.height = hCss + 'px';
      grid = []; tiles = [];
      for (var r = 0; r < ROWS; r++) {
        grid.push([]);
        for (var c = 0; c < cols; c++) {
          var t = { c: c, r: r, x: c * (cell + GAP), y: r * (cell + GAP), round: (r + c) % 2 !== 0, flat: FLAT[(c * 5 + r * 3) % FLAT.length] };
          grid[r].push(t); tiles.push(t);
        }
      }
      holes = [];
      var want = Math.max(2, Math.round(cols * ROWS / 14)), guard = 0;
      while (holes.length < want && guard++ < 500) {
        var hc = Math.floor(Math.random() * cols), hr = Math.floor(Math.random() * ROWS);
        if (!grid[hr][hc]) continue;
        if (!holes.every(function (h) { return Math.abs(h.c - hc) + Math.abs(h.r - hr) > 3; })) continue;
        tiles.splice(tiles.indexOf(grid[hr][hc]), 1);
        grid[hr][hc] = null;
        holes.push({ c: hc, r: hr, lastC: -1, lastR: -1 });
      }
      render(source);
    }
    function slideIntoHole(tile, h) {
      var tc = tile.c, tr = tile.r;
      grid[h.r][h.c] = tile; grid[tr][tc] = null;
      tile.c = h.c; tile.r = h.r;
      gsap.to(tile, { x: tile.c * (cell + GAP), y: tile.r * (cell + GAP), duration: paused ? 0 : .55, ease: 'power2.out', overwrite: true, onUpdate: function () { render(source); wake(); } });
      h.lastC = h.c; h.lastR = h.r; h.c = tc; h.r = tr;
    }
    function step() {
      if (document.hidden || paused) return;
      holes.forEach(function (h) {
        var opts = [];
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
          var c = h.c + d[0], r = h.r + d[1];
          if (c < 0 || c >= cols || r < 0 || r >= ROWS || !grid[r][c]) return;
          if (c === h.lastC && r === h.lastR) return;
          opts.push(grid[r][c]);
        });
        if (!opts.length) { h.lastC = -1; h.lastR = -1; return; }
        slideIntoHole(opts[Math.floor(Math.random() * opts.length)], h);
      });
    }
    cnv.addEventListener('click', function (e) {
      var rect = cnv.getBoundingClientRect();
      var c = Math.floor((e.clientX - rect.left) / (cell + GAP)), r = Math.floor((e.clientY - rect.top) / (cell + GAP));
      if (r < 0 || r >= ROWS || c < 0 || c >= cols || !grid[r] || !grid[r][c]) return;
      for (var i = 0; i < holes.length; i++) {
        if (Math.abs(holes[i].c - c) + Math.abs(holes[i].r - r) === 1) { slideIntoHole(grid[r][c], holes[i]); return; }
      }
    });
    function tilePath(x, y, s2, round) {
      if (round) { ctx.moveTo(x + s2, y + s2 / 2); ctx.arc(x + s2 / 2, y + s2 / 2, s2 / 2, 0, Math.PI * 2); return; }
      var rr = s2 * .24;
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + s2, y, x + s2, y + s2, rr); ctx.arcTo(x + s2, y + s2, x, y + s2, rr);
      ctx.arcTo(x, y + s2, x, y, rr); ctx.arcTo(x, y, x + s2, y, rr);
      ctx.closePath();
    }
    function render(src) {
      source = src;
      ctx.clearRect(0, 0, W, H);
      if (src && src.width) {
        ctx.save(); ctx.beginPath();
        tiles.forEach(function (t) { tilePath(t.x * DPR, t.y * DPR, cell * DPR, t.round); });
        ctx.fillStyle = '#000'; ctx.fill();
        // The rich middle band of the gradient, through the tile mask.
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(src, 0, src.height * .15, src.width, src.height * .65, 0, 0, W, H);
        ctx.restore();
      } else {
        tiles.forEach(function (t) { ctx.beginPath(); tilePath(t.x * DPR, t.y * DPR, cell * DPR, t.round); ctx.fillStyle = t.flat; ctx.fill(); });
      }
    }
    build();
    window.addEventListener('resize', build);
    ST.create({ trigger: cnv, start: 'top bottom', end: 'bottom top', onToggle: function (self) {
      footerVisible = self.isActive;
      tiles.forEach(function (t) { gsap.getTweensOf(t).forEach(function (tw) { tw.paused(!footerVisible); }); });
      wake();
    } });
    return { render: render, step: step, setStill: function (v) { paused = v; } };
  }
  document.addEventListener('visibilitychange', wake);

  /* Count-ups: every number in the text counts from zero; separators, units and
     ranges stay in place. 1.4s, the calculator's intro count. */
  function countUp(el, duration) {
    var text = el.getAttribute('data-count'); if (!text) return;
    if (still) { el.textContent = text; return; }
    var parts = text.split(/(\d[\d,]*\.?\d*)/);
    var state = { p: 0 };
    // Hold the final width while the digits change, so nothing beside the
    // number re-wraps mid-count (E's list of figures flickered without this).
    el.textContent = text;
    var inline = getComputedStyle(el).display === 'inline';
    if (inline) el.style.display = 'inline-block';
    var w = el.getBoundingClientRect().width;
    if (w) el.style.minWidth = w + 'px';
    var release = function () { el.style.minWidth = ''; if (inline) el.style.display = ''; };
    var render = function () {
      el.textContent = parts.map(function (part, i) {
        if (i % 2 === 0) return part;
        var comma = part.indexOf(',') >= 0, dec = (part.split('.')[1] || '').length, value = parseFloat(part.replace(/,/g, '')) * state.p;
        var s = value.toFixed(dec);
        return comma ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
      }).join('');
    };
    gsap.killTweensOf(state);
    render();
    gsap.to(state, { p: 1, duration: duration || 1.4, ease: 'power2.out', onUpdate: render, onComplete: function () { el.textContent = text; release(); } });
  }
  /* Big figures roll in like a counter: every digit spins up its reel to its
     value, left to right, and units and signs rise into place beside them.
     Smaller numbers keep the plain count. */
  var ROLL = '.mx-fig, .lt-figure b, .hero-stat, .lg-fig b, .rd b, .fb2-fig b';
  function primeRoll(el) {
    var text = el.getAttribute('data-count'); if (!text || el.querySelector('.roll')) return;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    Array.prototype.forEach.call(text, function (ch) {
      var box = document.createElement('span'); box.setAttribute('aria-hidden', 'true');
      if (/\d/.test(ch)) {
        box.className = 'roll roll-d';
        var ghost = document.createElement('span'); ghost.className = 'roll-ghost'; ghost.textContent = ch;
        var reel = document.createElement('span'); reel.className = 'roll-reel'; reel.dataset.to = 10 + +ch;
        for (var k = 0; k < 20; k++) { var d = document.createElement('i'); d.textContent = k % 10; reel.appendChild(d); }
        box.appendChild(ghost); box.appendChild(reel);
      } else {
        box.className = 'roll roll-c';
        var c = document.createElement('span'); c.textContent = ch === ' ' ? '\u00a0' : ch; box.appendChild(c);
      }
      el.appendChild(box);
    });
    gsap.set(el.querySelectorAll('.roll-reel'), { xPercent: -50, yPercent: 0 });
    gsap.set(el.querySelectorAll('.roll-c > span'), { yPercent: 130 });
  }
  function playRoll(el) {
    el.querySelectorAll('.roll').forEach(function (box, i) {
      var reel = box.querySelector('.roll-reel'), at = i * .07;
      if (reel) gsap.to(reel, { yPercent: -5 * +reel.dataset.to, duration: 1.6, delay: at, ease: 'expo.out' });
      else gsap.to(box.firstChild, { yPercent: 0, duration: .9, delay: at + .25, ease: 'power3.out' });
    });
  }
  function playCounts(scope, stagger) {
    var els = scope.querySelectorAll('[data-count]');
    els.forEach(function (el, i) { gsap.delayedCall((stagger || 0) * i, function () { countUp(el); }); });
  }
  /* The chart's bars rise from the baseline (the Agent's illustration entrance),
     gap markers follow, labels count. */
  function primeChart(rc) {
    gsap.set(rc.querySelectorAll('.rc-bar, .lg-spark i'), { scaleY: .2, opacity: .45 });
    gsap.set(rc.querySelectorAll('.rc-gap'), { autoAlpha: 0, y: 6 });
  }
  function playChart(rc) {
    if (still) { gsap.set(rc.querySelectorAll('.rc-bar, .rc-gap, .lg-spark i'), { clearProps: 'all' }); rc.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); }); return; }
    gsap.to(rc.querySelectorAll('.rc-bar, .lg-spark i'), { scaleY: 1, opacity: 1, duration: 1.4, stagger: .1, ease: 'power2.inOut', overwrite: true });
    gsap.to(rc.querySelectorAll('.rc-gap'), { autoAlpha: 1, y: 0, duration: .6, ease: 'power2.out', delay: 1.2, overwrite: true });
    playCounts(rc, .08);
  }

  /* The pipeline: wires are laid from the rows' real positions, then the sequence
     plays like the Agent's illustrations: data in, tasks light, the vote
     resolves one row at a time, the match lands in the dataset; hold; again. */
  function layoutWires(pl) {
    var svg = pl.querySelector('.pl-wires'); if (!svg) return;
    var box = pl.getBoundingClientRect(), W = box.width, H = box.height;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var r = function (el) { var b = el.getBoundingClientRect(); return { l: b.left - box.left, r: b.right - box.left, y: b.top - box.top + b.height / 2 }; };
    var src = [].map.call(pl.querySelectorAll('.pl-src'), r), tasks = [].map.call(pl.querySelectorAll('.pl-task'), r), votes = [].map.call(pl.querySelectorAll('.pl-vote'), r);
    var result = r(pl.querySelector('.pl-result')), ok = [].map.call(pl.querySelectorAll('.pl-vote'), function (v) { return v.dataset.status === 'ok'; });
    if (!src.length || !tasks.length || getComputedStyle(svg).display === 'none') { svg.innerHTML = ''; return; }
    var paths = [], bus1 = (src[0].r + tasks[0].l) / 2, bus2 = (votes[0].r + result.l) / 2;
    src.forEach(function (s) { paths.push(['in', 'M' + s.r + ' ' + s.y + 'H' + bus1]); });
    paths.push(['in', 'M' + bus1 + ' ' + Math.min(src[0].y, tasks[0].y) + 'V' + Math.max(src[src.length - 1].y, tasks[tasks.length - 1].y)]);
    tasks.forEach(function (t, i) { paths.push(['in', 'M' + bus1 + ' ' + t.y + 'H' + t.l]); paths.push(['task', 'M' + t.r + ' ' + t.y + 'H' + votes[i].l]); });
    var okRows = votes.filter(function (v, i) { return ok[i]; });
    okRows.forEach(function (v) { paths.push(['out', 'M' + v.r + ' ' + v.y + 'H' + bus2]); });
    paths.push(['out', 'M' + bus2 + ' ' + Math.min(okRows[0].y, result.y) + 'V' + Math.max(okRows[okRows.length - 1].y, result.y)]);
    paths.push(['out', 'M' + bus2 + ' ' + result.y + 'H' + result.l]);
    svg.innerHTML = paths.map(function (p) { return '<path data-phase="' + p[0] + '" d="' + p[1] + '"/>'; }).join('');
    svg.querySelectorAll('path').forEach(function (p) { var len = p.getTotalLength(); p.style.strokeDasharray = len; p.dataset.len = len; });
  }
  var pipelines = [];
  function mountPipeline(pl) {
    layoutWires(pl);
    var wires = function (phase) { return pl.querySelectorAll('path[data-phase="' + phase + '"]'); };
    var tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0 });
    var dash = function (sel, from, to, dur, stagger, at) { tl.fromTo(sel, { strokeDashoffset: function (i, el) { return from ? el.dataset.len : 0; } }, { strokeDashoffset: function (i, el) { return to ? el.dataset.len : 0; }, duration: dur, stagger: stagger, ease: 'none' }, at); };
    tl.set(pl.querySelectorAll('.pl-task, .pl-vote, .pl-result'), { opacity: .3 }, 0)
      .set(pl.querySelectorAll('.pl-src'), { opacity: .3 }, 0)
      .set(pl.querySelectorAll('.pl-dot, .pl-status'), { scale: 0 }, 0)
      .set(pl.querySelectorAll('.pl-result > *'), { opacity: 0, y: 6 }, 0)
      .to(pl.querySelectorAll('.pl-src'), { opacity: 1, duration: .5, stagger: .15 }, .2);
    dash(wires('in'), true, false, .5, .05, .5);
    tl.to(pl.querySelectorAll('.pl-task'), { opacity: 1, duration: .45, stagger: .12 }, 1)
      .to(pl.querySelectorAll('.pl-dot'), { scale: 1, duration: .4, stagger: .12, ease: 'back.out(2)' }, 1.15);
    dash(wires('task'), true, false, .35, .12, 1.4);
    tl.to(pl.querySelectorAll('.pl-vote'), { opacity: 1, duration: .45, stagger: .14 }, 1.7)
      .to(pl.querySelectorAll('.pl-status'), { scale: 1, duration: .45, stagger: .14, ease: 'back.out(2.2)' }, 1.85);
    dash(wires('out'), true, false, .5, .06, 2.9);
    tl.to(pl.querySelector('.pl-result'), { opacity: 1, duration: .4 }, 3.2)
      .to(pl.querySelectorAll('.pl-result > *'), { opacity: 1, y: 0, duration: .6, stagger: .12, ease: 'power2.out' }, 3.3)
      .addLabel('settled', 4.4)
      .to({}, { duration: 3.6 })
      .to(pl.querySelectorAll('.pl-row, .pl-result, .pl-result > *, .pl-dot, .pl-status, path'), { opacity: 0, duration: .5 }, 8)
      .set(pl.querySelectorAll('.pl-row, .pl-result, .pl-result > *, .pl-dot, .pl-status, path'), { clearProps: 'opacity' }, 8.6);
    var entry = { pl: pl, tl: tl, visible: false };
    pipelines.push(entry);
    var sync = function () { tl.paused(still || document.hidden || !entry.visible); if (still) tl.progress(tl.labels.settled / tl.duration()).pause(); };
    ST.create({ trigger: pl, start: 'top bottom', end: 'bottom top', onToggle: function (self) { entry.visible = self.isActive; sync(); }, onRefresh: function (self) { entry.visible = self.isActive; sync(); } });
    new ResizeObserver(function () { layoutWires(pl); }).observe(pl);
    document.addEventListener('visibilitychange', sync);
    sync();
    return entry;
  }
  function initPipelines(scope) { (scope || document).querySelectorAll('.pl').forEach(mountPipeline); }

  /* The gradient shapes think: a tile next to a gap slides into it along the
     grid and turns circle or square as it lands, keeping the checkerboard; now
     and then the second gap answers. The gradient drifts slowly underneath.
     Never more than two tiles moving, a pause between beats, asleep offscreen. */
  function initShapes() {
    document.querySelectorAll('.gs svg').forEach(function (svg) {
      var u = 10, cols = +svg.dataset.gsCols;
      var gaps = svg.dataset.gsGaps.split(',').filter(Boolean).map(function (i) { return { c: i % cols, r: Math.floor(i / cols) }; });
      if (!gaps.length) return;
      var tiles = Array.prototype.map.call(svg.querySelectorAll('rect'), function (el) { return { el: el, c: +el.dataset.c, r: +el.dataset.r }; });
      var shift = cols * u * .12, recent = [], awake = false, next = null;
      var drift = gsap.to(svg.querySelector('linearGradient'), { attr: { x1: '+=' + shift, x2: '+=' + shift }, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true });
      function slide(gap, delay) {
        var near = tiles.filter(function (t) { return recent.indexOf(t) < 0 && Math.abs(t.c - gap.c) + Math.abs(t.r - gap.r) === 1; });
        if (!near.length) return;
        var t = near[Math.floor(Math.random() * near.length)], c = t.c, r = t.r;
        t.c = gap.c; t.r = gap.r; gap.c = c; gap.r = r;
        recent.push(t); if (recent.length > 2) recent.shift();
        gsap.to(t.el, { attr: { x: t.c * u + .9, y: t.r * u + .9, rx: (t.c + t.r) % 2 ? 4.1 : 1.7 }, duration: .95, delay: delay, ease: 'power3.inOut' });
      }
      function beat() {
        next = null; if (!awake) return;
        var g = Math.floor(Math.random() * gaps.length);
        slide(gaps[g], 0);
        if (gaps.length > 1 && Math.random() < .4) slide(gaps[(g + 1) % gaps.length], .3);
        next = gsap.delayedCall(1.2 + Math.random() * 1.2, beat);
      }
      ST.create({ trigger: svg, start: 'top bottom', end: 'bottom top', onToggle: function (self) {
        awake = self.isActive;
        if (awake) { drift.play(); if (!next) next = gsap.delayedCall(1, beat); } else drift.pause();
      } });
    });
  }

  /* Reveals, the Agent page's entrance. */
  function reveal(targets, stagger) {
    var els = gsap.utils.toArray(targets); if (!els.length) return;
    ST.batch(els, { start: 'top 94%', once: true, onEnter: function (batch) {
      gsap.fromTo(batch, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .85, stagger: stagger || .08, ease: 'power3.out', overwrite: true });
    } });
  }
  function initHero() { reveal('.p1-hero-copy, .bd-board, .px-hero, .fb-card2, .lt-head-copy, .gs, .lp-head-grid, .ps-head, .pf-head-grid'); }
  function initRows() { reveal('.lg-row'); }
  function initSections() { reveal('.section-head, .p1-usecase-layout, .rd, .bd-figure, .nb-figure, .article-grid, .p1-resource, .res-head, .band-head, .demo-panel, .lt-feature-link, .mx-cell, .ps-sheet, .ps-main > *, .pf-figure, .pf-read, .ev, .ev-contents, .lt-careers .p1-split > *, .lp-section'); }
  // Numbers and charts play once as they enter.
  function initFigures() {
    // Every number counts once as it scrolls in; chart labels count with their bars.
    document.querySelectorAll('[data-count]').forEach(function (el) {
      if (el.closest('.rc') || el.closest('[data-chart-host]')) return;
      var roll = el.matches(ROLL);
      if (roll) primeRoll(el);
      ST.create({ trigger: el, start: 'top 94%', once: true, onEnter: function () { if (roll) playRoll(el); else countUp(el); } });
    });
    document.querySelectorAll('.rc, .lg-spark').forEach(function (rc) {
      if (rc.closest('[data-surface]')) return;
      primeChart(rc);
      ST.create({ trigger: rc, start: 'top 88%', once: true, onEnter: function () { playChart(rc); } });
    });
  }
  /* The Agent's use-case accordion: select a post, its chart draws on the surface. */
  function initStack() {
    var buttons = gsap.utils.toArray('[data-post]'), host = document.querySelector('[data-chart-host]');
    if (!buttons.length || !host || !window.PaveResearchChart) return;
    function select(i) {
      buttons.forEach(function (b, j) {
        var item = b.closest('.snav-item'), body = document.getElementById(b.getAttribute('aria-controls')), on = i === j;
        item.classList.toggle('active', on); b.setAttribute('aria-expanded', String(on));
        body.inert = !on; if (on) body.removeAttribute('aria-hidden'); else body.setAttribute('aria-hidden', 'true');
      });
      pipelines.forEach(function (p) { if (host.contains(p.pl)) p.tl.kill(); });
      pipelines = pipelines.filter(function (p) { return !host.contains(p.pl); });
      host.innerHTML = PaveResearchChart(posts[i]);
      var rc = host.querySelector('.rc'); primeChart(rc); playChart(rc);
      initPipelines(host);
      ST.refresh();
    }
    buttons.forEach(function (b, i) {
      b.addEventListener('click', function () { if (b.getAttribute('aria-expanded') !== 'true') select(i); });
      b.addEventListener('keydown', function (e) {
        var next = i;
        if (e.key === 'ArrowDown') next = (i + 1) % buttons.length; else if (e.key === 'ArrowUp') next = (i + buttons.length - 1) % buttons.length;
        else if (e.key === 'Home') next = 0; else if (e.key === 'End') next = buttons.length - 1; else return;
        e.preventDefault(); buttons[next].focus();
      });
    });
    var rc = host.querySelector('.rc');
    if (rc) { primeChart(rc); ST.create({ trigger: host, start: 'top 85%', once: true, onEnter: function () { playChart(rc); } }); }
  }
  /* The homepage carousel's arrows: page by one card, hug the ends. */
  function initResources() {
    var grid = document.querySelector('[data-resources]'), prev = document.getElementById('resPrev'), next = document.getElementById('resNext');
    if (!grid || !prev || !next) return;
    function stepW() { var c = grid.firstElementChild; return c ? c.getBoundingClientRect().width + 28 : 388; }
    function sync() { prev.disabled = grid.scrollLeft <= 2; next.disabled = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2; }
    prev.addEventListener('click', function () { grid.scrollBy({ left: -stepW(), behavior: still ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { grid.scrollBy({ left: stepW(), behavior: still ? 'auto' : 'smooth' }); });
    grid.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); sync();
  }
  /* Ruled V2: "Show more research" brings in the next page of rows in place;
     their numbers roll as they arrive. */
  function initShowMore() {
    document.querySelectorAll('.lg-more').forEach(function (btn) {
      var list = btn.previousElementSibling, page = +btn.dataset.page || 8;
      btn.addEventListener('click', function () {
        var hidden = Array.prototype.slice.call(list.querySelectorAll('.lg-row[data-more][hidden]')), next = hidden.slice(0, page);
        next.forEach(function (row) { row.hidden = false; row.removeAttribute('data-more'); });
        if (still) gsap.set(next, { clearProps: 'transform,opacity,visibility' });
        else {
          gsap.fromTo(next, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6, stagger: .06, ease: 'power3.out', overwrite: true });
          next.forEach(function (row) {
            var fig = row.querySelector('[data-count]');
            if (!fig || !fig.querySelector('.roll')) return;
            gsap.set(fig.querySelectorAll('.roll-reel'), { yPercent: 0 });
            gsap.set(fig.querySelectorAll('.roll-c > span'), { yPercent: 130 });
            playRoll(fig);
          });
        }
        var left = hidden.length - next.length, n = btn.querySelector('[data-more-count]');
        if (left > 0) { if (n) n.textContent = left; } else btn.remove();
        ST.refresh();
      });
    });
  }
  /* "In this post" marks the section being read; B's rail line fills as you read. No pinning. */
  function initContents() {
    var links = gsap.utils.toArray('.toc a');
    links.forEach(function (link, i) {
      var target = document.querySelector(link.getAttribute('href'));
      var next = links[i + 1] && document.querySelector(links[i + 1].getAttribute('href'));
      if (target) ST.create({ trigger: target, start: 'top 45%', endTrigger: next || '.prose', end: next ? 'top 45%' : 'bottom 45%',
        onToggle: function (self) { if (self.isActive) { links.forEach(function (l) { l.removeAttribute('aria-current'); }); link.setAttribute('aria-current', 'true'); } } });
    });
    var line = document.querySelector('.toc-progress'), bar = document.querySelector('[data-progress]'), prose = document.querySelector('.prose');
    // The contents line fills down as you read; the figure-first post also
    // draws a reading line across the top of the window.
    if ((line || bar) && prose) ST.create({ trigger: prose, start: 'top 45%', end: 'bottom 45%', onUpdate: function (self) {
      if (line) line.style.height = (self.progress * 100) + '%';
      if (bar) bar.style.transform = 'scaleX(' + self.progress + ')';
    } });
  }
  function syncSmoothScroll() {
    if (!window.Lenis) return;
    lenis = new Lenis({ smoothWheel: true, syncTouch: false, anchors: { offset: -100 } });
    lenis.on('scroll', ST.update);
    gsap.ticker.add(function raf(time) { if (lenis) lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Mesh-painted shapes: a hidden purple mesh to sample and a canvas to paint
  // the tiles on, added after research-v3.js has drawn the SVG tiles.
  document.querySelectorAll('.gs--mesh').forEach(function (gs) {
    var src = document.createElement('canvas');
    src.setAttribute('data-mesh', gs.getAttribute('data-mesh-tone') || 'purple'); src.setAttribute('aria-hidden', 'true'); src.style.display = 'none';
    var paint = document.createElement('canvas');
    paint.className = 'gs-paint'; paint.setAttribute('aria-hidden', 'true');
    gs.appendChild(src); gs.appendChild(paint);
  });
  // The footer puzzle takes its texture from the closing mesh, as on the Agent
  // page. Research pages close on careers, not the demo panel, so the puzzle
  // gets its own hidden closing mesh to sample.
  (function () {
    var pz = document.getElementById('footerPz');
    if (!pz || document.querySelector('canvas[data-mesh="closing"]')) return;
    var src = document.createElement('canvas');
    // Inline display:none: the footer's own canvas rule would otherwise show it.
    src.setAttribute('data-mesh', 'closing'); src.setAttribute('aria-hidden', 'true'); src.style.display = 'none';
    pz.parentNode.appendChild(src);
  })();
  initMeshes(); initLivingLight(); initResources(); initStack();
  footer = initFooterPuzzle();
  initShowMore();
  document.fonts.ready.then(function () { initPipelines(); });
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, function (ctx) {
    still = !!ctx.conditions.reduce;
    initContents();
    if (footer) footer.setStill(still);
    if (still) {
      meshes.forEach(function (m) { m.renderer.draw(0, .5, .45); if (footer && m.pull) footer.render(m.canvas); if (m.paint) paintShapes(m); });
      lights.forEach(function (l) { l.draw(); }); document.querySelectorAll('.rc, .lg-spark').forEach(playChart); return;
    }
    syncSmoothScroll();
    initHero(); initRows(); initSections(); initFigures(); initShapes();
    wake();
    return function () { if (lenis) { lenis.destroy(); lenis = null; } };
  });

  /* Nav: the Agent page's tone switching from data-nav-tone, hide on scroll down. */
  var nav = document.querySelector('.nav'), previousY = scrollY;
  function toneAt() {
    var probe = 60, found = null;
    document.querySelectorAll('[data-nav-tone]').forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) found = el; });
    return found ? found.dataset.navTone : nav.classList.contains('nav-light') ? 'light' : 'dark';
  }
  function navTone() {
    if (!nav) return;
    var y = scrollY;
    nav.classList.toggle('nav-light', toneAt() === 'light');
    nav.classList.toggle('nav-solid', y > 24);
    if (Math.abs(y - previousY) > 4) nav.classList.toggle('nav-hidden', y > previousY && y > 240 && !nav.querySelector('.open, .dd-open') && !document.documentElement.classList.contains('nm-lock'));
    previousY = y;
  }
  addEventListener('scroll', navTone, { passive: true }); addEventListener('resize', navTone); navTone();
  document.fonts.ready.then(function () { ST.refresh(); });
  addEventListener('load', function () { ST.refresh(); }, { once: true });
})();
