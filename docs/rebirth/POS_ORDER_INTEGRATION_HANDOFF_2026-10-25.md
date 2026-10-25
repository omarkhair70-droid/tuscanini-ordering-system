# Tuscanini — POS handoff contract for the current cashier software

**What is verified**: user spoke to existing POS developer; integration *possible*. The photo shows cash-register add-ons, not API configuration. The website currently has an independent Oracle/PostgreSQL order engine and operator room, **NOT** a connected cashier POS.

## Integration handshake needed from POS developer

1. POS software name, version, and actual restaurant instance; integration mode (HTTPS API, local LAN bridge/service, SDK, monitored export, or supported alternative). Avoid directly injecting database rows or desktop UI automation.
2. Read-only item/modifier mapping with immutable POS codes, names, prices, stock, category, compatibility, and selected size representation. `addon-*` and website SKU IDs must map deliberately.
3. Auth and transport: whitelisted endpoint, key/secret held on server only, webhook verification or authorized pull, TLS where supported; if local-only POS, restaurant-owned gateway with authenticated outbound delivery and connectivity recovery.
4. Acceptance semantics: `webOrderId` + idempotency key, explicit accepted/queued ACK *only after POS persisted the full ticket*, mapped modifiers/notes, pickup vs delivery, the customer's reference and contact fields as authorized. Retry on transient failure without duplication; log queued/failed/sent/acknowledged transitions.
5. Events back to website: received, accepted, preparing, ready, handed over / delivered, rejected, corrections/cancellation, with monotonic status/version. Do not invent kitchen stages that POS cannot report.
6. Provide staging/test credential, one disposable menu item and modifier. Demonstrate a real test ticket on the **existing cashier computer/printer**, edit/hold/reject/retry and status return to the customer browser across two devices. Document screenshots and logs stripped of personal data.
7. Go-live controls: merchant-approved menu/prices, cash register tax/delivery/tip policy, opening hours, operator access, manual fallback phone/WhatsApp, failure alerts, and rollback. **Do not turn on public order acceptance until all are witnessed and signed off.**

## Minimum proposed field mapping (actual wire format is developer-defined)

| Web order field | POS equivalent to request |
|---|---|
| Stable order UUID, idempotency key | External ticket ID / de-duplication key |
| Each SKU and variant/size ID | Actual POS product code and size |
| Selected addon IDs, amount in cents | Actual POS modifier code and quantity |
| Quantity, per-line notes | Printed kitchen line + notes |
| Pickup/delivery and table ref | POS order fulfillment type |
| Validated customer and address | POS permitted customer fields |
| Backend-verified subtotal and delivery charge | POS authoritative total + reconciled receipt |
| Operator status event/version | Tracked website order state |

**Non-negotiable**: website success must not be displayed as cashier acceptance until a genuine POS acknowledgement exists. **No sensitive customer details in debug logs, URLs, or third-party images.** Never replace the existing POS with a second fake order console in the customer's sight.
