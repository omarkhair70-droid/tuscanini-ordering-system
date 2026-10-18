'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

/**
 * One authentic TSC-02 restaurant photograph in two photographic treatments:
 * a whole, human-scale view, and a macro crop of the EXACT SAME source pixels.
 * Nothing is synthesized or matched to an unverified named menu product.
 */
export function MaterialReveal() {
  const [detail, setDetail] = useState(52);
  return (
    <section className="t-material" aria-labelledby="t-material-heading" id="t-material">
      <div className="t-material__masthead t-shell" data-t-story-step>
        <div className="t-material__eyebrow">
          <span className="t-index">03 / SEE THE ACTUAL FOOD</span>
          <span lang="en">ONE REAL PHOTO · TWO WAYS TO LOOK</span>
        </div>
        <h2 id="t-material-heading">من بعيد.<br/><em>من جوه.</em></h2>
        <p>شايف الكريب كله؟ قرّب شوية. اسحب بين اللقطة الكاملة والتفاصيل اللي جواها، وشوفها من زاويتين.</p>
      </div>
      <div className="t-material__composition t-shell" data-t-story-step>
        <div className="t-material__type-rail" aria-hidden="true" lang="en">
          <span>LOOK</span><span>CLOSER.</span>
        </div>
        <div className="t-material__stage">
          <div className="t-material__image t-material__image--whole">
            <Image src="/images/rebirth/food-02.jpg" alt="لقطة أصلية لكريب حقيقي ممسوك بإيد موظف توسكانيني، يظهر حجم الوجبة بالكامل" fill sizes="(max-width: 720px) 96vw, 67vw" className="t-material__img" />
          </div>
          <div className="t-material__image t-material__image--detail" aria-hidden="true" style={{clipPath:`inset(0 ${100-detail}% 0 0)`}}>
            <Image src="/images/rebirth/food-02.jpg" alt="" fill sizes="(max-width: 720px) 96vw, 67vw" className="t-material__img t-material__img--macro" />
          </div>
          <div className="t-material__handle" aria-hidden="true" style={{left:`${detail}%`}}>
            <span className="t-material__handle-knob">↔</span>
          </div>
          <span className="t-material__badge t-material__badge--whole">اللقطة الكاملة</span>
          <span className="t-material__badge t-material__badge--detail">التفاصيل</span>
          <input
            type="range" min={0} max={100} step={1} value={detail}
            aria-label="حرّك للمقارنة بين نفس صورة الأكل كاملة والتفاصيل المقرّبة"
            aria-valuetext={`${detail}٪ من اللقطة تظهر تفاصيل مقرّبة`}
            onChange={(event)=>setDetail(Number(event.target.value))}
            className="t-material__range"
          />
        </div>
        <div className="t-material__caption">
          <span>FROM THE RESTAURANT / TUSCANINI</span><span>ONE PHOTO / TWO VIEWS</span>
          <span>اسحب أو استخدم الأسهم في الكيبورد</span>
        </div>
      </div>
      <div className="t-material__after t-shell" data-t-story-step>
        <div>
          <span className="t-index">DON'T JUST LOOK / MAKE YOUR CHOICE</span>
          <h3>شايف اللي<br/><em>بيفرق؟</em></h3>
        </div>
        <div>
          <p>المشهد يساعدك تشوف التفاصيل، لكن الاختيار الصح محتاج منيو وأحجام وإضافات موثوقة. عشان كده تقدر تروح للمنيو مباشرة، من غير ما تضطر تكمل أي حركة.</p>
          <Link href="/menu" className="t-material__order">المنيو قدامك <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </section>
  );
}
