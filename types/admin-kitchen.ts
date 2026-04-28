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

export function isKitchenActiveStatus(value: AdminOrderStatus): value is KitchenActiveStatus {
  return (KITCHEN_ACTIVE_STATUSES as readonly string[]).includes(value);
}
