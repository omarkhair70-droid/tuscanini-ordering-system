# TUSCANINI — BROWSER QA / RUN 02: NEW MENU IN THE REAL APP
Date: 2026-10-18 | GitHub run: https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39112471381

## What actually ran
- `npx tsc --noEmit` and `npm run build`: passed.
- Chromium production-server screenshots: captured 18 real images (nine public routes × 390px and 1440px), uploaded in workflow artifact.
- Real restaurant photography integrity check: **FAILED** solely because 12 promised WebP files remain missing in GitHub branch. Keep release blocked.
- This run used placeholder Supabase env, so /menu shows the **deliberate unavailable-data state**, not a restaurant-approved menu catalog; it is NOT a live ordering E2E test.

## Visual comparison after converting /menu
Before: old red header and one vast mobile list, approx. **36,548px** screenshot height at width 390.
Now: same authored typography/cream/ink/corn palette and shared header as Home, distinct black editorial Menu opening, prominent actual-name search and category controls. With no DB in CI, 390px screenshot is approx **1,817px** height and clearly explains missing data instead of exposing stale historical prices. The new Desktop screenshot is approx 2,283px.
**Do not claim category and product shopping interaction has passed merely because the empty state renders.**

## New risks and next actions
1. Missing authentic food files still make Home a set of burgundy fallback panels. No art-direction acceptance until Git branch receives real photos.
2. The menu is intentionally visually empty in CI without Supabase. Add **isolated test-only fixture data** and verify filter, Arabic search, first 20 pagination, out-of-stock states, product customization modal, valid add-to-cart and deep links. Never allow fixture/historical prices to become actual checkout offers.
3. Product customization modal is still legacy red/white overlay; redesign as same brand family while protecting real item/size/addon calculations and focus safety.
4. Next customer routes (Offers/Finder/Cart/Tracking) still partly use old shell; blend only once adapted and quality-checked.
5. Mobile header, safe-area bar and modal focus traps require real browser-interaction tests, not screenshot tests alone.
6. Admin/kitchen/staff permissions, atomic order creation and order tracking require separate authenticated/integration QA.

## Evidence policy
Screenshot artifact proves browser rendering at responsive *viewport sizes* (not physical mobile device). Existing GitHub run link contains retrievable image artifact. Record findings here before further UI choices; repeat after assets, data fixtures and next route implementation.
