/* Pave navigation V2 (Teresa's "Pave Navigation Refresh", the future state
   Matt approved). Product, AI Technology, Customers, Resources, Pricing.
   Many of these pages don't exist yet: they link to "#" until they do. Same
   contract as nav-v1.js: include it where the
   nav belongs, before nav.js (menus, mobile sheet, Escape); mark the section
   with data-current. Classes are the existing nav's; the V2 layout is
   nav-v2.css. The short descriptions are Kinetic's placeholder copy. */
(function () {
  var script = document.currentScript;
  var current = script && script.getAttribute('data-current');
  var tone = (script && script.getAttribute('data-tone')) || 'light';
  var pave = 'https://www.pave.com';
  var soon = '#';
  var chevron = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var arrow = '<span class="nvb-arrow" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></span>';
  function top(id, label) {
    return '<a class="nav-link" href="#" data-dd="' + id + '" aria-haspopup="true" aria-expanded="false"' +
      (current === id ? ' aria-current="true"' : '') + '>' + label + chevron + '</a>';
  }
  function plain(id, label, href) {
    return '<a class="nav-link" href="' + href + '"' + (current === id ? ' aria-current="page"' : '') + '>' + label + '</a>';
  }
  function mini(label, href, sub) { return '<a class="nc-mini" href="' + href + '">' + label + (sub ? '<em>' + sub + '</em>' : '') + '</a>'; }
  function item(label, href, sub, here) { return '<a class="nc-item" href="' + href + '"' + (here ? ' aria-current="page"' : '') + '><strong>' + label + '</strong>' + (sub ? '<span>' + sub + '</span>' : '') + '</a>'; }
  var onResearch = current === 'ai' && /research/.test(location.pathname);

  /* Product menu. Four ways to lead with Pave Agent, chosen by data-product on
     the script tag or ?product= on the page (simple, tiles, bento, panel);
     without either, the October 14 row. In every one, Hire Pave Agent is an
     action inside Pave Agent, not a second item beside it. */
  var product = (script && script.getAttribute('data-product')) || new URLSearchParams(location.search).get('product') || '';
  var agentHref = 'agent-phase-1.html';
  var hireHref = soon;
  var up = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
  var mark = '<span class="nva-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
  function ico(path) { return '<span class="nvg-ico" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg></span>'; }
  var ICON = {
    integrations: '<path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4"/><rect x="7" y="7" width="10" height="10" rx="2.5"/>',
    controls: '<path d="M4 6h16M4 12h10M4 18h6"/><circle cx="18" cy="16" r="3"/><path d="M20.2 18.2L22 20"/>',
    security: '<path d="M12 3l7.5 3v5.6c0 4.4-3 8.1-7.5 9.4-4.5-1.3-7.5-5-7.5-9.4V6z"/><path d="M9 12.2l2.1 2.1 4-4.2"/>',
    pricing: '<path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9z"/><circle cx="8" cy="8" r="1.5"/>',
    planning: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    team: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19.5c.4-3 2.7-5 5.5-5s5.1 2 5.5 5"/><circle cx="17" cy="9.5" r="2.3"/><path d="M15.8 14.6c2.4.2 4.3 2 4.7 4.9"/>',
    rewards: '<path d="M12 3.5 3.5 8 12 12.5 20.5 8z"/><path d="M3.5 12.5 12 17l8.5-4.5"/><path d="M3.5 16.5 12 21l8.5-4.5"/>',
    offer: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h3.5"/>',
    data: '<path d="M5 20v-8M11 20V5M17 20v-5"/><path d="M3 20h18"/>',
    method: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6"/><path d="M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6"/>'
  };
  var MARKET = [['Market Data', pave + '/products/market-data-pro', 'Real-time benchmarks, with Lite free to start'], ['Methodology', pave + '/products/market-data-methodology', 'How the dataset is built and validated']];
  var TOOLS = [['Market Pricing', pave + '/products/market-pricing', 'pricing', 'Price every role against the market'],
    ['Compensation Planning', pave + '/products/compensation-planning', 'planning', 'Run merit, bonus and equity cycles'],
    ['Team View', pave + '/products/team-view', 'team', 'See pay across your teams'],
    ['Total Rewards', pave + '/products/total-rewards', 'rewards', 'Show employees their full package'],
    ['Visual Offer Letter', pave + '/products/visual-offer-letter', 'offer', 'Send offers candidates understand']];
  var PLATFORM = [['Integrations', pave + '/products/integrations', 'HRIS, payroll and data connections', 'integrations'], ['Enterprise Controls and Observability', soon, 'Permissions, audit trails and oversight', 'controls'], ['Security', pave + '/company/security-and-privacy', 'SOC 2, encryption and the Pave Trust Center', 'security']];
  // The homepage menu's product visuals (index.html), reused as they are.
  var MICRO = {
    // The Agent page's hero in miniature: the prompt types, the bars think,
    // then the answer rises with its green result (nav-v2.css, nvxType/nvxBar).
    agent: '<span class="nvx nvx-ag" aria-hidden="true"><span class="nvx-q"><span class="nvx-type">Run 5 merit simulations</span></span><span class="nvx-bars"><i style="height:10px;--i:0"></i><i style="height:7px;--i:1"></i><i class="on" style="height:15px;--i:4"></i><i style="height:9px;--i:2"></i><i style="height:12px;--i:3"></i></span></span>',
    data: '<span class="nvx" aria-hidden="true">' +
      '<span class="nvx-row"><b>P1</b><span class="nvx-dots"><i style="background:#8b5cf6"></i><i></i><i></i><i></i><i></i></span><em>$98,852</em></span>' +
      '<span class="nvx-row"><b>P2</b><span class="nvx-dots"><i style="background:#235cf3"></i><i style="background:#235cf3"></i><i style="background:#235cf3"></i><i style="background:#235cf3"></i><i></i></span><em>$126,586</em></span>' +
      '<span class="nvx-row"><b>P3</b><span class="nvx-dots"><i style="background:#132c6b"></i><i style="background:#132c6b"></i><i style="background:#132c6b"></i><i style="background:#132c6b"></i><i style="background:#132c6b"></i></span><em>$165,500</em></span></span>',
    tools: '<span class="nvx nvx-wf" aria-hidden="true"><span class="nvx-donut"><b>$452k</b></span><span class="nvx-col">' +
      '<span class="nvx-legend"><i style="background:#235cf3"></i>Salary<em>$248k</em></span>' +
      '<span class="nvx-legend"><i style="background:#4bc36b"></i>Options<em>$76k</em></span>' +
      '<span class="nvx-legend"><i style="background:#a78bfa"></i>Benefits<em>$67k</em></span></span></span>'
  };
  var USES = ['Price new job families', 'Investigate compensation competitiveness', 'Analyze merit cycles'];
  function minis(list) { return list.map(function (m) { return mini(m[0], m[1], m[2]); }).join(''); }
  function toolMinis() { return TOOLS.map(function (m) { return mini(m[0], m[1]); }).join(''); }
  function globalRow() {
    return '<div class="nvb-global">' + PLATFORM.map(function (p) {
      return '<a class="nvg" href="' + p[1] + '">' + ico(ICON[p[3]]) + '<span><strong>' + p[0] + '</strong><em>' + p[2] + '</em></span></a>';
    }).join('') + '</div>';
  }
  function families() {
    return '<div class="nvb"><p class="nvb-h">Market Data</p>' + minis(MARKET) + '</div>' +
      '<div class="nvb"><p class="nvb-h">Compensation Management Tools</p>' + toolMinis() + '</div>';
  }
  function card(kind, inner) {
    return '<div class="nav-card nav-card--product pm-' + kind + '" data-card="product" role="menu" aria-label="Product">' + inner + '</div>';
  }
  function productCard(v) {
    // Simple: Pave Agent is the menu's first line, a quiet text action beside it.
    if (v === 'simple') return card('simple',
      '<div class="pms-agent">' +
        '<a class="pms-main" href="' + agentHref + '">' + mark + '<span><strong>Pave Agent</strong><em>Your AI compensation analyst</em></span></a>' +
        '<a class="pms-cta" href="' + hireHref + '">Hire Pave Agent ' + up + '</a>' +
      '</div>' + families() + globalRow());
    // Tiles: the homepage's menu. Every family leads with a tile, so the agent
    // is one of three rather than a lone banner; its links sit under it.
    if (v === 'tiles') return card('tiles',
      '<div class="nvb">' +
        '<a class="nvb-tile nvb-tile--agent" href="' + agentHref + '">' + MICRO.agent + '<span class="nvb-tile-copy">Pave Agent<em>Your AI compensation analyst</em></span>' + arrow + '</a>' +
        mini('Hire Pave Agent', hireHref, 'Put Pave Agent to work on your comp team') +
      '</div>' +
      '<div class="nvb">' +
        '<a class="nvb-tile" href="' + MARKET[0][1] + '">' + MICRO.data + '<span class="nvb-tile-copy">Market Data<em>Real-time benchmarks, with Lite free to start</em></span>' + arrow + '</a>' +
        mini(MARKET[1][0], MARKET[1][1], MARKET[1][2]) +
      '</div>' +
      '<div class="nvb">' +
        '<a class="nvb-tile" href="' + TOOLS[1][1] + '">' + MICRO.tools + '<span class="nvb-tile-copy">Compensation Management<em>Plan, price and share pay</em></span>' + arrow + '</a>' +
        toolMinis() +
      '</div>' + globalRow());
    // Bento: two thirds for Pave Agent's card with Market Data and Methodology
    // side by side beneath it; one third for the tools as a stacked list of
    // row cards, like a table in card form; the platform stays as plain links.
    if (v === 'bento') {
      var go = '<span class="pb-go" aria-hidden="true">' + up + '</span>';
      return card('bento',
        '<div class="pb-left">' +
          '<div class="pb-agent">' +
            '<div class="pb-agent-copy">' +
              '<a class="pb-agent-link" href="' + agentHref + '"><strong>Pave Agent</strong><em>Your AI compensation analyst</em></a>' +
              '<a class="pb-hire" href="' + hireHref + '">Hire Pave Agent ' + up + '</a>' +
            '</div>' +
            // The Agent page hero, played by mountAgentDemos() below
            '<div class="pba" aria-hidden="true"><span class="pba-q"><span class="pba-q-text"></span></span>' +
              '<div class="pba-stage"><span class="pba-think"><i class="pba-orb"></i>Pave Agent is thinking...</span>' +
              '<div class="pba-surface"><div class="pba-result"></div></div></div></div>' +
          '</div>' +
          // Market Data and Methodology carry more weight than the tool rows:
          // taller cards, larger names, each with a product visual.
          '<div class="pb-pair">' +
            '<a class="pb-tile" href="' + MARKET[0][1] + '"><span class="pb-tile-top">' + ico(ICON.data) + MICRO.data.replace('class="nvx"', 'class="nvx pb-nvx"') + '</span>' +
              '<span class="pb-copy"><strong>Market Data' + go + '</strong><em>' + MARKET[0][2] + '</em></span></a>' +
            '<a class="pb-tile" href="' + MARKET[1][1] + '"><span class="pb-tile-top">' + ico(ICON.method) + '<span class="pb-grid" aria-hidden="true">' + new Array(19).join('<i></i>') + '</span></span>' +
              '<span class="pb-copy"><strong>Methodology' + go + '</strong><em>' + MARKET[1][2] + '</em></span></a>' +
          '</div>' +
        '</div>' +
        '<div class="pb-right"><p class="pb-h">Compensation Management Tools</p>' +
          TOOLS.map(function (tool) { return '<a class="pb-row pb-row--tool" href="' + tool[1] + '">' + ico(ICON[tool[2]]) + '<span class="pb-copy"><strong>' + tool[0] + '</strong><em>' + tool[3] + '</em></span>' + go + '</a>'; }).join('') +
        '</div>' + globalRow());
    }
    // Agent panel: Pave Agent as a place to start work, with the Agent page's
    // own use cases as ways in and hiring as the panel's one button.
    if (v === 'panel') return card('panel',
      '<div class="pp-agent">' +
        '<a class="pp-head" href="' + agentHref + '">' + mark + '<span><strong>Pave Agent <b class="nva-new">New</b></strong><em>Your AI compensation analyst</em></span></a>' +
        '<p class="pp-label">Ask Pave Agent to</p>' +
        USES.map(function (u) { return '<a class="pp-use" href="' + agentHref + '#usecases-title"><span>' + u + '</span>' + up + '</a>'; }).join('') +
        '<a class="pp-cta" href="' + hireHref + '">Hire Pave Agent</a>' +
      '</div>' + families() + globalRow());
    // The October 14 row (Pave Agent and Hire Pave Agent side by side).
    return card('v2',
      '<div class="nva-row">' +
        '<a class="nva" href="' + agentHref + '">' + mark + '<span class="nva-copy"><strong>Pave Agent <b class="nva-new">New</b></strong><em>Your AI compensation analyst</em></span><span class="nva-arrow" aria-hidden="true">' + up + '</span></a>' +
        '<a class="nva nva--hire" href="' + hireHref + '"><span class="nva-copy"><strong>Hire Pave Agent</strong><em>Put Pave Agent to work on your comp team</em></span><span class="nva-arrow" aria-hidden="true">' + up + '</span></a>' +
      '</div>' + families() + globalRow());
  }

  var html =
  '<nav class="nav nav-v2 nav-' + tone + '" aria-label="Main navigation">' +
    '<a class="logo" href="index.html" aria-label="Pave home">' +
      '<span class="pv-mark" aria-hidden="true"><i class="pv-s pv-tl"></i><i class="pv-s pv-tr"></i><i class="pv-s pv-bl"></i><i class="pv-s pv-br"></i></span>' +
      '<svg class="pv-word" width="56" height="20" viewBox="48.85 9.28 68.9 24.62" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="currentColor"><path d="M101.013 18.0521C101.013 16.297 101.357 14.7641 102.046 13.4533C102.757 12.1202 103.734 11.0983 104.978 10.3873C106.245 9.65418 107.689 9.2876 109.311 9.2876C110.955 9.2876 112.399 9.62085 113.643 10.2874C114.909 10.9539 115.898 11.8981 116.609 13.12C117.342 14.3419 117.72 15.7749 117.742 17.419C117.742 17.8633 117.709 18.3187 117.642 18.7853H104.778V18.9853C104.867 20.4738 105.334 21.6513 106.178 22.5177C107.022 23.3842 108.144 23.8174 109.544 23.8174C110.655 23.8174 111.588 23.5619 112.343 23.0509C113.099 22.5177 113.599 21.7735 113.843 20.8181H117.442C117.131 22.5511 116.287 23.9729 114.909 25.0838C113.554 26.1946 111.855 26.75 109.811 26.75C108.033 26.75 106.478 26.3946 105.145 25.6836C103.834 24.9505 102.812 23.9285 102.079 22.6177C101.368 21.3069 101.013 19.7851 101.013 18.0521ZM114.076 16.1526C113.921 14.9085 113.421 13.942 112.577 13.2533C111.755 12.5424 110.71 12.1869 109.444 12.1869C108.266 12.1869 107.245 12.5535 106.378 13.2866C105.534 13.9976 105.045 14.9529 104.912 16.1526H114.076Z"/><path d="M83.8125 9.48755H87.6782L92.3771 22.6844L97.0093 9.48755H100.808L94.5099 26.5501H90.111L83.8125 9.48755Z"/><path d="M75.9287 9.2876C78.2171 9.2876 79.9833 9.8208 81.2275 10.8872C82.4716 11.9536 83.0937 13.4755 83.0937 15.4528V26.6907H79.9594L79.6612 24.1173C79.0169 24.9616 78.2504 25.617 77.3617 26.0835C76.4953 26.5279 75.4289 26.75 74.1625 26.75C72.2741 26.75 70.7633 26.3057 69.6303 25.417C68.4972 24.5284 67.9307 23.3064 67.9307 21.7513C67.9307 19.9961 68.5527 18.652 69.7969 17.7189C71.0632 16.7636 72.885 16.2859 75.2622 16.2859H79.5279V15.2528C79.5279 14.2975 79.1946 13.5532 78.5281 13.02C77.8616 12.4646 76.9396 12.1869 75.7621 12.1869C74.7179 12.1869 73.8515 12.4091 73.1627 12.8534C72.4962 13.2977 72.0963 13.9087 71.963 14.6863H68.4305C68.6083 12.9756 69.3637 11.6537 70.6967 10.7206C72.0297 9.76526 73.7737 9.2876 75.9287 9.2876ZM74.7623 23.9507C76.2509 23.9507 77.4062 23.5508 78.2282 22.751C79.0724 21.9512 79.5056 20.8848 79.5279 19.5518V18.9519H75.0623C73.9514 18.9519 73.0961 19.1741 72.4962 19.6184C71.8964 20.0406 71.5964 20.6737 71.5964 21.518C71.5964 22.2511 71.8742 22.8399 72.4296 23.2842C73.0072 23.7286 73.7848 23.9507 74.7623 23.9507Z"/><path d="M57.9817 9.2876C59.5369 9.2876 60.9254 9.64307 62.1474 10.354C63.3693 11.0427 64.3246 12.0536 65.0133 13.3866C65.7021 14.6974 66.0464 16.2415 66.0464 18.0188C66.0464 19.7517 65.7021 21.2847 65.0133 22.6177C64.3246 23.9285 63.3693 24.9505 62.1474 25.6836C60.9254 26.3946 59.5369 26.75 57.9817 26.75C56.7154 26.75 55.6156 26.5168 54.6825 26.0502C53.7494 25.5837 53.0051 24.9505 52.4497 24.1507V33.8958H48.8506V9.48755H51.9832L52.4164 12.0203C53.7938 10.1985 55.6489 9.2876 57.9817 9.2876ZM57.3819 23.7174C58.8704 23.7174 60.0701 23.1842 60.981 22.1178C61.9141 21.0514 62.3807 19.6851 62.3807 18.0188C62.3807 16.3303 61.9141 14.964 60.981 13.9198C60.0701 12.8756 58.8704 12.3535 57.3819 12.3535C55.8933 12.3535 54.6936 12.8756 53.7827 13.9198C52.8718 14.9418 52.4164 16.2859 52.4164 17.9522C52.4164 19.6629 52.8718 21.0514 53.7827 22.1178C54.6936 23.1842 55.8933 23.7174 57.3819 23.7174Z"/></g></svg>' +
    '</a>' +
    '<div class="nav-links">' +
      top('product', 'Product') +
      top('ai', 'AI Technology') +
      top('customers', 'Customers') +
      top('resources', 'Resources') +
      plain('pricing', 'Pricing', 'pricing.html') +
    '</div>' +
    '<div class="nav-actions">' +
      '<a class="btn btn-secondary" href="https://app.pave.com/login">Sign in</a>' +
      '<a class="btn btn-primary" href="' + pave + '/request-demo">Book a demo</a>' +
      '<button class="nav-burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '</div>' +
    '<div class="nav-float">' +

    productCard(product) +

    /* 2. AI Technology: the credibility menu, not a second product menu.
       Three tiles, each drawn from what it is. */
    '<div class="nav-card nav-card--ai" data-card="ai" role="menu" aria-label="AI Technology">' +
      '<div class="nc-col">' +
        '<a class="nc-feature nc-feature--ai" href="' + soon + '">' +
          '<span class="nc-feature-tile" aria-hidden="true"><span class="nvx-stack"><i>Skills</i><i>Procedures</i><i>Permissions</i></span></span>' +
          '<strong>AI Engine</strong><span class="nc-feature-sub">The technology behind Pave Agent: skills, procedures and permissions.</span>' +
        '</a>' +
      '</div>' +
      '<div class="nc-col">' +
        '<a class="nc-feature nc-feature--ai" href="' + soon + '">' +
          '<span class="nc-feature-tile" aria-hidden="true"><span class="nvx-bench"><i style="height:22px"></i><i style="height:30px"></i><i style="height:18px"></i><i style="height:26px"></i><i class="on" style="height:48px"></i></span></span>' +
          '<strong>CompBench</strong><span class="nc-feature-sub">The industry-leading agentic benchmark for compensation.</span>' +
        '</a>' +
      '</div>' +
      '<div class="nc-col">' +
        '<a class="nc-feature nc-feature--ai" href="research-d.html"' + (onResearch ? ' aria-current="page"' : '') + '>' +
          '<span class="nc-feature-tile" aria-hidden="true"><span class="nvx-shapes"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></span>' +
          '<strong>AI Research</strong><span class="nc-feature-sub">Inside our AI research: evals, benchmarks and field notes.</span>' +
        '</a>' +
      '</div>' +
    '</div>' +

    /* 3. Customers: proof plus a buyer lens. Stories lead; by role and by
       company stage beside them. By industry waits for the tier two nav. */
    '<div class="nav-card nav-card--people" data-card="customers" role="menu" aria-label="Customers">' +
      '<div class="nvb nvb--flagship">' +
        '<a class="nvb-tile nvb-tile--stories" href="customers.html">' +
          '<span class="nvx-st" aria-hidden="true"><span class="nvx-chip is-on">Comp Leaders</span><span class="nvx-chip">Scaling</span><span class="nvx-chip">Enterprise</span></span>' +
          '<span class="nvb-tile-copy">Customer stories<em>Filter by role and company size</em></span>' + arrow +
        '</a>' +
        mini('Use cases', soon, 'Proven use cases with Pave Agent') +
      '</div>' +
      '<div class="nvb">' +
        '<p class="nvb-h">By role</p>' +
        mini('Comp Leaders', soon) + mini('Total Rewards', soon) + mini('People Ops', soon) + mini('CHRO and executives', soon) +
      '</div>' +
      '<div class="nvb">' +
        '<p class="nvb-h">By company stage</p>' +
        mini('Startup', soon) + mini('Scaling', soon) + mini('Enterprise', soon) +
      '</div>' +
    '</div>' +

    /* 4. Resources: Insights, Community, data and tools, the Data Lab tile.
       Research moved to AI Technology. */
    '<div class="nav-card nav-card--resources" data-card="resources" role="menu" aria-label="Resources">' +
      '<div class="nc-col">' +
        '<p class="nc-h">Insights</p>' +
        item('Blog', pave + '/insights/articles', 'Market insights and industry trends') +
        item('Guides &amp; Reports', pave + '/insights/guides-and-reports') +
      '</div>' +
      '<div class="nc-col">' +
        '<p class="nc-h">Community</p>' +
        item('Pave community', soon, 'Comp leaders learning from each other') +
        item('Events &amp; Webinars', pave + '/insights/events-and-webinars') +
      '</div>' +
      '<div class="nc-col">' +
        '<p class="nc-h">Data and tools</p>' +
        item('Hot Jobs Index', pave + '/hot-jobs-index') +
        item('Calculator', 'calculator.html', 'Model a compensation decision') +
      '</div>' +
      '<div class="nc-col nc-col--feature">' +
        '<a class="nc-feature nc-feature--lab" href="' + pave + '/pavedatalab">' +
          '<span class="nc-feature-tile" aria-hidden="true"><span class="nc-lab-grid"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></span>' +
          '<strong>Join Pave Data Lab for free</strong>' +
          '<span class="nc-feature-sub">The AI-powered insights community for compensation professionals.</span>' +
          '<span class="nc-read">Join for free</span>' +
        '</a>' +
      '</div>' +
    '</div>' +

    '</div>' +
  '</nav>';

  if (script) script.insertAdjacentHTML('beforebegin', html);

  /* The Bento's Pave Agent card plays the Agent page hero with the page's own
     parts: a question types into the blue bubble, "Pave Agent is thinking...",
     then the page's result chart (agent-result.js, PaveAgentResult) counts and
     draws. It moves through the four use cases the Agent page pairs with
     results; the questions come from that page's hero and use-case copy.
     Runs only while its menu is open (desktop card or phone sheet section);
     still, on the first answer, under reduced motion. Pages that show the
     Bento load agent-result.js and agent-result.css. */
  var QUESTIONS = ['How would you price a new mid-level engineering role?', 'Can we compete for engineers in the Bay Area?',
    'What merit increases should each team get?', 'What offer should we make this candidate?'];
  var T = { typeFrom: 150, typeTo: 1250, think: 1350, result: 2550, reveal: 1750, fade: 6300, cycle: 6900 };
  function mountAgentDemos() {
    var R = window.PaveAgentResult, nav = document.querySelector('.nav');
    var demos = Array.prototype.map.call(document.querySelectorAll('.pba'), function (el) {
      return { el: el, q: el.querySelector('.pba-q'), text: el.querySelector('.pba-q-text'), think: el.querySelector('.pba-think'),
        surface: el.querySelector('.pba-surface'), chart: R ? R.create(el.querySelector('.pba-result'), R.usecases[0]) : null, index: 0, start: 0, live: false };
    });
    if (!demos.length || !R) return;
    function settle(d) { d.text.textContent = QUESTIONS[0]; d.think.style.opacity = 0; d.surface.style.opacity = 1; d.chart.render(1); }
    demos.forEach(settle);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    function isLive(el) {
      var card = el.closest('.nav-card');
      if (card) return card.classList.contains('active');
      var sec = el.closest('.nm-sec'), sheet = el.closest('.nav-mobile');
      return !!(sec && sec.classList.contains('open') && sheet && sheet.classList.contains('open'));
    }
    function paint(d, local) {
      var q = QUESTIONS[d.index], typed = Math.max(0, Math.min(1, (local - T.typeFrom) / (T.typeTo - T.typeFrom)));
      d.text.textContent = q.slice(0, Math.round(q.length * typed));
      d.q.classList.toggle('is-typing', local < T.typeTo + 250);
      d.q.style.opacity = Math.min(1, local / 150);
      d.think.style.opacity = local >= T.think && local < T.result ? Math.min(1, (local - T.think) / 200) : 0;
      var r = local < T.result ? 0 : Math.min(1, (local - T.result) / 320);
      d.surface.style.opacity = r;
      d.surface.style.transform = 'scale(' + (.94 + .06 * r) + ')';
      d.chart.render(local < T.result ? 0 : Math.min(1, (local - T.result) / T.reveal));
      d.el.style.opacity = local > T.fade ? Math.max(0, 1 - (local - T.fade) / (T.cycle - T.fade)) : 1;
    }
    var running = false;
    function tick(now) {
      var any = false;
      demos.forEach(function (d) {
        var live = isLive(d.el);
        if (live && !d.live) d.start = now;      // each opening starts from the first question
        if (!live && d.live) { d.index = 0; d.chart.setModel(R.usecases[0]); settle(d); d.el.style.opacity = 1; }
        d.live = live;
        if (!live) return;
        any = true;
        var elapsed = now - d.start, i = Math.floor(elapsed / T.cycle) % QUESTIONS.length;
        if (i !== d.index) { d.index = i; d.chart.setModel(R.usecases[i]); }
        paint(d, elapsed % T.cycle);
      });
      running = any;
      if (any) requestAnimationFrame(tick);
    }
    function wake() { if (!running) { running = true; requestAnimationFrame(tick); } }
    if (nav) new MutationObserver(wake).observe(nav, { attributes: true, attributeFilter: ['class'], subtree: true });
    wake();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAgentDemos);
  else mountAgentDemos();
})();
