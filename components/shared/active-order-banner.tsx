'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { clearActiveOrder, loadActiveOrder, type ActiveOrderSnapshot } from '@/lib/active-order-storage';

type TrackingResponseOk = {
  ok: true;
  order: {
    reference: string;
    status: string;
    confirmationStatus: 'pending' | 'confirmed' | 'unreachable' | 'rejected';
    tableReference: string | null;
    createdAt: string;
  };
};

type TrackingResponseError = {
  ok: false;
  error?: string;
};

type CustomerTrackingStage =
  | 'pending_confirmation'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

const POLL_INTERVAL_MS = 15_000;

const STATUS_LABELS: Record<CustomerTrackingStage, string> = {
  pending_confirmation: 'طلبك في انتظار تأكيد المطعم',
  confirmed: 'تم تأكيد الطلب',
  preparing: 'جاري تحضير الطلب',
  ready: 'الطلب جاهز للاستلام',
  out_for_delivery: 'الطلب خرج للدليفري',
  delivered: 'تم تسليم الطلب',
  cancelled: 'تم إلغاء الطلب',
};

function toCustomerStage(status: string, confirmationStatus: 'pending' | 'confirmed' | 'unreachable' | 'rejected'): CustomerTrackingStage {
  if (status === 'ملغي' || confirmationStatus === 'rejected') {
    return 'cancelled';
  }

  if (status === 'تم التسليم') {
    return 'delivered';
  }

  if (status === 'خرج للدليفري') {
    return 'out_for_delivery';
  }

  if (status === 'جاهز للاستلام') {
    return 'ready';
  }

  if (status === 'جاري التحضير') {
    return 'preparing';
  }

  if (confirmationStatus === 'confirmed') {
    return 'confirmed';
  }

  return 'pending_confirmation';
}

function buildOrderSuccessUrl(activeOrder: ActiveOrderSnapshot): string {
  const params = new URLSearchParams({
    orderId: activeOrder.orderId,
    ref: activeOrder.reference,
  });

  if (activeOrder.tableReference) {
    params.set('table', activeOrder.tableReference);
  }

  return `/order-success?${params.toString()}`;
}

export function ActiveOrderBanner() {
  const [activeOrder, setActiveOrder] = useState<ActiveOrderSnapshot | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [statusLabel, setStatusLabel] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTerminal, setIsTerminal] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setActiveOrder(loadActiveOrder());
      setIsHydrated(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!activeOrder) {
      return;
    }

    const currentOrder = activeOrder;
    let isActive = true;

    async function loadTracking() {
      try {
        const response = await fetch(`/api/orders/track?orderId=${encodeURIComponent(currentOrder.orderId)}`, {
          cache: 'no-store',
          method: 'GET',
        });
        const payload = (await response.json()) as TrackingResponseOk | TrackingResponseError;

        if (!isActive) {
          return;
        }

        if (!response.ok || !payload.ok) {
          if (response.status === 400 || response.status === 404) {
            clearActiveOrder();
            setActiveOrder(null);
            return;
          }

          setErrorMessage(payload.ok ? 'تعذر تحميل حالة الطلب الآن.' : payload.error || 'تعذر تحميل حالة الطلب الآن.');
          return;
        }

        const nextStage = toCustomerStage(payload.order.status, payload.order.confirmationStatus);
        const nextStatusLabel = STATUS_LABELS[nextStage] || payload.order.status;

        setStatusLabel(nextStatusLabel);
        setIsTerminal(nextStage === 'delivered' || nextStage === 'cancelled');
        setErrorMessage('');
      } catch {
        if (!isActive) {
          return;
        }

        setErrorMessage('تعذر تحميل حالة الطلب الآن.');
      }
    }

    void loadTracking();
    const intervalId = window.setInterval(() => {
      void loadTracking();
    }, POLL_INTERVAL_MS);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [activeOrder]);

  const orderSuccessUrl = useMemo(() => {
    if (!activeOrder) {
      return '';
    }

    return buildOrderSuccessUrl(activeOrder);
  }, [activeOrder]);

  if (!isHydrated || !activeOrder) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-brand-dark/20 bg-brand-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm font-black text-brand-dark">{isTerminal ? 'آخر طلب' : 'لديك طلب نشط'}</p>

          <p className="text-sm font-bold text-brand-charcoal">مرجع الطلب: {activeOrder.reference}</p>

          {activeOrder.tableReference ? <p className="text-xs font-bold text-brand-charcoal">الطاولة: {activeOrder.tableReference}</p> : null}

          {statusLabel ? <p className="rounded-lg bg-brand-yellow/40 px-3 py-2 text-sm font-bold text-brand-dark">{statusLabel}</p> : null}

          {errorMessage ? <p className="text-xs font-bold text-brand-red">{errorMessage}</p> : null}

          <Link href={orderSuccessUrl} className="btn-secondary inline-flex items-center bg-brand-white">
            {isTerminal ? 'فتح تفاصيل آخر طلب' : 'متابعة الطلب'}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => {
            clearActiveOrder();
            setActiveOrder(null);
          }}
          className="rounded-lg border border-brand-dark/30 px-3 py-1 text-xs font-black text-brand-charcoal"
        >
          إخفاء
        </button>
      </div>
    </section>
  );
}
