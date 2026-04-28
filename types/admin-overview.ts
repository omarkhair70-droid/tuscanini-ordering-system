import type { AdminConfirmationStatus, AdminOrderStatus } from '@/types/admin-orders';

export type AdminOverviewSummary = {
  ordersToday: number;
  estimatedSalesToday: number;
  pendingConfirmationToday: number;
  preparingActiveToday: number;
};

export type AdminOverviewOperational = {
  newOrders: number;
  preparing: number;
  ready: number;
  deliveredToday: number;
  cancelledToday: number;
};

export type AdminOverviewLatestOrder = {
  id: string;
  orderNumber: number | null;
  reference: string;
  customerName: string | null;
  customerPhone: string;
  totalEstimate: number;
  status: AdminOrderStatus;
  confirmationStatus: AdminConfirmationStatus;
  createdAt: string;
};

export type AdminOverviewData = {
  summary: AdminOverviewSummary;
  operational: AdminOverviewOperational;
  latestOrders: AdminOverviewLatestOrder[];
};
