'use client';

import { useEffect, useRef } from 'react';

export type DeliveryPin = { lat: number; lng: number };

type Props = {
  onSelect: (point: DeliveryPin) => void;
};

/** Exact drop-off location selected by the customer on an interactive map.
 * The map is same-origin, while its tile provider and bundled MapLibre library
 * are pinned external static resources. The parent verifies source + origin.
 * The selected coordinates are returned to the order form — not a fake GPS
 * estimate and not the map of Tuscanini's own restaurant.
 */
export function CustomerDeliveryPin({ onSelect }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const callbackRef = useRef(onSelect);
  callbackRef.current = onSelect;

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin ||
          event.source !== frameRef.current?.contentWindow) return;
      const data = event.data as Record<string, unknown> | null;
      if (!data || data.type !== 'tuscanini:delivery-pin:selected' || data.version !== 1) return;
      const lat = Number(data.lat), lng = Number(data.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) ||
          lat < 22 || lat > 32 || lng < 24 || lng > 37) return;
      callbackRef.current({lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6))});
      dialogRef.current?.close();
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);

  return <>
    <button type="button" className="t-checkout-delivery-pin__open"
      onClick={() => dialogRef.current?.showModal()}>
      <span aria-hidden="true">⌾</span> حدّد مكان التوصيل على الخريطة
    </button>
    <dialog ref={dialogRef} className="t-checkout-delivery-pin__dialog"
      aria-label="اختيار مكان تسليم الطلب على الخريطة">
      <div className="t-checkout-delivery-pin__surface">
        <header>
          <strong>حدّد مكان التوصيل</strong>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="اقفل الخريطة">×</button>
        </header>
        <iframe ref={frameRef} title="خريطة تفاعلية لاختيار دبوس التوصيل"
          src="/delivery-location-picker.html" allow="geolocation" loading="lazy"/>
      </div>
    </dialog>
  </>;
}
