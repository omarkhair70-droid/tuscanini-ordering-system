import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import {
  parseConfirmationStatusOrThrow,
  parseOrderStatusOrThrow,
  resolveTransitionOrThrow,
  type TransitionDecision,
} from '@/lib/admin/orders-admin-validation';
import type { AdminOrderAction, AdminConfirmationStatus, AdminOrderStatus } from '@/types/admin-orders';

type OrderLifecycleRow = {
  id: string;
  order_number: number | null;
  status: AdminOrderStatus;
  confirmation_status: AdminConfirmationStatus;
};

export type ApplyOrderActionResult = {
  orderId: string;
  orderNumber: number | null;
  fromStatus: AdminOrderStatus;
  toStatus: AdminOrderStatus | null;
  confirmationStatus: AdminConfirmationStatus;
  action: AdminOrderAction;
};

async function loadOrderLifecycleOrThrow(orderId: string): Promise<OrderLifecycleRow> {
  const supabase = getSupabaseServerAdminClient();

  const result = await supabase
    .from('orders')
    .select('id, order_number, status, confirmation_status')
    .eq('id', orderId)
    .maybeSingle();

  if (result.error) {
    throw new Error(`تعذر قراءة حالة الطلب: ${result.error.message}`);
  }

  if (!result.data) {
    throw new Error('الطلب غير موجود.');
  }

  return {
    id: result.data.id,
    order_number: typeof result.data.order_number === 'number' ? result.data.order_number : null,
    status: parseOrderStatusOrThrow(result.data.status),
    confirmation_status: parseConfirmationStatusOrThrow(result.data.confirmation_status),
  };
}

async function insertStatusHistoryOrThrow(
  orderId: string,
  fromStatus: AdminOrderStatus,
  toStatus: AdminOrderStatus,
  note: string,
): Promise<void> {
  const supabase = getSupabaseServerAdminClient();

  const historyResult = await supabase.from('order_status_history').insert({
    order_id: orderId,
    from_status: fromStatus,
    to_status: toStatus,
    change_note: note,
  });

  if (historyResult.error) {
    throw new Error(`تعذر حفظ سجل تغيير الحالة: ${historyResult.error.message}`);
  }
}

async function applyOrderUpdateOrThrow(orderId: string, decision: TransitionDecision): Promise<void> {
  const supabase = getSupabaseServerAdminClient();

  const patch: Record<string, unknown> = {
    confirmation_status: decision.nextConfirmationStatus,
  };

  if (decision.nextStatus) {
    patch.status = decision.nextStatus;
  }

  const updateResult = await supabase.from('orders').update(patch).eq('id', orderId).select('id').maybeSingle();

  if (updateResult.error) {
    throw new Error(`تعذر تحديث الطلب: ${updateResult.error.message}`);
  }

  if (!updateResult.data) {
    throw new Error('تعذر تحديث الطلب المطلوب.');
  }
}

export async function applyAdminOrderActionOrThrow(orderId: string, action: AdminOrderAction): Promise<ApplyOrderActionResult> {
  const before = await loadOrderLifecycleOrThrow(orderId);
  const decision = resolveTransitionOrThrow(action, before.status, before.confirmation_status);

  await applyOrderUpdateOrThrow(orderId, decision);

  if (decision.nextStatus) {
    await insertStatusHistoryOrThrow(orderId, before.status, decision.nextStatus, decision.historyNote);
  }

  return {
    orderId: before.id,
    orderNumber: before.order_number,
    fromStatus: before.status,
    toStatus: decision.nextStatus,
    confirmationStatus: decision.nextConfirmationStatus,
    action,
  };
}
