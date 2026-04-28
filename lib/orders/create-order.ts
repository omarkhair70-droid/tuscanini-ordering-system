import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { ValidatedOrderPayload } from '@/lib/orders/order-validation';

type CreateOrderResult = {
  orderId: string;
  orderNumber: number | null;
};

const ORDER_SOURCE = 'web_whatsapp';

export async function createOrderInSupabase(payload: ValidatedOrderPayload): Promise<CreateOrderResult> {
  const admin = getSupabaseServerAdminClient();

  const { data: orderRow, error: orderError } = await admin
    .from('orders')
    .insert({
      customer_name: payload.customer.name,
      customer_phone: payload.customer.phone,
      customer_address: payload.customer.address || null,
      order_type: payload.customer.orderType,
      general_notes: payload.customer.generalNotes || null,
      status: 'جديد',
      confirmation_status: 'pending',
      subtotal: payload.subtotal,
      delivery_fee: 0,
      discount_amount: 0,
      total_estimate: payload.subtotal,
      source: ORDER_SOURCE,
    })
    .select('id, order_number')
    .single();

  if (orderError || !orderRow) {
    throw new Error(orderError?.message ?? 'تعذر حفظ الطلب.');
  }

  try {
    for (const item of payload.items) {
      const { data: orderItemRow, error: orderItemError } = await admin
        .from('order_items')
        .insert({
          order_id: orderRow.id,
          product_id: item.productId,
          product_name_snapshot: item.productName,
          selected_size_label: item.selectedSize?.label ?? null,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          item_notes: item.itemNotes || null,
          line_total: item.totalItemPrice,
        })
        .select('id')
        .single();

      if (orderItemError || !orderItemRow) {
        throw new Error(orderItemError?.message ?? 'تعذر حفظ عناصر الطلب.');
      }

      if (item.selectedAddons.length > 0) {
        const addonsRows = item.selectedAddons.map((addon) => ({
          order_item_id: orderItemRow.id,
          addon_id: addon.id,
          addon_label_snapshot: addon.label,
          addon_price: addon.price,
        }));

        const { error: addonsError } = await admin.from('order_item_addons').insert(addonsRows);

        if (addonsError) {
          throw new Error(addonsError.message);
        }
      }
    }

    const { error: historyError } = await admin.from('order_status_history').insert({
      order_id: orderRow.id,
      from_status: null,
      to_status: 'جديد',
      change_note: 'Order created from web cart and sent to WhatsApp.',
    });

    if (historyError) {
      throw new Error(historyError.message);
    }

    return {
      orderId: orderRow.id,
      orderNumber: typeof orderRow.order_number === 'number' ? orderRow.order_number : null,
    };
  } catch (error) {
    await admin.from('orders').delete().eq('id', orderRow.id);
    throw error;
  }
}
