# TUSCANINI — VISUAL CONSTITUTION V01
**Status:** PROVISIONAL ART-DIRECTION RULES / NOT FINAL BRAND DESIGN  
**Date:** 18 October 2026  
**Project:** Tuscanini (سور نادي توليب، بني سويف), restart as a newly authored experience.

## 0 — Executive decision
Design against **authentic available image evidence**, not imagined photo shoots. All **12 provided images measure 640×640 px**; their JPEGs range approximately **62–125 KB**. No image is a full-resolution photography master. Use varied editorial compositions that preserve meaning at low/moderate display sizes. An AI upscale is NOT equivalent to recovering original information and cannot authorize adding food that was never in the image.

Legacy `tuscanini-ordering-system` is historical record, not a visual template. No old hero, navigation, palette, typography or cards are inherited by default.

## 1 — Constitution / rules

**G01 — Truth is first:** no new toppings, artificial cheese strings, new portion sizes, fake steam or altered recipe. Crops and masking should not misrepresent real serving size. Any enhanced image must be compared against its source.

**G02 — Density has rhythm:** alternate dense food detail with typographic calm. Avoid filling every module with cross-sections and sauce at equal scale.

**G03 — Image scale follows source quality:** prefer one honest readable product photo at a restrained size rather than artificially stretching a 640px JPEG across a high-density large monitor. Rule of thumb: uncut 640 source supports ~320 CSS px at 2x resolution; after cropping, effective max size decreases proportionally. These are guidance, not a hard cap for an intentional low-fidelity artwork.

**G04 — Multiple photographic grammars:** whole-food shots, cut interior, human-held scale, packaged context, group abundance and overhead category image each get different compositional roles. Avoid pretending every dish must be cut apart.

**G05 — Typography carries meaning:** the image library is too limited to decorate every surface. Build visual hierarchy from bilingual Arabic/Latin typography, rhythm, caption placement and intentional whitespace. Use readable Arabic for actual names/prices; experimental display treatment only for editorial moments.

**G06 — Function does not inherit the campaign:** always direct access to exact menu/product and valid offers; cart/status use explicit language. Editorial motion is optional, never a checkout gate.

**G07 — One world, different jobs:** brand opening can be expressive; menu explains real food; offer must disclose details; payment/status must be calm and literal. No same photo-mask on six sections.

**G08 — Source is part of asset:** every image gets a stable ID, origin, date if known, rights confirmation, food identity status, quality, treatment history, and usage role. Never infer recipe from visible fillings alone.

## 2 — Evidence and image limitations
- Exactly 12 attached JPEGs were inspected; **all 640×640**.
- Many are compressed, oversharpened/saturated, with challenging separating edges (hands, gloves, layered crepes).
- Photos show crepe cross-sections, pizza top/boxed, sandwiches with packaging, staff-held portions and loaded cheese/sauce.
- We lack matched front/back of same dish, verified current product names/ingredients, original master photographs, resolution beyond 640px, and full set of all menu categories.
- Existing Facebook copy «ملوك الكريب في بني سويف» is public positioning, not proof of orders or quality.
- No visual design direction in this document claims restaurant approval.

## 3 — Twelve-image mapping, numbering matches user submission order

| ID | Content | Priority | Working use | Treatment |
|---|---|---|---|---|
| TSC-01 | شعار المحل + كريب متراكم | Medium | Brand context | Context crop |
| TSC-02 | كريب فردي محمول | High | Single cutaway | Selective isolation |
| TSC-03 | بيتزا داخل العلبة | Medium | Pizza / packaging | Keep context |
| TSC-04 | كريب فردي بحشوة لحوم | High | Single cutaway | Selective isolation |
| TSC-05 | مجموعة كريبات | Medium | Variety | Editorial crop |
| TSC-06 | مجموعة كريبات مع موظف | Medium | Human scale / variety | Keep staff context |
| TSC-07 | ثلاثة كريبات مكدّسة | High | Inside layers | Editorial crop |
| TSC-08 | ساندوتشات وتغليف أحمر | High | Sandwich / packaging | Keep context |
| TSC-09 | ثلاثة كريبات بقرب الكاميرا | High | Hero / macro layers | Controlled crop |
| TSC-10 | بيتزا من أعلى | High | Pizza top view | Whole disc crop |
| TSC-11 | وجبة محملة بصوص أصفر | Medium | Texture / other food | Keep context |
| TSC-12 | مجموعة كريبات ممسوكة باليد | High | Abundance / multi product | Tight product crop |

**Anchor set (7)**: TSC-01 (brand/mood), TSC-02 (single cut), TSC-04 (single cut), TSC-07 (layer detail), TSC-08 (packaging/sandwich), TSC-09 (dense hero crop), TSC-10 (pizza overhead).  
**Support**: TSC-03, 05, 06, 11, 12. No visual production priority equals best seller. Product identification is pending current verified menu.

## 4 — Image treatment and output naming pipeline

1. Keep originals unchanged: `assets/raw/TSC-01.jpg` etc., plus source filename crosswalk and attribution record.
2. `corrections/`: light technical exposure/white-balance adjustments only where justified; never invent food details. Preserve a before-after contact sheet.
3. `isolated/`: silhouette segmentation only on candidates TSC-02 / TSC-04, review layering, glove intersections, real interior boundaries at 200% scale; omit extraction if edges fail.
4. `editorial/`: source-faithful crops using composition and accessible alternate descriptions. Avoid deep zoom on tiny JPEGs.
5. `web/`: optimized responsive derivatives, AVIF/WebP after testing; retain correct `srcset`/sizes, intrinsic dimensions, fallback and original.
6. `manifest.json`: id, source filename, source URL (if known), width/height, allowed surfaces, product identification status, processing steps, permissions, created output filenames.

No 4x or 8x AI enhancement should be labeled “original” or silently replace factual product evidence. For composition samples, using larger textures or type around moderate-size source photos is preferable to fictitious detail synthesis.

## 5 — Draft visual grammar (NOT locked brand palette or font names)

**Image density:** hero/source proof concentrated into 1-2 major image moments; later sections vary between macro, context, ingredient description, offers and list readability.

**Color:** existing red/black/yellow are observed in the physical marks/packaging, but we are not obligated to inherit them. First exploration uses *neutral framing* as a diagnostic contrast; final colors need visual research and brand confirmation. Do not promote demo values to official design tokens.

**Composition:** test (a) one centered documentary product, (b) one off-grid/editorial arrangement where food occupies a bounded zone, (c) one sparse/text-led utilities view. Avoid repeating same card/overlay/alternating background rhythm across lanes.

**Typography:** test three *roles* before choosing families: Arabic/Latin display (personality), item names/informational headings (legibility), technical/order/status numerals (precision). Inspect pairs at mobile 360–390 px, 200% zoom, mixed Arabic+English, actual EGP price, long item names and focus states. Candidates only: Arabic Noto Sans Arabic / IBM Plex Sans Arabic / Alexandria; Latin Manrope / Instrument Serif for appropriate roles. Their selection is not approved here.

**Navigation principles:** first-experience/editorial exploration ≠ quick menu route. Offer direct menu + exact-item search/return entry on all devices. No animation should conceal cart, price, delivery or confirmation. Specific site IA and navigation component shapes are not locked.

**Motion:** prototype only voluntary content reveals where comparison improves comprehension. Reduced-motion and static alternatives compulsory. No WebGL, Three.js, GSAP, Lenis or PixiJS “by default”. Choose after a test demonstrates function.

## 6 — Production gate before UI design

**Gate A — Proof:** can an unretouched real photo tell the product truth, and is its item identity confirmed?  
**Gate B — Quality:** does the selected scale/crop hold on desktop/mobile without unacceptable pixelation?  
**Gate C — Differentiation:** does the layout still feel specific with brand name hidden? If generic, revisit actual restaurant evidence.  
**Gate D — Access:** instant product/offer route and correct info with animation off.  
**Gate E — Reuse:** can the system handle both pizza and crepe without forcing a cross-section gimmick?  
**Gate F — Anti-repetition:** at least three distinct section grammars emerge from the same rules.

## 7 — Next execution deliverable

**Reference Recheck → Typography & Composition Laboratory** (not a full home page yet):
- Run 3 composition tests with TSC-02, TSC-09 and TSC-10 at known effective dimensions.
- Compare 2–3 Arabic/Latin typography pairings across name, price, ingredients, campaign line and footer.
- Test desktop / 390px mobile and print contact sheets with both context-preserving images and attempted isolated silhouettes.
- Resolve image rights/current menu/owner-mark status before shipping to production.
- Choose a *candidate* design direction based on these results, then build a targeted interactive prototype and capture desktop/mobile screenshot evidence.

**Preserved unchanged:** original Tuscanini repository/deployment. No final logo, design language, IA, typography, navigation, or technical stack approved.