'use client';

import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/components/cart/cart-provider';
import { FloatingCartCta } from '@/components/cart/floating-cart-cta';
import { RebirthProductDialog } from '@/components/rebirth/rebirth-product-dialog';
import { ActiveOrderBanner } from '@/components/shared/active-order-banner';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import type { MenuCategory, MenuItem } from '@/types/menu';
import { MaterialGlyph, categoryMaterialGlyph } from '@/components/rebirth/material-glyph';
import { ProductArtwork } from '@/components/rebirth/product-artwork';
import { getCategoryContextPhoto } from '@/lib/rebirth/verified-menu-photographs';
import type { RebirthCatalog } from '@/lib/rebirth/previous-menu-catalog';

type Props = {
  categories: MenuCategory[];
  items: MenuItem[];
  initialTableReference: string | null;
  source: RebirthCatalog['source'];
};

const PAGE_SIZE = 20;
function normalizeArabic(text: string) {
  return text.normalize('NFKC').replace(/[\u064B-\u065F\u0670]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').toLocaleLowerCase('ar').trim();
}

export function RebirthMenu({ categories, items, initialTableReference, source }: Props) {
  const { tableReference, updateTableReference } = useCart();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState<'fast'|'art'|'photo'>('photo');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [originRect,setOriginRect] = useState<{left:number;top:number;width:number;height:number}|null>(null);

  useEffect(() => {
    const current = new URLSearchParams(window.location.search).get('category');
    if (current && categories.some((item) => item.slug === current)) setCategory(current);
  }, [categories]);

  useEffect(() => {
    if (tableReference !== initialTableReference) updateTableReference(initialTableReference);
  }, [initialTableReference, tableReference, updateTableReference]);

  const validItems = items;
  const catalogPresent = categories.length > 0 && items.length > 0;
  const filtered = useMemo(() => {
    const term = normalizeArabic(query);
    return validItems.filter(item => {
      const belongs = category === 'all' || item.categorySlug === category;
      return belongs && (!term || normalizeArabic(item.name + ' ' + item.description).includes(term));
    });
  }, [validItems, category, query]);

  const displayed = filtered.slice(0, limit);
  const contextPhoto = category==='all'?null:getCategoryContextPhoto(category as MenuItem['categorySlug']);
  function openProduct(item:MenuItem,trigger:HTMLElement){
    const art=trigger.querySelector<HTMLElement>('.t-product-art')??trigger.closest('.t-menu-product')?.querySelector<HTMLElement>('.t-product-art');
    const rect=art?.getBoundingClientRect();
    setOriginRect(rect&&rect.width>0&&rect.height>0?{left:rect.left,top:rect.top,width:rect.width,height:rect.height}:null);
    setSelectedProduct(item);
  }
  function chooseCategory(slug: string) {
    setCategory(slug);
    setLimit(PAGE_SIZE);
    const url = new URL(window.location.href);
    if (slug === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', slug);
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }

  return (
    <div className="t-page t-menu-page" dir="rtl">
      <a className="t-skip" href="#t-menu-search">انتقل للبحث في المنيو</a>
      <ExperienceHeader />
      <main className="t-menu-main">
        <header className="t-menu-intro t-shell">
          <div className="t-menu-intro__label"><span>THE REAL MENU / TUSCANINI</span><span>اختياراتك من توسكانيني — بني سويف</span></div>
          <div className="t-menu-intro__headline">
            <div className="t-menu-intro__copy">
              <span className="t-index">FIND YOUR FOOD / TUSCANINI</span>
              <h1>كل اللي<br/><em>نفسك فيه.</em></h1>
              <p>عارف طلبك؟ دوّر عليه بالاسم. لسه بتختار؟ ابدأ من قسم الأكل اللي على مزاجك.</p>
              <a className="t-menu-intro__jump" href="#t-menu-search">دور على أكلك <span aria-hidden="true">↓</span></a>
            </div>
            <div className="t-menu-intro__photo-pair" aria-label="صور حقيقية عامة من المطعم، وليست صور أصناف محددة في المنيو">
              <figure className="t-menu-intro__photo t-menu-intro__photo--main">
                <Image src="/images/rebirth/food-07.jpg" alt="ثلاثة كريبات حقيقية ظاهرة الحشو من توسكانيني" fill priority sizes="(max-width: 720px) 57vw, 30vw" />
                <figcaption lang="en">01 / THE INSIDE</figcaption>
              </figure>
              <figure className="t-menu-intro__photo t-menu-intro__photo--accent">
                <Image src="/images/rebirth/food-03.jpg" alt="بيتزا حقيقية داخل علبة توسكانيني المطبوعة" fill sizes="(max-width: 720px) 36vw, 19vw" />
                <figcaption lang="en">02 / THE BOX</figcaption>
              </figure>
              <span className="t-menu-intro__photo-note">من صور المطعم — مش صور مرتبطة بصنف معين</span>
            </div>
          </div>
          <div className="t-menu-intro__bottom"><span>{source.label} · السعر والتوافر النهائي عند تأكيد المطعم</span><Link href="/food-finder">مش عارف تختار؟ <span aria-hidden>↗</span></Link></div>
        </header>
        <div className="t-shell t-menu-content">
          <ActiveOrderBanner />
          <section aria-label="ابحث عن الأصناف" className="t-menu-search" id="t-menu-search">
            <label htmlFor="t-menu-query">دور على أكلك بالاسم</label>
            <div className="t-menu-search__inputrow">
              <input id="t-menu-query" type="search" autoComplete="off" value={query} onChange={event=>{setQuery(event.target.value);setLimit(PAGE_SIZE);}} placeholder="تشيكن فاير، بيتزا، كريب..." />
              {query && <button type="button" onClick={()=>{setQuery('');setLimit(PAGE_SIZE);}}>امسح البحث</button>}
            </div>
          </section>
          <p className="t-menu-source-note" role="note">{source.note}</p>
          <section aria-label="أقسام المنيو" className="t-menu-categories">
            <div className="t-menu-categories__heading"><span className="t-index">01 — PICK A FOOD FAMILY</span><span>{categories.length} قسم</span></div>
            <div className="t-menu-categories__scroller">
              <button type="button" aria-pressed={category==='all'} onClick={()=>chooseCategory('all')}><MaterialGlyph name="all" size={26} className="t-menu-category-glyph"/>كل الأصناف</button>
              {categories.map(item => (
                <button key={item.slug} type="button" aria-pressed={category===item.slug} onClick={()=>chooseCategory(item.slug)}><MaterialGlyph name={categoryMaterialGlyph(item.slug)} size={26} className="t-menu-category-glyph"/>{item.name}</button>
              ))}
            </div>
          </section>
          <section className="t-menu-items" aria-labelledby="t-menu-items-title">
            <div className="t-menu-items__heading">
              <div><span className="t-index">02 — CHOOSE WITH CLARITY</span><h2 id="t-menu-items-title">{category === 'all' ? 'الاختيارات' : categories.find(x=>x.slug===category)?.name}</h2></div>
              <span role="status" aria-live="polite">{filtered.length} صنف مطابق</span>
            </div>
            {catalogPresent && <div className="t-menu-view-switch" role="group" aria-label="طريقة عرض المنيو">
              <div><button type="button" aria-pressed={viewMode==='fast'} onClick={()=>setViewMode('fast')}>المنيو السريع</button>
              <button type="button" aria-pressed={viewMode==='art'} onClick={()=>setViewMode('art')}>عرض الرسومات</button>
              <button type="button" aria-pressed={viewMode==='photo'} onClick={()=>setViewMode('photo')}>صور الأكل</button></div>
              <p>الصور من مكتبة مرخّصة لتوضيح نوع الأكل فقط، مش تصوير وجبات توسكانيني أو مكوناتها. الأسعار من المنيو القديم.</p>
            </div>}
            {catalogPresent && contextPhoto && (
              <figure className="t-menu-family-context">
                <div className="t-menu-family-context__photo"><Image src={contextPhoto.src} alt={contextPhoto.alt} fill
                  sizes="(max-width:720px) 128px, 240px" /></div>
                <figcaption><span className="t-index" lang="en">REAL RESTAURANT PHOTOGRAPH / FAMILY ONLY</span>
                  <strong>من جوّه المطعم.</strong><span>{contextPhoto.credit} — مش صورة أي صنف معين.</span></figcaption>
              </figure>
            )}
            {!catalogPresent ? (
              <div className="t-menu-unavailable" role="status">
                <p className="t-index">MENU DATA / MISSING</p><h3>حصلت مشكلة في تحميل المنيو.</h3>
                <p>تواصل مع المطعم علشان تتأكد من الأصناف والأسعار.</p>
                <Link href="/contact">تواصل مع توسكانيني ↗</Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="t-menu-unavailable" role="status">
                <h3>مفيش أصناف مطابقة.</h3><p>جرّب اسم تاني أو ارجع لكل الأصناف.</p>
                <button type="button" onClick={()=>{setQuery('');chooseCategory('all')}}>اعرض كل الأصناف ↗</button>
              </div>
            ) : (
              <>
                <div className={`t-menu-items__grid t-menu-items__grid--${viewMode}`} key={category+'-'+viewMode}>
                  {displayed.map((item,index) => {
                    const available = item.availability !== 'unavailable';
                    const familyName = categories.find(c=>c.slug===item.categorySlug)?.name;
                    return (
                      <article className="t-menu-product" key={item.id}>
                        <div className="t-menu-product__top">
                          <span>{String(index+1).padStart(2,'0')}</span>
                          <span className="t-menu-product__family"><MaterialGlyph name={categoryMaterialGlyph(item.categorySlug)} size={22}/>{familyName}</span>
                        </div>
                        <div className="t-menu-product__identity">
                          <button className="t-menu-product__art-trigger" type="button" disabled={!available}
                            onClick={event=>openProduct(item,event.currentTarget)}
                            aria-label={available ? 'افتح تفاصيل ' + familyName + ' — ' + item.name + ' من المعاينة' : item.name + ' غير متاح'}>
                            <ProductArtwork item={item} visualMode={viewMode==='photo'?'representative':'art'}/>
                          </button>
                          <div className="t-menu-product__text">
                            <h3>{item.name}</h3>
                            {item.description && <p className="t-menu-product__description">{item.description}</p>}
                          </div>
                        </div>
                        <div className="t-menu-product__bottom">
                          <div className="t-menu-product__price">{available ? <><span>يبدأ من</span><strong>{item.priceFrom} ج.م</strong></> : <span>غير متاح حاليًا</span>}</div>
                          <button type="button" disabled={!available} onClick={event=>openProduct(item,event.currentTarget)} aria-label={available ? 'اختيار تفاصيل ' + familyName + ' — ' + item.name : familyName + ' — ' + item.name + ' غير متاح'}>
                            {available ? 'اختار التفاصيل ↗' : 'غير متاح'}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
                {displayed.length < filtered.length && (
                  <button className="t-menu-load-more" type="button" onClick={()=>setLimit(x=>x+PAGE_SIZE)}>
                    اعرض أصناف أكتر ({filtered.length-displayed.length} متبقية) ↓
                  </button>
                )}
              </>
            )}
          </section>
          <footer className="t-menu-footer">
            <p>من جوا الأكل للتفاصيل اللي تهمك. اختار على راحتك، وكل إضافة وسعر ظاهر قبل ما تكمل الطلب.</p>
            <div><Link href="/cart">راجع السلة ↗</Link><Link href="/contact">محتاج مساعدة؟ ↗</Link></div>
          </footer>
        </div>
      </main>
      <ExperienceFooter />
      <RebirthProductDialog item={selectedProduct} priceSource="previous" visualMode={viewMode==='photo'?'representative':'art'} originRect={originRect} onClose={()=>{setSelectedProduct(null);setOriginRect(null)}} />
      {catalogPresent && <FloatingCartCta />}
    </div>
  );
}
