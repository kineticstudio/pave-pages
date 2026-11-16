/* Customer story cards with video (Teresa, Nov 12; Hunter's pick, Nov 13).
   Renders pave.com/customers' story grid as it's live (Nov 13: the same
   fourteen stories, sizes and order) and gives every story that has a video
   the new card: its thumbnail and a play button, and on a desktop pointer a
   short muted preview while you hover.

   CMS (Case Studies), new fields:
     Video          YouTube link or ID; when set, the card is a video card
     Thumbnail      optional image; without it, YouTube's own thumbnail
     Preview start  seconds into the video where the hover preview begins
   The video IDs here are the ones already embedded in each story. */
(function () {
  'use strict';
  var CARDS = [
  {
    "span": "video",
    "company": "Databricks",
    "title": "How Databricks Built a Scalable Global Compensation Strategy With Pave",
    "href": "https://www.pave.com/case-studies/how-databricks-built-a-scalable-global-compensation-strategy-with-pave",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aadd4c6f66782d00937f631_databricks.png",
    "alt": "Stacked red geometric shapes forming a layered cube logo.",
    "video": "mR8yDK5NEdE"
  },
  {
    "span": "quarter",
    "company": "Cockroach Labs",
    "title": "How Cockroach Labs Gives Leaders the Peer Data They Actually Want",
    "href": "https://www.pave.com/case-studies/how-cockroach-labs-streamlined-processes-for-scale-while-saving-time-with-pave",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aadd80de73a0964be6172ab_cockroachlabs-logo-icon.svg",
    "alt": "Green abstract symmetrical geometric shape resembling an insect or robot."
  },
  {
    "span": "quarter",
    "company": "Authentic Brands Group",
    "title": "Turning a Fragmented Comp Stack into One Source of Truth",
    "href": "https://www.pave.com/case-studies/authentic-brands-group",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aadd74e40de9107bb58b32b_authenticbrand-logo-icon.svg",
    "alt": "White lowercase letter 'a' on a dark blue square background.",
    "video": "BilQYVnrHM4"
  },
  {
    "span": "quarter",
    "company": "Xero",
    "title": "How Xero Turned Months of Reviews into Minutes with Pave",
    "href": "https://www.pave.com/case-studies/xero",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aadd976009c6c11aa3e3c4b_Xero_software_logo.svg.webp",
    "alt": "Xero logo with white lowercase lettering on a blue circular background."
  },
  {
    "span": "quarter",
    "company": "SharkNinja",
    "title": "Bringing Control and Transparency to Comp Cycles for 4,000+ Employees",
    "href": "https://www.pave.com/case-studies/sharkninja-video",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aadd9cbc2ecfd63b5d4d889_shark-ninja.svg",
    "alt": "Bold white uppercase letters 'SN' on a black square background, with the letter N having a 3D shadow effect.",
    "video": "Ll36uYTQ_XY"
  },
  {
    "span": "quarter",
    "company": "Superhuman",
    "title": "Turning Equity Confusion into Compensation Confidence",
    "href": "https://www.pave.com/case-studies/superhuman",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aadda509e5f52a976c23841_superhuman-logo-icon.svg",
    "alt": "Simplified human figure icon with a round head and an inverted V-shaped body in dark color on a light purple background.",
    "video": "8lhQanWzrSI"
  },
  {
    "span": "quarter",
    "company": "Lambda",
    "title": "Ditching Spreadsheets to Build a More Credible Comp Program",
    "href": "https://www.pave.com/case-studies/lambda",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aaddad6e73a0964be61debd_lambda-logo-icon.svg",
    "alt": "White Greek letter lambda symbol inside a white square border on a black background.",
    "video": "zmnsEo8irAE"
  },
  {
    "span": "quarter",
    "company": "Dandy",
    "title": "How Dandy Stood Up a Compensation Cycle in Record Time With Pave",
    "href": "https://www.pave.com/case-studies/dandy",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aaddb29692ae7d15c1f5cd0_dandy-logo-icon.svg",
    "alt": "Lowercase white letter d centered on a dark green square background."
  },
  {
    "span": "quarter",
    "company": "Workato",
    "title": "On-time, Intuitive Merit Cycles with Market Pricing",
    "href": "https://www.pave.com/case-studies/how-workato-achieved-on-time-intuitive-merit-cycles-with-market-pricing",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/682b5897790f5e7de6dfb08b_Workato%20logo%20Horizontal%2C%20Regular.avif",
    "alt": "Workato company logo with a stylized turquoise 'W' symbol to the left of the word 'workato' in black lowercase letters."
  },
  {
    "span": "half",
    "company": "Instacart",
    "title": "How Instacart Builds Compensation Credibility with Real-Time Data from Pave",
    "href": "https://www.pave.com/case-studies/instacart",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aadde3d85e028c95de006c2_instacart-logo-icon2.png",
    "alt": "Simple stylized carrot icon with an orange body and two green leaves on top.",
    "video": "eoK4F2uf1z0"
  },
  {
    "span": "half",
    "company": "Lumanity",
    "title": "Taking Control of a Complex Global Compensation Program With Pave",
    "href": "https://www.pave.com/case-studies/lumanity",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aadddf55899284d27009bc4_Lumnanity_icon.webp",
    "alt": "Yellow square with a dark blue right triangle inside, oriented with the right angle at the top left corner."
  },
  {
    "span": "quarter",
    "company": "Upstart",
    "title": "Transforming an Equity Program With Pave Market Data",
    "href": "https://www.pave.com/case-studies/upstart",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aaddd155899284d27007a7f_upstart_logo-square.png",
    "alt": "Abstract geometric shape composed of overlapping rounded diamond forms in teal shades, creating a layered pattern."
  },
  {
    "span": "quarter",
    "company": "Faire",
    "title": "How Faire's Compensation Team Operates Quickly and Securely with Pave",
    "href": "https://www.pave.com/case-studies/faire",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aaddd6c4d3807983c9f3d97_faire-logo-icon.svg",
    "alt": "White capital letter F centered inside a solid black circle.",
    "video": "JoYi4dszsWY"
  },
  {
    "span": "half",
    "company": "Ancestry",
    "title": "Why Ancestry Uses Pave for End-to-End Compensation Management",
    "href": "https://www.pave.com/case-studies/ancestry",
    "logo": "https://cdn.prod.website-files.com/67cb497d91f1c12f57765ebb/6aaddda4def66e2e631aa358_ancestry-logo-icon.png",
    "alt": "White stylized three-leaf plant icon with a vertical stem on a green square background.",
    "video": "BR_JjbJ-c5c"
  }
];
  var PREVIEW = 10;        // seconds of preview, then back to the thumbnail
  var DELAY = 250;         // hover this long before the preview loads
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  var PLAY = '<span class="cs2-play" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4 2.5v11l9.5-5.5z" fill="currentColor"/></svg></span>';
  var ARROW = '<svg width="100%" viewBox="0 0 14 14" fill="none" aria-hidden="true" class="bcard-arrow2"><path d="M3.5 10.5L10.5 3.5M4.5 3.5h6v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  var embed = function (id, start, loop) {
    return 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3' +
      (loop ? '&loop=1&playlist=' + id : '&start=' + start);
  };
  function card(c) {
    var big = c.span === 'video', clip = !big && c.video;
    var media = big
      ? '<div class="cs2-embed"><iframe class="cs2-film" src="' + embed(c.video, 0, true) + '" title="" tabindex="-1" aria-hidden="true" allow="autoplay; encrypted-media"></iframe><div class="cs2-scrim" aria-hidden="true"></div></div>'
      : clip ? '<img class="cs2-poster" src="https://i.ytimg.com/vi/' + c.video + '/maxresdefault.jpg" alt="" loading="lazy"><div class="cs2-scrim" aria-hidden="true"></div>' : '';
    return '<div data-span="' + c.span + '" role="listitem" class="cs-card2' + (big ? ' cs-card2--video' : '') + (clip ? ' cs-card2--clip' : '') + '"' +
      (clip ? ' data-video="' + c.video + '" data-start="' + (c.start || 12) + '"' : '') + '>' + media +
      '<div class="cs2-top"><img src="' + esc(c.logo) + '" loading="lazy" alt="' + esc(c.alt) + '" class="cs-card2-img"><div class="text-weight-medium">' + esc(c.company) + '</div></div>' +
      '<div class="cs2-body"><div class="cs2-title' + (big ? ' is-white' : '') + '">' + esc(c.title) + '</div></div>' +
      (c.video ? PLAY : ARROW) +
      '<a href="' + esc(c.href) + '" class="cs-card-link" aria-label="' + esc(c.company + (c.video ? ' customer story, with video' : ' customer story')) + '"></a></div>';
  }
  var grid = document.querySelector('[data-grid="cases"]');
  grid.innerHTML = CARDS.map(card).join('');

  /* The hover preview: desktop pointers only, never under reduced motion. */
  var can = matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!can) return;
  grid.querySelectorAll('.cs-card2--clip').forEach(function (el) {
    var wait, stop, film;
    function off() {
      clearTimeout(wait); clearTimeout(stop);
      if (!film) return;
      var f = film; film = null;
      f.classList.remove('is-on');
      setTimeout(function () { f.remove(); }, 450);
    }
    el.addEventListener('mouseenter', function () {
      wait = setTimeout(function () {
        film = document.createElement('iframe');
        film.className = 'cs2-film'; film.tabIndex = -1; film.title = '';
        film.setAttribute('aria-hidden', 'true'); film.allow = 'autoplay; encrypted-media';
        film.src = embed(el.getAttribute('data-video'), el.getAttribute('data-start'));
        el.querySelector('.cs2-poster').after(film);
        // Fade in once YouTube has started, so its loading frame never shows.
        var f = film;
        film.addEventListener('load', function () { setTimeout(function () { if (film === f) f.classList.add('is-on'); }, 1600); });
        stop = setTimeout(off, 1600 + PREVIEW * 1000);
      }, DELAY);
    });
    el.addEventListener('mouseleave', off);
  });
})();
