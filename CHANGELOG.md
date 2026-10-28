# Changelog

## October 28, 2026: Pave Agent use cases

- **New:** `use-cases/index.html` (Grid V2) and `use-cases/<id>.html` (Detail
  V2, one per use case), approved October 28. They run live from
  `src/use-cases-data.json` with `src/use-cases.js` and `src/use-cases.css`.
  See README.md, "The use cases".

## October 28, 2026: page spacing under the fixed nav

- **New:** `webflow/header-space.html`, site-wide head code that gives pages
  built for the old nav their space back under the fixed nav and bar, and
  fixes the Hot Jobs Index tab menu sitting on its title. See README.md, "The
  fixed nav and page spacing".

## October 28, 2026: link previews

- **New:** `og/`, a 1200x630 preview still for research, the calculator, use
  cases and Insights, and a short MP4 loop of the hero's motion for research
  (the shapes) and the calculator (the total counting). The tags are in
  `research/index.html` and `calculator/index.html`. See README.md, "Open
  Graph (link previews)".

## October 20, 2026: the value calculator

- **New:** the value calculator, Four Questions V2, approved by Pave
  (Teresa and Tim) on October 20: `calculator/index.html`, run by
  `src/calculator-ui.js` and `src/calculator-v21.js` from
  `src/calculator-data.json`. See README.md, "The value calculator".
- V2 has Teresa's three comments: the header's columns align at the top, the
  sliders use Pave's purples (#A46FEF, #461F7A, #1C0042), and the running
  total bar leaves at the end of the calculator.

## October 20, 2026: Pave's changes to the research pages

Toqir's build (pave-v2.webflow.io/research) is in; these are Pave's changes
from their sheet, Kinetic Studio: Edits and Bugs (Research pages tab), plus
one from Hunter. The pages here now follow **Ruled V4** and **Split Header
V3**; Ruled V3 and Split Header V2 stay on the review site as approved.

- **Header shapes:** less pink in the gradient. A little lilac stays (Teresa:
  "there can be a little but it's not officially a brand color"). The shapes
  use a new `violet` mesh in `src/research-v3-animations.js`
  (`data-mesh-tone="violet"` on `.gs--mesh`).
- **Featured post:** the stat sits in a white card the height of the post
  (`.lt-figure--card`), and "Read the post" is a button under the title,
  left aligned (`.lt-feature-button`).
- **Background:** Pave's light blue `#F3F8FF` (`--blue-ultra-light`) for the
  bands on the index and for the post's header and bands, not the grey tint.
- **No author name or date anywhere:** gone from the featured post, the
  index rows (no Author column; `.lg--anon`), the post header (Author and
  Published) and the author card at the end of a post.

## October 16, 2026: the navigation and research pages

- **First handoff,** everything Pave approved on October 15:
  - **Navigation:** the Agent Panel version (`nav/index.html`). It replaces
    the site-wide navbar.
  - **Research index:** Ruled V3 (`research/index.html`), with Pave's
    October 15 hiring line.
  - **Research post template:** Split Header V2, shown with Pave's four posts
    (`research/<slug>.html`) and as a post with no number or image
    (`research/text-only.html`).
- The research pages carry the approved nav here; on the review site they
  still show the one they were reviewed with.
- Still to confirm with Pave: where the nav's not-yet-built items go, and the
  research page's address (README, "Still to confirm").
