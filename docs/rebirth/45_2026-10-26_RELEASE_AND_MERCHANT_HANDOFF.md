# Tuscanini · release and merchant handoff · 26 October 2026

## Scope accepted by owner
Deliver the real, original Rebirth customer website with menu, cart, pickup checkout, individual private Google login, saved GPS/address and history, order status, and ONE existing protected restaurant operator inbox. Do not pretend direct integration to restaurant POS vendor is proven. Phone/WhatsApp remain a manual handoff fallback.

## Mobile profile
The shared header has a persistent, accessible 44px Account action, its own original material person glyph, and active-path highlight even at 320px. Account includes Google sign-in, guest link, signed-in identity, saved-address cards and counts, personal owned history and status in Arabic. CI adds 320/390px account screenshot regression gates. No fictional avatar image and no third-party photo access.

## Production order switches: both required
- Coolify, EXISTING Dockerfile app `tuscanini-orders-api`: `ORDER_API_ACCEPT_ORDERS=yes` enables PostgreSQL inserts after API redeploy. Before that, leave `no`. This service is isolated and uses the catalog physically stored in tuscanini.menu_catalog.
- Vercel, on deployed Next production: `ORDER_BACKEND=oracle`; `TUSCANINI_ORACLE_LIVE_ORDERS=yes` lets customer Checkout submit. Default missing/no remains CLOSED. This status no longer depends on legacy Supabase `site_settings.is_ordering_open`. Updating a Vercel env var requires a new production deployment.
- **Both need an actual audited catalog and active restaurant operator**. Do not set both yes before a controlled first order can be accepted by staff. Customer progress screen must distinguish stored order from staff accepted.
- `TUSCANINI_DELIVERY_ENABLED` defaults no. Never claim delivery is available with unapproved delivery zones and zero/unknown fee. Publish pickup first, enable delivery only after pricing and boundaries are approved and tested.
- Backend `GET /v1/operator/readiness` requires service key and reports `acceptingOrders` and actual available-product count. Staff-key-gated Next `GET /api/internal/orders/connection` gives connection, queue size, catalog count and backend acceptance status, without secrets or customer fields.

## Google sign-in
- Google project must be Tuscanini, not Nova; a Web OAuth client with exact production callback `https://tuscanini-ordering-system.vercel.app/api/customer/google/callback`. Provider must be Production or appropriate Test Users for pilot accounts.
- Vercel Production: server-only `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI`, and `TUSCANINI_ORACLE_CUSTOMER_ACCOUNTS_READY=yes` only after the backend identity migration has been deployed and verified.
- Existing Coolify Dockerfile resource: `GOOGLE_OAUTH_CLIENT_ID` (same client as Vercel), `CUSTOMER_GOOGLE_AUTH_ENABLED=yes`, `CUSTOMER_AUTH_ENABLED=no`; redeploy. Google identity uses verified stable subject, not contact email or phone.
- Test real OAuth sign-in from real domain and same-origin cookie, logout, private history across two accounts, saved GPS address, and guest checkout. Never post the client secret to chat or GitHub.

## Existing merchant screen
- `https://tuscanini-ordering-system.vercel.app/operator/orders` on the post-release deployment.
- Operator enters the existing separately issued `TUSCANINI_OPERATOR_KEY` as password; service key never reaches browser. Pulls Oracle real queue and polls every 3.5 seconds while visible. Can accept, reject, start cooking, mark ready, deliver. Optional audio cue must be armed by user gesture.
- Arrange for restaurant staff to keep this tab active on tablet; train one owner. It is **not** an automatic POS integration and there is no verified physical printer. Existing cashier integration may still require manual copy/acknowledgment; do not advertise it as integrated.
- Use one test order end-to-end from real menu/cart: stored -> seen in inbox -> accepted -> prepared -> delivered -> customer tracker updates. Test restaurant phone, payment method on handoff, fees, app cache and mobile browser. Never place a full-price real order without operator awareness.

## Outstanding nonblocking/launch-blocking
**Launch blockers until tested**: published prices and 113-item availability reviewed by merchant; backend and Vercel flags both yes with current release SHAs, Google authorization/cookies verified; staff can log in and receive an actual submitted test ticket; pickup checkout, accepted and delivery transitions proven; customer notice and refund/complaint path agreed.
**Can be phased afterward**: native vendor POS automatic sync, auto-print, online payment gateway, delivered order push in background, long-term analytics and merchant-managed catalog administration.
Historical illustrative menu photos are representative, not exact SKU photography; label should remain truthful.
