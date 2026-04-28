export const ADMIN_ORDER_STATUSES = [
  'جديد',
  'جاري التحضير',
  'جاهز للاستلام',
  'خرج للدليفري',
  'تم التسليم',
  'ملغي',
] as const;

export const ADMIN_CONFIRMATION_STATUSES = ['pending', 'confirmed', 'unreachable', 'rejected'] as const;

export const ADMIN_ORDER_ACTIONS = ['confirm', 'preparing', 'ready', 'delivered', 'cancel'] as const;

export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];

export type AdminConfirmationStatus = (typeof ADMIN_CONFIRMATION_STATUSES)[number];

export type AdminOrderAction = (typeof ADMIN_ORDER_ACTIONS)[number];

export type AdminOrdersFilters = {
  status: AdminOrderStatus | 'all';
  confirmationStatus: AdminConfirmationStatus | 'all';
  q: string;
};

export type AdminOrderItemAddonView = {
  id: string;
  labelSnapshot: string;
  price: number;
};

export type AdminOrderItemView = {
  id: string;
  productNameSnapshot: string;
  selectedSizeLabel: string | null;
  quantity: number;
  itemNotes: string | null;
  lineTotal: number;
  addons: AdminOrderItemAddonView[];
};

export type AdminOrderSummaryView = {
  id: string;
  orderNumber: number | null;
  reference: string;
  tableReference: string | null;
  customerName: string | null;
  customerPhone: string;
  customerAddress: string | null;
  orderType: 'delivery' | 'pickup';
  totalEstimate: number;
  status: AdminOrderStatus;
  confirmationStatus: AdminConfirmationStatus;
  generalNotes: string | null;
  createdAt: string;
  items: AdminOrderItemView[];
};

export type AdminOrdersDashboardData = {
  filters: AdminOrdersFilters;
  orders: AdminOrderSummaryView[];
};
