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

**Current priority order:** A1 → A2 → A3/A4 → A5. The original website is *not* visually finished merely because routes render or automated CI is green.

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
