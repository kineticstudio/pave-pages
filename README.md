# Pave pages

Coded reference for the Webflow build of Pave's new navigation and research
pages, from Kinetic Studio. Kinetic keeps this repo current; the designs on
pave.kineticstudio.com are the source of truth.

## Where we're at

Updated October 20, 2026. Pave approved all of this on October 15 (Teresa,
in #ext-kinetic-pave): the Agent Panel navigation, and the research index and
post page as we iterated them. Pave is still deciding about moving off
Webflow, so these get built in Webflow now. They'd like to review next week.

| Page | Design | Webflow | What it is |
| --- | --- | --- | --- |
| Navigation | [Agent Panel](https://pave.kineticstudio.com/designs/pave/site-src/nav-v2.html?product=panel) | Built on the research pages; rest of the site after Pave approves | Replaces the site-wide navbar. `nav/index.html` |
| Research index | [Research Index Ruled V4](https://pave.kineticstudio.com/designs/pave/site-src/research-c4.html) | Built; October 20 changes to make | New static page, listing a new Research posts CMS collection. `research/index.html` |
| Research post | [Research Post Split Header V3](https://pave.kineticstudio.com/designs/pave/site-src/research-light-post-v3.html) | Built; October 20 changes to make | The collection's template page. `research/<slug>.html`, one per post |
| Research post, no number or image | [Text Only](https://pave.kineticstudio.com/designs/pave/site-src/research-light-post-v3.html?without=figure,image) | | The same template for a post with neither. `research/text-only.html` |
| Value calculator | [Four Questions V2](https://pave.kineticstudio.com/designs/pave/site-src/calculator-questions-v2.html) | Not started | Matt's value calculator, approved October 20 (Teresa and Tim). `calculator/index.html` |

The design links open each page on its own. On the review site the research
pages still show the older nav they were reviewed with; here they carry the
approved nav, as they will on pave.com.

How work moves:

- **Designs** on pave.kineticstudio.com are what we build to.
- **Changes** land here, one commit and one `CHANGELOG.md` entry each, with a
  note in #pave-toqir.

### Still to confirm (Hunter, with Pave)

- **Nav items with no page yet.** In the design these link to `#`: AI Engine
  and CompBench (AI Technology); Use cases, the four By role links and the
  three By company stage links (Customers); Pave community (Resources);
  Enterprise Controls and Observability and the Hire Pave Agent button
  (Product). Build them as designed; Hunter will confirm where they go, or
  whether they stay hidden, before the nav goes live.
- **The research page's address.** `/research` is free on pave.com, so the
  suggestion is `/research` with posts at `/research/<slug>`. The AI Research
  tile in the nav points there.

## Run it

```sh
npm run serve
```

Then open http://127.0.0.1:4322. Any static server works if it serves from
the repo root (for example `python3 -m http.server`), because the pages use
root paths like `/src/` and `/research/`.

**Fonts:** Pave's Aeonik Pro is licensed, so it's not in the repo. The
Webflow project already has it. To preview here, put copies in `src/fonts/`
named as the stylesheets expect: `AeonikProTRIAL-Regular.otf`,
`AeonikProTRIAL-Medium.otf` and `AeonikProTRIAL-Light.otf`. Without them the
pages fall back to system fonts.

## Pages

| Page | File | Design |
| --- | --- | --- |
| Navigation | `nav/index.html` | [Agent Panel](https://pave.kineticstudio.com/designs/pave/site-src/nav-v2.html?product=panel) |
| Research | `research/index.html` | [Ruled V4](https://pave.kineticstudio.com/designs/pave/site-src/research-c4.html) |
| AI-Powered Job Matching Works | `research/ai-powered-job-matching-works.html` | [Split Header V3](https://pave.kineticstudio.com/designs/pave/site-src/research-light-post-v3.html?post=ai-powered-job-matching-works) |
| Calculated Benchmarks | `research/calculated-benchmarks-toughest-compensation-challenges.html` | [Split Header V3](https://pave.kineticstudio.com/designs/pave/site-src/research-light-post-v3.html?post=calculated-benchmarks-toughest-compensation-challenges) |
| AI maturity roadmap | `research/ai-maturity-total-rewards-roadmap.html` | [Split Header V3](https://pave.kineticstudio.com/designs/pave/site-src/research-light-post-v3.html?post=ai-maturity-total-rewards-roadmap) |
| Equity benchmarks | `research/pave-transforms-equity-compensation-benchmarks-using-machine-learning.html` | [Split Header V3](https://pave.kineticstudio.com/designs/pave/site-src/research-light-post-v3.html?post=pave-transforms-equity-compensation-benchmarks-using-machine-learning) |
| No number or image | `research/text-only.html` | [Text Only](https://pave.kineticstudio.com/designs/pave/site-src/research-light-post-v3.html?without=figure,image) |
| Value calculator | `calculator/index.html` | [Four Questions V2](https://pave.kineticstudio.com/designs/pave/site-src/calculator-questions-v2.html) |

The four posts are Pave's existing articles, there so the template can be
seen with real content of different shapes: two have no date, one has a
coded diagram instead of a chart.

## How a page is put together

- **`nav/index.html`, `research/*.html`:** the page with its markup written
  in: the nav, the content and the footer. Read this for structure, classes
  and copy.
- **`src/nav.js`:** the menus. See "The navigation" below.
- **`src/research-v3-animations.js`:** everything that moves on the research
  pages. See "Motion" below.
- **`src/mesh.js`:** the WebGL gradient that fills the shapes on the index
  and the footer puzzle.
- **Styles,** as each page's `<head>` lists them:
  - `src/agent-chrome.css`: the site chrome (nav base, buttons), as on the
    Pave Agent page.
  - `src/nav-v2.css`: the new nav, including the Agent Panel (`.pm-panel`,
    `.pp-` classes).
  - `src/research-v3.css` and `src/research-v4.css`: the research pages.
  - `src/research-c2.css`: the index's own changes (Ruled V2, V3 and V4 share it).
  - `src/research-c4.css`: Pave's October 20 changes (Ruled V4 and Split
    Header V3): the light blue bands, the featured stat card, no Author column.
  - `src/research-light-post-v2.css`: the post's own change (the author
    details moving up when there's no number).
  - `src/agent-phase-1-footer.css`: the footer, as on the Pave Agent page.
- **For reading only** (the pages don't load them):
  - `src/research-posts.js`: the four posts' content. It maps onto the CMS
    fields below.
  - `src/research-v3.js`: the templates the research markup was written from.
  - `src/nav-v2.js`: the nav's items, descriptions and links as data.

`src/` mirrors the prototype's files, so names match the design links. Only
files these pages load are included, plus the three above.

## The value calculator

Pave approved Four Questions V2 on October 20 (Teresa, with Tim). It is Matt's
v21 value calculator (his formulas, his copy, his default of $38,182,739 at
4,500 employees) on the research pages' light style. Unlike the other pages
it stays live: the markup is written in as it first renders, and three files
run it.

- **`src/calculator-data.json`:** every number and every line of copy: the
  benchmarks and assumptions, each input's label, range, default and hint,
  the four questions, the CFO talk track, the risks, the disclaimer, the call
  to action and the sources. About twenty fixed numbers, from Pave's reports
  and Matt's assumptions; nothing comes from Pave's database.
- **`src/calculator-v21.js`:** the math, exactly Matt's (about 60 lines, no
  dependencies). `PaveCalculatorV21.create(data)` gives `calculate(state)` and
  `set(state, key, value)`.
- **`src/calculator-ui.js`:** fills the page from the data and keeps it live,
  through attributes in the markup:
  - `data-copy="path"` a line of copy (`{tokens}` are live values,
    `**bold**` is bold), `data-link="name"` a link from `links`
  - `data-input="key"` a field: label, number, hint with its source, slider
  - `data-out="key"` a live number (`data-format`, `data-animate` counts it)
  - `data-when="eligible|ineligible"` either side of the 200-employee line
  - `data-products`, `data-method`, `data-sources` lists from the data
  - `data-copy-button` copies the talk track
  - `data-sticky-total` the running total bar: it appears once the header's
    total scrolls away and leaves at `data-sticky-end` (the call to action)
- **Styles:** `src/calculator-v21.css` (Four Questions V2 is `.calc--q2`: the
  header aligned at the top, the sliders in Pave's purples).

**In Webflow,** the suggestion: build the layout and copy as native elements
so Pave edits the words in the Editor, keep the attributes above on the
elements that carry live values, and add the two scripts as custom code. The
numbers can live in a CMS item (Pave edits them in the Editor) passed to the
script as the same JSON shape, or in a JSON embed on the page. Below 200
employees Adherence and Understanding carry no value; Matt's rules for that,
and for resets when the headcount changes, are in `calculator-v21.js`.

## The navigation

Top level: Product, AI Technology, Customers and Resources open menus;
Pricing is a link; then Sign in and Book a demo.

- **Product** (the Agent Panel, `.nav-card.pm-panel`):
  - **The Pave Agent panel** (`.pp-agent`, navy): the Pave Agent mark, name
    and New tag (to the Pave Agent page), "Ask Pave Agent to" with three use
    cases (each to the Agent page's use cases section), and the Hire Pave
    Agent button at the bottom.
  - **Market Data:** Market Data, Methodology.
  - **Compensation Management Tools:** Market Pricing, Compensation Planning,
    Team View, Total Rewards, Visual Offer Letter.
  - **Along the bottom** (`.nvb-global`): Integrations, Enterprise Controls
    and Observability, Security.
- **AI Technology:** three tiles, AI Engine, CompBench and AI Research (the
  research page; marked current on the research pages).
- **Customers:** the Customer stories tile and Use cases; By role; By company
  stage.
- **Resources:** Insights (Blog, Guides & Reports), Community (Pave community,
  Events & Webinars), Data and tools (Hot Jobs Index, Calculator), and the
  Pave Data Lab tile.

Behaviour (`src/nav.js`): one floating panel (`.nav-float`) resizes between
the menus, the outgoing one fading toward the direction you moved while the
next slides in. Menus open on hover where there is hover, on click
otherwise, and close on Escape or a click outside. At 700px and below, the
burger opens one sheet (`.nav-mobile`) with each menu as a section that opens
in place; nav.js builds it from the desktop menus. The tone switching
(`data-nav-tone`) and hiding on scroll down are the Pave Agent page's, in
`src/research-v3-animations.js`.

Small CSS loops play only inside an open menu (the Pave Agent mark, the tile
visuals) and stay still under reduced motion (`nav-v2.css`). The short
descriptions under the links are Kinetic's placeholder copy; Pave may edit
them.

Every link points at its pave.com page, except the `#` ones listed under
"Still to confirm" and AI Research, which points at this repo's
`/research/`.

## The research index

1. **Hero** (`.lt-head`): "research" in Aeonik Light (300), lowercase, the
   one-line intro, and the shapes: a grid of squares and circles (`.gs`)
   filled with the purple gradient from the Customers page. They slide and
   round slowly. The SVG is the geometry; at runtime the motion script paints
   it with the WebGL mesh (`mesh.js`, the `purple` colours). Without WebGL the
   SVG's own gradient shows. In Webflow this is a code embed.
2. **Featured post** (`[data-featured]`): the latest post. Latest, topic and
   date; the title; the author as "Name, Title"; Read the post; and the
   post's number with its full label.
3. **All research** (`.lg--v2`): one row per post: the number with a short
   context line under it, the title, the topic, the author and date, an
   arrow. On hover a light grey card sits behind the row and the other rows
   mute. **Show more research** reveals the next rows, numbers rolling in.
   The design shows 3 at a time so the button appears with four posts; use 8
   to 10 in production. A collection list with pagination or a load-more
   does it.
4. **Careers** (`.lt-careers`): "Hard problems. Real data. Real impact. Join
   the Pave AI team." (each phrase kept together, "Join the Pave AI team." on
   its own line) and See open roles, to pave.com/company/careers.
5. **Footer:** the site's footer, as on the Pave Agent page.

## The research post (CMS template)

1. **Header** (`.lp-head`, a pale blue band): the crumb (Research / the first
   topic), the title, the summary; on the right the number with its label,
   then Author, Published (only when there's a date), Reading time and
   Topics. With no number, the author details move up to the top of the
   right column, level with the title (`research/text-only.html`).
2. **Fig. 01** (optional): the post's figure. The prototype draws its charts
   in code; in Webflow it's an image field. Pave asked for it to be optional:
   with no image the section is left out.
3. **The post:** "In this post" on the left (sticky, one link per H2, with a
   blue line that fills as you read); the body (paragraphs, H2s, lists,
   images); a call to action box partway down when the post has one; the
   author card at the end.
4. **More research:** the other posts, as rows like the index's.
5. **Careers and footer,** as on the index.

The earlier version's Results section (a row of stats under the header) is
gone: Pave asked to leave it out when the header has a number.

## CMS: Research posts

| Field | Type | Where it shows |
| --- | --- | --- |
| Title | Plain text | Everywhere |
| Slug | Slug | `/research/<slug>` |
| Summary | Plain text | Under the post's title |
| Date | Date, optional | Post header (Published), index rows, featured post. Nothing shows when it's empty |
| Topics | Plain text or a multi-reference | Crumb and index rows use the first; filtering may come later |
| Reading time | Number (minutes) | Post header |
| Author name, title, photo, LinkedIn | Plain text, image, link (or an Authors collection) | Bylines, post header, author card |
| Number | Plain text, optional | Post header, featured post, index rows ("20+", "45 days", "4.3 / 16") |
| Number label | Plain text | The full line under the number (post header, featured post) |
| Number context | Plain text | The short line under the number in the index rows ("signals analyzed per employee") |
| Figure image, figure title | Image and plain text, optional | Fig. 01 |
| Body | Rich text | The post |
| Call to action text and link | Plain text and link, optional | The box partway through the post |

The featured post is the first in the list, so give the collection a sort
order (dates are optional, so don't sort on date alone).

## Motion

- **GSAP 3 with ScrollTrigger:** sections rise 32px into place as they enter
  (0.85s, once); numbers roll into place like a counter, each digit a reel;
  Show more slides the new rows in; the post's contents line fills as you
  read.
- **Lenis** smooths scrolling in the prototype. Nothing depends on it, so
  leave it out if the Pave Webflow project doesn't use it.
- **WebGL** (`mesh.js`) fills the index shapes and the footer puzzle; both
  fall back without it.
- **Reduced motion:** everything sits in its final state.

## Updating this repo (Kinetic)

```sh
PAVE=~/Developer/kinetic/pave-v2 npm run sync
```

It rebuilds the pages from the prototype, then loads each one at 1440 and
390 and fails on a missing file, a script error, a doubled nav or a page that
scrolls sideways. Commit with a `CHANGELOG.md` entry and a note in
#pave-toqir.
