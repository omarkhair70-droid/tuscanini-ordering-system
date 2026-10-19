# TUSCANINI REBIRTH / PASS 18 — PHOTOGRAPHIC REPRESENTATION AND REAL ITEM-TO-SHEET MOTION
Date: 19 Oct 2026 | PR #59 Draft | no merge / production deployment

## Owner decision: photos will NOT have to come from the restaurant
The owner explicitly accepts external or generated illustrative photos for the 113 previously priced menu products. Do not block creative work waiting for the merchant. **BUT do not claim a stock illustration is a photographed/verified named Tuscanini product.** Menu data/price/size/addons remain exactly the previous restaurant catalog; order acceptance still requires current server validation and store-open state.

## Three independent provenance lanes
- **restaurant-original/context**: existing 12 authentic restaurant photo source files `TSC-01..TSC-12`, used in hero/family editorial scenes. No exact SKU match asserted.
- **representative-stock**: commercially reusable licensed food photographs depicting the general dish family, with explicit "صورة توضيحية" visible on every thumbnail, category/subject taxonomy and photographer/source link inside product sheet. **Not** a depiction of the specific ordered dish; colors/toppings/packaging and quantity can differ. Not evidence of actual ingredients/allergens.
- **exact-approved-product-photo**: owner reviewed file and exact catalog SKU ID, `verifiedMenuPhotos` dictionary. Currently **0/113**. This lane, when available, overrides representative stock or graphic fallback.
- **original graphic**: unique printed visual for each SKU, also remains available as opt-in "عرض الرسومات" and reliable onError/offline fallback.
- **generated illustration**: candidate future lane only. This pass does not secretly mislabel external stock as generated or as a photograph from Tuscanini.

## Sources / commercially usable stock
Pexels says commercial website usage is allowed: https://help.pexels.com/hc/en-us/articles/360042295214-Can-I-use-the-photos-and-videos-for-a-commercial-project . Avoid insinuating photographers or depicted people endorse Tuscanini. All source links and photographers are in `lib/rebirth/representative-menu-photos.ts`; the CDN is external so URLs might fail and the original graphic must remain a fallback. Source photo URLs use Pexels asset IDs and their documented pages. Photography used as an illustrative family reference, *not an updated product photo release*. The source set spans crepe savory, sweet crepe, pizza, pasta, sandwich, waffle, sides and drinks. Modifiers/crepe addons do not receive a fake meal photo.

## Motion reference review / technique decision
- MDN same-document View Transitions API: https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition . Broad availability but the DOM snapshot system freezes interactions during the animation and same-document transitions apply document-wide; using it directly with imperative native `<dialog>.showModal()` in an asynchronous React effect produces timing/focus edge cases.
- Motion for React's original doc comparing `layoutId` shared-element to native API: https://motion.dev/docs/react-layout-animations . A library-based layout is good for larger grids and modal interpolation, but adds a dependency and requires careful dialog portal/scroll behavior.
- Codrops original same-element/F.L.I.P tutorial: https://tympanus.net/codrops/2022/09/19/menu-to-grid-layout-animation/ ; updated product-grid preview https://tympanus.net/codrops/2025/05/27/animated-product-grid-preview-with-gsap-clip-path/ . These are learning references, not animation source code or assets copied from winners.
- **Chosen bounded implementation:** native DOM measured FLIP using Web Animations. On customer click, record actual thumbnail rect; open real accessible native modal; clone the current food image/graphic into top layer; animate from recorded rect to the exact target artwork's rect in 390ms via transform; restore original and remove cloned node. Does NOT block quantity/addons/checkout; respects `prefers-reduced-motion`; no GSAP/Three.js; no fake product-shape morph required.
- Functional/a11y order: real `<dialog>` remains authoritative. Focus/trap, ESC and onClose use its original lifecycle; FLIP clone has `aria-hidden=true` and no pointer events. Reduced-motion older browsers get instantaneous normal modal, same exact product and previous prices.

## Actual code changed / tested in the branch
- `lib/rebirth/representative-menu-photos.ts`: 14 external source-known illustrative photo references across 8 food families, deterministic assignment by SKU ID, with explicit status. `crepe-addons` intentionally stays illustration-only.
- `components/rebirth/product-artwork.tsx`: verified exact image precedence, then representative photo if selected, else original 113 printed SKU artwork; external image onError falls back to local graphic, no broken black area.
- `components/rebirth/rebirth-menu.tsx`: 3 genuine modes with clear UI: default **"صور الأكل"**, **"المنيو السريع"**, and **"عرض الرسومات"**; all preserve 113 original products, family filters, name search, original prices/sizes/addons, 20-record incremental display. Each image itself is a button to select that same exact SKU.
- `components/rebirth/rebirth-product-dialog.tsx`: original product’s representative photo or authored printed art stays recognizable when expanding into product sheet; photographed stock credit links to original Pexels photo page. Named dish is not misrepresented as the stock photo's ingredients.
- `app/rebirth-product-art.css`: tactile food-photo cards on desktop/mobile, compact quick-order rows and standalone original art gallery, 320 to 1440 responsive. Visible "صورة توضيحية" label. Scoped reduced-motion.
- `scripts/qa/rebirth-interaction-check.mjs`: three reversible modes, current item provenance note, original 113 graphics in art mode, real size/addon/cart checks unchanged, 320/390/768/1440 no overflow.
- `scripts/qa/rebirth-populated-menu-visuals.mjs`: real browser screenshots of default family-photo mode and source credit, gallery and actual product sheet.
- `scripts/qa/rebirth-motion-film.mjs`: optional-movement real browser video at 390 and 1440, with required `data-motion-technique=dom-flip` `data-motion-finished=true` checks. ZERO actual restaurant order POST.
- The original photo audit still reports **0/113 exact verified restaurant item photos**; this is EXPECTED, not a blocker for owner-approved illustrative photography.

## Open physical production gaps / no false closure
1. Cross-origin external Pexels assets must be monitored; eventual local optimized derivative/asset registry for production performance would be better. Strong source licensing/provenance review before publishing.
2. 14 licensed illustrative photographs are reused across menu family entries. They are NOT 113 bespoke photographs, and 113 custom graphics remain original design elements. Do not say every dish now has a unique photographed image.
3. Source-specific matching and real dish photography, if/when possible, replaces stock one item at a time. Avoid faking toppings, allergen availability, recipes or discounts from stock imagery.
4. Evaluate FLIP opening + closing/reverse and competing View Transition/GSAP prototypes on actual weak Android devices; don't promise 60fps without performance traces.
5. Owner-acceptance of images/feel/transition required; GitHub CI screenshots are engineering/visual evidence, not merchant signature.
6. Production payment/order DB remains unverified; draft PR must not be deployed or merged while creative and transactional gates remain open.

## Proof
- **Actual green browser and video proof:** [GitHub Actions #39183385454](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39183385454) completed **SUCCESS** with 0 browser interaction fixture failures. Production TypeScript/Next build, 12 original restaurant source-photo gate, 390/1440 actual illustration and representative photo screenshots, product credit panel, and two real Chromium WebM interaction films passed.
- Motion film explicitly required the clicked representative photo to complete **DOM FLIP** and checked `data-motion-technique=dom-flip` and `data-motion-finished=true` in actual headless Chromium at 390px and 1440px. No restaurant order POST was performed.
- In the 390px screenshot **food photo visibly loaded from Pexels** in the named SKU card and sheet, tagged "صورة توضيحية"; the product sheet linked the photographer and source, kept unchanged old menu size-price tiers (40,60,75 in the sampled crepe entry).
- An initial Pexels photo study had too much white plate vs food; replaced with a closer source-backed meat-filled crepe. Subsequent fixes use canonical original Pexels page slugs for direct attribution and smaller 640px CDN transforms. These *later* media edits require a separate visual run; do not claim this document's first green run certifies every later SHA.
- Responsive original-art gallery and price-first menu remain accessible as alternates. 113/113 exact restaurant photographs are **still missing**; there are currently fourteen curated illustrative stock source IDs, reused across family members.

### Final image-source/reduced-motion follow-up QA
- [GitHub Actions #39184027447](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39184027447) — **COMPLETED SUCCESS / 0 interaction test failures** after replacing over-empty plated-food stock, canonicalizing Pexels source page links, and reducing CDN requested image dimensions to 640px.
- Both real mobile and desktop Chromium videos show the **390ms DOM-FLIP into the native modal** and crediting of the Pexels exemplar. Reduced-motion **320/390/768/1440** tests explicitly assert that no FLIP overlay is created; food item, size, addons and cart are still fully functional.
- Latest phone screenshot proves more appetitive close-up meat-filled crepe reference (Valeria Boltneva), with a visible **صورة توضيحية** overlay and matching item sheet photographer credit. Illustration view retains one original typographic print composition for each of 113 items.
- **Do not confuse this with exact product photography**: fourteen commercial-use Pexels EXEMPLAR source IDs reused by food family, zero verified named Tuscanini SKU photographs.
