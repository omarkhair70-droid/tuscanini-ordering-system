'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { tuscaniniFoodMedia } from '@/lib/rebirth/food-media';

/**
 * Genuine category-level photos: real Tuscanini shots, NOT product-specific proof.
 * This discovery sequence is optional; direct Menu is always visible.
 */
const subjects = [
  { id: 'crepe', chapter: '01', arabic: 'الكريب', english: 'THE FOLD', caption: 'من برّه حكاية. ومن جوّه تفاصيل كتير.', menu: '/menu?category=crepe-tuscanini', image: 'TSC-09', subtitle: 'REAL CUTS / REAL FOOD' },
  { id: 'pizza', chapter: '02', arabic: 'البيتزا', english: 'THE WHOLE', caption: 'تكوين مختلف، ومشاركة ليها طعم تاني.', menu: '/menu?category=pizza-tuscanini', image: 'TSC-10', subtitle: 'FULL CIRCLE / DIFFERENT STORY' },
  { id: 'sandwich', chapter: '03', arabic: 'الساندوتشات', english: 'THE HOLD', caption: 'الأكل في الإيد، والتفاصيل قدام العين.', menu: '/menu?category=sandwiches-french', image: 'TSC-08', subtitle: 'HELD IN THE HAND' },
  { id: 'other', chapter: '04', arabic: 'اختيارات تانية', english: 'THE EXTRA', caption: 'لكل نوع أكل طريقته وحضوره.', menu: '/menu', image: 'TSC-11', subtitle: 'MORE THAN ONE FORM' },
] as const;

function FoodPhoto({ id, priority = false, className = '' }: { id: string; priority?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  const photo = tuscaniniFoodMedia.find((item) => item.id === id);
  if (!photo) return null;
  return (
    <div className={`t-real-food-photo ${className}`}>
      {!failed ? (
        <Image
          src={photo.path} alt={photo.altAr} fill priority={priority}
          sizes="(max-width: 720px) 92vw, (max-width: 1100px) 50vw, 40vw"
          className="t-real-food-photo__img"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="t-real-food-photo__missing" aria-label="صورة حقيقية من توسكانيني قيد تجهيز المصدر">
          <span lang="en">TUSCANINI / ORIGINAL PHOTO</span>
          <span>الصورة الأصلية قيد التجهيز</span>
        </div>
      )}
    </div>
  );
}

export function FoodExploration() {
  const [selected, setSelected] = useState<(typeof subjects)[number]['id']>('crepe');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const selectedSubject = useMemo(() => subjects.find((item) => item.id === selected) ?? subjects[0], [selected]);

  function openGallery() {
    setGalleryOpen(true);
    dialogRef.current?.showModal();
  }
  function closeGallery() {
    dialogRef.current?.close();
    setGalleryOpen(false);
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0
      : event.key === 'End' ? subjects.length - 1
      : (index + (event.key === 'ArrowRight' ? -1 : 1) + subjects.length) % subjects.length;
    const subject = subjects[next];
    setSelected(subject.id);
    document.getElementById(`t-food-tab-${subject.id}`)?.focus();
  }

  return (
    <>
      <section className="t-discover t-shell" aria-labelledby="t-discover-title" id="t-discover">
        <div className="t-discover__intro">
          <span className="t-index">02 — THE FOOD / FOUR EXPRESSIONS</span>
          <div>
            <h2 id="t-discover-title">مش صنف <em>واحد.</em></h2>
            <p>الأكل عند توسكانيني له أشكال مختلفة. اتفرّج على الصور الحقيقية، أو ادخل المنيو على طول.</p>
          </div>
        </div>
        <div className="t-discover__tabs" role="tablist" aria-label="اختار نوع الأكل">
          {subjects.map((subject, index) => (
            <button
              key={subject.id} id={`t-food-tab-${subject.id}`}
              type="button" role="tab"
              aria-selected={selected === subject.id}
              aria-controls="t-discover-panel"
              tabIndex={selected === subject.id ? 0 : -1}
              onKeyDown={(event) => handleTabKey(event, index)}
              onClick={() => setSelected(subject.id)}
            >{subject.arabic}<span aria-hidden="true">↗</span></button>
          ))}
        </div>
        <div className="t-discover__panel" id="t-discover-panel" role="tabpanel" aria-labelledby={`t-food-tab-${selected}`}>
          <div className="t-discover__copy">
            <span className="t-index">{selectedSubject.chapter} / {selectedSubject.english}</span>
            <h3>{selectedSubject.arabic}</h3>
            <p>{selectedSubject.caption}</p>
            <Link href={selectedSubject.menu} className="t-discover__cta">افتح القسم في المنيو <span aria-hidden="true">↗</span></Link>
            <span className="t-discover__caption" lang="en">{selectedSubject.subtitle}</span>
          </div>
          <div className="t-discover__image">
            <FoodPhoto key={selectedSubject.image} id={selectedSubject.image} />
            <span className="t-discover__photo-index" lang="en">{selectedSubject.image} / PHOTO EVIDENCE</span>
          </div>
        </div>
      </section>

      <section className="t-photo-archive t-shell" aria-labelledby="t-photo-archive-title">
        <div className="t-photo-archive__header">
          <div><span className="t-index">03 — REAL RESTAURANT / EDITORIAL MATERIAL</span><h2 id="t-photo-archive-title">مش صور <em>ستوك.</em></h2></div>
          <button type="button" onClick={openGallery} aria-haspopup="dialog">شوف الصور الـ12 <span aria-hidden="true">↗</span></button>
        </div>
        <div className="t-photo-archive__samples">
          {['TSC-02','TSC-10','TSC-08'].map((id) => (
            <button key={id} type="button" onClick={openGallery} aria-label="افتح معرض صور توسكانيني">
              <FoodPhoto id={id} />
              <span aria-hidden="true">{id}</span>
            </button>
          ))}
        </div>
      </section>

      <dialog ref={dialogRef} className="t-gallery-dialog" aria-label="صور الطعام الحقيقية من توسكانيني" onClose={() => setGalleryOpen(false)}
        onClick={(event) => { if (event.target === dialogRef.current) closeGallery(); }}>
        <div className="t-gallery-dialog__header">
          <div><span>ORIGINAL RESTAURANT PHOTOGRAPHS</span><h2>صور توسكانيني</h2></div>
          <button type="button" onClick={closeGallery} aria-label="إغلاق المعرض">×</button>
        </div>
        {galleryOpen ? (
          <div className="t-gallery-dialog__grid">
            {tuscaniniFoodMedia.map((photo) => (
              <figure key={photo.id}>
                <FoodPhoto id={photo.id} />
                <figcaption><span lang="en">{photo.id}</span> — {photo.altAr}</figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
