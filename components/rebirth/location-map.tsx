'use client';

import { useState } from 'react';
import { tuscaniniMapEmbedUrl } from '@/lib/rebirth/wayfinding';

/** A real third-party map on demand. The initial state is an intentional
 * restaurant location panel, never an empty iframe-shaped rectangle. */
export function LocationMap() {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div className="t-contact-map-section__canvas">
      {mapOpen ? (
        <iframe
          title="خريطة تفاعلية لمنطقة نادي توليب على شارع البحر في بني سويف"
          src={tuscaniniMapEmbedUrl}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="t-contact-map-section__reveal"
          onClick={() => setMapOpen(true)}
          aria-label="افتح خريطة منطقة توسكانيني داخل الصفحة"
        >
          <span className="t-contact-map-section__reveal-top"><span>TUSCANINI / BNS</span><span>من قلب بني سويف</span></span>
          <span className="t-contact-map-section__reveal-symbol" aria-hidden="true">↗</span>
          <strong>هنا<br/><em>بنستناك.</em></strong>
          <span className="t-contact-map-section__reveal-bottom">
            <span>شارع البحر، سور نادي توليب</span>
            <span>اضغط وافتح الخريطة <b aria-hidden="true">↗</b></span>
          </span>
        </button>
      )}
    </div>
  );
}
