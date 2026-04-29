'use client';

import { useEffect, useMemo, useState } from 'react';

type TrackingResponseOk = {
  ok: true;
  order: {
    orderNumber: number | null;
    reference: string;
    status: string;
    confirmationStatus: 'pending' | 'confirmed' | 'unreachable' | 'rejected';
    tableReference: string | null;
    createdAt: string;
    orderType: 'delivery' | 'pickup';
    totalEstimate: number;
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

const POLL_INTERVAL_MS = 12_000;

const TIMELINE: Array<{ key: CustomerTrackingStage; label: string }> = [
  { key: 'pending_confirmation', label: 'طلبك في انتظار تأكيد المطعم' },
  { key: 'confirmed', label: 'تم تأكيد الطلب' },
  { key: 'preparing', label: 'جاري تحضير الطلب' },
  { key: 'ready', label: 'الطلب جاهز للاستلام' },
  { key: 'out_for_delivery', label: 'الطلب خرج للدليفري' },
  { key: 'delivered', label: 'تم تسليم الطلب' },
  { key: 'cancelled', label: 'تم إلغاء الطلب' },
];

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

function formatCreatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return 'غير متاح';
  }

  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function OrderTrackingCard({ orderId, fallbackReference, fallbackTableReference }: { orderId: string; fallbackReference: string; fallbackTableReference: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<TrackingResponseOk['order'] | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadTracking() {
      try {
        const response = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId)}`, {
          method: 'GET',
          cache: 'no-store',
        });

        const payload = (await response.json()) as TrackingResponseOk | TrackingResponseError;

        if (!isActive) {
          return;
        }

        if (!response.ok || !payload.ok) {
          setError(payload.ok ? 'تعذر تحميل حالة الطلب الآن.' : payload.error || 'تعذر تحميل حالة الطلب الآن.');
          return;
        }

        setOrder(payload.order);
        setError('');
      } catch {
        if (!isActive) {
          return;
        }
        setError('تعذر تحميل حالة الطلب الآن.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
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
  }, [orderId]);

  const currentStage = useMemo(() => {
    if (!order) {
      return null;
    }

    return toCustomerStage(order.status, order.confirmationStatus);
  }, [order]);

  const currentStageLabel = currentStage ? TIMELINE.find((item) => item.key === currentStage)?.label ?? 'حالة الطلب غير متاحة' : '';

  const currentIndex = currentStage ? TIMELINE.findIndex((item) => item.key === currentStage) : -1;

  return (
    <section className="rounded-3xl border border-brand-dark/10 bg-brand-white p-5 shadow-[0_10px_24px_rgba(18,18,18,0.05)] sm:p-6">
      <div className="space-y-3">
        <p className="text-lg font-black text-brand-dark sm:text-xl">تم استلام طلبك</p>

        {isLoading ? <p className="rounded-xl border border-brand-dark/20 bg-brand-yellow/30 px-3 py-2 text-sm font-bold text-brand-dark">جاري تحميل حالة الطلب...</p> : null}

        {!isLoading && currentStageLabel ? (
          <p className="rounded-xl border border-brand-dark/20 bg-brand-yellow/30 px-3 py-2 text-sm font-bold text-brand-dark sm:text-base">{currentStageLabel}</p>
        ) : null}

        {error ? <p className="rounded-xl border border-brand-red/40 bg-brand-red/10 px-3 py-2 text-sm font-bold text-brand-red">{error}</p> : null}

        <div className="rounded-xl border border-brand-dark/20 bg-brand-white px-4 py-3">
          <p className="text-xs font-bold text-brand-charcoal">مرجع الطلب</p>
          <p className="mt-1 text-base font-black text-brand-red sm:text-lg">{order?.reference || fallbackReference || orderId}</p>
        </div>

        {(order?.tableReference || fallbackTableReference) ? (
          <div className="rounded-xl border border-brand-dark/20 bg-brand-white px-4 py-3">
            <p className="text-xs font-bold text-brand-charcoal">مرجع الطاولة</p>
            <p className="mt-1 text-base font-black text-brand-dark sm:text-lg">{order?.tableReference || fallbackTableReference}</p>
          </div>
        ) : null}

        <div className="grid gap-2 rounded-xl border border-brand-dark/20 bg-brand-white p-3 text-sm font-bold text-brand-dark sm:grid-cols-2">
          <p>نوع الطلب: {order?.orderType === 'pickup' ? 'استلام' : 'دليفري'}</p>
          <p>الإجمالي التقريبي: {order ? `${order.totalEstimate} ج.م` : 'غير متاح'}</p>
          <p className="sm:col-span-2">تاريخ الإنشاء: {order ? formatCreatedAt(order.createdAt) : 'غير متاح'}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-brand-dark/15 bg-brand-white p-4">
        <p className="text-sm font-black text-brand-dark">تتبع حالة الطلب</p>
        <ol className="mt-3 space-y-2">
          {TIMELINE.map((item, index) => {
            const isCancelled = currentStage === 'cancelled';
            const isCurrent = currentStage === item.key;
            const isComplete = !isCancelled && currentIndex >= 0 && index <= currentIndex;

            return (
              <li key={item.key} className="flex items-center gap-2 text-sm font-bold">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                    isCurrent
                      ? 'border-brand-red bg-brand-red text-brand-white'
                      : isComplete
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-brand-dark/20 bg-brand-white text-brand-charcoal'
                  }`}
                >
                  {index + 1}
                </span>
                <span className={isCurrent ? 'text-brand-dark' : 'text-brand-charcoal'}>{item.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
