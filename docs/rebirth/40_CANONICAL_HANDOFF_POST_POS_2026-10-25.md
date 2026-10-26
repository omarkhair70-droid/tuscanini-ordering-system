# TUSCANINI REBIRTH — CURRENT NEXT-CHAT HANDOFF
**As of 25 Oct 2026, after real restaurant POS add-ons & brand-line request.**

> START HERE in any new ChatGPT/Codex session. Then read `docs/rebirth/WORKING_BOARD.md` and the linked source/evidence, inspect the **live PR HEAD**, verify current GitHub Actions and Vercel SHA, and CONTINUE THE EXISTING WORK. This document captures the current goals and constraints, not permission to publish or take live orders. Historical Pass 00–38 research and the Oct-19 handoff provide context, not newer release status.

## 1. Owner's unambiguous commission and priorities
- Tuscanini (توسكانيني) is a **real restaurant/takeaway in Beni Suef, شارع البحر — سور نادي توليب**. Owner wants an original, high-quality, **production-facing customer experience**, not MVP copy, developer jargon, design experiments, demo/preview labels, fabricated tickets, fake discounts, or a generic restaurant template.
- Creative R&D is central: research, art direction, food-first editorial photography, original tone, human interaction, motion, performance, accessibility, responsiveness (320/390/768/1440), coherent checkout and after-order behavior. Website is meant to look **finished in front of customers**.
- Explicit merchant line to integrate: **«الكريب بيتكلم» / «توسكانيني — الكريب بيتكلم.»**. Added to Home hero while preserving the previously authored `بص جوه` story. Do not blindly overwrite brand structure; visually review placement and editorial balance with real screenshots.
- Merchant also asked for **add-ons visible/usable in customizing crepes** and confirmed via conversation with the developer of the **existing cashier application** that delivery of website orders into that system **is technically possible**. This is NEW highest-value external dependency, not a completed integration.
- User wants ALL needed capabilities to remain prepared; do not casually delete planned payment/integration paths. BUT do not claim unbuilt features work, send fake orders to customers, or open unapproved real orders. Build production-ready routes and safe fallbacks.

## 2. Canonical source of truth: exact repo
- Repo: https://github.com/omarkhair70-droid/tuscanini-ordering-system
- Branch: `redesign/tuscanini-authored-experience-20261018`.
- PR: https://github.com/omarkhair70-droid/tuscanini-ordering-system/pull/59 (DRAFT, BASE main).
- Verified pre-handoff functional HEAD: `7fcb05895d15e6a48f8ec0eac9515e841bb4ee0b`; **all five GitHub workflow runs were SUCCESS at that SHA**: Home, Home, Backend V2 PostgreSQL, Dedicated Order API, Browser Screenshots & Asset Gate. Matching Vercel Preview READY:
  https://tuscanini-ordering-system-ct3v45jyy-omarkhair70-droids-projects.vercel.app/
- This documentation-only commit necessarily moves branch HEAD: verify fresh HEAD, whether CI ran, and Vercel SHA. Do **not** confuse an older green code SHA with a newer unverified implementation.
- PRESERVE existing website, source graphics, previous commits, images, PR and backend. Do not restart or rewrite the repo. No merge to main or intentional public/live production cutover without owner/restaurant approval.

## 3. Present scope already built
- Main branded editorial Home; navigation; Menu, product-details native dialog + forward/return FLIP; Cart and checkout; order success/status strip/tracking; offers, contact, about, reviews, complaints, Food Finder; responsive layouts and original motion/Reduced Motion.
- Existing **113 historical menu SKU entries in 16 sections**; size variants, notes, quantity, choice of optional add-ons, cart same-line editing, server-side price/order validation. NOT confirmed as current merchant menu, price, stock or opening hours. Keep concise customer-facing price/disclosure text.
- 12 original contextual restaurant photographs, **100 existing generated WebP concepts**, **20 supplemental named SKU illustrations**. Mapping was audited: random category/hash selection removed; deliberate per-SKU mapping; roughly 64 curated food illustration mappings + 14 supplement concepts + 35 named original graphic treatments (verify code/current counts if changed). Six supplemental concepts specifically remain held from customer depiction: `sf5,sf6,dr5,dr6,ca4,ca5`. Not every SKU has real approved photographed item: **0/113 certified dish-specific merchant photographs**. Never claim 113 verified dish photos, and don't regenerate/delete the first 100.
- `/operator/orders` is a protected operator-facing order surface with Order Press and Ticket Rail. When no real service is enabled it fails closed; 20 fake ticket fixture can run **only in internal CI** behind `TUSCANINI_INTERNAL_VISUAL_QA=yes`. Legacy `/demo` and `/menu/visual-atlas` are hidden from public routes.
- Separate staged PostgreSQL order engine and Oracle HTTPS order API provide tested order→operator→tracking logic. **That engine is NOT the existing restaurant cash-register software**. Earlier one synthetic test ticket reached hosted operator screen; GitHub two-device integration succeeds in test environment. This is NOT proof an order reached the existing restaurant POS/printer.
- Cart checkout is truthful when merchant web-order intake closed: early clear status, editable preserved cart, contact path, no pointless buyer PII input. Operator room hidden/fail-closed when no backend; not a public demo. No blanket go-live authorisation.
- No verified online card/wallet gateway or native background push notifications. On-page status/tracking exists. Delivery geography, fees and restaurant payments remain owner-dependent.

## 4. NEW merchant POS photo: add-ons and website work (25 Oct)
- Restaurant supplied photo of its existing cashier program, page called `الإضافات` (Windows-like on HP monitor). The developer of that cashier software verbally confirmed that website orders CAN potentially reach that system. **Protocol / API / SDK / local bridge / credentials / POS product codes UNKNOWN**. Never infer connectivity from the screenshot.
- Exact photographed transcription: `docs/rebirth/POS_MODIFIERS_2026-10-25.md`. 34 labels/price rows visually transcribed; 30 legible items put into savoury-crepe customization; 4 ambiguous `S/M/L/F` entries held for staff confirmation. `رول` is **20 EGP on the photographed POS**, while old website reference showed 25: website updated to 20, but no merchant system sync was performed.
- Site source file `lib/rebirth/pos-addons-reference.ts`; `lib/mock-data.ts` uses those options; `components/rebirth/rebirth-product-dialog.tsx` clusters them as discoverable cheese/fillings/sauces/other disclosure groups, selected-count display and summed prices. Not yet proven every modifier is allowed with every savoury-crepe SKU. **Don't silently add these to pizza, sandwiches or desserts.**
- Home hero branded line in `components/home/rebirth-home.tsx` and CSS. Added neutral customer price messaging in product/menu. Screen-reader and phone usability matter.
- Regression test `scripts/qa/rebirth-pos-addons-audit.mjs` validates 34 rows, 30 selectable, 4 unresolved, key prices and phrase. Existing Browser CI also exercises product dialog/cart.
- Integration instructions: `docs/rebirth/POS_ORDER_INTEGRATION_HANDOFF_2026-10-25.md`. NO pretend POS integration already exists.

## 5. Operational safety rules — keep intact
- Never merge the draft PR or promote to main/production as if restaurant live until explicit authorisation and tests. Verify flags, don't blindly flip: web `isOrderingOpen=false`, historically Oracle `ORDER_API_ACCEPT_ORDERS=no`, `CATALOG_SYNC_ENABLED=no`, `TUSCANINI_ALLOW_CATALOG_SYNC` gated. Actual runtime values should be rechecked before go-live; do not assume remembered values are live.
- Existing restaurant POS is intended source of truth for order delivery, prep/printer workflow; do not replace it with invented dashboard when real integration is possible.
- Never falsely confirm customer order before authenticated POS acknowledgment; validate menu prices and modifier IDs server-side; use external ID/idempotency and safe retries; status propagation must reflect true staff actions, not timer animations.
- No fake customer reviews, fake statuses, fabricated ETA, food images with wrong fillings, invented merchant prices, missing identity/disclaimers, or tech/design-review prose on public-facing pages.

## 6. Next work in correct priority
1. **Review actual CURRENT 390/768/1440 browser screenshot/video artifacts** from latest green SHA. Public copy audit across EVERY customer route and tablet: remove engineering provenance/debug/copy leftovers; art-direct Home/brand line/menu/modifiers/Cart/Tracking/Contact. UX polish not a site rewrite.
2. **Merchant POS integration discovery**: collect product name/version, how external orders enter it (API vs local bridge), docs/endpoint/SDK, test creds in secure channel, real POS SKU and modifier IDs and price compatibility; determine whether POS reads external orders or website pushes to POS. No speculative connection implementation. Use the existing handoff doc and ask for precisely necessary info from POS developer when ready.
3. **Implement authenticated reliable POS adapter** under backend, using actual documented protocol; map website IDs ↔ POS codes; enqueue/idempotently dispatch, check persist/print acknowledgment, recover offline/retry without duplicate tickets. Update website tracking from actual POS statuses. Test with the real **cashier PC and printer** and two customer devices. Keep Oracle/staging pieces only as applicable to integration, not a second merchant POS.
4. **Menu/data signoff**: reconcile all 113 SKUs and new POS add-ons, portions, combos, modifier allowed families, tax, pickup/delivery, fees, availability, opening hours, payment method. Resolve ambiguous S/M/L/F and `كونو`, `رول` meanings. Approve images and correct six held inaccurate concepts; choose real food photos where practical.
5. **Release readiness**: secure operator access, backup/restore, privacy, logs scrubbed, rate limits, multi-order load, fallback/contact, error states, mobile/tablet physically, accessibility/performance/SEO; guarded pilot with staff before activating web intake, then controlled public release.
6. Payments and notification providers remain open product decisions, not already implemented features. Do not imply Visa/web push is working without verified gateway/consent, callbacks and reconciliation.

## 7. Source hierarchy and workflow
1. Fresh PR HEAD + actual files + GitHub Actions + SHA-matched Vercel deployment (state of code).
2. `docs/rebirth/WORKING_BOARD.md` (running task/release index), this 25-Oct handoff for new session.
3. `docs/rebirth/POS_MODIFIERS_2026-10-25.md`, `docs/rebirth/POS_ORDER_INTEGRATION_HANDOFF_2026-10-25.md` (new merchant evidence).
4. `docs/rebirth/20_CANONICAL_NEXT_CHAT_HANDOFF_2026-10-19.md`, Pass 00–38, research, photos, original briefs, HTML reference (history—not newest to-do list).
5. Use full source, screenshot/film artifacts, no pretending to have visually inspected images by reading CI summaries alone.
6. Work on **same branch**, write a focused verified commit, update **the existing** Working Board after meaningful work, CI and Vercel, not endless new planning artifacts. Never ask user to repeat details present in repo and conversation.

## New-session first action
Inspect latest PR HEAD, this document and WORKING_BOARD, then latest successful screenshot artifacts, and verify **current** on-site customer polish. Propose / execute next concrete remaining production-facing action. Preserve website and POS integration constraints. The owner is transitioning chats because the previous thread hit the message limit—not commissioning a restart.
