import type { AdminConfirmationStatus, AdminOrderStatus } from '@/types/admin-orders';

export type AdminOverviewSummary = {
  ordersToday: number;
  estimatedSalesToday: number;
  averageOrderValueToday: number;
};

export type AdminOverviewOperational = {
  pendingConfirmation: number;
  preparing: number;
  ready: number;
  outForDelivery: number;
  deliveredToday: number;
  cancelledToday: number;
};

export type AdminOverviewWarningOrder = {
  id: string;
  reference: string;
  customerName: string | null;
  customerPhone: string;
  status: AdminOrderStatus;
  confirmationStatus: AdminConfirmationStatus;
  createdAt: string;
  elapsedMinutes: number;
};

export type AdminOverviewWarnings = {
  pendingConfirmationOver10Minutes: AdminOverviewWarningOrder[];
  preparingOver20Minutes: AdminOverviewWarningOrder[];
};

export type AdminOverviewTopProduct = {
  productName: string;
  quantitySold: number;
  salesTotal: number;
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
  warnings: AdminOverviewWarnings;
  latestOrders: AdminOverviewLatestOrder[];
  topProductsToday: AdminOverviewTopProduct[];
};
