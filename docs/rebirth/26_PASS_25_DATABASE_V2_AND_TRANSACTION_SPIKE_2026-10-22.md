# TUSCANINI REBIRTH — PASS 25: Database V2 invariants + executable PostgreSQL spike
**Date:** 2026-10-22 · **PR:** #59 Draft · **Branch:** \`redesign/tuscanini-authored-experience-20261018\`
**Status:** isolated proof of backend model. NOT a live migration, not a production rollout.

## Architecture decision under test

Propose **independent PostgreSQL** as the database engine, with an application service owning authoritative order creation, price validation, payments and staff permissions. Django is one candidate application service, alongside a retained TypeScript API. Do not adopt Oracle Database or Django for fashion. Compare complexity, operations and costs before finalizing.

The proof-of-concept is in \`experiments/backend-v2\`: actual Django ORM models and a real PostgreSQL 16 service in CI, with atomic transactions, catalog locks, unique request idempotency, status audit and outbox. Tests deliberately simulate rollback at multiple internal write stages and a disconnected outbox receiver. Their success only proves these isolated properties.

## Database V2 draft (domain boundaries, NOT migration SQL)

\`\`\`text
Catalog
  category -> product -> variant/size
                   \\-> modifier_group -> modifier_option
  location_channel_availability
  catalog_revision/pricing_revision

Checkout/Order (transactional aggregate)
  order(request_key UNIQUE, fingerprint, source, branch_id?, status, totals, business_date)
   |-- order_line(product_snapshot, variant_snapshot, unit_price, tax, qty)
   |-- order_line_modifier(modifier_snapshot, surcharge)
   |-- order_status_event(actor_id, from_status, to_status, timestamp)
   \\-- outbox_event(event_id UNIQUE, topic, payload, published_at)

Money (independent from kitchen states)
  payment_attempt(order_id, provider, reference, amount, status)
  payment_transaction(provider_event_id UNIQUE, type, amount, verified_at)
  refund(payment_transaction_id, amount, state)
  settlement_record(provider, external_batch_id, amount, reconciled_at)

Operations + external systems
  staff_identity + role_permissions + audit_action
  pos_order_mapping(order_id, pos_external_order_id)
  inbox_processed_event(source, event_id UNIQUE)
  integration_cursor(destination, checkpoint)
  kitchen_ticket, table_session, delivery_handoff (if needed)

Future multi-store only (no premature implementation):
  business / location / per-location catalog and prices + tenant controls
\`\`\`

**Hard invariants:** no order accepted before store staff/compatible POS ACK; no public claim of payment success before verified provider data; server-authoritative pricing; exactly one committed order per request key/payload scope; atomic order and history state transitions; outbox at-least-once delivery with idempotent receiving systems; receipts must reflect immutable line snapshots. A schema that stores statuses as text also needs enforced state-transition application logic.

## Migration notes from inherited schema

- \`menu_categories\` → category, \`products\` → product, \`product_sizes\` → variant, \`product_addons\`/\`product_addon_links\` → modifier catalog; verify current 113 historical records and preserve old prices as historical only.
- \`orders\`/\`order_items\`/\`order_item_addons\` → transactional order aggregate; \`order_status_history\` → status events; \`kitchen_tickets\` and \`delivery_handoffs\` remain domain components, not necessarily new tables if external POS owns them.
- \`profiles\`/\`user_roles\` need real identities and permission policies; \`customer_flags\` requires explicit access/retention justification.
- \`site_settings\` and \`daily_metrics\` are not sources of finance settlement truth.
- No existing card payment ledger detected in reviewed repo: settlement cannot be backfilled from estimated order totals.

## Trial scenarios & acceptance

| Scenario | Expected contract |
|---|---|
| 2 concurrent requests with same key | 1 database order/1 outbox event |
| Same key, different cart | deterministic conflict, no second order |
| Failure immediately after header, items, history, or outbox insert | 0 persisted order-related rows |
| Price altered by client vs stored catalog | calculate from trusted DB only |
| Network disconnect during outbox publish | event remains pending for later attempt |
| Outbox sender succeeds twice due to ACK crash | consumer deduplicates by event ID; not exactly-once |
| Payment failed | order state and money state remain distinct |
| POS unavailable | do not fabricate store confirmation |

**Important:** test runners must prove these claims before marking their result green. Tests intentionally do not touch customer records or payment devices.

## Decision still pending

- Actual restaurant POS software/hardware, price authority, printer and internet loss behavior.
- Comparison of *equivalent transactional algorithms* in retained TypeScript + independent Postgres vs Django + independent Postgres, then TCO and operations.
- Postgres backup/restore, access controls, production migrations, RLS/DB roles, monitoring and current store worker management.
- Merchant acceptance, refunds, ETA and payment provider/settlement rules.
- A written code freeze/migration plan and rollback rehearsal before any database cutover.

**No Supabase-to-production-Postgres move in this pass. PR #59 stays Draft. No Merge or Deploy.**
