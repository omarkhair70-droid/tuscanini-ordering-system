import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { ValidatedOrderPayload } from '@/lib/orders/order-validation';
import { resolveOrderItemIdsOrThrow } from '@/lib/orders/resolve-order-ids';

type CreateOrderResult = { orderId: string; orderNumber: number | null; tableReference: string | null };
const ORDER_SOURCE = 'web_whatsapp';

export async function createOrderInSupabase(payload: ValidatedOrderPayload): Promise<CreateOrderResult> {
  const admin = getSupabaseServerAdminClient();
  const { data: orderRow, error: orderError } = await admin.from('orders').insert({ customer_name: payload.customer.name, customer_phone: payload.customer.phone, customer_address: payload.customer.address || null, order_type: payload.customer.orderType, general_notes: payload.customer.generalNotes || null, status: 'جديد', confirmation_status: 'pending', subtotal: payload.subtotal, delivery_fee: 0, discount_amount: 0, total_estimate: payload.subtotal, source: ORDER_SOURCE, table_reference: payload.tableReference }).select('id, order_number, table_reference').single();
  if (orderError || !orderRow) throw new Error(orderError?.message ?? 'تعذر حفظ الطلب.');

  try {
    for (const [itemIndex, item] of payload.items.entries()) {
      const resolved = await resolveOrderItemIdsOrThrow(admin, item, itemIndex);
      const insertPayload = item.kind === 'offer' && resolved.kind === 'offer'
        ? { order_id: orderRow.id, line_type: 'offer', offer_id: resolved.offerId, product_id: null, product_name_snapshot: `عرض: ${resolved.offerTitle}`, offer_title_snapshot: resolved.offerTitle, selected_size_label: null, unit_price: resolved.offerPrice, quantity: item.quantity, item_notes: item.itemNotes || null, line_total: resolved.offerPrice * item.quantity }
        : { order_id: orderRow.id, line_type: 'product', offer_id: null, product_id: resolved.kind === 'product' ? resolved.productId : null, product_name_snapshot: item.kind === 'product' ? item.productName : 'صنف', selected_size_label: item.kind === 'product' ? item.selectedSize?.label ?? null : null, unit_price: item.unitPrice, quantity: item.quantity, item_notes: item.itemNotes || null, line_total: item.totalItemPrice };

      const { data: orderItemRow, error: orderItemError } = await admin.from('order_items').insert(insertPayload).select('id').single();
      if (orderItemError || !orderItemRow) throw new Error(orderItemError?.message ?? 'تعذر حفظ عناصر الطلب.');

      if (item.kind === 'product' && resolved.kind === 'product' && item.selectedAddons.length > 0) {
        const addonsRows = item.selectedAddons.map((addon, addonIndex) => ({ order_item_id: orderItemRow.id, addon_id: resolved.addonIds[addonIndex], addon_label_snapshot: addon.label, addon_price: addon.price }));
        const { error: addonsError } = await admin.from('order_item_addons').insert(addonsRows);
        if (addonsError) throw new Error(addonsError.message);
      }
    }

    const { error: historyError } = await admin.from('order_status_history').insert({ order_id: orderRow.id, from_status: null, to_status: 'جديد', change_note: 'Order created from web cart and sent to WhatsApp.' });
    if (historyError) throw new Error(historyError.message);

    return { orderId: orderRow.id, orderNumber: typeof orderRow.order_number === 'number' ? orderRow.order_number : null, tableReference: typeof orderRow.table_reference === 'string' ? orderRow.table_reference : null };
  } catch (error) {
    await admin.from('orders').delete().eq('id', orderRow.id);
    throw error;
  }
}
