# TUSCANINI — WEBSITE EXPERIENCE / V01
**Date:** 18 October 2026  
**State:** Functional creative prototype; not an approved brand identity, transactional release, or deployed website.

## Purpose
Build the first integrated website composition from the project's evidence and the 12 true restaurant photographs. The historical Tuscanini site is an archive/possible operations reference and has not been edited. Visual prototype explores the working idea **INSIDE / OUT**, without treating it as the restaurant's official tagline or overriding the actual brand.

## Design / reference synthesis

| Reference | Verified fact | Principle carried forward | Don't copy |
|---|---|---|---|
| [Tripletta Pizza](https://www.cssdesignawards.com/sites/tripletta-pizza/47250/) / [Webflow Awards](https://webflow.com/webflowconf/2025/webflow-awards-recipient/tripletta-pizza) | CSSDA WOTD 2025 (8.33). Finalist for Webflow's 2025 Best Animated Experience. | A restaurant's digital world is informed by its place, local character and memorable moments. | Branch mascots, hidden surprises, green palette, scroll sequences. |
| [Lupo](https://www.cssdesignawards.com/sites/lupo/43675/) | CSSDA WOTD 2023 (8.28), design tags illustrated / animated / typographic. | Strong typography and a confident graphic world can coexist with food imagery. | Lupo's illustrated visual identity, exact layout. |
| [Promeat / Chipsa](https://chipsa.design/publications/pocemu-smesenie-raznyx-idei-daet-krutoi-rezultat-keis-promeat) | Studio discusses magazine metaphor, Three.js/WebGL development and model optimization. | Pick an authored principle from the material, then engineer its movement. | Editorial magazine metaphor or heavy WebGL for spectacle. |
| [Nielsen Norman Group](https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/) | Mobile discoverability suffers if the main route is only hidden in a small menu. | Visible, direct menu call-to-action on header and mobile sticky bar. | Arbitrary bottom tab bar or hamburger-only ordering. |
| [Baymard, Food Takeout 2026](https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026) | Research finds major commerce usability gaps in mainstream food apps. | Separate food-world discovery from exact item search/selection and trustworthy order states. | Assuming the best animated restaurant site is the best checkout. |

## First integrated visual grammar
- **Creative engine (provisional):** Inside / Out. Exterior shape → real details within, without hiding important pricing, ingredients, or order status.
- **Hero:** extremely large Arabic statement; true restaurant photographic evidence in one bounded diagonal visual; no fake 3D cut-out.
- **Sequence:** expressive intro → honest physical food proof → category-specific discovery → body, staff, packaging → documentary photo gallery → real location.
- **Anti-repetition:** proof in simple image + typographic block; discovery uses category state; context uses full image; gallery uses documentary archive rather than another repeated cutaway hero.
- **Food truths:** every used image comes from one of the 12 owner-provided 640 × 640 screenshots/photos. No invented ingredients or inflated portion imagery.
- **Color experiments (NOT official brand colors):** Ink `#171511`, paper `#FFF8E8`, cream `#F4E9D4`, Chili `#D92E24`, corn `#F5CD4E`. Chosen as an experimental composition vocabulary aligned to visible food and red packaging, not copied as mandatory legacy branding.

## Typography choices and roles (candidate)

| Role | Typeface | Use | Important constraint |
|---|---|---|---|
| Arabic campaign/display | **Changa 800** | Hero, section headings, oversized native Arabic | Verify long names, mobile line breaks, licensing and load behavior before shipping. |
| Arabic product/order UI | **IBM Plex Sans Arabic** | Description, controls, search and future checkout | Keep factual information fully readable; no eccentric condensed type in prices. |
| Latin markers and chapter numerals | **Anton** | Vertical markers, index/numbering and footer wordmark (not logo replacement) | Never let English display type replace readable Arabic user tasks. |

Fonts are requested from Google Fonts in prototype; fallback fonts are included. Font files are not bundled.

## Navigation architecture

### Desktop
- Persistent semantic header: logo/type, `الرئيسية`, `اكتشف الأكل`, `من جوّه`, `الصور`, `المكان`, **المنيو** direct CTA.
- Main menu opens a functional side panel with working item search and type filters.
- Real-photo gallery is a separate overlay, not an ecommerce product-detail fiction.

### Mobile
- Simplified sticky header: brand + visible **المنيو** action.
- Fixed action at bottom to get directly to menu without scrolling through art direction.
- Discover category switcher remains accessible with horizontal scroll; same informational hierarchy.
- Work to do in Next integration: focus trapping in dialogs, virtual keyboard and safe-area QA, long-menu lists, cart entry access.

### Exact menu and commerce boundary
The source catalog is **historical and unverified**. Prototype shows **clearly labeled sample items**, with category search/filter and **save a trial selection**. This is **not an order**. No actual prices, availability, promotion eligibility, checkout, payment, or fulfillment status are invented.

## Interaction and motion
- Working: category-tabs update image and text; menu side-sheet opens; search and filter list; save/unsave named sample items; photo gallery modal; Escape close; smooth anchor scroll.
- CSS-only hover + carousel ribbon for exploration; honors `prefers-reduced-motion`.
- No WebGL, PixiJS, Three.js or third-party timeline in this prototype. Current animation doesn't demonstrate a specific need for them.
- Potential production stack after visual sign-off: Next.js App Router, React, TypeScript, CSS design tokens, next/image, **GSAP / ScrollTrigger** for one or two meaningful editorial interactions, Supabase when reconciled with verified live data. Consider Rive only if a real interactive motion use case survives review.

## Asset system
- `assets/TSC-01.jpg` … `TSC-12.jpg` are byte-for-byte copies of the user-uploaded originals.
- `assets/TSC-01.webp` … `TSC-12.webp` are ordinary non-generative compressed versions for prototype page load.
- The **single-file preview** embeds actual JPEG files as data URIs and is therefore larger than a production Next.js page; use the **folder ZIP** for structured sources, lazy loading, and later responsive treatment.
- Images are not yet assigned to specific menu product names (we lack photographic product-to-recipe confirmation). Category pictures only.

## QA status / honesty

**Completed static verification:**
- Inline JS syntax checked using `node --check`.
- HTML parsed; no leftover asset placeholders.
- 12 referenced webp images exist in source directory.
- Hero and gallery descriptions contain real image text alternatives.

**Blocked browser testing:** Runtime Chromium is managed with a policy disallowing navigation to local URLs, so this run could not honestly claim desktop/mobile browser-render QA or successful clicks. Manual client preview and a proper unrestricted browser QA run remain before design lock.

**Pending before production:** actual restaurant-approved brand mark; verified menu, names, ingredients, prices, sizes/offer conditions; rights for public reuse of images; accurate ordering-backend integration; cross-browser and responsive screenshots; keyboard focus trapping; slow-phone performance and image loading; transactional QA.

## Deliverables
1. `TUSCANINI_WEBSITE_EXPERIENCE_V01.html` — independent, embedded-image prototype, open in Chrome.
2. `TUSCANINI_WEBSITE_EXPERIENCE_V01_SOURCE.zip` — structured `index.html`, 12 master photos and optimized variants, and this document.
3. Independent original Tuscanini repository **not changed, not deployed**.

## Next execution after review
Revise the visual composition **as a whole site** rather than separate isolated components; settle provisional typography and navigation after actual visual screenshot review. Next build in a new branch/app, implement real route structure and motion primitives, map live validated menu data and admin contracts only after restaurant content confirmation.