# TUSCANINI REBIRTH — MASTER DELIVERY BOARD / SITE-FIRST RESET
**Date:** 2026-10-22 | **Owner direction:** finish the original **authored website**, while arranging the direct-order backend and tablet inbox as parts of the SAME product.
**Repository:** `omarkhair70-droid/tuscanini-ordering-system` | **Working branch:** `redesign/tuscanini-authored-experience-20261018` | **PR:** #59 **DRAFT**, not merged, no production deploy.

> **This document is the current execution priority and unified status board.** Older dated documents remain a research and implementation archive. Do not promote older 'next' priorities over this board.

## Product, in one sentence
**One Tuscanini direct-order restaurant product:** a cohesive original public Rebirth website + a safe first-party orders backend + a separate simple tablet-friendly operator inbox, manually bridging accepted direct orders to the restaurant's existing cashier/kitchen method as needed. Talabat remains a separate ordering channel.

## Confirmed architecture and hard boundaries
- Public UI: **Next.js 16, React 19, TypeScript, existing art/media system**.
- New target server: **Next.js Node Route Handlers + modular server-only TypeScript domain**, **independent PostgreSQL 16+** using `pg`, transactions and versioned migrations.
- Operator: authenticated responsive **web/PWA inbox** on a restaurant tablet or computer; no native Android build and no integration inside Talabat's tablet.
- Existing phone orders, current POS, optional existing printed kitchen receipts stay in place. **We did not verify** the POS brand, auto-print path or any official API.
- No new Django/Oracle Database/Supabase dependency in the intended V1 architecture; existing Supabase implementation is **still used in current branch code until an actual staged migration**, not already removed.
- No billable infrastructure, live database or merchant orders, production deployment or main merge is authorized by this plan.

## Verified snapshot (not a completion verdict)
| Area | Verified evidence | Accurate status |
|---|---|---|
| PR | #59 open DRAFT; ~255 changed files at initial 22 Oct inspection; one Next project | Large working site exists, **not released** |
| Public routes | `/`, `/menu`, `/offers`, `/food-finder`, `/cart`, `/order-success`, `/about`, `/contact`, `/reviews`, `/complaints`; product detail inside Menu | **Implemented in code, not all owner-approved/closed** |
| Original media | 12/12 source-backed original restaurant photos committed | **Present**, final rights/resolution/crops/brand review pending |
| Generated item artwork | 100/100 WebP files present; 96/113 historical items mapped to suitable *representative* categories using 65 of the files; 17 without matched artwork | **Functional illustration system, NOT photographic SKU proof** |
| Exact-photo truth | 0/113 exact named-product real photos merchant-approved | **Open signoff**, never say the images represent certified actual dishes |
| Catalog | 113 historical named items across 16 categories with old sizes/add-ons/prices | **Historical, not merchant-certified current sale prices or availability** |
| Customer menu UX | Single customer path after Pass 21; no three-mode public menu, native product dialogue and reversible motion | **Implemented + browser QA**, final composition and real-device approval open |
| Checkout/tracking | New Rebirth checkout and tracking UI; current API writes to inherited Supabase with best-effort compensating deletion | **Working code path; NOT atomic/idempotent/live merchant signoff** |
| Admin | Existing orders, products, offers, settings and kitchen UI; shared-secret auth; kitchen refresh every ~25 sec | **Inherited implementation**, not named-user authorization nor tablet operator release |
| Backend V2 | Independent Django/Postgres and TypeScript/Postgres toy order domain; TypeScript loopback flow 15/15 tests | **Correctness sandbox only**, not production-backed web ordering |
| QA | Full visual asset/browser run #39713611238 **SUCCESS** at commit `9dfedde9`; Home CI #39713641816 **SUCCESS** at `372cf702`; new latest visual #39713641677 was in progress at audit | Automated evidence only; NOT signed-off visual design or phone/browser/live order test |

## Four TRACKS, one release

### A — WEBSITE & CREATIVE EXPERIENCE — **P0: PRIMARY ACTIVE TRACK**
Goal: **complete the original integrated Rebirth site** with a coherent, authored expression and a fast, credible order journey. Avoid replacing it with a generic template or putting server R&D ahead of design.

| Ticket | Concrete work in existing code | Definition of internally reviewed |
|---|---|---|
| **A1 — Full route creative pass** | Inspect real browser screenshots for Home, Menu, product dialog, Cart, Offers, Finder, About, Contact, Reviews, Complaints, Order Success. Rank visible page-level gaps against original HTML reference, source photos and research. Do NOT create an unrelated second prototype. | Actual 390/1440 visual evidence per route; issues listed with evidence, not adjective-only opinions |
| **A2 — Primary order journey** | Finalize coherent Home → Menu → Product/options → Cart → Confirmation/Tracking visual hierarchy, card/dialog clarity, editable cart, focus/back/scroll and reversible motion. Retain unified menu from Pass 21. | Short, frictionless first/repeat order path at 320/390/768/1024/1440; reduced-motion and keyboard checked |
| **A3 — Secondary pages with unique roles** | Offers, Food Finder, About, Contact, Reviews, Complaints: distinct visual voice, real information, source-truth, states and CTA links; avoid 8 duplicate hero/split-card layouts. | Per-route mobile/desktop preview + empty/error/deep-link review; no fake offer or testimonial |
| **A4 — Image + typography art direction** | Curate *specific* B03/B04/B05/B08 near-repeat shapes, source role in cards, real 12 photos, packaging glyph cohesion, Arab/Latin letterforms; never mass regenerate 100 images. | Documented keep/change decisions using stable media IDs and screenshots; no falsely certified dish photo |
| **A5 — Integrated browser + real-device QA** | Run screenshot artifacts, 200% zoom, keyboard, dialog Escape/back, touch rapid-tap, accessible contrast, performance and low-end Android real-device pass before approval. | CI green + artifact inspection + known limitations; real device flagged pending if none available |

**A2/Journey V2 checkpoint (22 Oct):** Read [Customer Journey & Tracking Contract](33_PASS_30_FULL_CUSTOMER_JOURNEY_AND_TRACKING_SYSTEM_2026-10-22.md). Actual site changes in same Next.js PR: shared cart/tracking step indicator; early mobile cart estimate/form jump and dense-review composition; mobile tracking server-confirmed receipt / independent merchant confirmation / kitchen and delivery facts; last-known status retained and flagged stale if network drops; mobile menu-to-cart dock now displays prices explicitly as **estimates**. Browser fixture screenshots at 390px from [run #39719430983](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39719430983), artifact `12400222401`, visually inspected. **That run failed 2 mobile checks because its test expected ASCII digits while the UI correctly formatted `٢٩٠`**; subsequent commit `31faad28` fixes the assertion; check newer browser CI before declaring full green. No real order placed. **Next:** inspect latest CI and screenshots, then complete all tracking states and unique roles across remaining secondary pages.

**Current priority order:** A1 → A2 → A3/A4 → A5. The original website is *not* visually finished merely because routes render or automated CI is green.

**A1/A2 execution checkpoint (22 Oct):** Real downloaded screenshots from #39713611238 reviewed on 390/1440. Implemented faster mobile Menu hero and direct Search/Category shortcut anchors (`2286346d`) and rebalanced 390px Product Dialog image without hiding disclosure/size/addons (`002fd9f4`). Exact before/after evidence and 10 triaged route gaps: [A1/A2 Screenshot Audit](32_A1_A2_ACTUAL_SCREENSHOT_SITE_FIRST_QA_2026-10-22.md). Home CI #39717285134 and Visual/Browser QA #39717285344 SUCCESS on code SHA `002fd9f4`. **Next craft focus: Cart/Checkout and the secondary pages' unique roles; do not restart backend R&D.**

### B — DIRECT ORDER ENGINE & DATABASE — **P1: REQUIRED BEFORE REAL CHECKOUT GO-LIVE**
| Ticket | Scope | Release rule |
|---|---|---|
| **B1 — Merchant menu truth** | Nonsecret current approved category/item/size/add-on price, stock, order hours, delivery zones/fees, actual live offers, contact details. 113 legacy records are reference only. | Owner reviews merchant price/source date; close ordering if trusted menu inaccessible |
| **B2 — Independent PostgreSQL staging** | Versioned relational schema & server modules replacing inherited Supabase reads/writes in a **separate test environment**, including safe migration preview and rollback rehearsal. | No mixed catalog truth; no live DB switch before trial and approval |
| **B3 — Transactional checkout & tracking** | Whole order + modifiers + audit in one transaction, payload-bound idempotency, safe retry after connection loss, server-side prices, customer tracking capability and scoped responses. | Automated DB/HTTP E2E & failure tests, no duplicate orders or guessable PII access |
| **B4 — Security & ops** | Named staff users, secure sessions, RBAC, request validation, rate limits, logs excluding personal data, connection pooling, backup/restore practice. | Penetration-minded threat review + authorization tests, not a shared-secret admin login |

### C — TABLET OPERATOR INBOX — **P1 PARALLEL UI, INTEGRATE AFTER B SECURITY**
| Ticket | Scope | Release rule |
|---|---|---|
| **C1 — Tablet-specific design** | Simple inbox for new web orders: very large visible ID/time/items/phone/fulfillment, inspect details, accept/reject, visual notification, opt-in alert sound, open/closed and disconnected states. Build as separate operator page family, not a miniature version of the marketing site. | Touch-first operator screenshot + human walkthrough. Use synthetic data before B is ready. |
| **C2 — Authenticated live sync** | Authenticated bounded polling with no-store, after-sleep resync and safe sound notifications. Never rely on Talabat tablet/POS APIs. | Backend state is authority; no missed/duplicate web-order handoff on reconnect. |
| **C3 — Manual existing POS bridge** | Human operator records accepted direct-order details in current cashier/kitchen process and acknowledges handoff. No automatic printed ticket claim. | One staff-supervised pilot order on existing equipment, no customer secrets captured. |

### D — RELEASE, OWNER REVIEW & OPERATIONS — **P0 QUALITY GATES / GO-LIVE LAST**
| Ticket | Scope | Release rule |
|---|---|---|
| **D1 — Creative preview gate** | Present integrated branch/preview with public checkout **disabled or safely sandboxed**; owner reviews site as a whole and supplies actual logo/source-photo/menu corrections. | Explicit whole-site visual feedback; incomplete items retain clear status |
| **D2 — Hosting/TCO gate** | Compare OCI Compute/VPS + Postgres with supported managed Postgres, TLS/DNS, backup retention, restore, monitoring and fixed monthly budget. | No hidden always-free assumptions or unowned maintenance obligation |
| **D3 — Restaurant pilot** | With merchant permission, synthetic/controlled direct web order → inbox → cashier process, staff training and fallback during internet outage. | Actual observed acceptance/handoff, truthful payment/receipt responsibility, customer support procedure |
| **D4 — Public release** | Final production checks, brand and photo rights, merchant price/offer/terms/hours signoff, CI, rollback, database cutover, domain and change tracking. | Explicit user/merchant authorization; PR #59 stops being draft only after release approval |

## Practical execution — not a new collection of unrelated 'Passes'
**Wave 1 — Restore WEBSITE leadership (NOW):** A1 site-wide actual screenshot review + A2 primary-order visual/user-flow fixes; work on current branch, each change paired with browser QA. Meanwhile obtain B1 non-secret price/brand/offer facts when convenient.
**Wave 2 — Complete SITE creative coverage:** A3, A4 and A5 plus D1 owner's integrated preview review. The visual experience can be reviewed **without** inviting real customer purchases.
**Wave 3 — Secure direct ordering:** B2→B3→B4 in separate PostgreSQL staging; C1 tablet UI may be built in parallel but must not read live sensitive orders until B4.
**Wave 4 — Tablet ↔ site integration:** C2 and C3 with controlled end-to-end and reconnection tests, then D2/D3 merchant pilot.
**Wave 5 — Launch only on signoff:** D4. Preserve historical production/main until migration/release authorized.

## NEXT HANDOFF / FIRST ACTUAL BUILD UNIT
1. Open **most recent successful browser artifact** and relevant previous screenshot/film evidence. Compare Home/Menu/Product/Cart/Offer/Story/contact support as an **integrated visual composition** on 390 & 1440; log concrete 5–10 strongest deficits (A1).
2. Make **targeted actual Next.js code changes** on the primary Home → Menu → Product → Cart path (A2) with clear before/after browser evidence. No new external design research unless a specific creative hypothesis needs it.
3. Regenerate only screenshots, never 100 media files; run relevant browser and interaction CI; close A1/A2 subitems only when proof exists.
4. Keep backend spike and isolated transaction models as reference, not as an excuse to pause public website work. Do not automatically start another POS simulator.

## Source-of-truth and no-go rules
- Read `20_CANONICAL_NEXT_CHAT_HANDOFF_2026-10-19.md`, `16_WHOLE_CREATIVE_EXPERIENCE_FLIGHTBOARD.md`, `21_PASS_20_REAL_ARTIFACT_REVERSE_FLIP_AND_100_FRAME_QA_2026-10-20.md`, and `22_PASS_21_ONE_CUSTOMER_MENU_2026-10-20.md` when editing relevant craft; use this board for **priority and status**, not to overwrite detailed research.
- Media facts: 12 authentic restaurant source photos, 100 generated illustrative WebPs, 113 historical menu items; 96 mapped to representative illustrations using 65 images, 17 unmatched, **0 exact approved food SKU photos** (verified in #39713611238).
- Passing automation means code/specified smoke checks worked in CI, **not** merchant approval, mobile usability or production readiness.
- **DRAFT PR #59. NO MERGE. NO PRODUCTION DEPLOY. NO LIVE CUSTOMER/PAYMENT/ORDER MUTATION.**

## PRODUCT CORRECTION — OCT 22 / OWN THE ORDER JOURNEY, NOT THE WARNINGS
The owner explicitly clarified the goal: **this project is an actively built, owner-controlled product**. Avoid treating ordinary iteration/testing as dangerous live merchant operation, or presenting research provenance on every customer-facing panel. Do not artificially constrain imaginative UX because a conventional POS or third-party dataset lacks a feature. Tuscanini's **own staff/operator tablet** can become the origin of meaningful new order events.

### Customer-facing experience principles
- **Remove disclosure essays and repeated hedges** from product cards, generated image panels, category family photos, checkout and tracking. One unobtrusive source note in the Menu is enough for representative photographs: `الأسعار من المنيو السابق · الصور للتوضيح`. Keep exact asset metadata/attribution internally.
- Product detail presents actual food name, art, concise description, choice of size/add-ons/quantity, price, notes, and **Add to Cart**. Never turn this into a developer proof sheet.
- Checkout should feel like a normal ordering product, with concise error messages only when an error occurs, not frontloaded precautionary legal text. Estimate/real fee differences must still be legible where monetary decision happens.
- **Experimental freedom:** create a real **staging/demo environment with its own separate database and staff inbox**, capable of placing, confirming, preparing, cancelling and tracking synthetic orders across two devices. Never interpret staging as a disabled app. Expose explicit TEST labeling on admin/dev UI and do not mix staging orders with live order IDs.
- **Live readiness is a different toggle** managed through staff settings. The existing legacy `is_ordering_open` false fallback is the reason checkout currently appears blocked; this is **not** evidence that web ordering is impossible or permanently disabled.

### Owned event-based product vision
1. **Operator/tablet** receives a new web order in its own Orders inbox. An operator can accept/reject it, start preparation, set/update a prep estimate, mark ready, dispatch and deliver where applicable. These are first-party events we design and persist, not dependent on external Talabat/POS state.
2. **Server authoritative order events:** `order.received`, `order.accepted`, `order.rejected`, `preparation.started`, `preparation.estimate_updated`, `order.ready`, `delivery.dispatched`, `order.delivered`, `order.cancelled`. Implement versioning, idempotency, actor records and transactional state/event update in staged independent PostgreSQL. Store event time, estimate source and channel; allow operator corrections. An ETA is allowed **when actually entered or computed from trustworthy kitchen data**, and should be labeled an estimate.
3. **Customer tracking** is a designed interactive **living ticket** with state-dependent art, editable microcopy and tasteful transitions, driven by events above. A kitchen/motion scene is perfectly viable if it reacts to real operator actions or explicitly represents the stage — not a fake always-advancing percentage.
4. **Notifications:** in-page state changes plus OS-level Web Push where supported, permissioned subscriptions, a service worker, VAPID sending, durable outbox jobs and notification click → that order's tracking page. Works when the tab isn't open on supported installed apps/browsers, subject to OS/browser permissions, throttling and network availability. Never promise guaranteed universal delivery when a phone is offline or permission denied; test actual Android and iOS PWA behavior.
5. **Tablet:** dedicated touch-first operator PWA, new-order attention/sound and connection indicator, separate from Talabat's own tablet app. Current admin pages are scaffolding, not the finished operator UI.
6. **Test:** across two browsers/tablets on a dedicated staging backend; simulate order→operator action→client visual+push receipt→dismiss/open; reconnect, duplicate update and corrected ETA. Test mode is meant to be **functional**, not just mocked screenshots.

### Specific immediate priorities
- **Now:** remove verbose consumer-facing image/old-price caveats from repeated product and checkout UI. Keep product sources in code.
- **Next:** implement staff inbox + separate staging order store and actual device-to-device events; wire the existing creative tracking ticket to first-party operator updates; then background notifications.
- **Then:** polish all customer pages, motion and mobile screenshots as one art direction; approve current menu with owner, run an authorized live pilot and release.
- Do not reintroduce speculative restrictions ('cannot have courier maps or ETA') as **design rules**. Decide feature-by-feature whether to generate their data within our own platform; if a map needs actual courier GPS and the owner wants it, plan delivery-device consent/location integration. Nothing in the current one-branch product requires it for V1.

## FIRST WORKING OWNED ORDER LOOP / 22 OCT 2026
- **Product position:** the website + first-party operator tablet + live tracking are one custom Tuscanini product. Existing Talabat/tablet and cashier remain separate order sources; we are not building a giant replacement POS.
- Created **Order Room** in `experiments/backend-v2/typescript/studio/index.html`, hosted by the existing disposable local Node/Postgres server: customer creates a synthetic order, operator inbox fetches it with line snapshots, operator accept/prepare/ready/deliver writes transactional state/audit/outbox, and customer live ticket polls durable event history from the same DB. Refreshing does not invent states. The studio boot command is `npm run studio --prefix experiments/backend-v2/typescript` with explicit disposable local DB environment flags.
- [Passing test run #39726185619](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39726185619): TypeScript strict check and **17/17** prior + newly added transactional HTTP cases passed; Django existing proof passed separately.
- **Important:** this is genuinely interactive localhost Postgres data, **not yet integrated into the Next.js pages** or remote tablet. It has only fixture staff token/role, local page-open notification permission, no background Web Push. That is precisely the next integration unit—not another separate simulator.
- **Next actual engineering handoff:** integrate staging-only Postgres server modules into the same Next.js Rebirth customer journey and separate tablet-first `/operator/orders` UI, named staff authentication, secure customer tracking link. Wire once and prove **Customer → Operator → Same Customer Ticket** across two browser devices; then background Push with service worker and device permission. The earlier creative website/visual reviews remain active in parallel.


## PASS 35 — Actual two-screen Next.js / Order Room connection (22 October 2026)
- Read [35_NEXTJS_ORDER_ROOM_TWO_SCREEN_INTEGRATION_2026-10-22.md](35_NEXTJS_ORDER_ROOM_TWO_SCREEN_INTEGRATION_2026-10-22.md) for run commands, route list, CI proof and honest integration boundary.
- Actual `/studio` customer + `/operator/orders` tablet views within Next.js use a guarded local API bridge to the same independent PostgreSQL order and status history. CI [#39728485619](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39728485619) passed real Node HTTP and Chromium 390px/1024px client/operator interactions. Fixed legacy mobile navigation overlay from screenshots. Backend 18/18 tests green.
- **Next necessary unit is no longer another demo:** expand DB/HTTP to the full *existing* 113 historical-menu item+size+addon+offer contract (with server price authority) and wire existing **Rebirth Cart→Order Success** in STAGING. Operator gets named login later, and Web Push is after that. The existing production-looking Rebirth Cart still speaks to inherited Supabase; do NOT present /studio as the finalized consumer checkout or a real tablet deployment.
