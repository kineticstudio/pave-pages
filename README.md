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
| Use cases | [Grid V2](https://pave.kineticstudio.com/designs/pave/site-src/use-cases-grid-v2.html) | Not started | The Pave Agent use cases index, approved October 28 (Teresa, with Tim). `use-cases/index.html` |
| Use case | [Detail V2](https://pave.kineticstudio.com/designs/pave/site-src/use-case-v2.html?case=pay-complaint) | Not started | One use case, the collection's template page. `use-cases/<id>.html`, one per use case |
| Hire Pave Agent | [V7](https://pave.kineticstudio.com/?project=pave&view=designs&design=hire-pave-agent%2F07-Pave-Hire-Pave-Agent-V7.html) | Not started | Tim approved it November 6 (V6, with Teresa's notes, which are V7). `hire-pave-agent/index.html`. See "Hire Pave Agent" |
| Insights (four main pages) | [Glow V2](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-5%2F01-Pave-Insights-Hub-Glow-V2.html) | Not started | Restyle of the existing Insights, Articles, Guides & Reports and Events & Webinars pages, approved November 4 (Teresa, for the team). `insights/`. See "Insights" |
| Insights article, customer story | [Article V2](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-2%2F05-Pave-Insights-Article-V2.html), [Customer Story V2](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-2%2F08-Pave-Insights-Customer-Story-V2.html) | Not started | Restyle of the Blog Posts and Case Studies templates. `insights/articles/<slug>.html`, `insights/customer-stories/<slug>.html` |
| Customers: video story cards | [Video Story Cards](https://pave.kineticstudio.com/?project=pave&view=designs&design=customers%2F01-Pave-Customers-Video-Story-Cards.html) | Not started | Approved November 16 (Teresa). Adds video cards to the live Customers page. `customers/index.html`. See "Customers: video story cards" |
| Product updates | [Round three](https://pave.kineticstudio.com/?project=pave&view=designs&design=product-updates%2F04-Pave-Product-Updates-V3.html) | Not started | New page and CMS collection, design approved for dev November 16 (Teresa); Pave's content is still to come. `product-updates/index.html`, one `product-updates/<id>.html` per update. See "Product updates" |

The design links open each page on its own. On the review site the research
pages still show the older nav they were reviewed with; here they carry the
approved nav, as they will on pave.com.

How work moves:

- **Designs** on pave.kineticstudio.com are what we build to.
- **Changes** land here, one commit and one `CHANGES.md` entry each, with a
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
| Use cases | `use-cases/index.html` | [Grid V2](https://pave.kineticstudio.com/designs/pave/site-src/use-cases-grid-v2.html) |
| Answer a pay complaint (and the seven others) | `use-cases/<id>.html` | [Detail V2](https://pave.kineticstudio.com/designs/pave/site-src/use-case-v2.html?case=pay-complaint) |
| Hire Pave Agent | `hire-pave-agent/index.html` | [V7](https://pave.kineticstudio.com/?project=pave&view=designs&design=hire-pave-agent%2F07-Pave-Hire-Pave-Agent-V7.html) |
| Insights | `insights/index.html` | [Hub, Glow V2](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-5%2F01-Pave-Insights-Hub-Glow-V2.html) |
| Articles | `insights/articles/index.html` | [Articles, Glow V2](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-5%2F02-Pave-Insights-Articles-Glow-V2.html) |
| Guides & reports | `insights/guides-and-reports/index.html` | [Guides and Reports, Glow V2](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-5%2F03-Pave-Insights-Guides-and-Reports-Glow-V2.html) |
| Events & webinars | `insights/events-and-webinars/index.html` | [Events and Webinars, Glow V2](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-5%2F04-Pave-Insights-Events-and-Webinars-Glow-V2.html) |
| Every article (32) | `insights/articles/<slug>.html` | [Article V2](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-2%2F05-Pave-Insights-Article-V2.html), with the [mid CTA and pull quote](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-2%2F06-Pave-Insights-Article-Mid-CTA-and-Pull-Quote-V2.html) and [FAQ](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-2%2F07-Pave-Insights-Article-FAQ-V2.html) |
| Every customer story (one per company) | `insights/customer-stories/<slug>.html` | [Customer Story V2](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-2%2F08-Pave-Insights-Customer-Story-V2.html), and [Video](https://pave.kineticstudio.com/?project=pave&view=designs&design=insights%2Fround-2%2F09-Pave-Insights-Customer-Story-Video-V2.html) for stories with a video |

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

## Open Graph (link previews)

`og/` has a link preview for each page: a 1200x630 still (`*-og.jpg`, about
60 to 110 KB) and, where the hero moves, a short loop of that motion
(`*-og.mp4`: H.264, 1200x630, 30fps, no sound, under 200 KB). The still is
the video's first frame.

| Page | Still | Video | What the video shows |
| --- | --- | --- | --- |
| Research | `research-og.jpg` | `research-og.mp4` (12s) | The gradient shapes sliding, forward then back, so it loops clean |
| Value calculator | `calculator-og.jpg` | `calculator-og.mp4` (6.4s) | The total counting from $38.2M (4,500 employees) to $169.5M (20,000) and back |
| Use cases | `use-cases-og.jpg` | | For when the page is approved; its hero doesn't move |
| Hire Pave Agent | `hire-pave-agent-og.jpg` | `hire-pave-agent-og.mp4` (8s) | The gradient drifting under the headline as market data flows in (pinned to the `og-2026-11-06` tag) |
| Insights | `insights-og.jpg` | | On the four Insights main pages; the Glow hero holds still, so no video |

`research/index.html` and `calculator/index.html` carry the tags in their
`<head>`, pointing at the files here through jsDelivr (pinned to the
`og-2026-10-28` tag, so they never change under you):

```html
<meta property="og:image" content="https://cdn.jsdelivr.net/gh/kineticstudio/pave-pages@og-2026-10-28/og/research-og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Pave research: the purple gradient shapes beside the title.">
<meta property="og:video" content="https://cdn.jsdelivr.net/gh/kineticstudio/pave-pages@og-2026-10-28/og/research-og.mp4">
<meta property="og:video:secure_url" content="https://cdn.jsdelivr.net/gh/kineticstudio/pave-pages@og-2026-10-28/og/research-og.mp4">
<meta property="og:video:type" content="video/mp4">
<meta property="og:video:width" content="1200">
<meta property="og:video:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://cdn.jsdelivr.net/gh/kineticstudio/pave-pages@og-2026-10-28/og/research-og.jpg">
```

The calculator's are the same with `calculator-og` and its own alt text.

**In Webflow:** upload the still as the page's Open Graph image in Page
settings (that writes `og:image` itself), and paste the `og:video` lines and
the two `twitter:` lines into the page's custom code, Inside `<head>`. The
video can stay on jsDelivr, or move to anywhere Pave serves files over
https; then swap the URL. For research posts, bind the Open Graph image to
the post's image field in the template's settings; they have no video.

Where it plays: most places (Slack, LinkedIn, X, iMessage) show the still;
the video plays only where a site supports `og:video` files (Facebook and
Discord, for example). The still is the preview everywhere else, so it's
made to work alone.

## The fixed nav and page spacing (Webflow, site-wide)

The live nav and announcement bar are fixed, so they float over the page
instead of pushing it down. Most of pave.com was built for the old nav, which
did push it down, so since the fixed nav went site-wide those pages start
under it: the hero on landing pages (Insights, Company, Products, Partners,
Request a demo, Careers, industry and region pages and others), the
breadcrumbs on every blog post, case study, author page and Hot Jobs detail
page, and the Hot Jobs Index tab menu over its title.

`webflow/header-space.html` fixes it once for the whole site. Paste it into
Site settings > Custom code > Head code. It:

- gives every page the header's height as top padding on `.main-wrapper`,
  measured from the nav and bar (112px on desktop, 120px on phones today), so
  pages sit where they did before;
- skips the pages built to sit under the nav: the homepage, Customers,
  Pricing, Pave Agent, the value calculator and Research (with its posts). A
  new page like those goes in the `OVER` list;
- sticks the Hot Jobs tab menu just under the header at every width.

Tested on the live pages with the snippet added, at 1440px and 390px: nothing
sits under the nav on any page type, and the six pages above don't move.

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

## The use cases

Pave approved Grid V2 and Detail V2 on October 28 (Teresa, with Tim), with
one caveat from their side: Pave confirms the final content of each use case
and reviews it before it's published. Like the calculator, the pages stay
live: the markup is written in as it first renders, and `src/use-cases.js`
runs on top.

- **`src/use-cases-data.json`:** the eight use cases from Pave's product
  team, plus the page copy (`page`, `detail`, `cta`). Each record: `id`,
  `title`, `outcome`, `category` or `categories`, `roles` and `products` (lists), `problem`,
  `oldWay` (list), `prompt` (`[brackets]` mark what the reader fills in),
  `followUps` (list), `data.yours` and `data.pave` (name and detail),
  `output` (`summary`, a `table` of `cols` and `rows`, `sources`) and `why`
  (heading and text). Outputs are sample data.
- **`src/use-cases.js`:** fills both pages from the data. On the index:
  search, the category chips with counts, the role and product filters, and
  the cards. On a use case: everything from the record, the Copy prompt
  button (copies plain text), and three related use cases (shared
  categories first, then shared products). Attributes on `<body>`: `data-uc="grid"` or
  `"detail"`, `data-uc-case` the use case, `data-uc-href` and
  `data-uc-index` the addresses it links to.
- **Several categories (Sasha, Nov 4):** a use case can sit in more than one
  category. In the data, `categories` is a list and its first item is the
  main category, shown on the card and in the breadcrumb (a plain `category`
  still works). A category chip counts and lists every use case that has it.
  In Webflow, make Category a Multi-reference to a Use case categories
  collection plus a "Main category" Reference for the card, and filter on
  all of an item's categories.
- **Line breaks and an optional table (Sasha, Nov 5):** a prompt keeps the
  line breaks it was written with (a blank line starts a new paragraph), and
  so does the output summary, each paragraph its own `<p>`. The output table
  and the sources are optional: with no table the summary stands alone. In
  Webflow, make Prompt and Output summary multi-line plain text (or rich
  text) and give the prompt `white-space: pre-line`; put the table and the
  sources line under conditional visibility ("Output table is set").
- **Styles:** `src/use-cases.css` on top of the research styles (V2 is
  `.uc--v2`: text-only cards, and the hover lifts the card and turns it
  light blue with a blue headline).

**In Webflow,** the suggestion: a Use cases CMS collection with the fields
above (lists as multi-reference or plain text, the output table as rich
text or an embed), the template page at `/use-cases/<id>`, and the index at
`/use-cases` as a collection list. Search and the filters can stay this
script, reading the collection from a JSON embed, or use Webflow's own
filtering if that's simpler for you. The Use cases link in the nav
(Customers) goes to `/use-cases` once it's live.

## Insights

Pave approved the Insights refresh on November 4 (Teresa, for the team, in
the Insights thread in #ext-kinetic-pave): Glow V2 (Round 5) on the four main
pages, and the article and customer story templates from Round 2 with
Sasha's comments built in. It's a restyle of pages Pave already has, so the
CMS collections and addresses stay; nothing here needs a new collection.

| Here | Pave's Webflow page | Address |
| --- | --- | --- |
| `insights/index.html` | Insights | `/insights` |
| `insights/articles/index.html` | Articles | `/insights/articles` |
| `insights/guides-and-reports/index.html` | Guides & Reports | `/insights/guides-and-reports` |
| `insights/events-and-webinars/index.html` | Events & Webinars | `/insights/events-and-webinars` |
| `insights/articles/<slug>.html` | Blog Posts Template | `/blog-posts/<slug>` |
| `insights/customer-stories/<slug>.html` | Case Studies Template | `/case-studies/<slug>` |

Out of scope: the Customer stories listing (`/insights/case-studies`) and the
Customers page, which Pave already redid. "See all" on the hub's customer
stories goes to `/customers`.

Like the use cases, the pages stay live: the markup is written in as it
first renders, and `src/insights.js` runs on top from
`src/insights-data.json` (pave.com's own content, from a September 24
snapshot of the CMS). In Webflow the collection lists replace the script.

- **The hero (Glow V2):** a still light blue gradient, pale under the nav,
  with Pave blue (#235CF3) low on the right. On the hub, Articles and Guides
  & Reports it runs on down behind the featured item, so the hero and the
  feature read as one block (`.in-through`, and `throughFeature()` in
  `src/insights.js` sets the art's height to the hero plus the featured
  band). Events & Webinars has no featured item, so it's the hero only. The
  gradient is the `inGlow2` mesh in `src/research-v3-animations.js`, drawn by
  `src/mesh.js`, and it doesn't move: a still image of it (export one from the
  page at 1440 and at phone width) works just as well in Webflow if that's
  simpler. Detail pages keep their own heroes.
- **The listings (Sasha's comments):** Compensation 101 stays off the
  listings (it's the SEO set). No counts, and the button just says "Show
  more". The featured article is the one with Pave's existing "Feature on
  Insights" switch on, otherwise the newest (the pick here is an example).
  Guides and reports are separate sections, "Get the guide" or "Read the
  report", from a new Kind option field (Guide, Report) on Guides; our first
  sort is in the data as `kind`, for Pave to check. One 16:9 cover per item.
- **Events & webinars:** an Upcoming section first (soonest first), then the
  past ones. Each row has a type tag from a new Format option field
  (Webinar, Conference, In person, Virtual event; Pave can add to it), who
  runs it from a Host field ("Hosted by Pave", or "Pave attending, run by
  Consero"), and a date range from a new Date (To) field for multi-day
  events. The action reads Register, Meet us there, Watch on demand or See
  the recap. There are no future events in the CMS yet, so these pages
  pretend today is September 25 (`data-today` on `<body>`) to show the
  Upcoming section; in Webflow it's the real date.
- **The article (Blog Posts Template):** the Updated date next to Published
  when it's set (the one here is an example), the mid CTA (heading, subtext,
  button) wherever the body has the `{{mid-cta}}` placeholder, FAQs that open
  and close (from the SEO FAQ rich text), styles for H3 to H5 and pull
  quotes, a table of contents from the H2s, and More in the same category at
  the end. `what-is-compa-ratio` shows the FAQ and
  `competing-for-talent-consider-offer-letters-reward-letters` the mid CTA
  and a pull quote.
- **The customer story (Case Studies Template):** Featured Products (the
  Products reference) in place of Format, the story's own embedded video
  kept in the body at 16:9, a table of contents when it has sections, stat
  callouts from the Stat Block fields (the two on The Krazy Coupon Lady are
  an example), bigger pull quotes, and the full description. A story with a
  video uses the video template: the video plays in the page at the top (not
  a modal), and the cards mark it with a play button and "Video".
- **Attributes on `<body>`:** `data-insights` says which page it is
  (`hub`, `articles`, `guides`, `events`, `article`, `case`),
  `data-hero="glow2"`, and on these copies `data-in-article`, `data-in-case`,
  `data-in-hub` and `data-in-articles` are the addresses it links to, and
  `data-in-post`, `data-in-case-slug` and `data-in-layout` the item it shows.
- **Styles:** `src/insights.css` and `src/insights-v2.css` on top of the
  research styles (`.in--v2`).

New CMS fields, all optional: Kind (Guides), Format, Host and Date (To)
(Webinars), Updated date (Blog Posts, if it isn't there yet). Everything
else uses fields Pave already has.

**In Webflow:** restyle the existing pages and templates on a branch, not
the live ones. Don't publish until Hunter gives the go.

## Hire Pave Agent

Tim approved the page on November 6: V6 "with those changes", meaning
Teresa's last four notes, which are V7 (dark blue hero text, the hero
centered, no white band under the nav at the top, and "Pave Agent handles all
your survey data."). V7 is what to build. `hire-pave-agent/index.html` is it
with the markup written in, and it matches the design at 1440 and 390 in
Chrome and Safari.

**Build it on a Webflow branch, or keep the page in draft behind a password,
and don't publish until Hunter gives the go.** (On November 6 the value
calculator went live on pave.com by accident with another publish; this is
how we keep that from happening again.) The address isn't confirmed yet; the
suggestion is `/hire-pave-agent`, and the Hire Pave Agent button in the
Product menu links there once it's live.

What's on the page, top to bottom:

- **Hero:** pave.com's own homepage hero, the same classes (`section_hero`,
  `hero_marquee`, `hero_content`, `hero_canvas`) and the same code
  (`src/home-hero.js` and `src/home-hero.css` are the homepage's inline
  script and styles, copied as they are). So the quickest route is to
  duplicate the homepage hero section, then:
  - put `hero_content` before `hero_marquee` (the text first, the motion
    below);
  - center the text, and set the headline, subhead and ghost button text to
    Pave's dark blue `#021340`;
  - turn the gradient over: `.hero_canvas { transform: scaleY(-1); }`, so
    the light side sits behind the text and the dark side behind the motion;
  - the copy: "Build a Frontier Compensation Team", "Why the world's top
    compensation teams hire Pave Agent", Book a demo and See Pave Agent in
    action (to the Pave Agent page).
- **Five sections** (`section.ha-chapter`), each opening with a header
  (`header.ha-section-head`): the title as an H2 on the left, Book a demo on
  the right, a hairline under it. Sections alternate the page's two dark
  backgrounds.
- **17 reasons** (`article.ha-reason`, every other one flipped with
  `.is-flip`): the number (`.ha-num`, "01" to "17"), Matt's lead sentence as
  an H3, the rest as a paragraph, an optional text link (`.ha-textlink`) and
  a visual on the other side. A Webflow component with those slots works
  well, so Pave can add, remove and reorder reasons; the numbers are plain
  text, so renumber when the list changes. The visuals:

  | # | Reason | Visual | Moves | Link |
  | --- | --- | --- | --- | --- |
  | 01 | Real-time market intelligence | `.ha-feed`, a market data table | A cell ticks up every couple of seconds | |
  | 02 | 10,000+ clients | `.ha-logos`, the logo wall | One logo at a time crossfades to another (`src/hire-agent-v3.js` has the pool) | Customers |
  | 03 | Pave Data Lab | `.ha-graph`, the node graph | Nodes light in turn | Data Lab |
  | 04 | Public datasets | `.ha-badges` | Settles in | |
  | 05 | Comp data warehouse | `.ha-tiers`, the four-layer stack | Settles in | |
  | 06 | Syncs with Pave's tools | `.ha-sync` | Settles in | Compensation planning |
  | 07 | 50+ integrations | `.ha-fifty` | Settles in | Integrations |
  | 08 | All your survey data | `.ha-surveys`, ranges for Pave, WTW and Levels.fyi | Settles in | |
  | 09 | Every other AI tool (MCP) | `.ha-sync.ha-mcp` | Settles in | |
  | 10 | Scales past your hours | `.ha-always` | Settles in | |
  | 11 | You make the final calls | `.ha-split` | Settles in | |
  | 12 | Built-in skills | `.ha-cloud` | Settles in | |
  | 13 | Gets smarter | `.ha-chart` | The line draws | |
  | 14 | OpenAI chose Pave | `.ha-chosen`, the white OpenAI logo and chips | Settles in | Customers |
  | 15 | Building your own costs more | `.ha-chart` | The lines draw | |
  | 16 | Privacy risk | `.ha-vault` | Settles in | |
  | 17 | Trust and safety | `.ha-certs` | Settles in | Security and privacy |

  The visuals are HTML and CSS, so each can be a Webflow embed with its
  markup from the page, or built natively from the same classes.
- **Closing panel and footer:** use the site's own closing CTA and footer.
  The closing line is "Bring Pave Agent your most complex questions." with
  Book a demo and Talk to sales.

Code:

- **Styles:** `src/hire-pave-agent.css`, everything the page adds, in one
  file (it was built in rounds, so later rules refine earlier ones; the
  `<body>` classes `ha-v2` to `ha-v7` switch them on). Put it in the page's
  head code, or carry the rules into Webflow classes.
- **Scripts,** in the page's custom code before `</body>`:
  - `src/home-hero.js`: the hero (already on the homepage);
  - `src/hire-agent.js`: each visual settles in once as it reaches the
    screen, the feed ticks, the graph lights, the charts draw;
  - `src/hire-agent-v3.js`: the logo wall's swaps;
  - `src/hire-agent-v7.js`: no frosted band under the nav at the very top of
    the page; the band comes back once the page scrolls. It targets
    `.nav-v2.nav-light::before` here, so point it at the live nav's classes.
  All of them show the finished state with reduced motion.
- **Calls to action:** a Book a demo in each section header and the text links
  on reasons 02, 03, 06, 07, 14 and 17. Pave asked for them to be optional,
  so any of them can simply be left out.
- **Copy to keep as is:** reason 02 says "Fortune 500 enterprises" without
  naming one (McDonald's can't be named). Matt's copy doc is the source for
  the rest.
- **Link previews:** `og/hire-pave-agent-og.jpg` and `.mp4`; the tags are in
  the page's head. See "Open Graph" above.

## Customers: video story cards

Teresa approved this on November 16. It's the live Customers page
(pave.com/customers), the same fourteen stories in the same sizes and order,
with one change: every story that has a video gets a video card. Nothing else
on the page changes. `customers/index.html` is the reference; the card markup
and the hover preview are in `src/customers-video.js` and
`src/customers-video.css` (the live grid's own CSS is copied in so the cards
sit exactly as they do today).

- **The card** (`.cs-card2--clip`): the video's thumbnail fills the card's
  image area, with a white play button in the corner where the arrow sits on
  the other cards. The company logo, title and link stay as they are, and the
  card still opens the story.
- **Hover preview, desktop only:** on a mouse or trackpad (not touch), hovering
  a video card for a moment starts a short muted preview in place of the
  thumbnail (it fades in, plays about ten seconds from the clip's start time,
  then settles back), and it stops when the pointer leaves. Phones and tablets
  just show the thumbnail and play button. With reduced motion on, no preview.
- **For the real build,** use a short MP4 clip per story for the hover (muted,
  H.264, about 10 seconds, under 2 MB) rather than the YouTube player, so
  YouTube's own buttons never flash up. The reference uses YouTube to show the
  idea.
- **CMS, Case Studies, new optional fields:** Video (YouTube link), Preview clip
  (the MP4 for the hover), Thumbnail (optional image; without it, YouTube's
  thumbnail, but Superhuman's has text baked in, so give it one), Preview start
  (seconds, if you use the YouTube player). A story with no video stays a
  normal card.
- Seven stories have videos today; their IDs are the ones already embedded in
  each story (listed at the top of `src/customers-video.js`).

Build it on a Webflow branch and don't publish until Hunter gives the go.

## Product updates

A new page for what's new in Pave, like fin.ai/updates. Teresa approved the
design for dev on November 16 (round three); Pave is still writing the real
updates, so the reference runs on lorem ipsum. `product-updates/index.html` is
the feed and `product-updates/<id>.html` one update (the collection's
template). `src/updates-v2.js` writes both from `src/updates-v2-data.js`;
the styles are `src/updates.css`, `src/updates-v2.css` and
`src/updates-v3.css`, in that order.

- **Hero:** "Product updates" and a line under it, on the blue mesh, and the
  gradient runs down the whole page into Pave's light blue (`.up2-wash`).
- **Filter chips** across the top, one per product plus All. They wrap onto a
  second line rather than cut off.
- **The side menu** (`.up2-ticker`, sticky): every update's date and title, a
  plain dot beside each, and the one you're reading in blue with its date
  showing. Round three took the halo off the dot and the line between the
  dots, and gave the rows more room (`src/updates-v3.css`, only the menu).
- **Each update** is a white box: date, product tag, title (to its page),
  summary, then a video, an embed or a product visual if it has one.
- **One update's page:** breadcrumb, title, date and tag, summary, the media,
  the body, Book a demo, Newer and Older, and three related updates.
- **CMS, Product Updates (new collection):** Name, Slug, Date, Product
  (reference, drives the filter and the tag), Summary (one line), Media type
  (Video, Embed, Visual or None), Video file and Poster image, Embed link
  (YouTube, Vimeo or Wistia), Visual (image), Body (rich text). Newest first.
- The address isn't confirmed; `/product-updates` is the suggestion.

Build it on a Webflow branch and don't publish until Hunter gives the go.

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
scrolls sideways. Commit with a `CHANGES.md` entry and a note in
#pave-toqir.
