'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

/** The close/detail control compares two crops of the same real Tuscanini photo. */
export function MaterialReveal() {
  const [detail, setDetail] = useState(48);

  return (
    <section className="t-material" aria-labelledby="t-material-heading" id="t-material">
      <div className="t-material__spread t-shell" data-t-story-step>
        <div className="t-material__story">
          <div className="t-material__masthead">
            <div className="t-material__eyebrow">
              <span className="t-index">03 / الكريب بيتكلم</span>
              <span>بُص على التفاصيل</span>
            </div>
            <h2 id="t-material-heading">التفاصيل<br/><em>بتتكلم.</em></h2>
            <p>طبقات فوق بعض، وحشو باين من أول بصّة. قرّب وشوف الكريب من جوّه.</p>
          </div>
          <div className="t-material__detail-card">
            <div className="t-material__detail-head">
              <strong>شوف الحشو من جوّه</strong>
              <span>اسحب وقرّب</span>
            </div>
            <div className="t-material__stage">
              <div className="t-material__image t-material__image--whole">
                <Image src="/images/rebirth/food-12.jpg" alt="كريبات توسكانيني المفتوحة وحشواتها ظاهرة" fill sizes="(max-width: 720px) 90vw, 38vw" className="t-material__img" />
              </div>
              <div className="t-material__image t-material__image--detail" aria-hidden="true" style={{clipPath:`inset(0 ${100 - detail}% 0 0)`}}>
                <Image src="/images/rebirth/food-12.jpg" alt="" fill sizes="(max-width: 720px) 90vw, 38vw" className="t-material__img t-material__img--macro" />
              </div>
              <div className="t-material__handle" aria-hidden="true" style={{left:`${detail}%`}} />
              <span className="t-material__handle-knob" aria-hidden="true" style={{left:`clamp(29px, ${detail}%, calc(100% - 29px))`}}>↔</span>
              <input
                type="range" min={0} max={100} step={1} value={detail}
                aria-label="حرّك للمقارنة بين نفس صورة الأكل كاملة والتفاصيل المقرّبة"
                aria-valuetext={`${detail}٪ من اللقطة تظهر تفاصيل مقرّبة`}
                onChange={event => setDetail(Number(event.target.value))}
                className="t-material__range"
              />
            </div>
            <div className="t-material__caption">
              <span>صورة حقيقية من توسكانيني</span>
              <span>اسحب أو استخدم الأسهم في الكيبورد</span>
            </div>
          </div>
          <div className="t-material__bridge">
            <span>لقيت اللي يفتح نفسك؟</span>
            <Link href="/menu">روح للمنيو <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="t-material__hero-food">
          <div className="t-material__halo" aria-hidden="true" />
          <Image
            src="/images/rebirth/food-12.jpg"
            alt="مجموعة كريبات حقيقية مفتوحة من توسكانيني وحشواتها ظاهرة"
            fill sizes="(max-width: 720px) 94vw, 47vw"
            className="t-material__hero-img"
          />
          <span className="t-material__photo-tag">كريب توسكانيني</span>
          <span className="t-material__photo-index" aria-hidden="true">01 / الحشو</span>
        </div>
      </div>
    </section>
  );
}
