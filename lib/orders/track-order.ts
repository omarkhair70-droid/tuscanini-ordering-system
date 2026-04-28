import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type PublicOrderTracking = {
  orderId: string;
  orderNumber: number | null;
  reference: string;
  status: string;
  confirmationStatus: 'pending' | 'confirmed' | 'unreachable' | 'rejected';
  tableReference: string | null;
  createdAt: string;
  orderType: 'delivery' | 'pickup';
  totalEstimate: number;
};

function validateOrderIdOrThrow(orderId: string): string {
  const normalized = orderId.trim();
  if (!UUID_PATTERN.test(normalized)) {
    throw new Error('معرّف الطلب غير صالح.');
  }

  return normalized;
}

export async function getPublicOrderTrackingOrThrow(orderId: string): Promise<PublicOrderTracking> {
  const safeOrderId = validateOrderIdOrThrow(orderId);
  const admin = getSupabaseServerAdminClient();

  const result = await admin
    .from('orders')
    .select('id, order_number, status, confirmation_status, table_reference, created_at, order_type, total_estimate')
    .eq('id', safeOrderId)
    .maybeSingle();

  if (result.error) {
    throw new Error(`تعذر قراءة بيانات تتبع الطلب: ${result.error.message}`);
  }

  if (!result.data) {
    throw new Error('الطلب غير موجود.');
  }

  const orderNumber = typeof result.data.order_number === 'number' ? result.data.order_number : null;

  return {
    orderId: result.data.id,
    orderNumber,
    reference: orderNumber ? `#${orderNumber}` : result.data.id,
    status: String(result.data.status ?? ''),
    confirmationStatus:
      result.data.confirmation_status === 'confirmed' || result.data.confirmation_status === 'unreachable' || result.data.confirmation_status === 'rejected'
        ? result.data.confirmation_status
        : 'pending',
    tableReference: typeof result.data.table_reference === 'string' ? result.data.table_reference : null,
    createdAt: String(result.data.created_at ?? ''),
    orderType: result.data.order_type === 'pickup' ? 'pickup' : 'delivery',
    totalEstimate: typeof result.data.total_estimate === 'number' ? result.data.total_estimate : 0,
  };
}
