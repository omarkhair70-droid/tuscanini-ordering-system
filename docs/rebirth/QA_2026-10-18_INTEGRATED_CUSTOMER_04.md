# Tuscanini / integrated customer flows — QA run 04
**Date:** 2026-10-18 | **Status:** INTERNAL QA PASSED FOR THE CASES BELOW; NOT A PRODUCTION OR OWNER SIGNOFF.
**GitHub browser/interaction job:** https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39138846469
**Visual artifact:** `tuscanini-mobile-desktop-visuals` on that run (20 screenshots for 10 public routes at 390px and 1440px).

## Validated by real GitHub Actions + Chromium
- TypeScript type check and Next.js production build succeed.
- **12/12 original user-provided Tuscanini photos** are committed and pass strict media-existence gate. Images are JPEG originals, rendered responsively by Next/Image where applicable; they are not a catalog of verified product-specific pictures.
- Screenshot runs for Home, Menu, Offers, Food Finder, About, Contact, Cart, Order Success, Reviews and Complaints: all 20 captured. Legacy pages being captured ≠ redesigned.
- Scripted Chrome interactions (both 390px and 1440px): Home authentic-photo loading; food-category tabs; 12-photo gallery open/close; no significant horizontal overflow; no uncaught JS exceptions on Home; Menu visible search/categories with non-live prices safely hidden; Cart empty state prevents submission; direct /order-success with no ID does not falsely claim a receipt.
- **Isolated cart fixture, NOT a real restaurant checkout:** name validation blocks POST, one mocked 409 is handled without deleting products, no duplicate mocked submits.
- **Isolated tracking fixture:** server status `جديد/pending` stays in awaiting-confirmation; when mocked backend changes to `جاري التحضير` and customer refreshes, UI then shows preparing, and not before.
- Site-wide typography, top navigation, food-led editorial palette, actual 12 images and shared footer reviewed from screenshot artifacts. After the screenshot run, a tiny bidi punctuation adjustment to footer wordmark was committed and awaits follow-up verification.

## What this QA explicitly does NOT validate
- This is Chromium VIEWPORT emulation, not testing on a physical Samsung/iPhone. Real touch, scroll inertia, keyboard covering and actual mobile CPU performance still need device QA.
- CI uses placeholder Supabase env: Menu/Finder/Offers show fail-closed states. No verification that the live restaurant menu, customer details, actual current prices, offers or kitchen are correct.
- No end-to-end real order acceptance, idempotency/atomic Postgres insert, payment, SMS, staff roles or real tracking authorization test has passed.
- `lib/orders/create-order.ts` still contains best-effort compensating cleanup rather than a single atomic DB transaction. Ambiguous client failure now avoids automatic duplicate retry but **does not replace server idempotency**.
- `lib/admin/admin-auth.ts` still uses a shared secret for operations; dedicated per-staff identity, role-bound authorization, rate limiting, audit logs, and public tracking privacy must be reviewed before publication.
- Dependency audit in earlier CI log reported 21 advisories (3 low, 2 moderate, 15 high, **1 critical**). Must identify affected packages and remediate before release.
- About/Contact/Reviews/Complaints and seven operator screens still include legacy visual treatments. The full project remains one **Draft PR** with release gate CLOSED.

## Findings and corrections
1. Initial Rebirth Home looked weak without images. Uploaded all 12 authentic assets, including TSC-12 recovered from original archived HTML.
2. Initial 390px/1440px checkout and order-status screenshots showed too much negative tracking fiction in legacy UI. Replaced with factual recorded-status wording and typographic layout.
3. Wordmark appeared visually compressed. Removed excessive negative letterspacing; confirmed Latin header mark legibility improved on 390px screenshot.
4. Checkout on network error is no longer silently redirected to WhatsApp with uncertain persistence. Exact POST failure remains visible, cart preserved, retry caution given.
5. Old Food Finder used historic mock product prices. New route requires live Supabase menu rows and does not emit mock recommendations.
6. Offers route only shows active authorized runtime offers, with distinct promotional treatment and direct cart action when numeric price is supplied.
7. Add shared footer across new routes, keeping admin distinct.

## Next product work — before full owner review
- Implement current, verified restaurant data fixtures + controlled backend integration test (NOT seeded historic prices).
- Retrofit the remaining real-world Story/Contact/Support routes as authored UI families with accurate address/hours/contact sources.
- Rebuild the admin/kitchen operating UI and validate server privilege boundaries.
- Final image-to-product mapping and high quality art direction via actual source constraints, without AI ingredient hallucination.
- Perform real device QA; compare actual 390/1440 screenshots and fix hover/focus/reduced-motion/long-page rhythm issues.
- Remove release blockers: atomic idempotent orders, tracking access and dependency audit, actual staff-facing E2E, owner signoff.

**Release rule:** a green CI test is an engineering signal, not approval of the full restaurant experience. No merge or deploy to the main/production site.
