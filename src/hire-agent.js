/* Hire Pave Agent: each visual settles in once as it reaches the screen, big
   numbers count up, the market feed ticks and the Data Lab graph lights its
   nodes in turn. Nothing pins or steers the scroll; reduced motion shows the
   finished state. */
(function () {
  'use strict';
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vis = document.querySelectorAll('.ha-vis');
  if (still || !('IntersectionObserver' in window)) { vis.forEach(function (v) { v.classList.add('is-revealed'); }); return; }

  function count(el) {
    var to = parseFloat(el.getAttribute('data-count')), dec = +(el.getAttribute('data-decimals') || 0);
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var t0 = performance.now();
    (function step(t) {
      var k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (to * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  // The feed: one cell at a time moves by a thousand or two and flashes green.
  function feed(panel) {
    var cells = panel.querySelectorAll('[data-tick]');
    setInterval(function () {
      var c = cells[Math.floor(Math.random() * cells.length)], v = +c.getAttribute('data-tick') + 1 + Math.floor(Math.random() * 2);
      c.setAttribute('data-tick', v); c.textContent = '$' + v + 'K';
      c.classList.add('is-up'); setTimeout(function () { c.classList.remove('is-up'); }, 900);
    }, 1800);
  }
  function graph(g) {
    var nodes = g.querySelectorAll('.ha-node:not(.is-hub)'), i = 0;
    setInterval(function () {
      nodes.forEach(function (n) { n.classList.remove('is-lit'); });
      nodes[i++ % nodes.length].classList.add('is-lit');
    }, 1100);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var v = en.target; io.unobserve(v); v.classList.add('is-revealed');
      v.querySelectorAll('[data-count]').forEach(count);
      v.querySelectorAll('[data-feed]').forEach(feed);
      v.querySelectorAll('[data-graph]').forEach(graph);
    });
  }, { threshold: .3 });
  vis.forEach(function (v) { io.observe(v); });
})();
