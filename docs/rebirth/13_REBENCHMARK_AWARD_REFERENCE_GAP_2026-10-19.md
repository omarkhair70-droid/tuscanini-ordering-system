# TUSCANINI REBIRTH / PASS 09 — RE-BENCHMARK, NOT DESIGN CLOSURE
Date: 19 Oct 2026 | Draft PR #59 | Status: **ART DIRECTION OPEN / NEEDS FURTHER R&D AND BOUNDED IMPLEMENTATION**

## Trigger and correction of project sequencing
The owner explicitly rejected jumping to order-idempotency/backend engineering before the site's design has been tested again against the original research and award-winning restaurant/brand examples. This is a valid process correction. **Passing 38 screenshot/fixture smoke checks NEVER certified the visual design complete.** Public design is still in development. Keep transaction integrity on the risk register, do not make it the next creative task.

## The actual observed baseline
- Browser artifact: 38 actual PNG captures from [Actions 39169238633](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39169238633). Captures cover 320,390,768,1440 Home; 320,390,768,1440 Menu/Offers/About/Contact/Reviews/Complaints; 390 and 1440 Cart/Order Success/Food Finder.
- Read the original independent HTML benchmark: `docs/rebirth/archive/WEBSITE_EXPERIENCE_HTML_REFERENCE.html`, 36,847 source characters, including distinctive physical editorial story, original photo cuts, menu choice preview, story and gallery. It is a creative-level benchmark, **not** a functional replacement, CSS specification or owner-finalized identity.
- Compare with `01_RESEARCH_MEMORY.md`, `02_CREATIVE_AND_MEDIA_SYSTEM.md`, `05_CREATIVE_PRODUCTION_01.md`, `06_HTML_VISUAL_TRANSLATION_PASS_02.md`, `07_CREATIVE_PASS_03_EDITORIAL_REDUCTION.md`, Pass 04, 05, 06, 07/08, and screenshots.
- Actual screenshot review shows that **Home has photographic authored scenes and accurate material**, whereas Menu/Offers/About/Contact are more generic strongly colored but typographically similar chapters. Reviews and Complaints are clear and appropriately restrained but still share one big type+color pattern.
- The mobile Home **full-page screenshot** previously showed a red empty-looking packaging image area, even though the on-scroll photo decode browser smoke passed. This is an image capture fidelity issue pending independent warm-scroll recapture, not proved to be a user-facing broken image. Do NOT use that false blank to make unsupported layout decisions.
- Current screenshots with dummy Supabase show empty Menu, no Offers, and Food Finder unavailable; cannot claim polished **populated** product catalog, promotion detail, modifier UI or personalized recommendations from empty states.
- Source photo library contains 12 actual 640×640 JPEGs; scaling limits photographic detail. Exact menu-item image mapping remains unverified.
- Fonts/wordmark: Changa/IBM Plex/Anton is a WORKING typographic triad, not an approved unique custom typeface. The textual TUSCANINI. footer/logo is not proof of a final merchant-approved brand mark. The giant BNS illustration/English source-ID labels are provisional editorial devices, not established restaurant iconography.

## Rechecked actual award/reference ledger, separated by role
All below are external benchmark interpretations, NOT a claim these exact mechanisms have been live-device-tested by our team today.

### Award-confirmed, direct food/restaurant DIGITAL benchmark
1. **Tripletta Pizza / Thomas Carré + Treize Grammes**, CSS Design Awards **Website of the Day, 27 Mar 2025**: https://www.cssdesignawards.com/sites/tripletta-pizza/47250/ . Webflow Awards 2025 **Best Animated Experience** recipient: https://webflow.com/webflowconf/2025/webflow-awards-recipient/tripletta-pizza . Studio/developer research: nine restaurants' individual character, scroll interaction, linked logo/motion identity, playful detail. **Transfer** one restaurant-specific expressive graphic identity plus coherent scene-to-scene behavior, not their palette, mascot, 9-city IA, magic scroll or stack (Webflow/GSAP).
2. **Lupo Pizza / la boucle**, CSSDA **WOTD 26 Jul 2023**: https://www.cssdesignawards.com/sites/lupo/43675/ . Illustrated street food type-and-character grammar. **Transfer** typographic *personality* and recognizable graphic handwriting; do NOT copy drawings/red lettering/mascot or claim Tuscanini has a custom illustrated campaign.
3. **CARTAPANI / AWD Agency**, CSSDA **WOTD 6 Mar 2025**: https://cssdesignawards.com/sites/cartapani/47146/ . Photography + illustration + responsive composition, integrated web storytelling. Coffee brand, not fast-ordering UX. **Transfer** cross-media system and type-image pacing, not coffee motifs.
4. **Promeat / Chipsa**, CSSDA **WOTD 2 Aug 2025**: https://cssdesignawards.com/sites/promeat/47856/ . Actual case study https://chipsa.ru/en/publications/pocemu-smesenie-raznyx-idei-daet-krutoi-rezultat-keis-promeat describes editorial core-product stills and custom WebGL/Three.js scroll motion with performance work. **Transfer** material-first meaningful chapter/motion and optimization discipline; not its meat model, photo set, video sequence, scroll-cinema purchase blocker or WebGL for status.
5. **Burrito Madre / General Condition + Futurianz**, CSSDA **Special Kudos 30 Jun 2026**, NOT CSSDA WOTD: https://www.cssdesignawards.com/sites/burrito-madre/49666/ . Color + illustrative world. **Transfer** only award-calibrated coherence lesson. Do not misclassify award levels.

### Supporting identity/physical brand REFERENCES (not mislabeled web awards)
6. **Zooba / &Walsh**: https://andwalsh.com/work/all/zooba/ . True research from Cairo street signs, handpainted Arabic lettering and packaging, applied across media. **Transfer** field observation → graphic grammar; do not falsely make Beni Suef like a generic Cairo postcard or copy their patterns.
7. **Gyros Factory / Sonat.Co**: https://sonat.co/gyros-factory . One sourced identity across staff wear, wraps, stills, film and website. **Transfer** real physical packaging to digital expression. No invented “Tuscanini mythology”, gods or new wrappers.
8. **Monty's / Nicolas Lavrov Studio**: https://www.nicolaslavrov.com/projects/montys . Bold type + packaging + signage + actual sandwich photos. **Transfer** logo/packaging/system coherency; don't copy red/cream itself (a common palette).
9. **Burger King / JKR**: https://www.jkrglobal.com/work/burger-king . Rebrand rooted in real product appetitive shapes and material advertising. **Transfer** product-derived graphic principle, not copy logo/palette.
10. **CAVA / REQ**: https://req.co/case-studies/cava/ ; real omni-channel identity/guest product design, not a design award asserted here. **Transfer** fast transactional clarity across touchpoints and system continuity.
11. **Baymard Food Delivery & Takeout UX 2026**: https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026 . Compare high-frequency flow separately from brand atmosphere. **Transfer** direct menu/product/quantity/edit/cart behavior; don't let “awarded” marketing sites dictate transaction screen layout.
12. **Original Tuscanini source HTML and 12 photo IDs** remain the strongest identity-specific references. No award wins have been claimed for our site.

## Independent side-by-side critique — evidence from actual running screenshots
| Surface | What's authentically working | Unresolved CREATIVE/UX gap | Decision |
|---|---|---|---|
| Home 390/1440 | Distinct black food hero, two REAL restaurant photo planes; yellow ticker, cream category/gallery, touch-based detail, red genuine packaging, local BNS yellow scene. Good purposeful chapter roles. | Repeated giant Changa titles; brand glyph/logo still provisional; 640px upscaling; mobile packaging screenshot fidelity; narrative linkage between physical chapter and source marks could be stronger. | **REVISE** media capture + identity detail; don't restore cut redundant chapters. |
| Menu | Source-back category photo pair and direct search link. | Populated product list not reviewed; old empty-state screenshot dominates; photos explicitly NOT bound to catalog. Need inspect loaded modifiers, Arabic numbers & category flow with real-backed fixture. | **INCOMPLETE**, not visual-closed. |
| Offers | Red brand scene, visible restaurant image; live-only campaign logic. | Only source-failure state visually tested, no true valid active offer card/detail, offer conditions, countdown or badged marketing truth. | **INCOMPLETE** pending approved live campaign sample/fixture. |
| Food Finder | Ethical fail-closed menu requirement, clear discovery task. | **Severe:** another oversized black hero + enormous cream blank-state title; repeats Cart's scale and visually overwhelms actual 3-step function. Current “LIVE MENU NEEDED” reads like internal QA note. Loaded options/results unreviewed. | **REOPEN / highest public design gap.** |
| About | Human food/photo-to-packaging progression; verified visual context, duplicate app shell fixed. | Resembles Home collage too much; true brand graphic and founder/place documentation absent, cannot fill those with fiction. | **REVISE** modestly with source-led typography/physical detail. |
| Contact | Effective yellow/black address placard and direct phones; honest unknown map/hours. | Big headline becomes yet another hero treatment; this is a contact utility, not a new brand billboard. | **BOUNDED REDUCTION** on repeat visitors and narrow phones, not new animations. |
| Reviews | Honest WhatsApp prompt, no faked review stars or testimonial card. | Red billboard + giant text, mostly conceptual; lacks proof of review submissions/states; do not invent social quotes. | **REVISE** compact expression if necessary; keep no fake content. |
| Complaints | Operational high-contrast form, input feedback and draft-to-WhatsApp verified. | Giant heading before actual form on phone; valid quote/section semantics; doesn't save a backend ticket. | **BOUNDED REDUCTION** of time-to-form if browser evidence warrants. |
| Cart / Checkout | Truthful no-order state, preserves accessible order structure and backend failure semantics. | Empty screenshot only; large black billboard before cart is too much for repeat buyer; never judged populated modifier/edit/payment states in visual pass. | **INCOMPLETE**, transaction visual gate needed before production. |
| Tracking | Truthful no-reference state, doesn't pretend confirmation. | Missing actual confirmed/preparing/ready *visual review* and false-precision status risk, giant hero where immediate status should dominate. | **INCOMPLETE**, functional status visual gate. |
| Admin/Kitchen | Existing contracts kept separate. | NOT included in the public 38-screenshot comparison; operator density and role states not art-direction-reviewed. | **NOT REVIEWED**, don't declare whole product complete. |

## Visual severity, strongest return on next work
P0 / baseline fidelity: **accurate images in screenshots**; capture with scroll + decode, then personally inspect 320/390/768/1440; do not assert photo quality from screenshots that skipped a lazy image. This is being implemented as `scripts/qa/rebirth-visual-capture.mjs`.
P1 / creative originality: extract a **true Tuscanini graphic fingerprint** from its packaging, photos and owner-confirmed brand source, document real shapes/lettering/labels. Need an authorized source-quality logo before inventing a logo. Build one tested, constrained identity experiment (not three complete redesigns).
P2 / anti-repetition: reduce Home/Menu/Offers/About/Finder/Checkout all repeating oversized `h1` + colored slab. Different roles need different composition grammar, not simply theme-color variation. Favor Food Finder and repeat-order/cart as first cases.
P3 / functional visual states: create screenshot fixtures for **populated** verified menu/offer/food-finder and checkout/cart/order status with truthfully marked test/fixture data. Screenshot green for unavailable is not a catalog design review.
P4 / useful signature motion: benchmark Tripletta/Lupo motion design as a **system**; test one reversible crop/handoff or category transition grounded in actual user comprehension. No arbitrary full-site scroll hijack, no GSAP/Three.js merely to claim award-tier engineering.
P5 / typography/logotype and mobile: stress test Arabic Changa display on 320/390 with actual long names, mixed Arabic/English, variable lengths, 200% zoom; inspect contrast, crop, focus and menu navigation.
P6 / whole-site QA: direct customer task + editorial exploration; compare reference role by role rather than screenshot mimicry; one integrated owner-preview decision before any production merge.

## Stop condition / how to declare closure
**Not now.** A final public-art-direction gate requires: truthful populated states, role-specific distinctive composition, verified restaurant-source brand grammar, screen-for-screen mobile and desktop comparison, useful motion proof where it adds meaning, image decode/photo quality and contrast/perf inspection. Production/admin/integrity remain necessary separate gates but do not substitute for creative closure.

## Measured Pass 10 / actual implementation from this re-benchmark
**Target:** Food Finder's duplicate Cart-scale giant black hero and a second disproportionately large unavailable-menu headline. Role = choice tool, not theatrical billboard or developer error dump.

Actual edits:
- `components/rebirth/rebirth-food-finder.tsx`: new direct question “تختار إزاي؟”; concise current-menu contract; fail-closed unavailable state with smaller heading and BOTH actions (/menu and /contact); removes English developer label “LIVE MENU NEEDED”.
- `app/rebirth-finder.css`: more compact hero on phones and desktop, two-column functional unavailable state on desktop, single-column on narrow widths. It remains in Tuscanini's established color/type system but no longer duplicates Cart's chapter scale.
- `scripts/qa/rebirth-interaction-check.mjs`: all four widths now assert distinct user task, bounded first scene, honest unavailable state, no horizontal overflow and links.
- Code check: https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39171657557 — **SUCCESS** on Next/TS build, warmed-scroll 38 screenshot artifact and Chromium interaction suite **zero failures**.

Actual 390px full-page visual comparison (not a simulation):
- **BEFORE:** 1413 pixels high
- **AFTER:** 1126 pixels high, a reduction of 287px (~20.3%).
- 1440px: 1642px → 1195px (-447px, ~27.2%).
- First hero browser geometry: **320px:385px; 390px:369px; 768px:308px; 1440px:459px**.
- At 320,390,768,1440 both fallback actions and no overflow passed. This is only a **bounded design fix**, NOT evidence of the populated 3-question results lane, which still needs truthful live-data/fixture QA.

## Screenshot pipeline integrity fix
The old Playwright CLI --full-page captures did not necessarily scroll through lazy media before painting. The 390px mobile Home screenshot therefore falsely displayed a huge blank red packaging area although its authenticated restaurant image decoded during the on-scroll interaction smoke.
We introduced `scripts/qa/rebirth-visual-capture.mjs`: it visits every scroll offset, waits for fonts and images to decode, fails on broken main images, then captures a stable full-page baseline with animations disabled. The new green capture in run #39171155536 shows the authentic TSC-08 packaging photograph correctly on mobile, at the SAME 5694px document height; the previous alleged image omission was a **capture artifact**, not proof of broken production UX.
This is evidence of why screenshots and audits must be reviewed adversarially, not just generated.

**Creative closure remains OPEN.** The remaining major design gates are real brand graphic fingerprint (source-confirmed), populated menu/offer and choice states, purposeful motion and product-style connected page choreography, Arabic 320/390 refinements and coherent full-site QA. Do NOT pivot to order idempotency as the next creative milestone.
