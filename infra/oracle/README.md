# Tuscanini Rebirth — Oracle + Coolify + PostgreSQL cutover

**Purpose:** turn the **same Vercel website** + **same `/operator/orders`** into a
real remotely connected web-order flow. This is a **deployment runbook**, not a
second tracker. Keep statuses, all feature work and evidence in
[`docs/rebirth/WORKING_BOARD.md`](../../docs/rebirth/WORKING_BOARD.md).

## Audited reality (23 October 2026)

- Vercel branch preview currently works, including a public **20 fictional order**
  interactive demonstration at `/operator/orders`; button presses only update
  the browser's local state.
- A real order transaction and the true two-browser operator/customer cycle run
  against **disposable local PostgreSQL** in GitHub Actions.
- The source under `experiments/backend-v2/typescript` is **explicitly local-only**:
  `db.ts` rejects a remote DB; `http.ts` binds only to `127.0.0.1` and uses
  caller-supplied test roles, and `studio.ts` imports a **synthetic** catalog.
  Do **not** publish that simulator on Oracle as a live ordering API, lift its
  database guard, or re-use its test token as merchant authentication.
- `app/api/orders/route.ts` uses the local studio bridge only on localhost;
  otherwise it still uses the **existing Supabase path**. The operator demo is
  not connected to the Supabase path.
- Oracle already runs other apps under Coolify. Reuse the VM **only after**
  checking free resources. Keep Tuscanini's DB, user, volume, API, backups and
  domain **separate from Nova and Plantupia**, without restarting them.
- No OCI / Coolify administrative session is available from the current
  GitHub/Vercel connection. The file below is **committed but not deployed**.

## Final topology

```text
           CUSTOMER PHONE                    RESTAURANT TABLET
                 |                                  |
                 |    same Vercel Next.js site      |
                 +--------------+-------------------+
                                |
                 Next Route Handlers (server)
              validate + idempotency + auth
                                |
                    TLS, server-to-server
                    ORDER_API_ORIGIN (Oracle)
                                |
               isolated Tuscanini API container
                token/session/scope enforced
                                |
              internal Docker network ONLY
                                |
                   tuscanini-postgres
             isolated user, volume and backups

 Existing Nova/Plantupia DB/API/Redis do not participate.
 ```

## Cutover gates — in order

### OCI-01: Inventory resources without changing anything
- Check existing Coolify project, available disk/RAM/CPU, port 80/443 proxy,
  certificate automation, backups, logs and server health.
- Capture existing Nova/Plantupia service names for a **do-not-touch** list;
  do not copy secrets or cross-connect data.
- Define separate Coolify `Tuscanini / Orders` project/environment.

### OCI-02: Dedicated database (config prepared, deployment pending)
- New Git-based Docker Compose resource from
  `infra/oracle/postgres.compose.yaml`.
- Required secret in Coolify: `TUSCANINI_DB_PASSWORD` (create there; **never**
  commit the value). Optional: `TUSCANINI_DB_USER=tuscanini_app` and
  `TUSCANINI_DB_NAME=tuscanini_orders`.
- Persistent `tuscanini_pgdata` volume; **no published 5432 port**, no public
  database domain. Verify `pg_isready` in resource health logs.
- Test backup AND restore on an isolated scratch database before live orders.
- DB container `READY` is only a database gate, **not** end-to-end readiness.

### OCI-03: Build a real, isolated order API — NOT the local fixture
- Separate migration-managed app schema (e.g. `tuscanini`, not `spike_ts`)
  with catalog, prices/addons, order/idempotency, event ledger/outbox, staff
  state transitions, delivery/pickup, no false payment success.
- Use separate runtime identity with least privilege, parameterized SQL,
  constraints, transactions, bounded queries, expiry/retention and repeatable
  migrations; provide health, readiness and database liveness routes.
- Auth: Vercel server-to-Oracle signed service calls, and protected
  **restaurant action** session/key. Never trust user-supplied role headers,
  never expose Vercel-to-Oracle shared secret or PG URL in client JavaScript.
- Customer tracking must carry a private unguessable capability or equivalent
  access check; enforce no-cache for PII, request limits, origin validation.
- Only **approved**, current merchant catalog/prices may activate real order
  intake. Until approval, keep synthetic orders isolated and clearly labelled.
- Outbox workers must retry with claim/lease, no lengthy network work under
  open DB transactions; replay must be idempotent.

### OCI-04: Ship API via Coolify to Oracle
- New Git-backed application; deploy **reviewed code and migrations only**.
- Bind service on internal `0.0.0.0` port and use Coolify's HTTPS proxy on an
  independent API hostname. Restrict accessible routes; do not expose DB.
- API environment secrets stored in Coolify, plus a server-only corresponding
  secret under **Vercel Preview environment for this branch**, never
  `NEXT_PUBLIC_*`. Use separate credentials for eventual Production.
- Confirm health, TLS, security headers, log redaction and no public staff data.
- Verify resource limits, restart behavior and DB persistent volume.

### OCI-05: Connect the existing site
- Next `/api/orders`, `/api/orders/track` and restaurant inbox/actions
  choose the new server-to-server API **only when a reviewed feature flag is on**.
- Preserve existing URLs, cart, tracking and Order Press/Ticket Rail design.
  The 20-demo mode remains explicit and disabled in live-operator mode.
- A customer browser **never accesses PostgreSQL directly**.
- Record provider status separately from actual order status; never claim
  payment was collected or refunded without a provider-confirmed event.
- Use a separate set of sample/QA orders that cannot be confused with live
  customer orders. Feature flag `ORDER_BACKEND=oracle` is **not yet
  implemented**; this is the intended routing control, not a current variable.

### OCI-06: End-to-end acceptance before customer launch
1. Two real devices on different networks:
   create one sample from phone → DB once → tablet notification → accept →
   preparing → ready → handoff → same live ticket.
2. Duplicate tap, delayed response, Vercel retry, stale cart/repriced item,
   declined restaurant order, address privacy, wrong pickup/delivery mode.
3. Tablet sleeping/offline/recovering, API reboot, Postgres restart, quick
   re-login, sound opt-in, delayed event, multi-tab.
4. Authorization abuse: anonymous inbox/action blocked, request tampering,
   protected customer tracking data, rate limit, no raw card handling.
5. Preview and production isolation, actual logs, daily backup and scratch
   restore, clear rollback route to stop accepting orders.

### OCI-07: Go-live decision
- Merchant approves active menu/prices/offers/hours, location + zones/fees,
  cash/prepay possibilities, cancellation/refund and order responsibility.
- Sign off from real tablet owner and run a supervised pilot, then enable the
  actual web-order intake explicitly. This doesn't require replacing the
  existing POS or Talabat.
- A `READY` deployment in Vercel or Coolify is **not** proof of merchant
  acceptance. Keep PR #59 Draft until the user approves merge/release.

## Zero-secret configuration inventory

| Where | Variable / setting | State |
|---|---|---|
| Coolify DB | `TUSCANINI_DB_NAME`, `TUSCANINI_DB_USER`, `TUSCANINI_DB_PASSWORD` | Compose source prepared; values NOT set here |
| Coolify app | `DATABASE_URL`, `PORT`, app key, HTTPS domain | Real API must be built; NOT configured |
| Vercel Preview | `ORDER_API_ORIGIN`, server-only auth and opt-in flag | Future contract; NOT configured |
| Merchant | Approved menu + options, delivery policy, collection/refund policy | Missing owner sign-off |
| Backups | Database snapshot schedule + restore exercise | Not yet verified |

**Explicit non-goals:** expose Postgres 5432 to the internet; point Tuscanini
at `nova-postgres-18` or Plantupia DB; turn the test simulator into a live
service by deleting guard checks; collect raw cards/CVV; mark unpaid orders as
paid; automatic production promotion; invent current prices or delivery fees.

References: [Coolify Git Compose](https://coolify.io/docs/applications/builds/docker-compose) and
[Coolify environment variables](https://coolify.io/docs/applications/configuration/environment-variables).
