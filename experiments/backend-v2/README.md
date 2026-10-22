# Isolated Django/PostgreSQL order reliability experiment

This is **not** the live Tuscanini server. No POS, cashier, customer-data migration, actual card payment or Supabase connection. The checkout endpoint remains unchanged. The deliberately minimal Django models are a **spike to prove database invariants**, not production-final data design.

## Environment / safety
- CI uses ephemeral PostgreSQL 16 and Django 5.2 LTS.
- Runner refuses any database name except \`tuscanini_spike\`, any host except local loopback, or missing opt-in \`TUSCANINI_SPIKE_ONLY=yes\`.
- Django's test runner creates and destroys its own \`test_tuscanini_spike\` DB.
- No live credentials or merchant customer records. Published CI database password is fixture-only, never a usable production secret.
- Run locally only with disposable PostgreSQL and:
  \`\`\`bash
  python -m pip install -r experiments/backend-v2/requirements.txt
  TUSCANINI_SPIKE_ONLY=yes POSTGRES_DB=tuscanini_spike POSTGRES_USER=spike POSTGRES_PASSWORD=<throwaway-password> python experiments/backend-v2/run_spike.py
  \`\`\`

## Proved by the tests (once GitHub CI reports SUCCESS)
1. All order header/lines/audit/outbox writes commit **together** or roll back **together**.
2. Accepted order totals are generated from catalog rows locked in the same transaction, not user-submitted prices.
3. A unique DB request key makes retries and two concurrent same-key submits converge on the *same* order.
4. Reusing the request key with another normalized cart produces a collision error.
5. A simulated disconnected network does not discard the pending outbox event; successful retry marks it delivered.
6. Payment state is distinct from order state; no actual gateway is implemented.

## Things this does NOT prove
- One single restaurant's true order volume or production hosting costs.
- A benchmark comparing Django/Postgres performance against the current Next/Supabase code. This is a correctness comparison, not a measured latency/cost win.
- Any real POS integration, printer, terminal or cash reconciliation.
- Durable offline merchant LAN continuity or delivery of web orders while the store is offline.
- Exactly-once external event delivery. An event can be sent, then the DB transaction can fail before the acknowledgment; downstream consumers must deduplicate by outbox event ID.
- Actual staff auth/RBAC, completed payment integration, inventory, refund and dispute flows.
- Real migrations, schema portability, or a production deployment plan.
- Production-readiness of \`settings.py\`: fixed single localhost DB and test-only secret.

## Comparison to the inherited TypeScript/Supabase backend

| Case | Existing code (verified by source) | Django/Postgres isolated spike |
|---|---|---|
| Order create | Header, lines/addons and history over multiple DB HTTP calls; best-effort compensating delete | One Postgres transaction for header, lines, event and outbox |
| Server price | Server verifies active products/sizes/addons/offers before write | Server reads and locks authoritative synthetic catalog in transaction |
| Repeated checkout | No durable idempotency key in create code | Unique request key + normalized payload SHA |
| External system outage | No committed outbox integration verified | Durable outbox + recoverable mock sender failure |
| Staff auth/payments/POS | Real production integration not verified | Not implemented; future design only |
| Complexity | Existing App Router and API routes | Adds a separately operated Python server; increased deployments, health monitoring, change synchronization |

Do **not** assume the above justifies migrating to Django. If same transactional approach is available with a simpler retained TypeScript service + independent PostgreSQL, use that baseline as well before final approval.
