# TUSCANINI REBIRTH / PASS 15 — MATERIAL GLYPHS + USER-CONTROLLED MOTION + WHOLE EXPERIENCE

Date: 19 Oct 2026 · Draft PR #59 only · design and owner approval are **OPEN**.

## User correction: this is not a spacing/typography-only redesign
The creative task spans REAL photography; graphic language and custom illustrations; icons and CTA surfaces; navigational composition; animation, state transitions and user feedback; authentic menu with original prices; accessible user interaction; consistency among physical packaging / brand / web / ordering. The previous narrow “fix angles, repeated H1s and then server” frame was inadequate. The brief is for a cohesive original restaurant experience in Next.js, not a static set of clean pages.

## Primary researched reality (not invented identity claims)
- `01_RESEARCH_MEMORY.md`: 7 principles — Form × Flavor, Reveal as Proof, Human Scale, Material Handoff, Two Tempos, Waiting Has Truth, Sensory Restraint.
- `02_CREATIVE_AND_MEDIA_SYSTEM.md`: contained / abundant, wrapper / interior, quiet / dense, approved-looking brand colors as **WORKING** tokens, genuine 12-photo set TSC-01…12, no item-photo mapping.
- `05_CREATIVE_PRODUCTION_01.md`: human-scale TSC-06, real cutaway TSC-09, controllable TSC-02 photo crop, physical TSC-08 package in real Home.
- Original `docs/rebirth/archive/WEBSITE_EXPERIENCE_HTML_REFERENCE.html`: creative whole-site benchmark, **not** a replacement for real Next.js and client/server accuracy.
- `14_OWNER_PREVIOUS_MENU_AND_POPULATED_CREATIVE_PASS_11_12.md`: 16 original categories, 113 items and old prices selected explicitly by the owner; no fake new prices, updated pictures, specials or checkout success.

## Narrow second reference layer: mechanisms, not visual copies
- Tripletta Pizza / Treize Grammes + Thomas Carré: actual [CSSDA Website of the Day 2025](https://www.cssdesignawards.com/sites/tripletta-pizza/47250/). Transfer **coherent art-directed visual/motion system with restaurant-specific identity**, not its colors, code or scroll choreography.
- Lupo Pizza / la boucle: actual [CSSDA WOTD 2023](https://www.cssdesignawards.com/sites/lupo/43675/). Transfer **self-consistent typographic and illustrated graphic grammar**, no stolen drawings/mascot.
- Gyros Factory / Sonat.Co: [case](https://sonat.co/gyros-factory). Identity, packaging, food photography and website reinforce each other. Transfer the **source→system process**; the Greek mythology and its packaging visuals are NOT Tuscanini.
- [Treize Grammes Codrops production study](https://tympanus.net/codrops/2024/10/10/case-study-treize-grammes-2024/): interactions are individually composed with explicit reset/close behaviors. Transfer reversible user agency, not a tech dependency.
- [Codrops same-image clip-path motion](https://tympanus.net/codrops/2023/03/01/double-image-hover-effects-with-clip-path-animations/): optional technique comparison; we use a 480ms **user-triggered** photo crop reveal, not copied visual assets or a global complex animation dependency.

## What was actually implemented in Pass 15 — with exact surfaces
1. **One original, authored SVG glyph grammar** `components/rebirth/material-glyph.tsx`:
   Fold, cut, box, hand, place, crepe, pizza, sandwich, pasta, sweet, drink, sides, all, menu, offer, story and cart. Minimal line artwork; one lineweight and corner family, reused as a visual alphabet. The pictograms are **our EXPERIMENTAL WEBSITE VISUALS** informed by real food/wrapping concepts. They are not official Toscanini logos, exact wrappers, product ingredient claims or merchandise approved by the owner. The gallery retains photographs as factual evidence.
2. **Mobile/tablet navigation transformed from plain link list to art-directed route grid** `components/rebirth/experience-header.tsx` + `app/rebirth-home.css`: Fold masthead; distinct route symbols; large touch targets, count/index references, clear utility links and Cart; a scrim closes on interaction, Escape still closes, aria-expanded remains functional. Motion only when permitted; reduced-motion is static. Direct Menu CTA remains in the HEADER, not hidden behind the spectacle.
3. **Menu category browsing** `components/rebirth/rebirth-menu.tsx` + `app/rebirth-menu.css`: all sixteen actual original food categories + All have schematic family glyphs. Duplicate same-named products remain differentiated by their category; line-item prices and add-ons are literal old menu figures.
4. **Two-step Food Finder** `components/rebirth/rebirth-food-finder.tsx` + `app/rebirth-finder.css`: 8 actual form choices now have their own source-informed drawn food symbols (including no fictional spicy/new badge). Visual selected state uses same glyph system; accessible press state and 48px or larger targets.
5. **Home FoodExploration** `components/rebirth/food-exploration.tsx` + `app/rebirth-exploration.css`: source-explained family cards and tabs use the exact same graphic characters and larger editorial watermark. Category change switches a genuine, matched FAMILY-level photo with an optional crop reveal. Reduced-motion leaves it still; never pretend it is a named item or exact amount.
6. **Red physical chapter is now a meaningful two-state interaction** `components/rebirth/physical-chapters.tsx` + `app/rebirth-story-rhythm.css`:
   - `TSC-08`: actual photographed red packages and sandwiches.
   - `TSC-07`: separately photographed opened crepes.
   - Two real buttons, reversible; SVG box/cut switch; caption explicitly tells the visitor the two photographs are **different products**, NOT two stages of one sandwich/order.
   - Short reversible crossfade; no autoplay/scroll lock or background video, SVG fold drawing behind words.
   - Do not call this a discovered genuine “staff-to-customer wrapper ritual”: owner research doesn't prove one.
7. **QA expansion** `scripts/qa/rebirth-interaction-check.mjs`: home real-image decoder check, exact source-photo switching + reverse, mobile Escape and illustrated menu, icon coverage of 16 categories plus All and eight Finder choices, four viewports and no new JS-only mandatory motion. Captures open mobile nav 390/768 and alternate packaging state 390/1440.

## Creative test / rejection conditions
- If 320px menu/nav obscures direct order access or traps a user, reject and correct it.
- No item-level fake photo; no generated copyrighted logo or copied icons from any reference website.
- Preserve actual product prices and label their **previous menu** origin. Server is still the final order accept/reject authority; no client-only false promise.
- Check screenshot legibility of SVG scale at 320/390/768/1440; both dark and warm surfaces, user focus outlines, keyboard/Escape, and both motion settings.
- Don't add GSAP/Three.js until a very specific motion cannot be performed accessibly and performantly with native SVG/CSS.
- A green build or screenshot count is **NOT** final site design, animation quality, actual merchant sign-off or deployed application validation.

## Additional art-direction/animation gaps still OPEN
- Owner-supplied actual vector wordmark/logo or authorization to redraw from packaging with source verification; current wordmark is provisional typographic treatment.
- Genuine package/cup/wrap template geometry if physical brand system must be reproduced accurately. A generic abstract fold drawing is NOT a traced official pattern.
- Larger-format photo source images if available; do not hallucinate higher resolution food textures.
- Purposeful Home-to-Menu cross-route transition and navigation exit behavior/scroll restoration under Next.js App Router; test with Back button and touch. No forced loader or gate to order.
- Offers with trusted merchant campaign creative/terms; don't invent sale tags or dates.
- User/owner review of actual SVG icons at 320/390 and motion performance on real devices; screenshots alone are not final.
- Admin/kitchen visual family and production order E2E separate gates; do not replace those with brand work.

## Evidence status
Code implemented on the current Draft branch, TypeScript compile and Chromium artifact evidence to be linked once latest Pass 15 run completes. NOT approved or published. No merge.

## PASS 15 — ACTUAL BROWSER QA / GRAPHIC EVIDENCE
**Verified code, NOT merely a plan.**

- Green Next CI and Chromium screenshot/asset workflow: [Actions #39176756399](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39176756399) — **completed SUCCESS**, fixture interaction smoke **0 failures**, strict authentic source-photo gate.
- **52 PNG browser captures** including normal full-page screens at mobile, tablet and desktop, plus focused user-activated navigation open state at **390px and 768px**, packaging alternate (inside) scene at **390px and 1440px**, populated old-price Menu search/product modal/cart/Food Finder states.
- Four browser widths **320/390/768/1440** passed custom glyph presence for all **17 Menu filter chips**; Food Finder icon grid has 8 visual family choices. Three similar flavor names can be distinguished without inventing food photos.
- At 320/390/768, illustrated mobile nav opens and closes on Escape. The five main routes retain their true hrefs and menu/cart direct access isn't hidden behind the artwork. Utility links now have distinct feedback/help/place symbols.
- Two restaurant images (TSC-08 and TSC-07) actually decoded and switch in response to pressed buttons; original wrapper returns on second press. The changing caption correctly states it is a **different actual photographed product**, NOT a split/before-after illusion.
- After the 2026-10-19 designer visual review: 390px navigation artwork fits one viewport, the red wrapping/inside composition keeps food credible and readable; original menu's glyphs are legible at 390px; Food Finder's outline families visibly work as a reusable line language. This is a first authoring PASS, not owner-approved corporate branding or full award-level closure.
- A recurring test failure at the first implementation was **an obsolete locator assuming only one packaging image**, not a broken picture; browser QA now distinguishes two photos and verifies both decode. Any earlier failed CI step is superseded by the successful final run above.
- Follow-up physical/device QA: check focus position after nav close, touch perception of folded/cut glyphs, color contrast at 200% zoom, cross-route transition budget and no unwanted animation on real low-end devices before owner sign-off.
