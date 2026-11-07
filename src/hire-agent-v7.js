/* Hire Pave Agent V7: Teresa asked to lose the white band at the top. At the
   very top of the page the nav has no frost, so the gradient runs to the top
   edge; as soon as the page scrolls the frost comes back, so the hero's
   animation never runs under bare nav links. */
(function () {
  'use strict';
  var body = document.body, top = null;
  function check() {
    var at = (window.scrollY || window.pageYOffset) < 24;
    if (at === top) return;
    top = at;
    if (at) body.setAttribute('data-over-hero', ''); else body.removeAttribute('data-over-hero');
  }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();
