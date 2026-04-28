import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { AdminOverviewData, AdminOverviewLatestOrder } from '@/types/admin-overview';
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

const ACTIVE_ORDER_STATUSES: AdminOrderStatus[] = ['جاري التحضير', 'جاهز للاستلام', 'خرج للدليفري'];

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

async function countOrdersByStatus(status: AdminOrderStatus): Promise<number> {
  const supabase = getSupabaseServerAdminClient();

  const result = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', status);
  if (result.error) {
    throw new Error(`تعذر حساب الطلبات بحالة ${status}: ${result.error.message}`);
  }

  return result.count ?? 0;
}

async function countTodayByStatus(status: AdminOrderStatus, startIso: string, endIso: string): Promise<number> {
  const supabase = getSupabaseServerAdminClient();

  const result = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', status)
    .gte('created_at', startIso)
    .lt('created_at', endIso);

  if (result.error) {
    throw new Error(`تعذر حساب طلبات اليوم بحالة ${status}: ${result.error.message}`);
  }

  return result.count ?? 0;
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  const supabase = getSupabaseServerAdminClient();
  const { startIso, endIso } = getTodayRangeUtc();

  const [todayResult, latestResult, newOrdersCount, preparingCount, readyCount, deliveredTodayCount, cancelledTodayCount] =
    await Promise.all([
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
      countOrdersByStatus('جديد'),
      countOrdersByStatus('جاري التحضير'),
      countOrdersByStatus('جاهز للاستلام'),
      countTodayByStatus('تم التسليم', startIso, endIso),
      countTodayByStatus('ملغي', startIso, endIso),
    ]);

  if (todayResult.error) {
    throw new Error(`تعذر تحميل ملخص اليوم: ${todayResult.error.message}`);
  }

  if (latestResult.error) {
    throw new Error(`تعذر تحميل أحدث الطلبات: ${latestResult.error.message}`);
  }

  const todayRows = (todayResult.data ?? []) as OverviewTodayOrderRow[];
  const latestRows = (latestResult.data ?? []) as LatestOrderRow[];

  const summary = {
    ordersToday: todayRows.length,
    estimatedSalesToday: todayRows.reduce((sum, row) => sum + toNumber(row.total_estimate), 0),
    pendingConfirmationToday: todayRows.filter((row) => row.confirmation_status === 'pending').length,
    preparingActiveToday: todayRows.filter((row) => ACTIVE_ORDER_STATUSES.includes(row.status)).length,
  };

  const operational = {
    newOrders: newOrdersCount,
    preparing: preparingCount,
    ready: readyCount,
    deliveredToday: deliveredTodayCount,
    cancelledToday: cancelledTodayCount,
  };

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
    summary,
    operational,
    latestOrders,
  };
}
