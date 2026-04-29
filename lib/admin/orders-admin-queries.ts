import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import {
  ADMIN_CONFIRMATION_STATUSES,
  ADMIN_ORDER_STATUSES,
  type AdminConfirmationStatus,
  type AdminOrderStatus,
  type AdminOrdersDashboardData,
  type AdminOrdersFilters,
  type AdminOrderSummaryView,
} from '@/types/admin-orders';

type SearchParamsInput = Record<string, string | string[] | undefined>;

type OrderRow = {
  id: string;
  order_number: number | null;
  table_reference: string | null;
  customer_name: string | null;
  customer_phone: string;
  customer_address: string | null;
  order_type: 'delivery' | 'pickup';
  total_estimate: number | string;
  status: AdminOrderStatus;
  confirmation_status: AdminConfirmationStatus;
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
  line_total: number | string;
  line_type?: 'product' | 'offer';
};

type OrderItemAddonRow = {
  id: string;
  order_item_id: string;
  addon_label_snapshot: string;
  addon_price: number | string;
};

const MAX_ORDERS = 60;

function getFirstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

function isOrderStatus(value: string): value is AdminOrderStatus {
  return (ADMIN_ORDER_STATUSES as readonly string[]).includes(value);
}

function isConfirmationStatus(value: string): value is AdminConfirmationStatus {
  return (ADMIN_CONFIRMATION_STATUSES as readonly string[]).includes(value);
}

function toNumber(value: number | string): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeSearchQuery(input: string): string {
  return input.trim().slice(0, 40);
}

export function parseAdminOrdersFilters(searchParams: SearchParamsInput): AdminOrdersFilters {
  const statusParam = getFirstParam(searchParams.status).trim();
  const confirmationParam = getFirstParam(searchParams.confirmation_status).trim();
  const queryParam = normalizeSearchQuery(getFirstParam(searchParams.q));

  return {
    status: isOrderStatus(statusParam) ? statusParam : 'all',
    confirmationStatus: isConfirmationStatus(confirmationParam) ? confirmationParam : 'all',
    q: queryParam,
  };
}

function buildReference(orderRow: Pick<OrderRow, 'id' | 'order_number'>): string {
  if (typeof orderRow.order_number === 'number') {
    return `#${orderRow.order_number}`;
  }

  return orderRow.id;
}

export async function getAdminOrdersDashboardData(searchParams: SearchParamsInput): Promise<AdminOrdersDashboardData> {
  const supabase = getSupabaseServerAdminClient();
  const filters = parseAdminOrdersFilters(searchParams);

  let query = supabase
    .from('orders')
    .select(
      'id, order_number, table_reference, customer_name, customer_phone, customer_address, order_type, total_estimate, status, confirmation_status, general_notes, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(MAX_ORDERS);

  if (filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.confirmationStatus !== 'all') {
    query = query.eq('confirmation_status', filters.confirmationStatus);
  }

  const ordersResult = await query;

  if (ordersResult.error) {
    throw new Error(`تعذر تحميل الطلبات: ${ordersResult.error.message}`);
  }

  const allOrderRows = (ordersResult.data ?? []) as OrderRow[];
  const orderRows = filters.q
    ? allOrderRows.filter((row) => {
        const queryValue = filters.q.trim();
        const digitsQuery = queryValue.replace(/\D/g, '');
        const orderNumberText = typeof row.order_number === 'number' ? String(row.order_number) : '';

        if (digitsQuery) {
          return row.customer_phone.includes(digitsQuery) || orderNumberText.includes(digitsQuery);
        }

        return row.customer_phone.includes(queryValue) || orderNumberText.includes(queryValue);
      })
    : allOrderRows;

  if (orderRows.length === 0) {
    return {
      filters,
      orders: [],
    };
  }

  const orderIds = orderRows.map((row) => row.id);

  const orderItemsResult = await supabase
    .from('order_items')
    .select('id, order_id, product_name_snapshot, selected_size_label, quantity, item_notes, line_total, line_type')
    .in('order_id', orderIds)
    .order('created_at', { ascending: true });

  if (orderItemsResult.error) {
    throw new Error(`تعذر تحميل عناصر الطلبات: ${orderItemsResult.error.message}`);
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
      throw new Error(`تعذر تحميل إضافات عناصر الطلب: ${addonsResult.error.message}`);
    }

    addonRows = (addonsResult.data ?? []) as OrderItemAddonRow[];
  }

  const addonsByItemId = addonRows.reduce<Map<string, OrderItemAddonRow[]>>((acc, row) => {
    const list = acc.get(row.order_item_id);
    if (list) {
      list.push(row);
    } else {
      acc.set(row.order_item_id, [row]);
    }

    return acc;
  }, new Map<string, OrderItemAddonRow[]>());

  const itemsByOrderId = itemRows.reduce<Map<string, OrderItemRow[]>>((acc, row) => {
    const list = acc.get(row.order_id);
    if (list) {
      list.push(row);
    } else {
      acc.set(row.order_id, [row]);
    }

    return acc;
  }, new Map<string, OrderItemRow[]>());

  const orders: AdminOrderSummaryView[] = orderRows.map((orderRow) => ({
    id: orderRow.id,
    orderNumber: typeof orderRow.order_number === 'number' ? orderRow.order_number : null,
    reference: buildReference(orderRow),
    tableReference: orderRow.table_reference,
    customerName: orderRow.customer_name,
    customerPhone: orderRow.customer_phone,
    customerAddress: orderRow.customer_address,
    orderType: orderRow.order_type,
    totalEstimate: toNumber(orderRow.total_estimate),
    status: orderRow.status,
    confirmationStatus: orderRow.confirmation_status,
    generalNotes: orderRow.general_notes,
    createdAt: orderRow.created_at,
    items: (itemsByOrderId.get(orderRow.id) ?? []).map((itemRow) => ({
      id: itemRow.id,
      productNameSnapshot: itemRow.product_name_snapshot,
      selectedSizeLabel: itemRow.selected_size_label,
      quantity: itemRow.quantity,
      itemNotes: itemRow.item_notes,
      lineType: itemRow.line_type ?? 'product',
      lineTotal: toNumber(itemRow.line_total),
      addons: (addonsByItemId.get(itemRow.id) ?? []).map((addonRow) => ({
        id: addonRow.id,
        labelSnapshot: addonRow.addon_label_snapshot,
        price: toNumber(addonRow.addon_price),
      })),
    })),
  }));

  return {
    filters,
    orders,
  };
}
