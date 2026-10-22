# PASS 29 — Direct Ordering Product & Stack Decision
**Date:** 2026-10-22 | **PR:** #59 DRAFT | **Status:** decision only, not deploy authorization.

## Restaurant facts vs assumptions
- Owner described a working conventional cashier and phone-order process; restaurant has enrolled with Talabat and is arranging internet and a tablet.
- Existing POS/kitchen printer details are unconfirmed. The Talabat tablet is not ours; do not promise it will accept orders from Tuscanini's website.
- Pass 27's cashier-accept-before-kitchen-start sequence was a TEST FIXTURE, not restaurant-validated workflow. In old code kitchen can see `جديد` even with `confirmation_status=pending`.

## Scope
Build the official **direct web-ordering channel** plus **tablet/desktop operator inbox**. Preserve Talabat and conventional POS separately. Web order is saved → restaurant staff visibly receive and accept/reject it → staff manually enter/process the order through existing cashier/kitchen workflow if required. No automatic Talabat/POS/kitchen printer integration claimed.

## Selected initial architecture
| Layer | Decision |
|---|---|
| Customer UI | Retain existing Next.js 16, React 19, TypeScript, Tailwind, authored visuals, food imagery and cart |
| Backend | Next.js Node.js Route Handlers delegating to server-only modular domain services |
| DB engine | Independent PostgreSQL v16+, no future Supabase runtime dependency |
| DB adapter | `pg`/node-postgres, transactional SQL, versioned SQL migrations, safe DB pool |
| Tablet | Responsive `/operator/orders` web interface; optional PWA install on supported tablets |
| Inbox updates | Authenticated bounded 5–10-second polling first; no-cache, reconnection, visible connection indicator |
| Staff login | Named users, secure hashed credentials, server sessions/cookies, role checks, audit/rate limiting; **not** old shared admin secret |
| Infrastructure | Choose standalone Node/Docker plus backed-up independent Postgres on a VPS/OCI Compute or managed Postgres after actual TCO; OCI Compute PostgreSQL is NOT Oracle Database |
| Notifications | Prominent visual alert and opt-in audio; enable audio via staff click (browser autoplay restrictions) |

## Technical integrity gates
1. Server-authoritative current signed-off catalog and availability; legacy 113 entries/prices historical until reviewed.
2. Atomic order+lines+audit, persisted payload-bound idempotency request key, secure tracking token and rate limits.
3. Status dimensions separated: `received` is **not** accepted, `accepted` is **not** paid/printed; actual kitchen process remains unverified.
4. Tablet never silently loses a web order after browser sleep/network outage; resync by server state and show offline banner.
5. Use current POS manually as directed by staff until a specific POS vendor/API is actually confirmed. Talabat stays a distinct source/channel.
6. Testing against isolated Postgres succeeded in Pass 27 but must not be called production readiness or real-world merchant acceptance.
7. No native Android, Django, Redis, queue brokers, Oracle Database, payment gateway, automatic receipt printer or replacement POS in v1 without demonstrated need.

## Next execution
**Pass 30:** Design/build tablet-first Operator Inbox UI using synthetic fixtures (new order card, detail, accept/reject, open hours state, offline/empty/error, reconnect, notification enable). Implement in the existing Next.js repo, preserve public visuals.
**Pass 31:** Introduce independent Postgres STAGING schema and server-only order adapter with per-staff authentication, atomic checkout and idempotency. No live data cutover.
**Pass 32:** Run controlled end-to-end web→DB→tablet acceptance/rejection on staging, device usability, duplicate/retry/offline testing and price signoff.
**Pass 33:** Owner-authorized pilot order, manual POS/kitchen handoff verification, backups/restore and go-live gates. No merge/deploy automatically.

## No production change
PR #59 remains DRAFT. Keep 100 generated menu images and creative direction. Do not alter live merchant prices, customers, credentials, or production DB. Verify expected hosting recurring costs, TLS, backups and restores before setting up paid resources.

References: https://nextjs.org/docs/app/getting-started/deploying | https://nextjs.org/docs/app/guides/self-hosting | https://node-postgres.com/features/transactions | https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
