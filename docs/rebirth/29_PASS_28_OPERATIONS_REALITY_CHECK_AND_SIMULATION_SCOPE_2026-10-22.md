# TUSCANINI REBIRTH — PASS 28 / Why the simulation exists, what is real, what is assumed
**Date:** 2026-10-22  
**PR:** #59, DRAFT  
**Status:** evidence / operational discovery gate; **not** a claim that the restaurant works like the simulator  
**Owner's question:** *What exactly are we simulating, and on which real-world evidence is it based?*

## The engineering purpose of Passes 25–27

The disposable PostgreSQL/Django and PostgreSQL/TypeScript experiments tested **mechanisms**, not whether we correctly know the merchant's operations:
1. **Atomic transactions:** order + lines + audit/outbox either all commit or all roll back.
2. **Idempotency:** retrying one checkout should not create two orders; race/different payload requires correct handling.
3. **Concurrency:** simultaneous contradictory staff updates must not both succeed.
4. **Durability:** a failed external notification leaves a committed outbox record to replay; a disconnection does not fabricate merchant confirmation.
5. **Trust boundaries:** browser-sent prices are not authoritative, and payment status is independent of fulfillment status.

GitHub Action [#39711012982](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39711012982) proved the **invented model's implementation** (15/15 TypeScript tests) only. It did **not** validate the model against actual Tuscanini staff and equipment. Avoid presenting the pass/fail ratio as real restaurant acceptance, uptime, feature completeness or benchmark.

## Evidence from the inherited/current application source (not actual onsite observations)

| Code or UI behavior actually present | Direct file evidence | Meaning / limit |
|---|---|---|
| Customer checkout sends \`POST /api/orders\`; successful reply saves active order then opens \`/order-success?orderId=...\` | \`components/rebirth/rebirth-checkout.tsx\` | This is the **current web UX**, not evidence that the real kitchen receives the order. The source label \`web_whatsapp\` in the DB insert is historical naming, not proof of WhatsApp delivery. |
| Server checks \`isOrderingOpen\` and server-side catalog validity before creating the record | \`app/api/orders/route.ts\`, \`lib/orders/create-order.ts\` | A persisted record means *received*, not staff accepted, paid or printed. |
| Initial status \`جديد\`, separate \`confirmation_status: pending\`, total labeled estimate | \`lib/orders/create-order.ts\` | Confirmation is a separate field from order progress. |
| Kitchen dashboard includes status \`جديد\` among its active columns | \`types/admin-kitchen.ts\`, \`lib/admin/orders-kitchen-queries.ts\` | Kitchen **can see unconfirmed orders by code**; this may or may not match store policy. |
| Admin \`preparing\` action is allowed when status is \`جديد\`; it does not require \`confirmation_status=confirmed\` | \`lib/admin/orders-admin-validation.ts\` | Current application **does not enforce cashier acceptance before kitchen prep**. |
| Customer tracking prioritizes \`جاري التحضير\` before \`confirmation_status=pending\` | \`components/rebirth/rebirth-order-tracking.tsx\` | A newly created but unconfirmed order can display *preparing* if staff presses preparation. This is another consequence of the current independent statuses, not proof of actual operations. |
| Kitchen dashboard refreshes about every 25 seconds | \`app/admin/kitchen/page.tsx\` | Polling code is not an actual networked KDS/POS/printer integration. |
| 20 table numbers generate links \`/menu?table=N\` | \`app/admin/tables/page.tsx\` | Static QR-friendly links are not a real table-session or restaurant POS flow. |

## What Pass 27 **invented to exercise correctness**

Pass 27's \`experiments/backend-v2/typescript/src/operations.ts\` imposes:

\`received → cashier accept/reject → kitchen start → kitchen ready → cashier deliver\`.

**This is a fixture policy, not a merchant-approved policy.** Particularly important discrepancy: the old UI permits preparation directly from \`جديد\` even when \`confirmation_status=pending\`; the simulator forbids it. **Neither codebase proves the real restaurant policy.**

The test-only HTTP server uses caller-supplied fixture roles and a random local token; **not staff authentication or production authorization**. No real POS callback, KDS adapter, thermal printer, offline POS or payment reconciler exists in the experiment.

## Key unknowns — must be observed, not invented

| Question | Why answer changes system design |
|---|---|
| Which named POS/cashier software (including version) is used in-store? Or is it manual? | Determines whether Tuscanini should **integrate** with a POS versus become a POS. |
| For a web/delivery order, who first acknowledges it: phone/WhatsApp operator, register, cashier, kitchen or delivery worker? | Determines honest accepted/order-confirmation event and permissions. |
| Can kitchen begin on a new unconfirmed request? | Distinguishes current admin behavior from simulator's assumed cashier gate. |
| Is there an actual KDS, thermal printer, verbal kitchen call, paper ticket or tablet? | Determines real integration endpoints and device reliability requirements. |
| Who has the definitive product price/size/modifier/discount data? | Determines catalog source of truth and reconciliation; historical 113 items aren't live approved pricing. |
| Where is the actual payment event recorded: cash drawer, POS terminal, online gateway, external aggregator? | Determines payment ledger, receipt, settlement and refund design; Visa terminal ≠ online checkout. |
| What happens if internet drops at the store? | Determines whether cloud web requests can be accepted, whether store LAN POS continues, how to acknowledge a delayed order. |
| What are delivery, pickup and table-specific handoff processes? | Determines status machine per fulfillment type, branch and liability. |

### Minimum authorized observation — one controlled example per channel
1. Follow **one ordinary staff-handled order** from arrival to cashier to kitchen to handoff. Record actors, screens/device types, receipt/ticket path and *system* status changes. Do not collect customer phone/address/payment details.
2. Follow **one pickup or web/WhatsApp request** and identify who confirms it and what actual signal starts preparation.
3. Observe a **delivery payment/handoff** and its status in the merchant's existing record system. No live tests, shutdowns or intentional outages without explicit restaurant authorization.
4. Record POS product/vendor/version and whether official API, sandbox/webhooks, export file or authorized manual bridge exists. Do not ask for passwords, API secrets, merchant customer records or card details.
5. Owner/operations lead approves **actual** status transition diagram, price authority and money reconciliation boundaries.

## Scope choices to decide **after** observation

**A. Direct-order web channel only** — keep existing POS as operational/financial source of truth; integrate accepted-order handoff (API if available, otherwise supervised adapter). No replacement cashier module or parallel payment ledger.

**B. Owned cashier/kitchen operations** — build or operate POS-equivalent workflow only if no suitable incumbent or explicitly desired; requires devices, receipts, payments, shift close, offline/retry, staff roles and support budgets.

**C. Hybrid** — website owns customer-facing draft/tracking, incumbent POS owns sale/receipt/payment/kitchen, adapter maps IDs/states; integration conflict and duplicate reconciliation are explicit.

None can be chosen from source code or market competitors alone.

## Architecture status after this reality check

- **Solid research result:** both independent Postgres implementations can prove the same transactional failure-safety mechanisms on synthetic data. Pick modular TypeScript/Postgres or Django/Postgres only after actual operations and TCO, not because tests passed.
- **Not yet justified:** additional mock POS/KDS layers pretending they model Tuscanini, binding existing customer routes to experimental HTTP, adding live payment, migrating 113 historical items, implementing vendor-specific integrations, or choosing whether cashier confirmation must gate preparation.
- **Immediate next work with no onsite evidence:** prepare a neutral **integration boundary** and data contracts (\`WebOrderReceived\`, \`MerchantOrderAccepted/Rejected\`, \`KitchenStarted\`, \`PaymentVerified\`) without enforcing a fictitious actor or workflow; map each event to potential incumbent POS provider. A neutral observation sheet and one-page owner confirmation flow is more valuable now than more passing synthetic tests.

## Gates
- Pass 27 remains a **technical sandbox only**.
- Stop treating its fixed staff process as a product requirement.
- Require explicit **merchant workflow signoff** before changing the production order lifecycle, purchasing another POS license or introducing an integration.
- Preserve existing Rebirth design, menu images and historical catalog. **PR #59 DRAFT; no merge or production deployment.**
