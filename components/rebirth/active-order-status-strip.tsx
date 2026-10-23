'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { loadActiveOrder, type ActiveOrderSnapshot } from '@/lib/active-order-storage';

type OrderStatus = {
  status: string;
  confirmationStatus: 'pending' | 'confirmed' | 'rejected' | 'unreachable';
  orderType: 'delivery' | 'pickup';
};
type TrackingReply = { ok: true; order: OrderStatus } | { ok: false; error?: string };

const POLL_MS = 15_000;

function statusText(order: OrderStatus): string {
  if (order.confirmationStatus === 'rejected') return 'المطعم اعتذر عن الطلب';
  if (order.status === 'ملغي') return 'الطلب اتلغى';
  if (order.status === 'تم التسليم') return 'الطلب اتسلّم';
  if (order.status === 'خرج للدليفري') return 'الطلب خرج للتوصيل';
  if (order.status === 'جاهز للاستلام') return order.orderType === 'pickup'
    ? 'طلبك جاهز للاستلام' : 'الطلب جاهز عند المطعم';
  if (order.status === 'جاري التحضير') return 'طلبك بيتحضّر';
  if (order.confirmationStatus === 'unreachable') return 'المطعم محتاج يتواصل معاك';
  if (order.confirmationStatus === 'confirmed') return 'المطعم أكّد طلبك';
  return 'طلبك مستني تأكيد المطعم';
}

/**
 * A quiet *in-website* continuation of the real order.
 * No fabricated ETA, browser push, OS notification or claimed Live Activity.
 * The order UUID stays in the customer's existing tracking page URL.
 */
export function ActiveOrderStatusStrip() {
  const pathname = usePathname();
  const [active, setActive] = useState<ActiveOrderSnapshot | null>(null);
  const [status, setStatus] = useState('بنراجع حالة طلبك…');
  const [stale, setStale] = useState(false);

  useEffect(() => {
    // A newly saved cart order is picked up on client-side navigation.
    setActive(loadActiveOrder());
  }, [pathname]);

  useEffect(() => {
    if (!active) return;
    const orderId = active.orderId;
    let live = true;
    let controller: AbortController | null = null;

    async function refresh() {
      controller?.abort();
      const request = new AbortController();
      controller = request;
      try {
        const response = await fetch('/api/orders/track?orderId=' +
          encodeURIComponent(orderId), {
          method: 'GET', cache: 'no-store', signal: request.signal,
        });
        const result = await response.json() as TrackingReply;
        if (!live || request.signal.aborted) return;
        if (!response.ok || !result.ok) {
          setStale(true);
          return;
        }
        setStatus(statusText(result.order));
        setStale(false);
      } catch {
        if (live && !request.signal.aborted) setStale(true);
      }
    }

    const poll = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    void refresh();
    const timer = window.setInterval(poll, POLL_MS);
    window.addEventListener('online', poll);
    document.addEventListener('visibilitychange', poll);
    return () => {
      live = false;
      controller?.abort();
      window.clearInterval(timer);
      window.removeEventListener('online', poll);
      document.removeEventListener('visibilitychange', poll);
    };
  }, [active?.orderId]);

  // Cart already has its own detailed active-order card; the tracking page
  // shows a full ticket. Do not duplicate the status/navigation on them.
  if (!active || pathname === '/cart' || pathname === '/order-success') return null;

  return (
    <div className="t-order-strip" role="region" aria-label="متابعة طلبك الحالي">
      <span className="t-order-strip__dot" aria-hidden="true"/>
      <span className="t-order-strip__caption">أوردرِك</span>
      <span className="t-order-strip__status" aria-live="polite">
        {stale ? 'تعذّر تحديث حالة الطلب · افتح المتابعة' : status}
      </span>
      <Link href={'/order-success?orderId=' + encodeURIComponent(active.orderId)}
        className="t-order-strip__link">
        تابع الطلب <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
