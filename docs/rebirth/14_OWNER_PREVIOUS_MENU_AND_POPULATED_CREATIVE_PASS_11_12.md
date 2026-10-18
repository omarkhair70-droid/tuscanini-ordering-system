# TUSCANINI REBIRTH / PASSES 11–12 — PREVIOUS MENU / REAL CATALOG ART DIRECTION

Date: 19 Oct 2026 · Active branch `redesign/tuscanini-authored-experience-20261018` · Draft PR #59, **NO MERGE / NO PRODUCTION DEPLOY**

## Exact user decision (overrides earlier provisional “hide legacy prices”)
The builder explicitly directed us to **keep Tuscanini's previous menu, with the same previous prices, until a new menu exists**. This changes the public creative/commerce preview baseline. The earlier decision to show a blank Menu / unavailable Food Finder if live Supabase was unreachable was made before this instruction and **must not override it**.

Do not reinterpret this as permission to invent updated prices, ingredient claims, availability, menu product imagery, promotions, operating hours, or restaurant-confirmed order acceptance. Preserve the old menu's exact price values and modifiers.

## Source and data path
- Original existing repository `lib/mock-data.ts` is the unmodified source of the legacy restaurant menu: **16 categories, 113 products**, actual recorded size prices and add-ons. That filename is historical; its price values are deliberately reused by explicit owner direction, not generated for visual filler.
- `lib/rebirth/previous-menu-catalog.ts` is a typed server-only read boundary exposing original `menuCategories` and `featuredItems` without touching their amounts. Its `source.kind` is `owner-directed-previous-menu`, distinct from a live DB read.
- `app/menu/page.tsx` and `app/food-finder/page.tsx` read the SAME prior catalog. No divergence between the two public surfaces; no mixing unrelated mock products, no fake new/spicy tags.
- Search and category filter now return actual legacy product values; user sees an Arabic source note explaining that final stock and order acceptance are restaurant-dependent.
- Real menu item images are **NOT** available. Family-level TSC-07 and TSC-03 are restaurant photography in the Menu HERO only and are NOT incorrectly assigned to named products.
- Live `app/api/orders` and `createOrderInSupabase` remain untouched. Server reads active products and authoritative prices from the actual DB; submitting an old-price cart **must never silently bypass this**. If unavailable/mismatched, checkout can be declined. All QA uses nonproduction dummy Supabase and NEVER posts a restaurant order.

## R0/R1/R3 — brief and identity role
**Person**: mobile visitor hungry and trying to choose correct type, size, add-ons; returning customer knows item name.
**Job**: immediate search, find several identically named flavors across different types, compare same previous prices, customize, put in cart.
**Context**: 320/390 one thumb; 768 tablet; 1440 desktop. Quick ordering path, no theatrical scroll to find a price.
**Absence**: invented thumbnail/catalog images, 113 huge poster cards, fictional tags, three useless questions, made-up discounts.

Reference principles (from `13_REBENCHMARK_AWARD_REFERENCE_GAP_2026-10-19.md`):
- Tripletta and Lupo: build a unique recognizable graphic grammar, not a second copy of their pages.
- Zooba/Monty's/Gyros Factory: **physical takeaway labels and real packaging → digital typography/graphic rhythm**, not transplanted mascots or slogans.
- Baymard food-ordering: clear, reachable choice and price on phone. Fast catalog UI should be calmer than the food chapter.
- Tuscanini genuine source: TSC-08 red wrappers, TSC-03 pizza box, TSC-07 exposed crepe, real original menu categories and prices. Palette/typography are still a design hypothesis, not merchant-locked corporate identity.

## What has been implemented
### Menu
- Exact 16-category filter, 113 products, 20 per page load-more, Unicode Arabic-normalized search, ?category deep link.
- Duplicate names like **تشيكن فاير** occur in several actual categories. Every product action's accessible label now includes the food family (e.g. `كريب توسكانيني — تشيكن فاير`) rather than ambiguously identifying three controls as the same product.
- Authored native modal with actual size, add-on, quantity and live-calculated prior-menu totals; source label and no false per-item photo.
- Real CartProvider lines persist, product detail stays exact; selected legacy prices and sizes displayed plainly. No actual backend order submission in this pass.
- P12 real screenshot review: original 20 card grid at 390px produced **7044px** document. Compact typographic rows preserve content while reducing to **5552px** (−1492px, approx **21.2%**). At 320px, **8070px → 5574px** (−2496px, approx **30.9%**). At 1440px, **4341px → 4232px**. Tablet 768 initially regressed due to too-early one-column breakpoint (4730px → 5327px), corrected to a 2-column print-menu grid from 721px. Re-capture to confirm.
- Rows are a distinct fast-choice grammar; genuine restaurant photograph remains in the page's authored hero. No fake SKU crops.

### Food Finder
- Changed from a never-usable dummy-Supabase error screen to the real previous menu catalog.
- Removed the original “new/hot” menu tag question because original records do **not** contain trustworthy tag annotations. Now **two evidence-backed questions**, food family (including dessert, drinks and appetizers) and budget cap. Only actual old-price matches; no additive item offered as a stand-alone food recommendation.
- The eight top-ranked matches link to their exact category in the real menu route. Intro and results state that prices are **previous menu prices** and final conditions are confirmed with the restaurant.

### Checkout populated-visual fix
- Populated browser screenshot exposed an inaccessible visual reading order on small screens: **Final Review summary was displayed ABOVE food and customer fields** via CSS order overrides, despite the source DOM order being correct.
- Restored phone/tablet order to food → contact/delivery → final total/consent; made the mobile black hero smaller so actual order appears earlier. No order submission logic changed.
- Added browser visual assertion checking layout positions on 390px after a real old-price item enters the cart.

## Evidence rather than claims
- [Actions #39174381361](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39174381361): TypeScript/Next build, original 12-photo gate, browser fixture **SUCCESS / 0 failures** at 320,390,768,1440. Explicit exact-price example: **تشيكن فاير 125 EGP + موزاريلا 20 EGP, x2 = 290 EGP**, persisted through the CartProvider into /cart. Real duplicate item names kept distinct.
- [Actions #39174599225](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39174599225): **SUCCESS** after compact row redesign, warm-scroll 34 route screenshots, zero browser fixture failures. Actual image sizes recorded above.
- [Actions #39174731384](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39174731384): **SUCCESS** including additional screenshots of populated search, selected size/add-on dialog, selected 290 EGP cart and actual eight Food Finder matches at 390px & 1440px; zero interaction failures and NO real order POST.
- Subsequent tablet fix and mobile cart visual-order correction are in-flight/under CI. Do not claim closure for these code tweaks before their own screenshots and logs.

## Still open / don't jump prematurely
1. Final 320/390/768/1440 visual review AFTER tablet and cart corrections, plus first modal and populated checkout screenshots.
2. Validate actual old menu against merchant's current database before allowing REAL customer order POST. Presentation with a user-authorized previous-price catalog is **not** proof that live Postgres matches or operations are open.
3. Accurate higher-resolution source photography, licensed final wordmark and true source-led packaging graphic fingerprint (avoid inventing letterforms).
4. Offer state with a real merchant-approved promotion; no dummy offers allowed.
5. Full separate re-benchmark vs physical identity and awarded restaurant websites, signatures/motion with proof of purpose; **ART DIRECTION remains OPEN**.
6. Admin/operator role and order transactions still distinct production validation gates.

**Do not merge PR #59 or deploy Main.**
