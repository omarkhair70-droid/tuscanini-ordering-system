# TUSCANINI / ENGINEERING + QA CONTRACT
**All statuses here are planned/observed in code, not claims of live E2E test passing.**

## Architecture principle
An authored, clean customer frontend INSIDE the existing repo. Legacy CSS/layout is not a visual source. Selectively preserve business logic and API contracts only after inspection/testing. Backend DB vendor decision remains open (Supabase/Postgres may be adequate); no assumption Oracle is objectively better. Preserve the old deployed service during work; draft PR and preview until approval.

## Verified existing software
- Next.js 16, React 19, TypeScript, Tailwind 3, Supabase client in package.
- Menu runtime adapter attempts Supabase, catches errors and silently falls back to historical `featuredItems` mock/menu categories. **Production risk:** old prices can appear as current; replace with transparent unavailable/loading/error state or explicit source validity before release.
- `lib/orders/create-order.ts` inserts order, lines, addons and history as multiple DB calls, then deletes order on later error. **Risk:** non-atomic rollback under races or partial failures; prefer one DB transaction (e.g. vetted Postgres RPC), verified idempotency and accurate response handling.
- `app/api/orders/route.ts` checks `isOrderingOpen`, validates input and returns order ID/reference. No assumption that submission means store acceptance.
- Existing order-tracking component maps pending confirmation, confirmed, preparing, ready, out for delivery, delivered, cancelled; ensure every transition reflects real operator change and permissions.
- Admin auth uses one environment shared secret + signed HMAC cookie, not individual staff identities; audit RBAC, session invalidation, activity logging, rate limiting, abuse safety and CSRF boundaries before production.
- Operator/admin paths and menu/product editing are valuable **contracts to assess**, not a justification to keep old surfaces.
- Photography: 12 real 640×640 source photos in conversation working files; 11/12 original JPEG files are now committed as actual media bytes; remaining TSC-12 is NOT committed. Github is now testing hero/gallery loading via Chromium. Final 12/12 gate remains a release blocker.

## Stack decision gate
| Layer | Candidate | Why | Gate before lock |
|---|---|---|---|
| App | Next.js App Router + React + TS | Already deployed, typed routes/data, mature ecosystem | dependency advisories, build, deployment test |
| Components | bespoke CSS tokens + carefully chosen utilities | preserve authored direction, avoid generic UI kit | visual screenshots and reuse test |
| Media | WebP/AVIF optimized source-backed photos; next/image where appropriate | honest food proof | source mapping, sizes, rights and image QA |
| Motion | CSS/WAAPI; GSAP only for coordinated chapters | prototype features can be implemented progressively | motion/reduced-motion/performance compare |
| 3D | defer WebGL/Three.js/PixiJS/Rive | no proven 3D need | experiment requiring actual depth |
| Data | current Supabase, selectively repaired, NOT mandatory | existing operators/product data | schema and auth audit, DB transaction, trusted menu |
| CI | GitHub Actions + Vercel preview + browser-based QA | actual pull request path | required checks/traceable artifacts |

## Test matrix PER route
Functional: regular, loading, empty, slow response, offline/error, invalid params, deep links, repeated clicks and back navigation.
Responsive: width 320, 390, 768, 1024, 1440; portrait+landscape; 200% zoom; safe area, keyboard opening, image cropping, reduced motion.
Accessible: RTL/English direction isolation, WCAG contrast, 44px-ish touch areas, focus visible/trap/return, alt captions for INFORMATIVE real photos, semantic heading/landmarks, screen readers, active tab announcements, no hover-only access, errors associated with controls.
Visual: compare on phone **and** desktop to original photographic editorial energy, not just CSS code; record screenshot versions and why decisions changed.
Performance: real-asset loading, mobile midrange CPU/net, no layout shifts, asset-size audit, no mandatory video or animation for first order.
Commerce: exact item, modifiers, totals, duplicates, promotions, fulfillment modes, order confirmation vs saved, real kitchen statuses, non-atomic failure case, sensitive information controls, no phantom menu fallback.
Operator: create/update product, offer dates and eligibility, kitchen pending/preparing/ready, status transitions, concurrent staff use, admin session boundary, audit evidence.
Safety: secrets never committed; no sandbox/mock keys in live runtime; ensure personal customer data retention/access justified; uploads and user-provided text sanitized; avoid exposing contact info accidentally.

### Automation plan
Current workflow `.github/workflows/rebirth-home-ci.yml` covers TypeScript and Next build. Expand to unit tests for pure menu/cart logic, smoke/deep-link route tests, Playwright E2E with preview credentials, @axe-core/ accessibility assertions, and artifact screenshots of each route at 390 & 1440. Run for each PR change; don't assert browsers passed until logs/artifacts show it.

### Every 1–2 implementation units
1. Re-read creative role and its originating research claim.
2. Targeted search only if a blocker/counterexample emerges (e.g. specific mobile nav, SVG mask, transaction).
3. Implement in real App Router, not stand-alone user-facing HTML.
4. Run static checks then local/preview browser screenshot and interactions in both viewports.
5. Open GitHub CI logs and compare preview against visual baseline; log issues and fixes.
6. Mark unit internally reviewed, NOT globally approved, until integrated site gate.
7. Follow up with a wider regression sweep every several units.

### Integrated final acceptance
- All 10 customer paths and 7 verified operator paths present and coherent; conditional nested subviews work.
- Source-backed images present and named, beautiful-but-honest product imagery, no inaccurate old menu claims.
- Real repeat customer orders without a mandatory creative sequence.
- Real campaign deep link preserves offer identity, menu filter route respects query value.
- Order submission, kitchen confirmation and tracking are tested with controlled records and truthful statuses.
- Real mobile/desktop screenshots signed off; reduced motion, screen-reader/keyboard, slow network.
- Full CI green, no security-regression alerts or hidden debug/test endpoints.
- Owner reviews **whole joined-up product**, then merge/release approval.
