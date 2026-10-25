'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MaterialGlyph } from '@/components/rebirth/material-glyph';

/** Real physical restaurant evidence, not a fictional production or delivery ritual. */
export function PackagingChapter() {
  // Two SEPARATE real restaurant photographs: packaging TSC-08, cut food TSC-07.
  // Never present them as before/after of the same order, product or size.
  const [scene,setScene]=useState<'package'|'inside'>('package');
  const packageActive=scene==='package';
  return (
    <section className="t-packaging" aria-labelledby="t-packaging-title">
      <div className="t-packaging__photo">
        <Image
          src="/images/rebirth/food-08.jpg"
          alt="ساندوتشات توسكانيني بجانب العلب الحمراء وورق التغليف المطبوع الحقيقي"
          fill loading="eager" sizes="(max-width: 760px) 100vw, 50vw"
          className="t-packaging__photo-img t-packaging__photo-img--package"
          data-current={packageActive} aria-hidden={!packageActive}
        />
        <Image
          src="/images/rebirth/food-07.jpg"
          alt="صورة مختلفة من توسكانيني: ثلاثة كريبات مفتوحة بتفاصيل الحشو الظاهرة"
          fill loading="eager" sizes="(max-width: 760px) 100vw, 50vw"
          className="t-packaging__photo-img t-packaging__photo-img--inside"
          data-current={!packageActive} aria-hidden={packageActive}
        />
        <span className="t-packaging__photo-label">{packageActive ? 'العلبة والورق' : 'الأكل من جوّه'}</span>
        <div className="t-packaging__view-caption" role="status">
          {packageActive ? 'علب توسكانيني الحمراء وورق التغليف.' : 'ودي كريبات تانية من توسكانيني، شوف الحشو من جوّه.'}
        </div>
        <div className="t-packaging__photo-mark" aria-hidden="true">
          <MaterialGlyph name={packageActive ? 'box' : 'cut'} size={72}/>
        </div>
      </div>
      <div className="t-packaging__content">
        <div className="t-packaging__eyebrow">
          <span className="t-index">04 / THE WRAP</span>
          <span lang="en">FOOD. PAPER. INSIDE.</span>
        </div>
        <h2 id="t-packaging-title">العلبة<br/><em>ليها شكل.</em></h2>
        <div className="t-packaging__chooser" role="group" aria-label="تغيير مشهد الصور الحقيقية">
          <button type="button" aria-pressed={packageActive} onClick={()=>setScene('package')}>
            <MaterialGlyph name="box" size={34}/>
            <span>العلبة والورق</span>
            <small lang="en">01</small>
          </button>
          <button type="button" aria-pressed={!packageActive} onClick={()=>setScene('inside')}>
            <MaterialGlyph name="cut" size={34}/>
            <span>الأكل من جوا</span>
            <small lang="en">02</small>
          </button>
        </div>
        <div className="t-packaging__bottom">
          <p>من العلبة الحمراء لحد الحشو اللي جوّه الكريب. اختار المشهد اللي يفتح نفسك، وبعدين اختار أكلك.</p>
          <Link href="/menu">شوف الأكل كله <span aria-hidden="true">↗</span></Link>
        </div>
        <MaterialGlyph name="fold" size={340} className="t-packaging__ghost-glyph"/>
      </div>
    </section>
  );
}

export function PlaceChapter() {
  return (
    <section className="t-place-final" aria-labelledby="t-place-final-title">
      <div className="t-place-final__copy">
        <span className="t-index">05 / من قلب بني سويف</span>
        <h2 id="t-place-final-title">تلاقينا<br/>في بني<br/><em>سويف.</em></h2>
        <p className="t-place-final__address">
          <span aria-hidden="true" className="t-place-final__pin">●</span>
          شارع البحر، سور نادي توليب، بني سويف.
        </p>
        <div className="t-place-final__links">
          <Link href="/contact">المكان والتواصل <span aria-hidden="true">↗</span></Link>
          <Link href="/offers">شوف العروض <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="t-place-final__art" aria-hidden="true">
        <span className="t-place-final__thin-ring t-place-final__thin-ring--top" />
        <span className="t-place-final__thin-ring t-place-final__thin-ring--bottom" />
        <div className="t-place-final__city">
          <span className="t-place-final__city-label">TUSCANINI / BENI SUEF</span>
          <svg viewBox="0 0 310 155" fill="none" aria-hidden="true">
            <path d="M18 110H292M26 95H284M45 95V50H74V95M87 95V38H116V95M129 95V63H159V95M171 95V24H198V95M210 95V51H240V95M251 95V69H277V95" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
            <path d="M11 124C39 111 60 137 86 124S136 111 162 124S211 137 238 124S276 116 299 124M11 141C39 128 60 154 86 141S136 128 162 141S211 154 238 141S276 133 299 141" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
          </svg>
          <span className="t-place-final__city-foot">شارع البحر / بني سويف</span>
        </div>
        <span className="t-place-final__heart">من قلب<br/>بني سويف</span>
        <div className="t-place-final__food-disc">
          <Image src="/images/rebirth/food-12.jpg" alt="" fill sizes="(max-width:720px) 25vw, 11vw" />
        </div>
        <span className="t-place-final__stamp">BNS<small>EGYPT</small></span>
      </div>
    </section>
  );
}
