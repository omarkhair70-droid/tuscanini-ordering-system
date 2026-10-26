# TUSCANINI — BROWSER QA / FIRST REAL GITHUB RUN
Date: 2026-10-18 | **Not a design approval or a release**
Run: https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39111806016
Workflow: `Tuscanini Rebirth — Browser Screenshots & Asset Gate`
Screenshot artifact: `tuscanini-mobile-desktop-visuals` on that run.

## Verified outcomes
- GitHub Actions ran `npm ci`, TypeScript check, Next production build: **passed**.
- Installed Chromium, booted actual Next production server on port 3000: **passed**.
- Captured 18 full-page Chromium screenshots at **390×844** and **1440×900** for 9 public routes: Home, Menu, Offers, Food Finder, About, Contact, Cart, Reviews and Complaints: **passed**.
- Uploaded actual screenshots as GitHub Actions artifact: **passed**.
- Media existence audit: **12/12 required restaurant photos missing from the GitHub branch at this run**.
- Strict real-photo merge gate: **failed intentionally** due to missing authentic assets. This is not a TypeScript or screenshot-engine failure; leave the PR blocked until photographs are integrated.

## Manual screenshot review (desktop + phone-width)
Home is no longer the simple light old site: dark editorial opening, large Arabic title, contrast and distinctive chapter hierarchy are visible. However major food image surfaces and the entire photo gallery render as **plain red fallback panels**, destroying the food-led purpose. The visual prototype looked far richer because it actually contained the real photographs; comparing the two without media would be invalid.
- On mobile the Home is very long (~5,501 px screenshot height at 390 px width). Repeated oversized chapter headlines and large vertical gaps need content/tempo review in the integrated design; no blanket page-height target until photo loading and scroll paths are tested.
- The /menu route is still the **old bright red legacy storefront**. It reads as a different product from the reauthored Home. This mismatch is EXPECTED while conversion is incomplete; not an approved design.
- The /menu full-page screenshot height at 390 px was roughly **36,548 px** in this captured state. Showing all items in one unsearchable-looking vertical march is NOT a satisfactory mobile food selection experience; test category grouping, search, list density and navigation with actual current menu data.
- Operator screens were not included in this first browser capture; separate secured fixture tests are required.
- Screenshot capture confirms **rendering** only, not click flows, no horizontal overflow, focus-trap, actual device touch behavior, authenticated ordering, contrast, performance or production readiness.

## Must-fix priority order
1. **AUTHENTIC PHOTO BYTES** — transfer `TSC-01..12` optimized WebPs to documented `public/images/rebirth/food-xx.webp` paths. Without this, Home art-direction QA is blocked.
2. **CONTINUITY** — convert /menu and other routes to the same authored public UI family while preserving live server data, cart, status contracts and direct purchase entry. Don't let old crimson pill UI leak into newly authored navigation.
3. **FINDABILITY / MOBILE LENGTH** — improve menu category selection and search, direct known-item order and Food Finder; compare 40-second known-item task and first-time exploration task.
4. **TYPOGRAPHIC/CONTENT RHYTHM** — trim repeated Inside/Out copy across chapters, keep formal variation; recheck mobile heading line breaks and image/context ratio.
5. **INTERACTION QA** — tab selection, gallery close/Escape, keyboard focus, accessibility, RTL direction, deep links, active-order banner and accurate cart count.
6. **COMMERCE SAFETY** — stop serving historical mock prices as if live; test server create/confirmation/preparation semantics and admin authorization.

## Next screenshot acceptance criteria
- Same real food and photography as source, not placeholder, no blown-up 640px full bleed.
- 390 + 1440 route screenshots show a **continuous** visual system.
- All deep links and user tasks pass; checkout and status truth independently validated.
- Visual edits supported by user-provided media + thesis, not random layer effects.
- No user-facing claim that the whole site is ready merely because CI build is green.

## Important limitation
390 px width is a Chromium emulation, NOT a test on a physical Android or iOS device. Actual phone/touch testing remains a required distinct gate.
