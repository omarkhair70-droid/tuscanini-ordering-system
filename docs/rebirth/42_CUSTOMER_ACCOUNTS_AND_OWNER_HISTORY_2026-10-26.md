# Tuscanini — Customer Accounts / Saved Locations / Order Ownership
**Date:** 2026-10-26
**Branch:** `redesign/tuscanini-authored-experience-20261018` | **PR:** #59

## Built in this pass

- `/account`: real Supabase email OTP flow (email link or code), sign-out, private account landing, saved addresses, and a history view. The account is accessible via the existing mobile utility navigation and desktop header. Guest checkout remains first-class.
- Saved locations are rows in `public.customer_addresses` belonging to a verified Supabase `auth.users` ID. The user can save a current confirmed GPS pin + written address from Cart, delete a saved location, and restore one back to the delivery Checkout. No fake localStorage account, no phone-number-based access.
- `GET /api/customer/orders`: authenticated, no-store, verified bearer token on server, queries **only** `orders.customer_user_id = verified user.id`, with bounded latest-order fields. It does **not** accept a user ID, email or phone lookup supplied by the browser.
- `POST /api/orders` on the Supabase backend: optionally verifies the user's bearer token and writes the verified `customer_user_id` alongside a newly placed order. Anonymous requests still work as guests. Oracle and isolated local studio engines are **not silently relabeled** as Supabase customer-owned orders.
- Existing persisted price/size/add-on checks, closed intake setting, cash/InstaPay/Vodafone Cash handoff choices, and 390px delivery-pin checkout remain intact.
- Browser QA now has account route/screenshot coverage and a negative unauthenticated order-history check; does not simulate that OTP delivery happened.

## Database and activation contract

**Migration:** `supabase/migrations/009_customer_addresses_ownership.sql` must actually be applied to the corresponding target Supabase database before saved addresses are usable. It adds the owner key and RLS-backed `customer_addresses` table. It has NOT been applied simply by committing to GitHub.

**Server feature gate:** after migration verification and auth URL/OTP email-template setup, set
`TUSCANINI_SUPABASE_CUSTOMER_ACCOUNTS_READY=yes` in the intended environment. It enables private order history and association of new orders with verified customer IDs on the Supabase backend. Without the flag, the API gives 503 for customer history (rather than claiming a complete feature), and orders continue their guest path. An existing Supabase browser login does not retroactively claim old orders.

**Supabase Auth:** configure site URL and redirect allowlist including the actual production/preview account callback URL (and an email template that includes OTP or magic link). Browser uses the existing `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, never a service role key. Phone SMS OTP is not enabled by this implementation; it requires an SMS provider.

**Known deliberate gaps:** (a) merchant may run Oracle as live order backend, so its verified customer-owned order adapter/history needs separate mapping; (b) order item-level history and safe reorder via current catalog snapshots still need an authenticated owner query and reprice path; (c) account OTP, RLS and personal history must be tested against migrated staging/production Supabase, not only static/browser CI; (d) saved-address default-selection and atomic replacement not yet implemented; (e) no production flags, migration or public-intake changes were made.

## Product quality / next slice

A safe reorder is never a button that copies legacy prices from order snapshots into a new order. Fetch the selected owned order's item/modifier IDs, hydrate against *current* catalog, revalidate stock and new total, and ask for confirmation before adding to cart. Support mixed product/offer history only when backend mapping is explicit. Only then expose a `اطلبه تاني` action.

CI success/Preview deployment must be reported for the exact HEAD, not inherited from older commits. The account page may display an unavailable saved-address state before migration is applied; do not advertise operational sign-in/history until live verification is complete.
