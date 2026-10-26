# Tuscanini Order Service (Oracle target)

This is **a dedicated service**, not the disposable `spike_ts` HTTP fixture.
Production order intake remains OFF by default. The server is not yet deployed.

- Node 22 / pg 16 / dedicated `tuscanini_orders` database user and volume.
- HTTP routes all require `X-Tuscanini-Service-Key`, including tracking.
  Caller must be the **Next.js server only**, not the customer's browser.
- Actions use a server-established role, never a role header from the client.
  The real restaurant authentication check belongs to the Next.js operator
  route, plus private service key. Anonymous operations forbidden.
- `POST /v1/catalog/sync` is gated by `CATALOG_SYNC_ENABLED=yes`.
- `POST /v1/orders` is gated by `ORDER_API_ACCEPT_ORDERS=yes`.
- Existing transactional/idempotent menu-domain code is isolated in the
  `tuscanini` schema. It has no connection to Nova/Plantupia DB.
- `GET /healthz` is process-only; `GET /readyz` checks PostgreSQL without
  exposing internals.

## Environment (configure in Coolify, not Git)

`PGHOST` (internal service), `PGDATABASE=tuscanini_orders`,
`PGUSER=tuscanini_app`, `PGPASSWORD` (secret),
`ORDER_API_SERVICE_KEY` (32+ random characters, server-only),
`CATALOG_SYNC_ENABLED` and `ORDER_API_ACCEPT_ORDERS` (default OFF),
`PORT=8080`.

Do not reuse the public preview access URL, test token or real customer
details in demo data. For rollout specifics, see
[`infra/oracle/README.md`](../../infra/oracle/README.md).
