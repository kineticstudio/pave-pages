// Shared nav dropdown wiring for index.html + light.html.
// One .nav-float shell morphs (width/height tween) between the .nav-card
// menu layers, Stripe-style: the outgoing menu fades toward the direction
// of travel while the incoming one slides in from the other side.
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  var float = nav.querySelector('.nav-float');
  if (!float) return;

  var dds = [];
  Array.prototype.forEach.call(nav.querySelectorAll('[data-dd]'), function (trig) {
    var card = nav.querySelector('.nav-card[data-card="' + trig.getAttribute('data-dd') + '"]');
    if (card) dds.push({ trig: trig, card: card });
  });
  if (!dds.length) return;

  var current = -1;
  var closeTimer = null;
  var HOVER = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  var MOBILE = window.matchMedia ? window.matchMedia('(max-width: 700px)') : { matches: false };

  function sizeTo(card) {
    if (MOBILE.matches) {
      float.style.width = '';
      float.style.height = '';
      return;
    }
    float.style.width = card.offsetWidth + 'px';
    float.style.height = card.offsetHeight + 'px';
  }

  function open(i) {
    if (current === i) return;
    var first = current === -1;
    current = i;
    dds.forEach(function (o, j) {
      var on = j === i;
      o.card.classList.toggle('active', on);
      o.trig.classList.toggle('dd-open', on);
      o.trig.setAttribute('aria-expanded', on ? 'true' : 'false');
      // Park inactive menus toward their side of the active one, so the next
      // switch always slides in from the direction of travel
      if (!MOBILE.matches) {
        o.card.style.transform = on ? 'translateX(0)' : 'translateX(' + (j < i ? -28 : 28) + 'px)';
      }
    });
    if (first) {
      // First open: snap the shell to size invisibly, then fade/rise in
      float.classList.add('no-anim');
      sizeTo(dds[i].card);
      void float.offsetWidth;   // flush styles so .open transitions from here
      float.classList.remove('no-anim');
      float.classList.add('open');
    } else {
      sizeTo(dds[i].card);      // shell tweens to the new menu's size
    }
  }

  function closeAll() {
    current = -1;
    float.classList.remove('open');
    dds.forEach(function (o) {
      o.card.classList.remove('active');
      o.trig.classList.remove('dd-open');
      o.trig.setAttribute('aria-expanded', 'false');
    });
  }

  dds.forEach(function (d, i) {
    d.trig.addEventListener('click', function (e) {
      e.preventDefault();
      // Touch/keyboard: toggle. Hover devices opened on enter already —
      // a click there shouldn't flicker the menu closed.
      if (!HOVER && current === i) closeAll();
      else open(i);
    });
    if (HOVER) {
      [d.trig, d.card].forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          clearTimeout(closeTimer);
          open(i);
        });
        el.addEventListener('mouseleave', function () {
          clearTimeout(closeTimer);
          closeTimer = setTimeout(closeAll, 180);
        });
      });
    }
    d.card.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeAll();
    });
  });

  // The float itself (padding/edges between menus) also holds the menu open
  if (HOVER) {
    float.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    float.addEventListener('mouseleave', function () {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeAll, 180);
    });
  }

  window.addEventListener('resize', function () {
    if (current > -1) sizeTo(dds[current].card);
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) closeAll();
  });

  // ── Mobile menu: hamburger + accordion sheet built from the SAME cards ──
  var burger = nav.querySelector('.nav-burger');
  var menu = null;
  if (burger) {
    menu = document.createElement('div');
    menu.className = 'nav-mobile';
    dds.forEach(function (d) {
      var sec = document.createElement('div');
      sec.className = 'nm-sec';
      var head = document.createElement('button');
      head.className = 'nm-head';
      head.innerHTML = d.trig.textContent.trim() + '<span class="nm-plus">+</span>';
      head.addEventListener('click', function () { sec.classList.toggle('open'); });
      var body = document.createElement('div');
      body.className = 'nm-body';
      var clone = d.card.cloneNode(true);
      clone.className = 'nm-card';           // sheds .nav-card layer styling
      clone.removeAttribute('data-card');
      clone.removeAttribute('style');
      body.appendChild(clone);
      sec.appendChild(head);
      sec.appendChild(body);
      menu.appendChild(sec);
    });
    // Plain links (no dropdown) become flat rows — this now picks up the
    // right-hand utility links (Customers, Pricing) as well as any in
    // .nav-links, since both are hidden behind the hamburger at this width
    Array.prototype.forEach.call(nav.querySelectorAll('.nav-link:not([data-dd])'), function (a) {
      var link = a.cloneNode(true);
      link.className = 'nm-link';
      menu.appendChild(link);
    });
    var signIn = nav.querySelector('.nav-actions .btn-secondary');
    if (signIn) {
      var si = signIn.cloneNode(true);
      si.className = 'nm-link';
      menu.appendChild(si);
    }
    var demo = nav.querySelector('.nav-actions .btn-primary');
    var cta = document.createElement('a');
    cta.className = 'btn btn-primary nm-cta';
    cta.href = demo && demo.getAttribute('href') || '#';
    cta.textContent = 'Book a demo';
    menu.appendChild(cta);
    nav.appendChild(menu);

    function setMenu(open) {
      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.documentElement.classList.toggle('nm-lock', open);
    }
    burger.addEventListener('click', function () {
      setMenu(!menu.classList.contains('open'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && menu.classList.contains('open')) setMenu(false);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAll();
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.documentElement.classList.remove('nm-lock');
      }
    }
  });
})();
