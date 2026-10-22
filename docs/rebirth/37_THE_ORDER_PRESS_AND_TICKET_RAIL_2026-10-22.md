# PASS 37 — TUSCANINI / THE ORDER PRESS
**Date:** 2026-10-22 | **Surface:** `/operator/orders` in local development | **PR:** #59 draft.

## What was wrong
The previous tablet interface was a fairly conventional card dashboard, huge instructions column, disconnected operations, and 4 example orders. It visually resembled an admin panel, not a practical restaurant work surface. User explicitly rejected a superficial four-column Kanban redesign after reference research, and authorized **The Order Press** as the next implementation.

## Two alternate paradigms in ONE operator screen
### A — ORDER PRESS (default)
- One **large focused order**, visually like a restaurant ticket with index and paper.
- A **scrollable list of all other orders** with number, key item, total pieces, server timestamp-derived age, and state; tapping any item makes it the focus without losing context.
- Right away accessible staff buttons for that focus: accept or decline, start preparation, ready, delivered depending on **actual server status**.
- New orders come first from the server. Screen content gets useful space rather than decorative explainer copy.
- **All Day** band aggregates product counts from `accepted/preparing` orders, not accepted delivery or completed orders. This reduces mental counting for kitchen staff.

### B — TICKET RAIL (independent alternative)
- Same order snapshots/events, but a single horizontal reel of paper tickets.
- Scroll-snap, touch-friendly horizontal motion, no forced Kanban lanes.
- New/preparing/ready/completed filters, search across order numbers and food names, and preserved selection on return to Press mode.
- The screen uses the same Tuscanini ink/paper/chili/yellow vocabulary as the customer journey, but tasks and readable details lead.

### Reality and preview
- Both modes use `GET /api/studio/bridge?resource=inbox` and staff actions for real **localhost PostgreSQL staging data**. Existing status writes, staff test-key check, transactional DB events, Rebirth tracking remain unchanged.
- A clearly labeled **20-order visual pressure preview** (`?preview=20` or press the preview control) generates deterministic varied cards in the browser, covers sizes/add-ons/notes/ready/preparing/rejected, and **disables all actions**. No fake orders are submitted to PostgreSQL.
- Script `scripts/qa/rebirth-operator-press-visual.mjs` is added to the real multi-service Chromium CI. It checks Press=1 focus+19 queue; rail=20 independently scrollable ticket cards; filtering to six new; selection survives mode switching; All-Day calculation; disabled preview actions; and widths 1024 landscape, 768 portrait, 390 mobile. Screenshot artifacts: `press-20-orders-1024.png`, `ticket-rail-20-orders-1024.png`, `press-20-orders-768.png`, `press-20-orders-390.png`.
- **Before signoff:** check the browser job conclusion and **inspect captured screenshots**; adjust above-fold primary buttons, density and typography based on the actual result. Do not claim a final screen or employee launch without an actual operator-device test.

## Main files
- `components/studio/operator-press.tsx` owns the two layouts and filters.
- `app/operator-press.css` owns the distinctive operational art direction and adaptive tablet/mobile density.
- `app/operator/orders/page.tsx` hosts that single product; previous `StudioOrderRoom` is still used for `/studio` customer only.
- `.github/workflows/tuscanini-backend-v2-spike.yml` captures both variants after proving the existing Rebirth→operator→customer event loop.

## Design decisions under consideration
The team should choose based on a real 15–20 order comparison:
- How quickly can a cashier find the next new order, locate its specific size/add-on/note, and press the right action?
- Can they discover that an order is running late without an invented fixed ETA? Later staff-entered prep estimates could augment this.
- Is the full "Press" ticket overwhelming for the front desk? Is the "Rail" too much swiping for kitchen production?
- If staff need both roles, **Press may be best for decisions and Rail for visual scanning**, available instantly as modes instead of maintaining two apps.

## Not done
- Production authentication; named employee permissions; staff alert sounds or PWA background notifications; live tablet installation.
- All-Day station assignment; distinct cook stations; externally integrated POS printer or Talabat.
- Merchant-verified menu/fees and release authorization. No production merge/deploy.

**Next focused pass:** visually inspect real Chromium screenshots, simplify any crowded info, test live actions after mode switches, then build staff authentication and new order attention without disturbing the Rebirth customer's authored menu/checkout.
