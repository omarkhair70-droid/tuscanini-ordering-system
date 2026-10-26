# TUSCANINI — ORDER IN MOTION / LIVING TICKET
**Design decision:** 2026-10-22. **Branch:** `redesign/tuscanini-authored-experience-20261018` | **PR #59:** DRAFT.

## Idea
The order experience feels like a live printed ticket from Tuscanini — **not** a logistics dashboard, generic shipping timeline, kitchen cartoon, stock watch animation or automatically advancing progress bar.

**What we borrowed as thinking, never directly copied:** receipt redesign by BERG (the utility print object as experience), Don Fuego's menu-as-brand ephemera, Brutø's editorial typographic and paper treatment. Apply existing Tuscanini yellow/ink/chili red/cream imagery and real brand components, not their palettes or layouts.
References:
- https://www.feeldesain.com/receipt-redesign-berg.html
- https://www.behance.net/gallery/245842917/DON-FUEGO-Open-Fire-Restaurant
- https://www.creativereview.co.uk/bruto-brutalist-branding-wunder-werkz/
- https://help.shopify.com/en/manual/fulfillment/setup/order-status-page/understanding-order-status-pages
- https://www.w3.org/WAI/WCAG21/Understanding/status-messages
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion

## Design language contract
1. **State leads:** The current truth occupies the first screen on 320/390 mobile, visually bigger than the page intro.
2. **Ticket ≠ financial receipt:** Paper receipt metaphor never pretends payment, kitchen printing, accepted sale or ETA. Copy says "دي تذكرة متابعة، مش إيصال دفع".
3. **Connected evidence:** Three factual records (order saved; merchant confirmation; fulfillment progress) are visually connected by typography and dashed tear lines, **not** 3 unrelated colored cards or fictitious sequential completion.
4. **Distinct physical texture:** editorial masthead, crooked rubber-stamp **decorative** mark, 01/02/03 indexed strip, tear edge, reference on detachable paper. Layout is native HTML/CSS; no external image/code dependency.
5. **Motion only on real status change:** a brief .45s stamp arrival animation keyed to server-derived status. No looping chef/courier, fake percentages, or progress extrapolation. Disable when `prefers-reduced-motion:reduce`. Never pull data from animation.
6. **Human-friendly edges:** clear offline/stale label, manual refresh, 15-second visible-tab polling, explicit support links and cancellation/unreachable states.
7. **Photos:** Tracking does not need generated food glamour; maintain the 12 real restaurant context photos on discovery pages. The ticket relies on typography, meaningful blank space and authentic order details.

## Functional contract
The server state remains read-only and authoritative. `confirmationStatus` and `status` remain independent even if the legacy backend says preparing while merchant confirmation is pending. Never show payment confirmation without financial verification. No automatic re-submission or work on the existing POS/Talabat tablets.

No live order, merchant data, prices, database schema, backend contract or card payment modified by this pass.

## Verification gates
- Existing 320/390/768/1440 browser smoke must pass, including independent verified/waiting status cards and offline stale recovery.
- Capture full-page 390 screenshots for `pending` and `preparing with pending merchant confirmation`, plus 1440 tracking. Inspect actual screenshot for clipping, contrast, mobile status prominence.
- Ensure all stage labels are text, not hue/stamp only; ensure screen reader status via existing `aria-live="polite"` and errors via `role="alert"`.
- Verify no unbounded auto-animation, layout shift or fabricated ETA.
- Compare against actual restaurant status once staff process is observed; synthetic fixture does not certify production operations.

## Scope left to close before "website finished"
- All tracking states across payment-independent fulfillment and errors, order not found, cancellation, unreachable, ready, out for delivery, delivered and support flow.
- 200% zoom and real mobile reduced-motion keyboard QA.
- End-to-end site creative direction and owner-approved menu/prices, staged Postgres safety, actual merchant operator inbox.
