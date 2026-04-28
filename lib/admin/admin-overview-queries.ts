import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type {
  AdminOverviewData,
  AdminOverviewLatestOrder,
  AdminOverviewTopProduct,
  AdminOverviewWarningOrder,
} from '@/types/admin-overview';
import type { AdminConfirmationStatus, AdminOrderStatus } from '@/types/admin-orders';

type OverviewTodayOrderRow = {
  status: AdminOrderStatus;
  confirmation_status: AdminConfirmationStatus;
  total_estimate: number | string;
};

type LatestOrderRow = {
  id: string;
  order_number: number | null;
  customer_name: string | null;
  customer_phone: string;
  total_estimate: number | string;
  status: AdminOrderStatus;
  confirmation_status: AdminConfirmationStatus;
  created_at: string;
};

type WarningOrderRow = {
  id: string;
  order_number: number | null;
  customer_name: string | null;
  customer_phone: string;
  status: AdminOrderStatus;
  confirmation_status: AdminConfirmationStatus;
  created_at: string;
};

type TopProductsRow = {
  product_name_snapshot: string;
  quantity: number;
  line_total: number | string;
};

const TOP_PRODUCTS_LIMIT = 5;

function toNumber(value: number | string): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildReference(order: Pick<LatestOrderRow, 'id' | 'order_number'>): string {
  if (typeof order.order_number === 'number') {
    return `#${order.order_number}`;
  }

  return order.id;
}

function getTodayRangeUtc(): { startIso: string; endIso: string } {
  const now = new Date();

  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

function elapsedMinutesFromNow(createdAt: string): number {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) {
    return 0;
  }

  const diffMs = Date.now() - created;
  if (diffMs <= 0) {
    return 0;
  }

  return Math.floor(diffMs / 60000);
}

function mapWarningRows(rows: WarningOrderRow[]): AdminOverviewWarningOrder[] {
  return rows.map((row) => ({
    id: row.id,
    reference: buildReference(row),
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    status: row.status,
    confirmationStatus: row.confirmation_status,
    createdAt: row.created_at,
    elapsedMinutes: elapsedMinutesFromNow(row.created_at),
  }));
}

function mapTopProducts(rows: TopProductsRow[]): AdminOverviewTopProduct[] {
  const byProduct = rows.reduce<Map<string, AdminOverviewTopProduct>>((acc, row) => {
    const key = row.product_name_snapshot.trim() || 'منتج غير معروف';
    const current = acc.get(key);

    if (current) {
      current.quantitySold += row.quantity;
      current.salesTotal += toNumber(row.line_total);
    } else {
      acc.set(key, {
        productName: key,
        quantitySold: row.quantity,
        salesTotal: toNumber(row.line_total),
      });
    }

    return acc;
  }, new Map<string, AdminOverviewTopProduct>());

  return Array.from(byProduct.values())
    .sort((a, b) => {
      if (b.quantitySold !== a.quantitySold) {
        return b.quantitySold - a.quantitySold;
      }

      return b.salesTotal - a.salesTotal;
    })
    .slice(0, TOP_PRODUCTS_LIMIT);
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  const supabase = getSupabaseServerAdminClient();
  const { startIso, endIso } = getTodayRangeUtc();

  const tenMinutesAgoIso = new Date(Date.now() - 10 * 60_000).toISOString();
  const twentyMinutesAgoIso = new Date(Date.now() - 20 * 60_000).toISOString();

  const [
    todayResult,
    latestResult,
    pendingCountResult,
    preparingCountResult,
    readyCountResult,
    outForDeliveryCountResult,
    deliveredTodayResult,
    cancelledTodayResult,
    pendingWarningResult,
    preparingWarningResult,
    topProductsRawResult,
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('status, confirmation_status, total_estimate')
      .gte('created_at', startIso)
      .lt('created_at', endIso),
    supabase
      .from('orders')
      .select('id, order_number, customer_name, customer_phone, total_estimate, status, confirmation_status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('confirmation_status', 'pending'),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'جاري التحضير'),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'جاهز للاستلام'),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'خرج للدليفري'),
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'تم التسليم')
      .gte('created_at', startIso)
      .lt('created_at', endIso),
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'ملغي')
      .gte('created_at', startIso)
      .lt('created_at', endIso),
    supabase
      .from('orders')
      .select('id, order_number, customer_name, customer_phone, status, confirmation_status, created_at')
      .eq('confirmation_status', 'pending')
      .lt('created_at', tenMinutesAgoIso)
      .order('created_at', { ascending: true })
      .limit(20),
    supabase
      .from('orders')
      .select('id, order_number, customer_name, customer_phone, status, confirmation_status, created_at')
      .eq('status', 'جاري التحضير')
      .lt('created_at', twentyMinutesAgoIso)
      .order('created_at', { ascending: true })
      .limit(20),
    supabase
      .from('order_items')
      .select('product_name_snapshot, quantity, line_total, orders!inner(created_at)')
      .gte('orders.created_at', startIso)
      .lt('orders.created_at', endIso)
      .limit(500),
  ]);

  if (todayResult.error) throw new Error(`تعذر تحميل ملخص اليوم: ${todayResult.error.message}`);
  if (latestResult.error) throw new Error(`تعذر تحميل أحدث الطلبات: ${latestResult.error.message}`);
  if (pendingCountResult.error) throw new Error(`تعذر حساب pending: ${pendingCountResult.error.message}`);
  if (preparingCountResult.error) throw new Error(`تعذر حساب preparing: ${preparingCountResult.error.message}`);
  if (readyCountResult.error) throw new Error(`تعذر حساب ready: ${readyCountResult.error.message}`);
  if (outForDeliveryCountResult.error) throw new Error(`تعذر حساب out-for-delivery: ${outForDeliveryCountResult.error.message}`);
  if (deliveredTodayResult.error) throw new Error(`تعذر حساب delivered today: ${deliveredTodayResult.error.message}`);
  if (cancelledTodayResult.error) throw new Error(`تعذر حساب cancelled today: ${cancelledTodayResult.error.message}`);
  if (pendingWarningResult.error) throw new Error(`تعذر تحميل تنبيهات pending: ${pendingWarningResult.error.message}`);
  if (preparingWarningResult.error) throw new Error(`تعذر تحميل تنبيهات preparing: ${preparingWarningResult.error.message}`);
  if (topProductsRawResult.error) throw new Error(`تعذر تحميل أفضل المنتجات: ${topProductsRawResult.error.message}`);

  const todayRows = (todayResult.data ?? []) as OverviewTodayOrderRow[];
  const latestRows = (latestResult.data ?? []) as LatestOrderRow[];
  const pendingWarningRows = (pendingWarningResult.data ?? []) as WarningOrderRow[];
  const preparingWarningRows = (preparingWarningResult.data ?? []) as WarningOrderRow[];
  const topProductsRows = ((topProductsRawResult.data ?? []) as TopProductsRow[]);

  const estimatedSalesToday = todayRows.reduce((sum, row) => sum + toNumber(row.total_estimate), 0);
  const ordersToday = todayRows.length;

  const latestOrders: AdminOverviewLatestOrder[] = latestRows.map((row) => ({
    id: row.id,
    orderNumber: typeof row.order_number === 'number' ? row.order_number : null,
    reference: buildReference(row),
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    totalEstimate: toNumber(row.total_estimate),
    status: row.status,
    confirmationStatus: row.confirmation_status,
    createdAt: row.created_at,
  }));

  return {
    summary: {
      ordersToday,
      estimatedSalesToday,
      averageOrderValueToday: ordersToday > 0 ? estimatedSalesToday / ordersToday : 0,
    },
    operational: {
      pendingConfirmation: pendingCountResult.count ?? 0,
      preparing: preparingCountResult.count ?? 0,
      ready: readyCountResult.count ?? 0,
      outForDelivery: outForDeliveryCountResult.count ?? 0,
      deliveredToday: deliveredTodayResult.count ?? 0,
      cancelledToday: cancelledTodayResult.count ?? 0,
    },
    warnings: {
      pendingConfirmationOver10Minutes: mapWarningRows(pendingWarningRows),
      preparingOver20Minutes: mapWarningRows(preparingWarningRows),
    },
    latestOrders,
    topProductsToday: mapTopProducts(topProductsRows),
  };
}
