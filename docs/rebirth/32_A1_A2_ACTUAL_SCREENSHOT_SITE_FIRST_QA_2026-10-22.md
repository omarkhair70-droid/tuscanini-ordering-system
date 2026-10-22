# TUSCANINI REBIRTH — A1 / A2 Real Screenshot Audit and First UX Fixes
**Date:** 2026-10-22 | **PR:** #59 DRAFT | **Track:** A, public site first.

## Actual visual evidence inspected
- Downloaded and extracted real GitHub Actions visual artifact `tuscanini-mobile-desktop-visuals.zip` from successful run [#39713611238](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39713611238), artifact ID `12398393007`.
- Personally inspected 390px screenshots: Home, Menu, Product Dialog, populated Cart, Offers, Food Finder, About, Contact, Order Success; 1440px top-of-page Home, Menu, Product Dialog, populated Cart.
- Follow-up **real browser** artifact from [#39716636958](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39716636958), `2286346d`, used to inspect **before/after 390px Menu**. The browser+media+motion job is VERIFIED SUCCESS for that commit; no claim of current merchant approval.
- The 390px Menu original above-fold composition consumed approximately the first 830 vertical pixels before the search block. After A2's targeted mobile adjustment the source-safe photographic hero ends roughly 95 px sooner and the first search panel appears within a 900px screenshot. The visual system and both real restaurant photos were kept.
- This is a visual review of **the QA artifact**, not a phone-in-hand performance/keyboard/voiceover test. Do not confuse a full-page stitched screenshot with actual time spent navigating; above-fold measurements are from native first-screen crops.

## Issues, ordered by customer impact — evidence labels
| ID | Finding grounded in screenshots/source | Impact / action | State |
|---|---|---|---|
| **A1-01** | Menu 390px first screen showed almost entirely the black typographic hero and restaurant photo pair; search was outside the initial ~844px phone frame. | Customer came to choose food, not read another full-height editorial arrival. Shorten *only the mobile Menu* hero while preserving original visuals. | **Fixed in code** `2286346d`; browser CI SUCCESS, before/after visually inspected. |
| **A1-02** | Menu's first hero had only a link to **search**, with category browsing distant lower in the page. | Offer native anchor navigation to `#t-menu-search` and `#t-menu-categories`, both keyboard accessible, with a Playwright existence regression. | **Fixed in code** `2286346d`; CI SUCCESS. |
| **A1-03** | Product detail at 390px gave the illustrative food image only ~118px, with the source/provenance text visually carrying comparable weight; options themselves remained readable. | Enlarge mobile image moderately, preserve disclosure, avoid pushing size/add-ons below usable reach. | **Modified** `002fd9f4`; check NEW browser run and screenshot before claiming verified. |
| **A1-04** | Populated Cart 390px full-page capture is ~2572px long: item review, then delivery fields, then final estimated total + uncertainty caveats. | Reduce repeated administrative visual noise and consider a concise summary and input grouping; **do not** hide price uncertainty or error conditions. Requires full real-device input test. | OPEN, no change this pass. |
| **A1-05** | Home and Menu share strong ink/paper/yellow/real-food photographic grammar, but the Menu hero originally took Home-like narrative space. | Keep Home emotionally spacious, make Menu more task-first; avoid copying a single hero to every page. | Partial: Menu mobile improved, whole-site owner review open. |
| **A1-06** | Offers route's real photograph is contextual; when offer verification fails, screen tells truth rather than fabricating a promotion. | Preserve the honest no-live-offer state; validate owner-approved real offers/terms before release. | Existing implementation QA evidence, merchant signoff OPEN. |
| **A1-07** | Food Finder has its own sketch/choice-based visual language instead of menu cards only. | Verify supported recommendation data and return-to-Menu flow with valid live catalog after PostgreSQL staging. | Partially implemented; no sale-safe data signoff. |
| **A1-08** | About and Contact maintain high-contrast editorial photos/treatments, but copy/location/rights remain merchant evidence questions. | Test legibility, directions/phone actions and source captions on real phones; no invented restaurant biography. | OPEN final review. |
| **A1-09** | Order Success screenshot without real order ID accurately displays uncertainty. | Preserve distinction between persisted request, staff accepted and actual kitchen/paid state; secure order tracking before live launch. | Implementation present, backend migration pending. |
| **A1-10** | 100 generated WebPs exist, 96/113 historical items have safe representative assignments via 65 images, but 0/113 named-item true restaurant photos approved; some B03/B04/B05/B08 styles repeat. | Avoid regenerating wholesale or inventing fillings; selectively curate photo hierarchy and source truth with owner. | PENDING curated photo review; none approved as exact SKU evidence. |

## Code files changed in this first site-first pass
- `components/rebirth/rebirth-menu.tsx`: 2 authentic keyboard-addressable hero shortcuts, category target anchor.
- `app/rebirth-menu.css`: mobile hero/image proportion and lower padding; explicit shortcut focus state; anchor scroll offset.
- `app/rebirth-product-art.css`: **scoped** mobile detail image/description balance (does not change 100 artwork files).
- `scripts/qa/rebirth-interaction-check.mjs`: explicit category/search anchors and mobile product image size checks.

## No-go / next review
- **Pass A next:** inspect product-sheet 390 screenshot from the new visual Action run. If its action sheet remains readable and test succeeds, move to A2 Cart/checkout visual hierarchy; do not start another generic backend simulator.
- **Data remains separate launch blocker:** checkout still points at inherited Supabase APIs until controlled PostgreSQL staging work; no live data or merchant POS changes.
- Preserve 12 actual contextual restaurant photographs and generated representatives; truthful image source notes remain visible.
- No merge, production deployment, real POS print, merchant payment or owner-approved price update. PR #59 DRAFT.
