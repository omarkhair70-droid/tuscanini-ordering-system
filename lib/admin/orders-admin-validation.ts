import 'server-only';

import {
  ADMIN_ORDER_ACTIONS,
  ADMIN_ORDER_STATUSES,
  type AdminOrderAction,
  type AdminOrderStatus,
  type AdminConfirmationStatus,
} from '@/types/admin-orders';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type TransitionMap = Record<AdminOrderAction, readonly AdminOrderStatus[]>;

const ACTION_ALLOWED_FROM: TransitionMap = {
  confirm: ['جديد', 'جاري التحضير', 'جاهز للاستلام', 'خرج للدليفري'],
  preparing: ['جديد'],
  ready: ['جاري التحضير'],
  delivered: ['جاهز للاستلام', 'خرج للدليفري'],
  cancel: ['جديد', 'جاري التحضير', 'جاهز للاستلام', 'خرج للدليفري'],
};

export type TransitionDecision = {
  nextStatus: AdminOrderStatus | null;
  nextConfirmationStatus: AdminConfirmationStatus;
  historyNote: string;
};

export function validateOrderIdOrThrow(orderId: string): void {
  if (!UUID_PATTERN.test(orderId)) {
    throw new Error('معرّف الطلب غير صالح.');
  }
}

export function parseOrderActionOrThrow(value: unknown): AdminOrderAction {
  if (typeof value !== 'string') {
    throw new Error('إجراء الطلب غير صالح.');
  }

  const normalized = value.trim();
  if ((ADMIN_ORDER_ACTIONS as readonly string[]).includes(normalized)) {
    return normalized as AdminOrderAction;
  }

  throw new Error('الإجراء المطلوب غير مسموح به.');
}

export function parseOrderStatusOrThrow(value: unknown): AdminOrderStatus {
  if (typeof value !== 'string') {
    throw new Error('حالة الطلب الحالية غير صالحة.');
  }

  if ((ADMIN_ORDER_STATUSES as readonly string[]).includes(value)) {
    return value as AdminOrderStatus;
  }

  throw new Error('حالة الطلب الحالية غير صالحة.');
}


export function parseConfirmationStatusOrThrow(value: unknown): AdminConfirmationStatus {
  if (typeof value !== 'string') {
    throw new Error('حالة التأكيد الحالية غير صالحة.');
  }

  if (value === 'pending' || value === 'confirmed' || value === 'unreachable' || value === 'rejected') {
    return value;
  }

  throw new Error('حالة التأكيد الحالية غير صالحة.');
}

function assertActionAllowedFromStatus(action: AdminOrderAction, currentStatus: AdminOrderStatus): void {
  const allowedStatuses = ACTION_ALLOWED_FROM[action];
  if (!allowedStatuses.includes(currentStatus)) {
    throw new Error('لا يمكن تنفيذ هذا الإجراء من حالة الطلب الحالية.');
  }
}

export function resolveTransitionOrThrow(
  action: AdminOrderAction,
  currentStatus: AdminOrderStatus,
  currentConfirmationStatus: AdminConfirmationStatus,
): TransitionDecision {
  assertActionAllowedFromStatus(action, currentStatus);

  if (action === 'confirm') {
    if (currentConfirmationStatus === 'confirmed') {
      throw new Error('الطلب مؤكد بالفعل.');
    }

    return {
      nextStatus: null,
      nextConfirmationStatus: 'confirmed',
      historyNote: 'Order confirmed by admin dashboard.',
    };
  }

  if (action === 'preparing') {
    if (currentStatus === 'جاري التحضير') {
      throw new Error('الطلب في حالة التحضير بالفعل.');
    }

    return {
      nextStatus: 'جاري التحضير',
      nextConfirmationStatus: currentConfirmationStatus,
      historyNote: 'Order moved to preparing.',
    };
  }

  if (action === 'ready') {
    if (currentStatus === 'جاهز للاستلام') {
      throw new Error('الطلب في حالة جاهز بالفعل.');
    }

    return {
      nextStatus: 'جاهز للاستلام',
      nextConfirmationStatus: currentConfirmationStatus,
      historyNote: 'Order marked as ready.',
    };
  }

  if (action === 'delivered') {
    if (currentStatus === 'تم التسليم') {
      throw new Error('الطلب تم تسليمه بالفعل.');
    }

    return {
      nextStatus: 'تم التسليم',
      nextConfirmationStatus: currentConfirmationStatus,
      historyNote: 'Order marked as delivered.',
    };
  }

  if (currentStatus === 'ملغي') {
    throw new Error('الطلب ملغي بالفعل.');
  }

  return {
    nextStatus: 'ملغي',
    nextConfirmationStatus: currentConfirmationStatus,
    historyNote: 'Order cancelled by admin dashboard.',
  };
}
