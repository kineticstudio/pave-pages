# Changelog

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
