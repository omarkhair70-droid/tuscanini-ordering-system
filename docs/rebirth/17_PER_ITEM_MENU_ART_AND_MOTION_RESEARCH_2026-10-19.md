# TUSCANINI / PASS 17 — EACH MENU ITEM AS AN ART-DIRECTED, ANIMATED OBJECT
Date: 19 October 2026 · PR #59 DRAFT · No merge, no production order submissions

## New user direction, preserved literally
Do not stop at legible compact rows and typed glyphs. Build an image/art system **for each menu item**, make it distinctively Tuscanini rather than generic product cards, study how awarded experiences achieve material/motion continuity and actually implement/test custom behavior. Search narrower for techniques and source cases repeatedly after visual QA.

## Evidence-grounded image decision, not a substitute for user request
- The repository has **113 exact old-menu item records and original prices across 16 categories**, by owner's explicit choice, in `lib/mock-data.ts`.
- The owner-supplied photographic source atlas contains **12 actual 640×640 real restaurant shots** (`lib/rebirth/food-media.ts`); **none identifies and verifies an exact named SKU**. We CANNOT truthfully say the site now has 113 actual item photographs. A category crepe image may not be labeled "تشيكن فاير".
- We therefore execute two independent tracks:
  1. **NOW:** authored *different graphics* for EACH of the 113 existing records, with recognizable food-family drawings but distinct fold positions, ink, serial and id; clear that these are expressive illustrations, not ingredient/size evidence.
  2. **TO COMPLETE:** capture/receive the actual image for EACH named SKU (and material-size difference when it matters), verify with owner/menu ID, then activate only the approved mapping and render it as an individual photograph. Exact prices and availability remain independent.
- `lib/rebirth/verified-menu-photographs.ts` starts with an explicitly **empty SKU→photo manifest**. This is a TRUTH GATE, not a claim of complete photography. A future entry must include productId, local source path, photograph alt, source and verifiedBy evidence. Fuzzy filename/photo family matching is prohibited.
- Family-context originals appear ONLY after selecting an actual matching crepe/pizza/sandwich group, accompanied by a prominent claim that this is a family photo, not the displayed name. Other families lack verified originals and stay typographic/graphic — DO NOT fake burgers/pasta/waffles.

## Source/award/implementation research (distinct kinds of evidence)

### Award-confirmed food/restaurant website caliber
- Tripletta Pizza — CSS Design Awards Site of the Day 2025: https://www.cssdesignawards.com/sites/tripletta-pizza/47250/ . Custom motion/personality woven through identity, not one plugin added everywhere.
- Lupo Pizza — CSSDA Website of the Day 2023: https://www.cssdesignawards.com/sites/lupo/43675/ . Illustrated-type grammar; not its actual pizza drawings/colors.
- KHUFU'S / MONARQ — **Awwwards Honorable Mention** on 7 May 2026, as the studio discloses in: https://monarqeg.com/case-studies/khufus/ . A real Egyptian restaurant experience pairing coherent story, actual menu and interactive browsing. Acknowledgement is not the same as Site of the Day. Their AI film is not permission to invent our named food product photography.
- Promeat / Chipsa, CSSDA WOTD 2025 — https://cssdesignawards.com/sites/promeat/47856/ ; careful GPU motion. Marketing rather than transactional UX; not appropriate to force WebGL on every item.

### Relevant original production/tutorial technical methods
- **Gwen Bogaert / Codrops: Animated Product Grid Preview with GSAP & Clip-Path** (2025), original tutorial: https://tympanus.net/codrops/2025/05/27/animated-product-grid-preview-with-gsap-clip-path/ . Method: focused product preview originating from grid with a reveal. **Transfer:** real item identity persists through transition, do not turn 113 list items into time-heavy animations.
- **Manoela Ilic / Codrops: Menu to Grid Layout Animation** (2022), original tutorial: https://tympanus.net/codrops/2022/09/19/menu-to-grid-layout-animation/ and working source https://github.com/codrops/MenuToGrid (MIT, with separate Unsplash photography). Method: GSAP Flip maintains spatial continuity when moving a thumbnail into another layout. **Transfer:** same printed visual language in list and product sheet; not mandatory to adopt the exact stack.
- **Manoela Ilic / Codrops: Image Tiles Menu Animation** (2023): https://tympanus.net/codrops/2023/04/26/image-tiles-menu-animation/ . Method: disparate tiles coalesce on selection, intentionally editorial rather than the fastest way to order. **Transfer:** perhaps one chapter-level motion; reject as a 113-SKU mandatory wait animation.
- **Iqbal Muthahhary / Codrops: Responsive Grid with GSAP Flip** (2026), https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/ . Method: FLIP preserving item continuity through layout changes; benchmark only if native transitions prove insufficient.
- **Café Olé / Creatoro motion identity**, published case https://www.behance.net/gallery/220571581/Caf-Ol-Brand-Motion-Identity . Two consistent motion principles across animated menu and order status, not random per-page effects. The case is a **portfolio design reference**, no website award claimed here.
- **GRAPE PAPER / Ahmed Sallam**, packaging+monoline identity: https://www.behance.net/gallery/249519063/GRAPE-PAPER-Restaurant-Brand-Identity-Packaging . Source to visual system, not copying the actual art; award not claimed.
- **Baymard 2026 original food-delivery UX research**, https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026 . Explicit gaps in item customization and return/navigation paths at major platforms; ordering task must remain central.

## PASS 17 implemented code
- `components/rebirth/product-artwork.tsx`: repeatable seeded/typed individual print-object graphics for each exact SKU (distinct object IDs and randomized-but-stable geometry, not random at runtime), consistent category glyph and price-neutral art. Has verifiedPhoto conditional path gated by manifest.
- `app/rebirth-product-art.css`: route-specific graphic family; printed-registration labels and controlled fold lines, 320–1440 responsive list. Hover and keyboard focus fold/unfold movement. One coordinated grid reveal when an actual food family changes. Native product dialog opens on a matching art piece with short editable sheet motion; reduced-motion disabled, touch gets a direct functional button.
- `components/rebirth/rebirth-menu.tsx`: each item renders its portrait in the compact old-price row, without attributing any of the 12 generic restaurant photos to a named item. Selected known category may show real generic source photo context with explicit disclaimer.
- `components/rebirth/rebirth-product-dialog.tsx`: maintains product's unique graphic language during size/add-on customization; actual old prices and source disclosure preserved, no invented product shot.
- `scripts/qa/rebirth-interaction-check.mjs`: assert all **113** item IDs map to **113** individual abstract graphics; tests source-only family photo and same graphic in modal at four widths.
- `scripts/qa/rebirth-populated-menu-visuals.mjs`: additional visually inspected captures of actual family photo context, individual art and product sheet (390/1440).
- `scripts/qa/rebirth-motion-film.mjs`: real browser footage now continues from Home to the physical category intro, custom item hover/fold and actual product sheet (390/1440). These are real client interactions — no backend order POST.

## Photo production brief (actual 113 photos remain missing; no false status)
- Photograph the *actual named item*, not a related category, with the restaurant's permission and staff; include SKU ID/name and selected size, recipe version, date and source photographer in the intake.
- For each distinct product type: one factual unobscured hero angle plus optional cross-section for crepes, top angle for pizzas, lateral human hand/packaging scale for sandwiches, utensil/context only when owner-approved. Maintain truthful portion size and real ingredients. Use RAW/high-quality originals, not stretched social copies.
- Align art direction by *real physics*: outside/inside, wrapper/cut, light/shadow, depth of food **already present**. Avoid generative image edits that change ingredients or decoration. Don't assert photo count/approval while absent.
- Save optimized responsive derivatives alongside original source and explicit mapping in verified photo manifest; run a build-time path/id/duplicate audit before exposing named photos.
- When approved exact item imagery arrives, progressively convert each verified graphic placeholder to an actual photo while preserving print-label/crop/motion behavior and the same truthful item ID.

## QA and creative acceptance
- Browser tests at 320,390,768,1440 for no overflow, all 113 individual names/art IDs, duplicate cross-family names, real-price calculation and modal.
- Video of deliberate menu selection and product art→sheet on phone and desktop; pointer focus and keyboard parity. Motion disabled under reduced motion. Measure responsiveness and no delayed add-to-cart.
- Source matches and live order acceptance must be checked separately. **Never deploy or merge PR #59 because a GIF looks nice**.
- Owner has not approved current graphic texture/photo art as final identity; compare visually against original HTML, Tripletta/Lupo system coherence, actual restaurant red packaging and own screen recordings. Revise/reject based on evidence.

## Current evidence status
Initial edits committed in Draft branch; workflow results are checked independently before asserting Pass 17 green. The **113 photos are NOT present yet**.
