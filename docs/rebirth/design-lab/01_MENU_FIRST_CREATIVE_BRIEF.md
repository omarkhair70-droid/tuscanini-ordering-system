# TUSCANINI — MENU FIRST / CREATIVE DIRECTION 01
**31 October 2026 · Design proposal, not approved rollout · Branch: design/tuscanini-menu-first-lab-20261031**

## Core decision
The menu is the homepage. Customers should see real food choices and prices inside the first viewport on a common mobile screen. No forced intro, full-screen hero, feature essay, or second navigation step. Editing an order remains contextual and reversible.

**Quietly bold. Less explanation. More sensation.** Editorial *composition*, straightforward *behavior*.

## New hierarchy
1. Compact authentic Tuscanini identity + always-reachable cart.
2. Short menu context + brand-appropriate expressive but compact headline.
3. Obvious Arabic search, full-catalog by default.
4. A legible family rail. Proposed families: All / Crepe / Pizza / Sandwiches / Pasta / Sweets / Appetizers / Drinks. The underlying historical 16 category slugs remain authoritative for actual data mapping.
5. Compact item rows: exact item name, subtype, starting price, one obvious product-detail control.
6. Product detail sheet: size, vetted modifiers, quantity, note, live recalculated authoritative total, one Add action.
7. Cart/checkout/tracking: restrained utilitarian interface; factual states only.
8. Actual restaurant art/photography in background or secondary context; never present family-level photos as proof of a specific dish.

## Source truth
At the 22 October working-board snapshot: 113 historical menu items / 16 categories; 12 original 640px restaurant photos; 100 generated reference visuals, none merchant-verified as exact product photos. Menu/price/stock and photo-to-SKU match **must be reconciled with merchant before any real checkout launch**. The published restaurant order intake must remain unaffected. The current branch design may not use any historical amount as a certified live price.

## Creative language
- Menu columns and separators rather than repeated rounded cards.
- Warm paper `#F6F3ED`, dark ink `#231F1B`, muted `#796F64`, separator `#D8D1C7`, restrained chili accent `#B44231` — exploratory tokens, not brand approval.
- Readable Arabic display and microcopy; font roles may reuse IBM Plex Sans Arabic, with identity and font licensing reviewed.
- No heavy shadow/3D, auto-playing media, scroll-jack or decorative animation.
- Original branded packaging and real food photography may become textured visual evidence *after* crop, quality and rights review.
- The legacy/T monogram used in exploratory stand-alone sketches is not a replacement for the official brand mark.

## Source research used, not copied
- Baymard Food Delivery & Takeout UX: https://baymard.com/research/online-food-delivery
- Baymard 2026 mobile navigation/category research: https://baymard.com/research-articles/mobile-app-ux-trends
- MeasuringU restaurant UX research: https://measuringu.com/ux-restaurant/
- Editorial food-menu study: https://www.juriokita.com/project/tonchin-nyc-webdesign
- Consistent physical/digital food brand system: https://www.studio24.se/work-fabro

## Scope of this branch
**Implementation now lives in the actual Next.js project, not in standalone HTML:** both `/` and `/menu` render `MenuFirstEntry` → existing `RebirthMenu`, with a `presentation="menu-first"` variant. Search, category selection, product details and cart use the current restaurant project components; 16 historical categories are grouped into simple visible families. The earlier standalone HTML is an exploratory throwaway and NOT a production source.

Scope of this PR: **working branch frontend + design docs only**. It changes public route UI on this isolated branch but does not touch main, production deployment, live restaurant order intake flags, backend/database, prices or operations. Visual review, CI, actual mobile/browser QA and the merchant catalog/brand signoff remain **open acceptance gates**. Do not merge from a code-only or build-only claim.