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
  const locatingRef = useRef(false);
  callbackRef.current = onSelect;

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin ||
          event.source !== frameRef.current?.contentWindow) return;
      const data = event.data as Record<string, unknown> | null;
      if (!data || data.version !== 1) return;
      if (data.type === 'tuscanini:delivery-location:request') {
        // Request the browser's location in the TOP-LEVEL page. Some mobile
        // browsers block geolocation in embedded frames despite allow=geolocation.
        const requestId = data.requestId;
        if (typeof requestId !== 'string' ||
            !/^[A-Za-z0-9_-]{8,64}$/.test(requestId) || locatingRef.current ||
            !dialogRef.current?.open) return;
        locatingRef.current = true;
        const reply = (result: Record<string, unknown>) => {
          if (dialogRef.current?.open && frameRef.current?.contentWindow === event.source)
            frameRef.current.contentWindow.postMessage({
              type: 'tuscanini:delivery-location:result', version: 1, requestId, ...result,
            }, window.location.origin);
        };
        const finish = (result: Record<string, unknown>) => {
          locatingRef.current = false;
          reply(result);
        };
        const success = (position: GeolocationPosition) => {
          const lat = position.coords.latitude, lng = position.coords.longitude;
          if (!Number.isFinite(lat) || !Number.isFinite(lng) ||
              lat < 22 || lat > 32 || lng < 24 || lng > 37) {
            finish({status: 'outside'});
          } else {
            finish({status: 'ok', lat, lng});
          }
        };
        if (!navigator.geolocation) {
          finish({status: 'unsupported'});
          return;
        }
        const retry = () => {
          reply({status: 'retrying'});
          navigator.geolocation.getCurrentPosition(success, (error) => {
            finish({status: error.code === 1 ? 'denied' :
              error.code === 3 ? 'timeout' : 'unavailable'});
          }, {enableHighAccuracy: false, timeout: 13000, maximumAge: 60000});
        };
        navigator.geolocation.getCurrentPosition(success, (error) => {
          if (error.code === 1) finish({status: 'denied'});
          else retry();
        }, {enableHighAccuracy: true, timeout: 9000, maximumAge: 30000});
        return;
      }
      if (data.type !== 'tuscanini:delivery-pin:selected') return;
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
