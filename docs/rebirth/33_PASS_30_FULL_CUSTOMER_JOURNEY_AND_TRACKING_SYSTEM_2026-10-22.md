# Tuscanini Rebirth — Customer Journey System, not isolated screen patches
**Date:** 2026-10-22 | **Track:** A public-website craft | **PR:** #59, DRAFT — no merge/deploy.

## Commission / product thesis

Finish **one authored Tuscanini website**, not a repaired homepage plus disconnected technical prototypes. The customer's path is:
`Home → Menu → Product choice and modifiers → Cart review → Customer/fulfillment details → Server order submission → Tracking/restaurant communication → Return or support`.

**Every page must have its own purpose and visual voice** while inheriting the same grounded physical Tuscanini cues: original food photography, packaging/fold graphic grammar, expressive Arabic hierarchy, ink/paper/yellow/chili contrast, clearly marked representative artwork, reliable buttons and true order status. This is both an editorial design project and a critical transactional product.

## Universal invariants of the customer experience
1. **Fast path:** Menu, Cart and an actual saved order's tracking are accessible without watching an introduction or learning new modes.
2. **Truth first:** Historical 113 items/prices and 100 AI-generated illustrations are not current merchant-approved products/photos. The 12 genuine photos are documentary/context. A generated/stock food image may not certify the actual named SKU.
3. **Receipt truth:** successful web submit means an order **was persisted**, not restaurant acceptance, payment, receipt print, cooking or delivery.
4. **Independent states:** backend `status` can say `جاري التحضير` while `confirmation_status` is `pending`. Never synthesize an accepted confirmation. Track **receipt + confirmation + operations** independently.
5. **Uncertain transport:** during a POST network failure do not automatically retry in the inherited non-idempotent backend. Leave cart untouched, explain uncertainty and direct contact; upgrade to payload-bound idempotency only in independent PostgreSQL staging.
6. **Reconnection:** preserve last known successful tracking state; mark it stale on refresh failure and resume polling on browser focus/network return. Do not let out-of-order older requests overwrite newer responses.
7. **No fake POS:** Talabat tablet and existing conventional cash register remain outside web status unless a real integration is approved; existing cashier may process orders manually.

## Integrated UX grammar

| Moment | Core customer question | First-screen answer | Next action |
|---|---|---|---|
| Home | What's this restaurant and can I order now? | Real photo identity + immediate Menu | Open Menu |
| Menu | Can I find my food fast? | Search or category link, unified 113-item historical catalog with source notice | Open product |
| Product detail | What exactly did I choose? | Photo role, clear price-origin, size/modifiers/quantity and sticky cart CTA | Add to cart |
| Cart | What am I about to send? | Editable items, quick estimated total on mobile, customer/fulfillment info, final review and uncertainty rule | Record order, **only if the live server accepts it** |
| Tracking | Did it save? Did staff confirm? Is it being prepared? | Server-controlled receipt, confirmation and fulfillment facts shown independently | Refresh / Contact |
| After / return | How do I order again or get help? | Persistent menu and contact links, contextual active-order banner only if a real ID exists | Menu / Contact |

### Shared mini-journey used on Cart and Tracking
`اختار أكلك → راجع التفاصيل → تابع الطلب`. These steps are **navigation orientation only**, not restaurant status or a claim that a customer has paid. Rebirth components have `data-step-state` and `aria-current=step`, are small/responsive, and neither take over the page nor block checkout.

### Tracking's THREE independent fact cards
- **تسجيل الطلب:** `verified` only if server returned an actual order record.
- **تأكيد المطعم:** `waiting/verified/attention` from actual `confirmationStatus`; no inference from kitchen status.
- **التجهيز والتسليم:** `waiting/verified/attention` from actual `status`; can be `verified` even while the confirmation card remains pending, because that is how the inherited backend behaves.
- On a transport error show the **last successful timestamp + stale label**; allow manual retry, and recheck when browser regains connectivity or returns to foreground.

## Implemented now in Next.js, same PR
- Added `components/rebirth/customer-journey.tsx` and `app/rebirth-customer-journey.css`; mounted in real Cart and Order Success.
- `components/rebirth/rebirth-checkout.tsx`: fixed unverified “confirmation must precede preparing” language; added mobile subtotal/quantity recap and real `#t-checkout-fields` jump; summary indicates fulfillment type; validation scroll targets **actual** missing fields or final confirmation, not always the top form. No fake live price verification.
- `app/rebirth-checkout.css`: shortened first mobile scene and compacted information hierarchy without hiding final review or old-price disclaimer.
- `components/rebirth/rebirth-order-tracking.tsx`: independent data facts, no assumed staff acceptance, preserves last-good state, aborts superseded polls, refreshes after tab focus/network restored.
- `app/rebirth-tracking.css`: card layout, reduced mobile hero height, status controls and readable 320/390/768/1440 layouts.
- `components/cart/floating-cart-cta.tsx`: the mobile Menu→Cart handoff now uses the same ink/yellow print materials and calls the cost an **estimate**, not a server-accepted payable total.
- `scripts/qa/rebirth-interaction-check.mjs`: automated synthetic browser fixture tests for cross-screen step states, honest pending vs preparing, independent confirmation, offline/stale state, mobile recap and screenshot capture of relevant filled states.
- Browser scenarios NEVER perform a live order POST. The only checkout POST fixture intercepts requests and returns an intentional rejection.

## Verification state
- Multiple incremental **Home CI** compilations passed while implementation was in progress, including [#39719363675](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39719363675).
- Browser QA [#39718924633](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39718924633) initially failed **only** the confirmation-card assertion after click because React's async update hadn't been awaited (4 width instances). The other assertions, including preparing-with-pending and stale transport recovery, passed. Updated the test to await the third verified card before asserting. **Do not mark full visual closure until a subsequent Browser QA run actually succeeds.**
- Screenshot generation is added at 390px for populated synthetic checkout and both `pending` and `preparing-without-accepted` tracking. Verify generated artifacts and inspect at real viewport before visual approval.
- No full real-device test, 200% zoom acceptance or restaurant operator signoff yet. No actual checkout production migration.

## Next integrated crafts (remaining, ordered, not new unrelated R&D)
1. **Inspect new populated Cart/Tracking screenshots**, compare 390/1440 against Menu and Home; tune one consistent typography/motion/spacing hierarchy and accessible controls. Confirm the tracking status **appears above the fold** on 390px after hero reduction.
2. **Finalize Cart:** amount hierarchy, size/addon/name rendering, editable quantities, delivery vs pickup details, validation summary and safe failure/retry patterns at 320/390/768/1024/1440 and 200% zoom.
3. **Complete actual Tracking:** saved/pending, confirmed, unreachable, preparing pending-confirmation, ready, out-for-delivery, delivered, rejected/cancelled, offline, missing/bad ID and a clear support route. All as synthetic browser fixtures until secure real API.
4. **Finish secondary chapters with distinct creative roles:** Offers, Food Finder, About, Contact, Reviews, Complaints; no copied full-height headers, fake reviews or fake offers.
5. **Whole-site creative quality:** Home→Menu→Product→Cart→Tracking transition audit, 100 illustrative media source mapping B03/B04/B05/B08 curation, Arabic display hierarchy, small-screen focus, reduced motion, true original 12 photos.
6. **Real release blockers:** approved merchant catalog/prices/availability/hours/delivery/fees/offers, secure tracking capability, independent Postgres staging checkout+idempotency, named staff security, tablet operator inbox and observed POS handoff, real phone/device testing, backups, release approval.

## Why this is a system, not patches

An accepted change must strengthen an explicit *customer decision across screens* and be accompanied by an actual code diff + 390/1440 browser evidence + correctness/accessible/error-state tests. One good screenshot is not completion. The ten-route website remains **OPEN for owner review**. Do not start another generic Django/POS simulation and do not regenerate all 100 images.

**Current boundaries:** Same Next.js repo and draft PR #59, no Supabase data cutover, no payment terminal work, no live merchant/customer records and no production deployment.

## Specific external validation (targeted research, not a fresh strategy reboot)
- Baymard, [Checkout Flow UX Optimization](https://baymard.com/blog/checkout-flow-ux-optimization): keep the review summary visible/easily revisitable, preserve input after errors, do not surprise people with late fees. This project keeps one-page full review and a compact non-payable client total; it does not introduce a forced accordion workflow.
- W3C, [WCAG Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages): dynamic status content should be programmatically identifiable without an unexpected focus jump. Tracking updates its headline politely, while transport failures remain clear `role=alert` messages. Screen-reader manual testing is still due.
