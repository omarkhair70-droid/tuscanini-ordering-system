import type { AdminOrderStatus } from '@/types/admin-orders';

export const KITCHEN_ACTIVE_STATUSES = ['جديد', 'جاري التحضير', 'جاهز للاستلام', 'خرج للدليفري'] as const;

export type KitchenActiveStatus = (typeof KITCHEN_ACTIVE_STATUSES)[number];

export const KITCHEN_COLUMNS: ReadonlyArray<{
  status: KitchenActiveStatus;
  title: string;
}> = [
  { status: 'جديد', title: 'جديد' },
  { status: 'جاري التحضير', title: 'جاري التحضير' },
  { status: 'جاهز للاستلام', title: 'جاهز' },
  { status: 'خرج للدليفري', title: 'خرج للدليفري' },
];

export type KitchenOrderItemAddonView = {
  id: string;
  labelSnapshot: string;
  price: number;
};

export type KitchenOrderItemView = {
  id: string;
  productNameSnapshot: string;
  selectedSizeLabel: string | null;
  quantity: number;
  itemNotes: string | null;
  addons: KitchenOrderItemAddonView[];
};

export type KitchenOrderView = {
  id: string;
  orderNumber: number | null;
  reference: string;
  tableReference: string | null;
  customerName: string | null;
  orderType: 'delivery' | 'pickup';
  status: KitchenActiveStatus;
  generalNotes: string | null;
  createdAt: string;
  items: KitchenOrderItemView[];
};

export type KitchenOrdersBoardData = {
  orders: KitchenOrderView[];
  grouped: Record<KitchenActiveStatus, KitchenOrderView[]>;
};

export type KitchenUrgencyLevel = 'normal' | 'warning' | 'danger';

const KITCHEN_WARNING_MINUTES_BY_STATUS: Record<KitchenActiveStatus, number> = {
  جديد: 10,
  'جاري التحضير': 20,
  'جاهز للاستلام': 10,
  'خرج للدليفري': 30,
};

export function getKitchenUrgencyLevel(status: KitchenActiveStatus, elapsedMinutes: number): KitchenUrgencyLevel {
  if (!Number.isFinite(elapsedMinutes) || elapsedMinutes < 0) {
    return 'normal';
  }

  if (status === 'جاري التحضير' && elapsedMinutes > KITCHEN_WARNING_MINUTES_BY_STATUS[status]) {
    return 'danger';
  }

  if (elapsedMinutes > KITCHEN_WARNING_MINUTES_BY_STATUS[status]) {
    return 'warning';
  }

  return 'normal';
}

export function isKitchenActiveStatus(value: AdminOrderStatus): value is KitchenActiveStatus {
  return (KITCHEN_ACTIVE_STATUSES as readonly string[]).includes(value);
}
