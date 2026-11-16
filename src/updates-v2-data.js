/* Product updates, round two: every update as data, so the feed and the
   detail page read the same record. Each field maps to one CMS field (see
   the field list in updates-v2.css's header). Lorem ipsum until Pave's R&D
   sends real updates. media.type is "video" (an MP4 with a poster), "embed"
   (a YouTube, Vimeo or Wistia link) or "visual" (the coded product moment on
   the blue mesh); leave media out for a text-only update. */
(function () {
  'use strict';
  var body = [
    { p: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    { h: 'What’s new' },
    { ul: ['Duis aute irure dolor in reprehenderit in voluptate velit esse', 'Cillum dolore eu fugiat nulla pariatur, excepteur sint occaecat', 'Cupidatat non proident, sunt in culpa qui officia deserunt'] },
    { h: 'How it works' },
    { p: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' },
    { p: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' }
  ];
  var VIS = {
    chat: '<div class="up-ui up-ui--chat"><p class="up-q">Lorem ipsum dolor sit amet, consectetur adipiscing?</p><div class="up-a"><span class="up-agent"><i></i>Pave Agent</span><b>$145k to $175k</b><span class="up-lines"><i style="--w:92%"></i><i style="--w:78%"></i><i style="--w:64%"></i></span></div></div>',
    bands: '<div class="up-ui up-ui--bands"><p class="up-ui-title">Lorem ipsum · L4</p><div class="up-band"><span>P25</span><i style="--lo:12%;--hi:48%"></i></div><div class="up-band"><span>P50</span><i style="--lo:26%;--hi:66%"></i></div><div class="up-band"><span>P75</span><i style="--lo:40%;--hi:84%"></i></div><div class="up-band"><span>P90</span><i style="--lo:52%;--hi:94%"></i></div></div>',
    table: '<div class="up-ui up-ui--table"><p class="up-ui-title">Lorem ipsum cycle</p><div class="up-row"><span>Engineering</span><span class="up-pill">Lorem</span><i style="--w:78%"></i></div><div class="up-row"><span>Product</span><span class="up-pill is-blue">Ipsum</span><i style="--w:62%"></i></div><div class="up-row"><span>Sales</span><span class="up-pill">Dolor</span><i style="--w:84%"></i></div><div class="up-row"><span>Design</span><span class="up-pill is-blue">Amet</span><i style="--w:54%"></i></div></div>',
    rewards: '<div class="up-ui up-ui--rewards"><p class="up-ui-title">Lorem ipsum</p><b>$248,500</b><div class="up-stack"><i style="--w:56%"></i><i style="--w:28%"></i><i style="--w:16%"></i></div><div class="up-key"><span>Base</span><span>Equity</span><span>Bonus</span></div></div>',
    offer: '<div class="up-ui up-ui--offer"><span class="up-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><p class="up-ui-title">Lorem ipsum, welcome to Pave</p><b>$186,000</b><span class="up-lines"><i style="--w:88%"></i><i style="--w:70%"></i></span><span class="up-btn">Accept offer</span></div>',
    chat2: '<div class="up-ui up-ui--chat"><p class="up-q">Ut enim ad minim veniam, quis nostrud?</p><div class="up-a"><span class="up-agent"><i></i>Pave Agent</span><span class="up-lines"><i style="--w:96%"></i><i style="--w:88%"></i><i style="--w:72%"></i><i style="--w:40%"></i></span></div></div>'
  };
  window.PaveUpdates = {
    products: ['Pave Agent', 'Market Data Pro', 'Integrations', 'Compensation Planning', 'Total Rewards', 'Team View', 'Visual Offer Letter'],
    updates: [
      { id: 'lorem-ipsum-dolor-sit-amet', date: '2026-10-28', product: 'Pave Agent', title: 'Lorem ipsum dolor sit amet', summary: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', media: { type: 'video', src: '/src/media/updates-sample.mp4', poster: '/src/media/updates-sample.jpg', label: 'Watch: lorem ipsum dolor sit amet' } },
      { id: 'ut-enim-ad-minim-veniam', date: '2026-10-21', product: 'Market Data Pro', title: 'Ut enim ad minim veniam', summary: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', media: { type: 'visual', html: VIS.bands } },
      { id: 'duis-aute-irure-dolor', date: '2026-10-09', product: 'Integrations', title: 'Duis aute irure dolor', summary: 'In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
      { id: 'excepteur-sint-occaecat-cupidatat', date: '2026-09-24', product: 'Compensation Planning', title: 'Excepteur sint occaecat cupidatat', summary: 'Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', media: { type: 'visual', html: VIS.table } },
      { id: 'sed-ut-perspiciatis-unde-omnis', date: '2026-09-15', product: 'Pave Agent', title: 'Sed ut perspiciatis unde omnis', summary: 'Iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.', media: { type: 'visual', html: VIS.chat } },
      { id: 'nemo-enim-ipsam-voluptatem', date: '2026-09-03', product: 'Total Rewards', title: 'Nemo enim ipsam voluptatem', summary: 'Quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.', media: { type: 'visual', html: VIS.rewards } },
      { id: 'neque-porro-quisquam-est', date: '2026-08-27', product: 'Team View', title: 'Neque porro quisquam est', summary: 'Qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam.' },
      { id: 'quis-autem-vel-eum-iure', date: '2026-08-14', product: 'Visual Offer Letter', title: 'Quis autem vel eum iure', summary: 'Reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.', media: { type: 'visual', html: VIS.offer } },
      { id: 'at-vero-eos-et-accusamus', date: '2026-08-05', product: 'Market Data Pro', title: 'At vero eos et accusamus', summary: 'Et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.' },
      { id: 'nam-libero-tempore', date: '2026-07-22', product: 'Pave Agent', title: 'Nam libero tempore', summary: 'Cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime.', media: { type: 'visual', html: VIS.chat2 } }
    ].map(function (u) { u.body = body; return u; })
  };
})();
