import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import {
  KITCHEN_ACTIVE_STATUSES,
  type KitchenActiveStatus,
  isKitchenActiveStatus,
  type KitchenOrderView,
  type KitchenOrdersBoardData,
} from '@/types/admin-kitchen';
import type { AdminOrderStatus } from '@/types/admin-orders';

type OrderRow = {
  id: string;
  order_number: number | null;
  customer_name: string | null;
  order_type: 'delivery' | 'pickup';
  status: AdminOrderStatus;
  general_notes: string | null;
  created_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_name_snapshot: string;
  selected_size_label: string | null;
  quantity: number;
  item_notes: string | null;
};

type OrderItemAddonRow = {
  id: string;
  order_item_id: string;
  addon_label_snapshot: string;
  addon_price: number | string;
};

const MAX_ACTIVE_ORDERS = 120;

function toNumber(value: number | string): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildReference(order: Pick<OrderRow, 'id' | 'order_number'>): string {
  if (typeof order.order_number === 'number') {
    return `#${order.order_number}`;
  }

  return order.id;
}


function isKitchenOrderRow(row: OrderRow): row is OrderRow & { status: KitchenActiveStatus } {
  return isKitchenActiveStatus(row.status);
}

function createEmptyGroupedMap(): Record<KitchenActiveStatus, KitchenOrderView[]> {
  return {
    جديد: [],
    'جاري التحضير': [],
    'جاهز للاستلام': [],
    'خرج للدليفري': [],
  };
}

export async function getKitchenOrdersBoardData(): Promise<KitchenOrdersBoardData> {
  const supabase = getSupabaseServerAdminClient();

  const ordersResult = await supabase
    .from('orders')
    .select('id, order_number, customer_name, order_type, status, general_notes, created_at')
    .in('status', [...KITCHEN_ACTIVE_STATUSES])
    .order('created_at', { ascending: true })
    .limit(MAX_ACTIVE_ORDERS);

  if (ordersResult.error) {
    throw new Error(`تعذر تحميل طلبات المطبخ: ${ordersResult.error.message}`);
  }

  const orderRows = (ordersResult.data ?? []) as OrderRow[];

  if (orderRows.length === 0) {
    return {
      orders: [],
      grouped: createEmptyGroupedMap(),
    };
  }

  const orderIds = orderRows.map((row) => row.id);

  const orderItemsResult = await supabase
    .from('order_items')
    .select('id, order_id, product_name_snapshot, selected_size_label, quantity, item_notes')
    .in('order_id', orderIds)
    .order('created_at', { ascending: true });

  if (orderItemsResult.error) {
    throw new Error(`تعذر تحميل عناصر طلبات المطبخ: ${orderItemsResult.error.message}`);
  }

  const itemRows = (orderItemsResult.data ?? []) as OrderItemRow[];
  const itemIds = itemRows.map((row) => row.id);

  let addonRows: OrderItemAddonRow[] = [];

  if (itemIds.length > 0) {
    const addonsResult = await supabase
      .from('order_item_addons')
      .select('id, order_item_id, addon_label_snapshot, addon_price')
      .in('order_item_id', itemIds)
      .order('created_at', { ascending: true });

    if (addonsResult.error) {
      throw new Error(`تعذر تحميل إضافات المطبخ: ${addonsResult.error.message}`);
    }

    addonRows = (addonsResult.data ?? []) as OrderItemAddonRow[];
  }

  const addonsByItemId = addonRows.reduce<Map<string, OrderItemAddonRow[]>>((acc, row) => {
    const current = acc.get(row.order_item_id);

    if (current) {
      current.push(row);
    } else {
      acc.set(row.order_item_id, [row]);
    }

    return acc;
  }, new Map<string, OrderItemAddonRow[]>());

  const itemsByOrderId = itemRows.reduce<Map<string, OrderItemRow[]>>((acc, row) => {
    const current = acc.get(row.order_id);

    if (current) {
      current.push(row);
    } else {
      acc.set(row.order_id, [row]);
    }

    return acc;
  }, new Map<string, OrderItemRow[]>());

  const activeOrderRows = orderRows.filter(isKitchenOrderRow);

  const orders: KitchenOrderView[] = activeOrderRows.map((orderRow) => ({
    id: orderRow.id,
    orderNumber: typeof orderRow.order_number === 'number' ? orderRow.order_number : null,
    reference: buildReference(orderRow),
    customerName: orderRow.customer_name,
    orderType: orderRow.order_type,
    status: orderRow.status,
    generalNotes: orderRow.general_notes,
    createdAt: orderRow.created_at,
    items: (itemsByOrderId.get(orderRow.id) ?? []).map((itemRow) => ({
      id: itemRow.id,
      productNameSnapshot: itemRow.product_name_snapshot,
      selectedSizeLabel: itemRow.selected_size_label,
      quantity: itemRow.quantity,
      itemNotes: itemRow.item_notes,
      addons: (addonsByItemId.get(itemRow.id) ?? []).map((addonRow) => ({
        id: addonRow.id,
        labelSnapshot: addonRow.addon_label_snapshot,
        price: toNumber(addonRow.addon_price),
      })),
    })),
  }));

  const grouped = createEmptyGroupedMap();

  for (const order of orders) {
    grouped[order.status].push(order);
  }

  return {
    orders,
    grouped,
  };
}
