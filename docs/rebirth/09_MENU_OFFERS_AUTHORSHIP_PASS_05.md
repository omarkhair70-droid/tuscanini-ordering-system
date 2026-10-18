# TUSCANINI REBIRTH / CREATIVE PASS 05 — MENU & OFFERS AUTHORSHIP
Date: 18 October 2026 | Working branch `redesign/tuscanini-authored-experience-20261018` | Draft PR #59 (NO merge)

## Context / creative question
Pass 04 recovered much of the HOME's authored HTML energy. Actual 390px/1440px Menu and Offers screenshots were technically usable but relied on gigantic type-only colored headers, disconnected from the restaurant's **real** photographs. The goal was to give these routes their own *content-grounded* visual authorship without copying the previous HTML, inventing live products, or adding a mandatory story detour before ordering.

## Actual photo-to-role translation
**Menu** (`components/rebirth/rebirth-menu.tsx`, `app/rebirth-menu.css`):
- Adds two **authentic, source-backed, category/context-level** photographs to the original functional Menu hero: TSC-07 (three open crepes; food interior) + TSC-03 (real pizza inside actual Tuscanini box). The split collage appears beside a user-facing title on wide screens and folds below short copy on phones.
- The two photos are **NOT** bound to a named currently purchasable product, price, portion, or live availability. Their alt text and visible caption distinguish documentary restaurant images from the actual menu dataset.
- Maintains exact name search, filter buttons and product chooser unchanged; adds a direct `#t-menu-search` link *within the first hero copy* so a returning visitor can bypass the photographic sequence on mobile. Keeps the existing /menu direct ordering path and sticky header.
- Replaces developer-facing “connected actual system / no invented prices” intro copy with customer-facing state language that changes according to whether live data was loaded. Historical unverified products remain hidden.
- Adjusts 320px Arabic headline from a third line into an intentionally two-line composition, verified by browser geometry assertion.

**Offers** (`app/offers/page.tsx`, `app/rebirth-offers.css`):
- Adds a single documentary TSC-11 restaurant photograph with a bounded yellow-red frame. Explicitly labels it **not a picture of any particular promotion**. No synthetic offer photography, badge, fake discount or made-up product link.
- Keeps the list connected to active offer records; the list itself remains editorial but prioritizes verified price and clear terms.
- Fixes a discovered data ambiguity in the real read path: `getActivePublicOffers()` previously returned `[]` on a Supabase query error. This caused the offers page's `sourceError` state never to trigger and risked falsely claiming no active promotions during an outage.
- Adds optional `throwOnError` behavior to `lib/offers-runtime.ts`, enabled only by `OffersPage`. Other call sites retain the previous non-throwing contract. Now “unable to verify offers” is visibly different from “no confirmed active offers”.
- Under the QA's deliberate dummy DB setup, the Offers page now displays “مش قادرين نتحقق من العروض” instead of an incorrect empty-availability claim.

## Motion / art-direction decision
- No GSAP, ScrollTrigger, Canvas, WebGL or Three.js addition. Both pages need compositional authorship and factual food imagery, not synchronized timeline animation.
- Menu image zoom is hover-only secondary detail; the complete content is available without hover or motion. Reduced-motion disables that zoom. Offers photograph is static.
- Keep any more elaborate motion for a proven later cross-scene transition, benchmarked on a real midrange phone.

## Exact QA evidence / what passed
**Final pass CI after source-truth fixes and visual assertions:**
https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39165768939

- Chromium screenshot/asset workflow **PASSED**, including TypeScript, Next production build, source-backed 12-photo gate and browser fixture smoke with **0 failures**.
- **30 actual PNG captures** in artifact `tuscanini-mobile-desktop-visuals`: 22 pre-existing route/viewport full-page views, 4 focused Home scenes, plus new Menu/Offers views at 320 and 768. Both Menu and Offers have screenshots at **320, 390, 768 and 1440px**.
- Checked Menu two real images fully decoded, exact informational label, visible first-scene jump to real search, deliberately two-line heading, no material page-level overflow and direct underlying menu controls at all widths.
- Checked Offers authentic photo decoded and correctly labeled as not a live discount, direct /menu exit, no horizontal overflow, and in dummy Supabase environment explicitly asserted **source failure**, not a false no-active-offers claim.
- Baseline mobile visual audit before edits: Menu 390px full-page height 2104; Offers 390px 1603. First photographed pass: Menu 2298, Offers 1807. Final pass after copy/rhythm fixes: Menu 390px **2351**, Offers 390px **1783**; Menu 320px **2402**, Offers 320px **1802**. These are layout measurements, not quality ratings; there is still tradeoff between visible photography and time-to-search.
- The 320px Menu had a three-line “نفسك فيه” break on an early photographed pass. Reduced the heading to 49px and added immediate first-scene search shortcut; latest Chromium geometry assertion confirms the intentional two-line heading.
- Examined desktop, tablet and narrow phone PNGs. Menu hero composition reads as real food with a clear search shortcut; red Offers chapter reads as a real restaurant scene while current unavailable state is explicit.

## Still NOT complete / next creative lane
1. Site-wide artistic continuity: transition from Menu family photos → verified individual products needs **accurate real item mapping** when merchant data/photos exist. NEVER silently use these family photos as item thumbnails.
2. Even though the route is stronger, the 320px/390px first search field appears below the photographic scene; the first-scene anchor is the current bypass. Test actual time-to-product with repeat visitors and a real device before deciding whether to move search above images.
3. Offers on real merchant data: test active, scheduled, expired and error states separately; **dummy CI only confirms failure path**, not true live promos.
4. High-resolution source images (current originals 640×640) and font loading performance need direct device inspection.
5. Design and implement **About/physical restaurant story**, then revise full Home–Menu–Offers transitions with real content. Checkout tracking and operations remain functional/permission-first rather than poster-like.
6. Atomic order creation/idempotency, operator auth/permissions, kitchen status and production Supabase data remain unverified; don't use a green UI screenshot workflow as a deployment claim.

**NO MERGE. PR #59 remains Draft. Main/production unchanged.**
