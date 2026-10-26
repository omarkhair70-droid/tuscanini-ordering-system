# TUSCANINI / HOME 01 — implementation and review gate
Date: 2026-10-18
Branch: `redesign/tuscanini-authored-experience-20261018`
Status: **OPEN / NOT YET VISUALLY CLOSED**

## Project rule

This is the production Next.js repository, not the separate HTML exploratory file.
The original application remains unchanged on main. Work proceeds screen-by-screen on this branch / draft PR.
The Home route is the first lane; menu, cart, order tracking, staff/admin and other routes keep their previous functionality.
We DO NOT merge while a lane has incomplete asset/media integration, browser review, interaction review or baseline build failures.

## Home 01 shipped in branch (implementation, pending QA)

- Real Next.js App Router Home route, route-scoped CSS, isolated new shell.
- New brand header with desktop anchors and accessible mobile details navigation.
- Distinct compositional chapters: arrival, food-family discovery, editorial detail, direct ordering, offers and location.
- Genuine navigation links to real existing `/menu`, `/offers`, `/food-finder`, `/about`, `/contact`, `/cart`.
- Food family deep links using existing category slugs from repo (not fabricated availability).
- Active-order banner retained from the established system; the new Home is not a fake checkout.
- Mobile sticky ordering access; keyboard focus rules; reduced-motion fallback and route-isolated styles.
- No invented menu prices, discounts, recipe facts or order state.

## Photo-source pipeline — REQUIRED BEFORE HOME CLOSURE

User supplied exactly twelve original 640×640 Facebook-downloaded JPEG photographs in this conversation. They are available in the conversation working container, **not yet committed to GitHub**.

Use real user-provided source files and convert them without introducing fake ingredients. These expected file destinations are referenced by CSS as progressive photo surfaces, with color fallback if not yet present:

| Intended repository path | Original filename | Visual role |
|---|---|---|
| `public/images/rebirth/food-01.webp` | `782208451_122125102508813154_3012964228322686674_n.jpg` | Hero food + brand wall |
| `public/images/rebirth/food-02.webp` | `807858902_122127740210813154_7264629719392698387_n.jpg` | Cut-open crepe detail |
| `public/images/rebirth/food-03.webp` | `784197571_122125571198813154_1637167208819104149_n.jpg` | Pizza in branded packaging |
| `public/images/rebirth/food-04.webp` | `812535501_122128267022813154_6789820019884523052_n.jpg` | Single crepe / alternate |
| `public/images/rebirth/food-05.webp` | `808441146_122129677868813154_6728074287811253701_n.jpg` | Crepe assortment |
| `public/images/rebirth/food-06.webp` | `825328265_122130038708813154_1462278202442388874_n.jpg` | Crepe group human scale |
| `public/images/rebirth/food-07.webp` | `825286535_122131450682813154_8860430949979013186_n.jpg` | Cutaway detail stack |
| `public/images/rebirth/food-08.webp` | `833873500_122131785872813154_7378712455740153250_n.jpg` | Sandwich / real packaging |
| `public/images/rebirth/food-09.webp` | `839651250_122132141966813154_3935688610852167747_n.jpg` | Crepe group macro |
| `public/images/rebirth/food-10.webp` | `841229327_122132807210813154_8422595721934789532_n.jpg` | Pizza category top view |
| `public/images/rebirth/food-11.webp` | `849075737_122133129620813154_7687456626755428731_n.jpg` | Loaded dish / sauces |
| `public/images/rebirth/food-12.webp` | `853153311_122133477818813154_2342043302948759856_n.jpg` | Crepe group / brand |
  
All photographed food must stay authentic; segmentation/color treatment must not invent or enlarge fillings.
Raw 640px assets should never be stretched to full desktop width without graphic framing/cropping.

## HOME 01 visual closure requirements

- [ ] All actual food assets committed at the mapped paths, with responsive WebP optimization
- [ ] Screenshot inspection at 1440px, 1024px, 768px, 390px and 320px viewport widths
- [ ] Image quality: real food clearly visible; no excessive upscale or exposed bad cutout edge
- [ ] Header and links: functional keyboard + touch; details menu closes/goes away appropriately
- [ ] No horizontal overflow on mobile; long Arabic and Latin text doesn't collide
- [ ] Contrast and focus ring inspection, heading semantics and alt strategy for informative photography
- [ ] Reduced-motion, slow-network and fallback behavior
- [ ] Real routes and category deep links checked end-to-end
- [ ] Active-order banner appears only when there is an active order and remains accurate
- [ ] TypeScript and Next.js build CI green; no SEO/metadata regressions
- [ ] Explicit visual review and final approval before moving on

## Route lanes queued after Home

1. Menu & discovery (live data; category, filtering, exact-name lookup)
2. Product detail / customization
3. Cart / checkout
4. Offers / campaign deep links
5. Confirmation / tracking / order state
6. Contact, story, reviews, accessibility, admin shell and cross-site polish.

No lane is marked CLOSED only because JSX was committed.

## Reference anchor

- Home evidence from actual Tuscanini photos and user-confirmed restaurant.
- Tripletta / Treize Grammes — identity and atmosphere, not copied composition.
- Promeat / Chipsa — media technique driven by product thesis, not obligatory WebGL.
- Zooba / &Walsh — authentic field research and differentiated Arabic brand writing.
- Baymard 2026 food delivery UX research — protect direct ordering and truthful fulfillment.
- HILTECH / Omar Khair portfolio — process, separate compositional roles, visual QA closure.

**Next action:** upload source-backed WebPs to the branch, run browser QA against the actual branch preview, fix visual issues, then decide Home 01 closure. Do not merge draft PR until those gates pass.
