import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { ValidatedOrderPayload } from '@/lib/orders/order-validation';
import { resolveOrderItemIdsOrThrow } from '@/lib/orders/resolve-order-ids';

type CreateOrderResult = { orderId: string; orderNumber: number | null; tableReference: string | null };
const ORDER_SOURCE = 'web_whatsapp';
const cents = (value: number) => Math.round(value * 100);

export async function createOrderInSupabase(payload: ValidatedOrderPayload): Promise<CreateOrderResult> {
  const admin = getSupabaseServerAdminClient();

  // Critically: validate ALL active products, linked addons and authoritative
  // prices BEFORE inserting the order header. A forged client-side unit price
  // must never be accepted as the source of truth for the restaurant.
  const checkedLines = [];
  for (const [index, item] of payload.items.entries()) {
    const resolved = await resolveOrderItemIdsOrThrow(admin, item, index);
    checkedLines.push({ item, resolved, lineTotal: cents(resolved.unitPrice) * item.quantity });
  }
  const serverSubtotalCents = checkedLines.reduce((sum, line) => sum + line.lineTotal, 0);
  if (serverSubtotalCents !== cents(payload.subtotal)) {
    throw new Error('إجمالي السلة اتغير. برجاء تحديث السلة ومراجعة الأسعار.');
  }
  const verifiedSubtotal = serverSubtotalCents / 100;

  const { data: orderRow, error: orderError } = await admin.from('orders').insert({
    customer_name: payload.customer.name,
    customer_phone: payload.customer.phone,
    customer_address: payload.customer.address || null,
    order_type: payload.customer.orderType,
    general_notes: payload.customer.generalNotes || null,
    status: 'جديد',
    confirmation_status: 'pending',
    subtotal: verifiedSubtotal,
    delivery_fee: 0,
    discount_amount: 0,
    total_estimate: verifiedSubtotal,
    source: ORDER_SOURCE,
    table_reference: payload.tableReference,
  }).select('id, order_number, table_reference').single();
  if (orderError || !orderRow) throw new Error(orderError?.message ?? 'تعذر حفظ الطلب.');

  try {
    for (const { item, resolved, lineTotal } of checkedLines) {
      const isOffer = resolved.kind === 'offer';
      const rowPayload = isOffer ? {
        order_id: orderRow.id,
        line_type: 'offer',
        offer_id: resolved.offerId,
        product_id: null,
        product_name_snapshot: `عرض: ${resolved.offerTitle}`,
        offer_title_snapshot: resolved.offerTitle,
        selected_size_label: null,
        unit_price: resolved.unitPrice,
        quantity: item.quantity,
        item_notes: item.itemNotes || null,
        line_total: lineTotal / 100,
      } : {
        order_id: orderRow.id,
        line_type: 'product',
        offer_id: null,
        product_id: resolved.productId,
        product_name_snapshot: resolved.productName,
        selected_size_label: resolved.sizeLabel,
        unit_price: resolved.unitPrice,
        quantity: item.quantity,
        item_notes: item.itemNotes || null,
        line_total: lineTotal / 100,
      };

      const { data: orderItemRow, error: orderItemError } = await admin
        .from('order_items').insert(rowPayload).select('id').single();
      if (orderItemError || !orderItemRow) {
        throw new Error(orderItemError?.message ?? 'تعذر حفظ عناصر الطلب.');
      }

      if (resolved.kind === 'product' && resolved.addons.length > 0) {
        const addonRows = resolved.addons.map(addon => ({
          order_item_id: orderItemRow.id,
          addon_id: addon.id,
          addon_label_snapshot: addon.label,
          addon_price: addon.price,
        }));
        const { error: addonError } = await admin.from('order_item_addons').insert(addonRows);
        if (addonError) throw new Error(addonError.message);
      }
    }

    const { error: historyError } = await admin.from('order_status_history').insert({
      order_id: orderRow.id,
      from_status: null,
      to_status: 'جديد',
      change_note: 'Order received from web cart, awaiting restaurant confirmation.',
    });
    if (historyError) throw new Error(historyError.message);

    return {
      orderId: orderRow.id,
      orderNumber: typeof orderRow.order_number === 'number' ? orderRow.order_number : null,
      tableReference: typeof orderRow.table_reference === 'string' ? orderRow.table_reference : null,
    };
  } catch (error) {
    // IMPORTANT: this is best-effort cleanup, not a database transaction.
    // A dedicated Postgres RPC transaction and idempotency key are still
    // required before production signoff for failure/retry safety.
    await admin.from('orders').delete().eq('id', orderRow.id);
    throw error;
  }
}
