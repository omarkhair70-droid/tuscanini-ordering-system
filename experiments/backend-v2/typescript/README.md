# TypeScript + independent PostgreSQL V2 ordering spike

**NO Supabase. NO live merchant data. NO production endpoint.**  
This is a test-only, independent Node.js/TypeScript backend experiment in the existing Tuscanini repo.

- Technology: Node 22, `pg`, TypeScript with `tsx` tests, PostgreSQL 16.
- Separate schema: `spike_ts`, created and dropped on a **disposable** local DB named exactly `tuscanini_spike`.
- Hard safety gate: `TUSCANINI_SPIKE_ONLY=yes`, `POSTGRES_DB=tuscanini_spike`, and `POSTGRES_HOST=127.0.0.1` or `localhost`.
- No production DSN inherited from `DATABASE_URL` or Supabase. Never put merchant database passwords into CI.
- The CI workflow provides the disposable PostgreSQL service and runs `npm run typecheck` and `npm test` here.
- A repeat checkout is assigned a durable `request_key`; on conflict with the same SHA-256 cart fingerprint it returns the original DB order.
- Each order + all lines + audit event + outbox event is a *single* PostgreSQL transaction with deterministic catalog row locking and DB-sourced prices.
- `deliverOneOutbox` is a **mock**; no external POS, notifications or card processor is called.

## Run only with your own disposable local PostgreSQL

The test schema is dropped and recreated. It is prohibited to point these tests at any actual store, customer or production DB.

```bash
cd experiments/backend-v2/typescript
npm install --no-package-lock
TUSCANINI_SPIKE_ONLY=yes POSTGRES_DB=tuscanini_spike POSTGRES_USER=spike \
 POSTGRES_PASSWORD=local-test-only-password POSTGRES_HOST=127.0.0.1 \
 npm run typecheck
TUSCANINI_SPIKE_ONLY=yes POSTGRES_DB=tuscanini_spike POSTGRES_USER=spike \
 POSTGRES_PASSWORD=local-test-only-password POSTGRES_HOST=127.0.0.1 \
 npm test
```

## Not proven

No HTTP API or production auth exists here. No workload latency, cost, multi-register/offline resilience, user/branch permissions, gateway integration, printer integration, refunds or real cashier acceptance has been proven. This implementation is intentionally limited; it is not a drop-in replacement for the existing Next.js app.

The `outbox` toy holds a DB lock while calling a mock sender; a real outbox worker should use short-lived claim/lease and retry backoff, avoid holding DB transactions during slow network operations, and require deduplication downstream.

See `docs/rebirth/27_PASS_26_TYPESCRIPT_POSTGRES_PARITY_2026-10-22.md` for the **decision matrix**. Correctness parity does not establish performance superiority.


## Pass 27 — operational HTTP / POS simulation (local only)
- \`src/operations.ts\`: cashier accept/reject, kitchen start/ready, cashier deliver as a **row-locked finite-state machine**, with order-state + audit row + durable outbox committed atomically.
- \`src/http.ts\`: test-only JSON API listening **only on 127.0.0.1 on an ephemeral port**, when explicit local DB safety flags are set. \`POST /api/orders\`, \`GET /api/orders/:id/tracking\`, \`POST /api/staff/orders/:id/decision\`, \`POST /api/kitchen/orders/:id/progress\` and \`POST /api/staff/orders/:id/handoff\`.
- The API uses a **random fixture-only token** and a **caller-supplied simulated role**. This is **NOT REAL AUTH**. It is intentionally unusable as a production cashier/kitchen API. No payment confirmation, real POS, networked printer or mobile device is connected.
- \`tests/orders.test.ts\` contains isolated end-to-end HTTP fixtures for happy and rejected workflows, no premature kitchen action, stale concurrent staff updates, network retry and transaction rollback, plus the previous checkout tests.
- The outbox mock sends while holding a database transaction; **real production worker must use claim/lease/backoff and deduplicated consumers**. A web submit marked \`received\` is NOT a restaurant-confirmed order.

## Order Room — the first working customer ↔ operator loop

**From generic backend spike to one operational feature:** An interactive local browser studio is now included at `studio/index.html`. Both views talk to the same persisted PostgreSQL records through the same HTTP server:
`customer submit → DB order/outbox → operator inbox → staff action → DB event log → customer ticket`.

To launch (ONLY against a disposable PostgreSQL 16 database on the same computer, named exactly `tuscanini_spike`):

```bash
cd experiments/backend-v2/typescript
npm install --no-package-lock
TUSCANINI_SPIKE_ONLY=yes POSTGRES_DB=tuscanini_spike POSTGRES_HOST=127.0.0.1 \
 POSTGRES_USER=spike POSTGRES_PASSWORD=local-test-only-password npm run studio
```

Open the printed `http://127.0.0.1:<port>/studio` twice, customer and operator. Place a sample order in one view, accept / start / ready / delivered in the other. The ticket loads the actual persisted event ledger and refreshes while visible. A local browser tab can request optional **foreground** notifications. A stopped/restarted server retains database orders; Node tests, in contrast, reset their disposable test schema.

New endpoints: `GET /api/staff/orders` (requires test role/token), `GET /api/orders/:id/events`, `GET /api/studio/catalog`, `GET /studio`. The existing write and tracking endpoints remain test-only. Two new PostgreSQL HTTP tests verify that the operator inbox sees customer orders and that a staff action adds durable events; invalid early kitchen processing produces no event.

**Intentional boundary:** This works on one computer in two browser windows, not as a public staff app; the staff token/role is **fixture-only** and unfit for production auth, and the sample menu is fictitious. The studio is not yet embedded into the authored Next.js Rebirth pages. **Background mobile Push is NOT implemented**; that requires a real Push subscription, service worker and server-side sender. Talabat and the existing conventional POS remain separate.

**Next code step:** Mount the same order-event contracts behind Next.js staging-only adapters, use separate staff identities/tracking capabilities, and build the real tablet-first UI with approved merchant menu choices. Keep order transport/test environment separable from live Supabase data until migration is deliberately complete.
