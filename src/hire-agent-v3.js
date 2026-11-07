/* Hire Pave Agent V3: the logo wall keeps changing (ACG). Every so often one
   tile, picked at random, slides its logo out and the next from the pool in,
   so the wall cycles through big tech, everyday brands and AI leaders. Only
   logos already on pave.com. Still under reduced motion and offscreen. */
(function () {
  'use strict';
  // The hero blend's band: laid over the tracks, from the first source to the
  // recommended row, at the recommended range.
  var blend = document.querySelector('.ha-blend'), band = blend && blend.querySelector('.ha-blend-band');
  function placeBand() {
    if (!band) return;
    var box = blend.getBoundingClientRect(), tracks = blend.querySelectorAll('.ha-src i, .ha-rec i');
    var first = tracks[0].getBoundingClientRect(), lastT = tracks[tracks.length - 1].getBoundingClientRect();
    var lo = parseFloat(band.style.getPropertyValue('--lo')) / 100, hi = parseFloat(band.style.getPropertyValue('--hi')) / 100;
    if (!first.width) return;
    band.style.left = (first.left - box.left + first.width * lo - 4) + 'px';
    band.style.width = (first.width * (hi - lo) + 8) + 'px';
    band.style.top = (first.top - box.top - 8) + 'px';
    band.style.height = (lastT.bottom - first.top + 16) + 'px';
  }
  if (band) { new ResizeObserver(placeBand).observe(blend); placeBand(); }
  var wall = document.querySelector('[data-logo-cycle]');
  if (!wall || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var POOL = [
    ['logos-homepage/fal.svg', 'fal'], ['logos-colored/wm-doordash.svg', 'DoorDash'], ['logos-homepage/together-ai.svg', 'Together AI'],
    ['logos-colored/waymo.svg', 'Waymo'], ['logos-homepage/gamma.svg', 'Gamma'], ['logos-colored/wm-cloudflare.svg', 'Cloudflare'],
    ['logos-colored/affirm.svg', 'Affirm'], ['logos-homepage/listen-labs.svg', 'Listen Labs'], ['logos-colored/wm-snowflake.svg', 'Snowflake'],
    ['logos-colored/fanatics.svg', 'Fanatics'], ['logos-colored/wm-okta.svg', 'Okta'], ['logos-colored/wm-atlassian.svg', 'Atlassian'],
    ['logos-colored/servicenow.svg', 'ServiceNow'], ['logos-colored/wm-expedia.svg', 'Expedia'], ['logos-colored/wm-square.svg', 'Square'],
    ['logos-colored/anduril.svg', 'Anduril'], ['logos-colored/wm-nubank.svg', 'Nubank'], ['logos-colored/synopsys.svg', 'Synopsys']
  ];
  var tiles = [].slice.call(wall.querySelectorAll('li'));
  var waiting = POOL.slice(), last = -1, visible = false, busy = false;
  new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(wall);
  setInterval(function () {
    if (!visible || busy || document.hidden) return;
    var i; do { i = Math.floor(Math.random() * tiles.length); } while (i === last);
    last = i; busy = true;
    var tile = tiles[i], old = tile.querySelector('img:not(.is-out)'), next = waiting.shift();
    waiting.push([old.getAttribute('src'), old.getAttribute('alt')]);
    var img = new Image(); img.src = next[0]; img.alt = next[1]; img.className = 'is-in';
    img.onload = function () {
      tile.appendChild(img);
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        old.classList.add('is-out'); img.classList.remove('is-in');
        setTimeout(function () { old.remove(); busy = false; }, 650);
      }); });
    };
    img.onerror = function () { busy = false; };
  }, 1300);
})();
