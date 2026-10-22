# TUSCANINI REBIRTH — PASS 26: TypeScript vs Django, independent PostgreSQL
**Date:** 2026-10-22
**Repo:** `omarkhair70-droid/tuscanini-ordering-system`
**PR:** #59 DRAFT, branch `redesign/tuscanini-authored-experience-20261018`.
**Production authorization:** NONE; no merge, deployment, real merchant payments or Supabase data migration.

## What was actually implemented

Two *independent*, isolated order/DB correctness spikes, both using **PostgreSQL 16** with disposable, localhost-only test DBs:
- Python `experiments/backend-v2/spike`: Django 5.2 LTS ORM, `transaction.atomic()`, `select_for_update()`, unique idempotency request key, immutable order lines, status-event and outbox.
- TypeScript `experiments/backend-v2/typescript`: Node.js 22, `pg`, handwritten parameterized PostgreSQL queries, `BEGIN/COMMIT/ROLLBACK`, `SELECT ... FOR UPDATE`, database UNIQUE request key, immutable order-line snapshots and outbox; strict `tsc` gate.
- CI `.github/workflows/tuscanini-backend-v2-spike.yml` runs two separate jobs, each on its own ephemeral PostgreSQL 16 service. The TypeScript test suite drops and recreates only test schema `spike_ts` on explicitly named local `tuscanini_spike`.

## Verified evidence

- [GitHub Actions #39709420180](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39709420180) on code+CI commit `c022f26ce3645061178db749276368e1e004e8fe` **completed SUCCESS** for BOTH jobs, incl. TS typecheck. Observed job logs: **Django 7/7; TypeScript 8/8**. The TypeScript suite has an extra test for valid retry after a prior failed transaction.
- In subsequent commit `d851a982`, the equivalent Django retry-after-fault test was added. **Verified** [GitHub Actions #39709544334](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39709544334): BOTH Django **8/8** and TypeScript **8/8** passed. **Verified** [Home CI #39709735191](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39709735191) on commit `36359c1a`: standalone TS spike excluded from Next.js root `tsconfig.json`, restoring root typecheck and Next build.
- These are correctness and rollback tests, NOT request latency, throughput or cost measurements. Times such as `Ran 7 tests in 0.219s` are test-runner timing and are NOT comparative performance evidence.

## Matching invariants / a precise result

| Invariant / scenario | Django + Postgres | TypeScript + Postgres |
|---|---|---|
| All DB writes for a new order transactional | Demonstrated | Demonstrated |
| Catalog-derived prices + immutable snapshots | Demonstrated | Demonstrated |
| Normalized-cart SHA + same-key retry | Demonstrated | Demonstrated |
| Same key with different cart rejects | Demonstrated | Demonstrated |
| Two concurrent same-key submissions create one order | Demonstrated | Demonstrated |
| Injected failure after header/lines/audit/outbox rolls all back | Demonstrated | Demonstrated |
| Disconnected outbox sender can retry | Demonstrated | Demonstrated |
| Payment and order status separate | Demonstrated | Demonstrated |
| Retry after failed transaction | Demonstrated | Demonstrated |
| Actual production staff/POS/payment settlement | NOT PROVEN | NOT PROVEN |
| Latency/cost/throughput advantage | NOT MEASURED | NOT MEASURED |

**Important:** These are *functionally corresponding*, NOT byte-for-byte equivalent schema or equally optimized code paths. Django uses ORM bulk-create; TypeScript inserts lines one at a time in the spike. Do not compare raw suite-duration numbers as a performance benchmark. A later statistically controlled harness must equalize database schema/indexes, connections/warmup, request mix, environment, batch patterns and concurrency.

## Technical comparison

| Factor | Retained TypeScript + independent PostgreSQL | Separate Django + independent PostgreSQL |
|---|---|---|
| App logic surface | Can remain part of existing Next.js TypeScript runtime | Separate Python backend service and API boundary |
| Operational footprint | Potentially fewer runtimes/deploys; still requires database, backup, worker and pooling | Additional service/version/deployment, but familiar Django admin/ORM patterns |
| Data consistency | PostgreSQL transactions and constraints in `pg` | Same PostgreSQL guarantees via ORM transaction |
| Background events | External worker needed for durable outbox; `pg` or another queue/worker | Worker needed for durable outbox; Django/Celery optional |
| Auth and RBAC | Must build server-side role checks and staff accounts | Django auth/admin useful, but still requires roles, audits and staff flows |
| Integration vendors | Payment/POS adapter code, events, idempotency required | Same operational work |
| Cost | Deployment topology TBD; no actual provider quote/test yet | Same; extra runtime may add ops expense but no quantified difference |

### Provisional decision
For a single Tuscanini restaurant, **the smallest credible production architecture currently looks like a modular TypeScript application backend with independent PostgreSQL**. It preserves the already implemented Next.js customer app, reduces the number of languages and separately deployed services, and satisfies the same *isolated* database safety invariants. 

This is a **provisional engineering direction, not approval to migrate**. Django remains justified if real requirements call for a separately deployable operations API, extensive Django admin/workflow integration, a wider Python service ecosystem, or independent staff/POS backend deployment. Oracle Database remains a legitimate option when workload, cost, existing ops and actual vendor integrations establish a case; its brand is not itself a reason for or against.

## Architectural target — candidate, not deployed

```text
Next.js authored frontend ── HTTPS ── TS application backend (modular monolith)
                                           │
             Staff auth / roles ───────────┤
             Catalog + verified pricing ──┤
             Orders + idempotency ─────────┤
             Payment state + provider ─────┤
                                           ▼
                                    Independent Postgres
                                  transactional order/outbox
                                           │
                                     Outbox relay worker
                                           │
                               POS/KDS and notification adapters
```

Safeguards to design before shipping:
1. `request_key` scope/expiry, payload fingerprint including user/order channel and real modifier semantics; normalization and race error behavior.
2. Atomic updates for **order status + status history + outbox**, not only initial order creation.
3. Durable outbox claiming with timeouts/backoff and consumer inbox deduplication. Mock sender held a DB transaction open; replace this in production.
4. Clear `received != accepted` and `paid != completed` states; real gateway signed-webhook verification, refunds, settlement.
5. Server-only DB credentials, per-worker RBAC, branch/store isolation if applicable, pool capacity and network/TLS controls.
6. Confirm store's real POS, price authority and live kitchen routing; reconcile 113 historical menu entries before charging anyone.
7. DB versioned migrations, least-privilege grants, backups, restore drills and a rollback plan.
8. Compare equivalent API-level request workloads (including cold/warm runtime), CPU, memory, p50/p95, DB round trips, count of pool connections, cancellation/retry, and real cloud bills before full stack lock.

### Immediate next implementation unit
A standalone **TypeScript + PostgreSQL Order Domain API prototype** in the experiment only, using structured boundaries `catalog/checkout/operations/integrations`, fake POS adapter and authorization stubs; build e2e fixtures from client submission to store acknowledgment and rejection *without* real merchant data. Do not move Next.js live routes until these gates pass.

The main Next.js Rebirth code, product images and historical prices are untouched in this pass.
