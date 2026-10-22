# TUSCANINI REBIRTH — PASS 27 / Operator, Kitchen & HTTP Workflow Simulation
**Date:** 2026-10-22
**Repo:** `omarkhair70-droid/tuscanini-ordering-system`
**Branch:** `redesign/tuscanini-authored-experience-20261018`
**PR:** #59 DRAFT — no merge or production deployment.

## Outcome (verified)
This pass extends the isolated **TypeScript + independent PostgreSQL 16** experiment. It does **not** integrate actual store software, a card gateway, a payment terminal or any merchant/customer production database.

- Added `experiments/backend-v2/typescript/src/operations.ts`: transactional staff state transitions, row locking, role-specific action rules and `OperationalError` 400/403/404/409 statuses.
- Added `experiments/backend-v2/typescript/src/http.ts`: *test-only* local HTTP adapter bound to **127.0.0.1** on an ephemeral port, guarded by the existing disposable DB environment restrictions.
- Updated `experiments/backend-v2/typescript/schema.sql` to include `actor_role` and `action` in the **isolated** order status-event audit schema; original restaurant database unchanged.
- Expanded `experiments/backend-v2/typescript/tests/orders.test.ts` with seven end-to-end/failure tests; **15 tests in all**.
- [GitHub Actions #39711012982](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39711012982) **SUCCESS** on code commit `9ec9598f8c078f7db18259dfbdbe6f75b7c58e3c`. The TypeScript job passed `tsc` and **15/15 tests** (job logs `# tests 15, # pass 15, # fail 0`). The same run's Django job completed successfully with its earlier 8 tests. [Second independent spike run #39711017453](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39711017453) also succeeded.
- Next.js Home CI and Browser/Visual QA on this SHA are separate workflows; verify actual conclusions before claiming globally green.

## Transition rules (fixture business policy, not signed off by actual restaurant)

```text
Customer (POST /api/orders)
               |
          received
               |
         Cashier decision
            /       \
       accept      reject
         |           |
      accepted    rejected [terminal]
         |
    Kitchen start
         |
     preparing
         |
     Kitchen ready
         |
        ready
         |
   Cashier handoff
         |
     delivered
```

| Action | Fixture role | Required previous | New state |
|---|---|---|---|
| accept | cashier | received | accepted |
| reject | cashier | received | rejected |
| start | kitchen | accepted | preparing |
| ready | kitchen | preparing | ready |
| deliver | cashier | ready | delivered |

The row in `spike_ts.orders` is locked with `SELECT ... FOR UPDATE`, then `orders.status`, `order_status_event`, and `outbox_event` are committed in a single database transaction. If the change fails, none commits. Thus racing accept/reject actions cannot both succeed.

**Customer truth:** `received` means only persisted; **not** store acceptance. Payment status is separate from fulfillment and no payment provider is connected.

## Test-only loopback HTTP contracts

```text
POST /api/orders                                  {requestKey, items}
GET  /api/orders/:id/tracking                     -> {id,status,subtotal_cents}
POST /api/staff/orders/:id/decision               {action:"accept"|"reject"}
POST /api/kitchen/orders/:id/progress             {action:"start"|"ready"}
POST /api/staff/orders/:id/handoff                {action:"deliver"}
```

**CRITICAL:** `x-spike-role` is **caller-controlled**, and `x-spike-test-token` is a randomly generated test fixture, *NOT* a real identity, authorization or security model. Server binds loopback only, when `TUSCANINI_SPIKE_ONLY=yes` and Postgres DB name/host match the disposable test guard. **Never connect this HTTP adapter to the public site.** No real POS API, printer, refund, payments, staff user records or personally identifying data are included.

## Verified 15-test coverage
1. Catalog-sourced price and immutable snapshots.
2. Same-key repeat / cart reorder returns existing order.
3. Same key with another payload conflicts.
4. Rollback after header, lines, history or outbox insertion.
5. Simultaneous duplicate order returns one order.
6. Outbox retry after simulated disconnected transport.
7. Payment failure independent from order status (synthetic database).
8. Valid retry after failed order transaction.
9. HTTP customer → cashier accept → kitchen start → kitchen ready → cashier deliver; 5 state events and 5 outbox records.
10. HTTP cashier rejects; kitchen cannot start rejected order.
11. Missing fixture token, wrong role or premature kitchen access rejected.
12. Failed staff status update rolls back status, audit and outbox.
13. Racing staff accept/reject only one succeeds.
14. Outbox notifications survive simulated shop-offline transport and can be retried.
15. Malformed input/nonexistent order does not create phantom records.

## What this is NOT
- Not a real POS or kitchen device connection and not proof of LAN/offline continuity. Cloud events persist; they cannot be delivered instantly to a disconnected location.
- Not secure staff login. Fixture role header is **insecure by design** and for tests only.
- Not a payment, tax receipt, refund, settlement or delivery management system.
- Not load/latency benchmarking. CI suite wall-clock execution time is NOT request latency or throughput.
- Not a deployable independent API; request validation and error handling are deliberately minimal.
- The spike's outbox callback still runs while holding a DB transaction, which is **NOT production worker architecture**; production requires short-lease claims, backoff, dedup and failure monitoring.
- No approval to migrate the historical 113 menu items, alter prices, replace operational Supabase live environment, or merge PR #59.

## Next engineering unit: evidence-based production topology
1. Replace the local-only role stub in a *separate* nonlive contract design with a real staff identity/role model and server-side auth; no blind copying of fixture headers.
2. Introduce a **fake POS/KDS adapter + inbox dedup** and a short-lease/ack durable worker; test transport outage, crash-after-send-before-ack, replay and recovered connectivity.
3. Implement a controlled HTTP concurrency/latency harness (p50/p95, error/replay rate, DB round trips and CPU/memory), comparing only equalized transactions/requests/connection pooling on the same machine.
4. Identify real restaurant POS and merchant workflow and confirm who has authority for menu prices and acceptance. Do not choose a production adapter without this.
5. Preserve the Rebirth visual QA as a parallel track. Final go-live requires owner's explicit approval and verified current pricing/payments.

**Status:** Code and CI proof done inside Draft branch. No main merge, production deploy or merchant mutation.
