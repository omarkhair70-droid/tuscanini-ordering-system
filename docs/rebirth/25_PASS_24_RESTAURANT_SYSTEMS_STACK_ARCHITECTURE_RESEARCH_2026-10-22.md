# TUSCANINI REBIRTH — PASS 24 / RESTAURANT SOFTWARE ARCHITECTURE & TECH STACK RESEARCH
**Date:** 2026-10-22  
**Repository:** `omarkhair70-droid/tuscanini-ordering-system`  
**Branch:** `redesign/tuscanini-authored-experience-20261018`  
**Status:** technical research and architecture options, **NOT code migration/production authorization**  
**Owner direction:** Do not choose Supabase as the future application/data platform. Compare self-managed/managed PostgreSQL, Oracle Database, other proven databases and actual restaurant platforms. Preserve the Rebirth visual work, 100 generated media files and the original historical 113 item records/prices unchanged.

## 0. What is actually being built?
A restaurant product is several operational systems, not a single customer-facing website:
- **Demand:** public branded site, cart, scheduled orders, delivery/pickup, QR entry, campaigns.
- **Store execution:** cashier/POS, staff acceptance, kitchen routing/KDS/printers, handoff and refunds.
- **Money:** separate `order_status` from `payment_status` and settlement/void/refund; close shift and business day, cash drawer and receipts.
- **Truth:** canonical pricing and modifiers, availability, tax/service rules, stock state; exact item vs illustration transparency.
- **Integration:** POS adapters, gateway, couriers, message/webhook delivery, acknowledgment and retries.
- **Operations:** access by person/branch, logs, monitoring, backup/restore, failure handling and offline operation.

Do not confuse an **Oracle Cloud VM running PostgreSQL** with **Oracle Database** or with the licensed **Oracle MICROS Simphony** restaurant POS product. These are three very different decisions.

## 1. Publicly verified real technology stacks — no speculative internals

| Platform | What the company actually documents | What we can learn | Confidence |
|---|---|---|---|
| **Toast** | Official engineering hiring lists **Java/Kotlin backend**, **Java/Kotlin Android POS**, **React/Tailwind/GraphQL**, **PostgreSQL + DynamoDB**, **Pulsar/Camel/RabbitMQ**. Official offline architecture describes **local hub sync** between devices on the property network. | Multiple data stores and messaging follow real operational responsibilities; local continuity is a primary feature. **Do not copy its large-scale microservice stack into a single restaurant.** | Published technical stack + product architecture. |
| **Oracle MICROS Simphony** | Enterprise POS, property/revenue centers, workstation and device services, KDS Controller and shared service, RESTful **Transaction Services Gen2** menu/order integration. Separate cloud and property-local services. | A **store is an operational boundary**; receipt/printer/kitchen/transactions are not just UI pages. This does **not** establish that every Simphony customer runs Oracle Database on each register. | Official Oracle docs. |
| **Odoo** | Official docs show Python server application with PostgreSQL as its DB; POS preloads essential products/customer data in browser cache and stores offline orders for synchronization when online returns, but many backend-dependent features unavailable offline. | A modular monolithic business app on PostgreSQL is normal; offline has specifically documented limits. | Official open product docs. |
| **ERPNext / Frappe** | Python Frappe backend, JS frontend, primarily MariaDB, Redis workers/cache, Node/Socket.IO real-time; Frappe reports PostgreSQL support beta. | Conventional server-side modular app + relational DB + optional queues is industry-normal. | Official Frappe docs / published architecture. |
| **TastyIgniter v4** | Open-source restaurant ordering solution on Laravel/PHP, production DB MySQL/MariaDB and documented PostgreSQL support in specific deployment modes; background queue workers for jobs. | One modular backend + relational DB can support online ordering and management. | Official installation guide; verify installation mode / DB compatibility before implementation. |
| **Foodics** | Public docs establish integrations and API enablement for external systems, plus ordering and branch operations; **a defensible public end-to-end internal stack was NOT verified**. | Investigate concrete API access/licensing and exact merchant POS, do not invent its backend language or DB. | Official product/docs for integration, internals undisclosed. |
| **Sapaad** | Official POS docs: offline order capture and later sync; official KDS 2.0 docs: KDS **does not** operate offline. | “Offline mode” is insufficient shorthand: test POS→KDS→printer→payment **per feature**. | Official support docs. |

### Primary source links
- Toast engineering stack: https://careers.toasttab.com/jobs/senior-software-engineer-android-california-united-states?gh_jid=7550881
- Toast offline local sync: https://doc.toasttab.com/doc/platformguide/adminOfflineModeOverview.html
- Toast creation and POS price authority: https://doc.toasttab.com/doc/devguide/apiCreatingOrders.html
- Toast menu change sync: https://doc.toasttab.com/doc/devguide/apiMenusWebhook.html
- Toast restaurant availability: https://doc.toasttab.com/doc/devguide/apiRxAvailabilityWebhook.html
- Oracle Simphony model: https://docs.oracle.com/cd/F14820_01/doc.191/f15052/c_simphony_intro.htm
- Oracle STS Gen2: https://docs.oracle.com/en/industries/food-beverage/simphony/omsstsg2api/index.html
- Oracle partner sample online menu → checks: https://marketplace.oracle.com/media/134299965/other/Partner_Implementation_Guide_Order_and_Pay_Online.pdf
- Odoo architecture: https://www.odoo.com/documentation/20.0/developer/tutorials/server_framework_101/01_architecture.html
- Odoo POS offline specifics: https://www.odoo.com/documentation/19.0/applications/sales/point_of_sale/use.html
- ERPNext architecture: https://erpnext.com/files/Scaling%20ERPNext.pdf
- Frappe current core architecture: https://docs.frappe.io/framework/user/en/basics
- TastyIgniter 4 installation: https://tastyigniter.com/docs/installation
- Foodics integration: https://help.foodics.com/hc/en-us/articles/9527870053404-Integration-Availability
- Sapaad offline POS: https://kb.sapaad.com/help/how-do-i-use-the-offline-mode-in-walk-in
- Sapaad KDS offline: https://kb.sapaad.com/help/does-kds-work-in-offline-mode

## 2. Cross-system engineering patterns — why they exist

### Price and acceptance
Toast docs explicitly warn that pricing must be recalculated by the POS pricing endpoint before an order is submitted; browser/cart price is not sale authority. A pending request should not say “restaurant confirmed.” Model at least `submitted → accepted/rejected → preparing → ready → handed_off` with precise status permissions. **Payment state is a separate state machine** (`unpaid/initiated/authorized/paid/failed/refunded`, adjusted to provider). A payment redirect or an upstream order ID is not proof of settlement.

### Atomic order, history and outbox
Use a database transaction for `order + lines + selected modifiers + audit history + outbox_event`; on error all rollback. A background publisher transmits committed events to staff/POS/KDS and marks deliveries. Idempotent consumer and dedup key protect against duplicated events/retries. AWS documents this as **transactional outbox**: https://docs.aws.amazon.com/en_en/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html

### Idempotency
Every client-side checkout submission gets a durable unique key, bound to request payload hash/customer scope; repeating the same key returns the original result, not a second order. Gateway operations receive distinct gateway idempotency keys. Stripe's published contract is a good technical pattern reference, **not a recommendation to use Stripe in Egypt**: https://docs.stripe.com/api/idempotent_requests

### Catalog
Don't treat pictures as product identity. `product, variant, modifier_group, modifier_option, availability, channel_visibility, tax_class` have separate roles. Snapshot unit price and tax/fees on order lines to preserve receipt truth. One verified sale-price authority, with revision/version and sync metadata for integrations. Discount application rules require trusted server calculation. Pub/sub/webhook and periodic reconciliation should reflect store's true catalog.

### POS/Kitchen boundary
The local store may accept and print orders even if central cloud is unavailable, but web orders cannot be delivered instantaneously to a disconnected local site. Define **honest delayed/pending state**, staff acknowledgment, polling/backfill and alarm. Test printer and KDS separately; do not promise offline card capture unless licensed provider explicitly supports it.

### Egypt statutory / accounting context
The ETA public e-receipt FAQ says offline receipts can be issued offline and later transmitted (FAQ states a then-current 24-hour period), plus GUID chain/previous UUID/returns and receipt QR requirements. **Applicability to this merchant, enrollment stage, exact deadlines and integrator certification require accountant/ETA confirmation**, not an assumption based on the FAQ alone:
https://pos.eta.gov.eg/ar/faqs

## 3. Database and infrastructure trade-offs

| Choice | Strength | Trade-off | Tuscanini judgment |
|---|---|---|---|
| **Independent PostgreSQL** (managed or on a private VM) | Transactional SQL, foreign keys, indexes, JSONB where justified, Python/Django ecosystem, migration portability | You own schema, access rules, capacity/planning, backups, ops; self-host means running DB reliability | **First candidate** for a single restaurant product moving toward multiple locations |
| **Oracle Database** (Autonomous or licensed) | Mature transactions, advanced enterprise DB features, suitable if contract/support/infrastructure exist | Different SQL/driver/migration semantics; OCI Always Free limits/support; likely more operational overhead and licensing paths | Evaluate objectively, not because Oracle Simphony uses the brand. Better if existing licensed requirements or specific features justify it |
| **MySQL/MariaDB** | Mature relational store used by well-established restaurant software; InnoDB transactions | Migration/ORM/data-type choices differ; no unique advantage established for this specific inherited Postgres schema | Viable, but conversion cost without operational gain seems unjustified |
| **Local SQLite on POS/KDS edge** | Excellent embedded durable local store for carefully designed offline device queue | Not the authoritative multi-user internet backend; needs robust sync/ack/conflict recovery | **Possible future local edge** for actual offline register, only if we own the device software |

**Hosting company ≠ engine:** PostgreSQL can run on an OCI VM, other VPS, or a managed PostgreSQL provider without running Oracle Database. Oracle's Always Free resource documents have CPU/storage/session/support limits; free tiers are useful for labs, **not automatic production resilience or SLA**:
https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
https://www.oracle.com/cloud/free/faq/

Do not pick by $/month sticker alone. Full operational cost = compute + storage + backups + restore tests + logs + bandwidth + developer maintenance + uptime/support + payment gateway fees + POS license/API charges.

## 4. Recommended Tuscanini architecture — one restaurant, not a giant SaaS

**Provisional, pending current POS inspection:**

```
Customers / mobile browser
     Next.js authored web UX (catalog, cart, tracking)
                 |
              HTTPS / API
                 v
             Django modular backend
     ┌────────────┬───────────────┬─────────────────┐
     |  Catalog   |   Orders      | Payments ledger |
     |  Pricing   |  Staff state  | Gateway adapter |
     |  Offers    |  Idempotency  | Refund/reconcile|
     └────────────┴───────────────┴─────────────────┘
                 |
          Postgres transactions
    (orders, lines, payments, audit, outbox)
                 |
           Outbox worker
                 |
    POS adapter / kitchen notification / analytics
                 |
             Store equipment
      POS computer / KDS / printer
```

- **Why Django?** A *practical candidate* given existing Python backend experience, mature ORM, transactions and operator admin; not mandated by Toast or Oracle. A well-designed Next.js TypeScript application server could also be kept if equivalent boundaries/testing/ops are demonstrable. Avoid rebuilding both simultaneously without a migration test plan.
- **Why modular monolith now?** A single branch/store does not gain enough from microservices, Kafka/Pulsar, Kubernetes or multiple independently deployed datastores to offset maintenance. Define modules/contracts, not distributed services prematurely.
- **Redis / Celery:** add only when outbox polling/background delivery and measurable asynchronous workloads require them; Postgres-based worker/outbox is viable at early volumes. Design simple polling with durable outbox first. Realtime UI via SSE/WebSocket or short polling, whichever real latency/cost evidence supports.
- **Store POS adapter:** not chosen until onsite verification. If external POS has API, it may remain the sales and accounting source of truth; our own order DB records customer web intent and verified handoff mapping, not a competing cash ledger.
- **Local/offline:** separate optional edge agent; not required to ship the first controlled web-order release. If introduced, keep it on the LAN and explicitly test conflict recovery, duplicate prevention and security; do not expose raw LAN endpoints to the public internet.

## 5. Domain entities for the new backend (map old records; do not throw them away)

- `menu_category`, `product`, `product_variant`, `modifier_group`, `modifier_option`, `availability`, `catalog_version`.
- `order`, `order_line`, `order_line_modifier` with immutable selling price/charge snapshots and `business_date`.
- `order_status_event` for staff operations; `payment_attempt`, `payment_transaction`, `refund`, `settlement_record` for money — independent of order status.
- `idempotency_record`, `outbox_event`, `inbox_processed_event`, `pos_external_mapping`, `sync_checkpoint` for reliable integration.
- `staff_user`, `role_permission`, `audit_event`, `shift_close`; optional `kitchen_ticket`, `receipt`, `delivery_handoff`.
- Future multi-store only: `organization`, `location`, location-specific prices/catalog + tenant isolation in *all* keys and permissions. Do not bolt tenant fields onto existing schema blindly.

## 6. Measurable load plan (do not pretend these are current restaurant numbers)

Example scenarios to benchmark, **not forecasts**:

| Synthetic load | Orders/day | Line items/order | Implied lines/day |
|---|---:|---:|---:|
| Pilot | 50 | 3 | 150 |
| Busy single branch | 500 | 4 | 2,000 |
| Multi-branch stress fixture | 5,000 | 4 | 20,000 |

Tests to run: p50/p95 API checkout and staff board latency, menu TTFB, failed/replayed checkout rate, duplicated ticket count, webhook/outbox time-to-delivery, restart/recovery, DB pool saturation, peak orders/min, offline reconnection, backup restore recovery point/time. Load tests use synthetic IDs and non-production payment providers only.

## 7. Exact decision gates

**Gate A — physical store truth:** identify existing POS software, OS/license, printer model, local network, internet/failover, finance terminal vs online gateway, menu source; show synthetic register order with authorization.

**Gate B — data model + invariants:** inventory the existing 20-table schema vs current needs; preserve original 113 items and previous price records. Define order/payment invariants and settlement; versioned schema, migration rollback/backup.

**Gate C — architecture spike:** build TWO local throwaway endpoints only, not production migrations: (1) independent Postgres and Django transaction/idempotent order submission; (2) POS/KDS adapter mock + durable outbox relay. Load/retry/failure/latency test them. Compare with equivalent simplest retained TypeScript API option before locking framework.

**Gate D — cost + operational model:** price 3 real hosting scenarios (managed PostgreSQL, OCI/Postgres VM, other VPS), with backup, restores, maintenance and gateway/POS costs. No unsupported $ claim before observing deployment and load.

**Gate E — production launch:** secure staff login, paid/rejected/refund/settled states, current merchant menu signoff, live accepted-order and kitchen test with staff, signed gateway webhook, simulated outage; *owner must authorize actual deploy/merge*.

## 8. Specific changes to previous discussions

- **Do not automatically continue strengthening Supabase-specific functions as if they were the future architecture.** Pass 23 added stale-write protection to inherited code; it does not decide the long-term stack.
- **Do not confuse a successful Next.js CI build with validated real restaurant operations.**
- **Do not migrate raw merchant customer/payment/order databases without permissions, backup, test plan or owner signoff.**
- **No microservices-by-fashion, no gratuitous complexity, no unnecessary visual restart.**
- Research is a **source-backed comparison**, not proof of any company's secret internal implementation.

**PR #59 remains DRAFT. NO MERGE. NO PRODUCTION DEPLOY. NO PAYMENT OR STORE DATA MUTATIONS.**
