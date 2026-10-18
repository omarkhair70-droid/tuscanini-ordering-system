'use client';

import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/components/cart/cart-provider';
import { FloatingCartCta } from '@/components/cart/floating-cart-cta';
import { RebirthProductDialog } from '@/components/rebirth/rebirth-product-dialog';
import { ActiveOrderBanner } from '@/components/shared/active-order-banner';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import type { MenuCategory, MenuItem } from '@/types/menu';

type Props = {
  categories: MenuCategory[];
  items: MenuItem[];
  initialTableReference: string | null;
  sourceVerified: boolean;
};

const PAGE_SIZE = 20;
function normalizeArabic(text: string) {
  return text.normalize('NFKC').replace(/[\u064B-\u065F\u0670]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').toLocaleLowerCase('ar').trim();
}

export function RebirthMenu({ categories, items, initialTableReference, sourceVerified }: Props) {
  const { tableReference, updateTableReference } = useCart();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  useEffect(() => {
    const current = new URLSearchParams(window.location.search).get('category');
    if (current && categories.some((item) => item.slug === current)) setCategory(current);
  }, [categories]);

  useEffect(() => {
    if (tableReference !== initialTableReference) updateTableReference(initialTableReference);
  }, [initialTableReference, tableReference, updateTableReference]);

  const validItems = useMemo(() => sourceVerified ? items : [], [sourceVerified, items]);
  const filtered = useMemo(() => {
    const term = normalizeArabic(query);
    return validItems.filter(item => {
      const belongs = category === 'all' || item.categorySlug === category;
      return belongs && (!term || normalizeArabic(item.name + ' ' + item.description).includes(term));
    });
  }, [validItems, category, query]);

  const displayed = filtered.slice(0, limit);
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
            <div><span className="t-index">FIND THE FOOD / THE ORDER IS YOURS</span><h1>كل اللي<br/><em>نفسك فيه.</em></h1></div>
            <p>عارف طلبك؟ دوّر عليه بالاسم. لسه بتختار؟ ابدأ من قسم الأكل اللي على مزاجك.</p>
          </div>
          <div className="t-menu-intro__bottom"><span>منيو متصل بالنظام الفعلي — بدون أسعار مختلقة</span><Link href="/food-finder">مش عارف تختار؟ <span aria-hidden>↗</span></Link></div>
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
          <section aria-label="أقسام المنيو" className="t-menu-categories">
            <div className="t-menu-categories__heading"><span className="t-index">01 — PICK A FOOD FAMILY</span><span>{categories.length} قسم</span></div>
            <div className="t-menu-categories__scroller">
              <button type="button" aria-pressed={category==='all'} onClick={()=>chooseCategory('all')}>كل الأصناف</button>
              {categories.map(item => (
                <button key={item.slug} type="button" aria-pressed={category===item.slug} onClick={()=>chooseCategory(item.slug)}>{item.name}</button>
              ))}
            </div>
          </section>
          <section className="t-menu-items" aria-labelledby="t-menu-items-title">
            <div className="t-menu-items__heading">
              <div><span className="t-index">02 — CHOOSE WITH CLARITY</span><h2 id="t-menu-items-title">{category === 'all' ? 'الاختيارات' : categories.find(x=>x.slug===category)?.name}</h2></div>
              <span role="status" aria-live="polite">{filtered.length} صنف مطابق</span>
            </div>
            {!sourceVerified ? (
              <div className="t-menu-unavailable" role="status">
                <p className="t-index">LIVE DATA REQUIRED</p><h3>المنيو مش متاحة حاليًا.</h3>
                <p>مش هنعرض أسعار قديمة كأنها الأسعار الحالية. حاول تاني بعد شوية، أو اتواصل مع المطعم للتأكد من المنيو.</p>
                <Link href="/contact">تواصل مع توسكانيني ↗</Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="t-menu-unavailable" role="status">
                <h3>مفيش أصناف مطابقة.</h3><p>جرّب اسم تاني أو ارجع لكل الأصناف.</p>
                <button type="button" onClick={()=>{setQuery('');chooseCategory('all')}}>اعرض كل الأصناف ↗</button>
              </div>
            ) : (
              <>
                <div className="t-menu-items__grid">
                  {displayed.map((item,index) => {
                    const available = item.availability !== 'unavailable';
                    const familyName = categories.find(c=>c.slug===item.categorySlug)?.name;
                    return (
                      <article className="t-menu-product" key={item.id}>
                        <div className="t-menu-product__top">
                          <span>{String(index+1).padStart(2,'0')}</span>
                          <span>{familyName}</span>
                        </div>
                        <h3>{item.name}</h3>
                        {item.description && <p className="t-menu-product__description">{item.description}</p>}
                        <div className="t-menu-product__bottom">
                          <div className="t-menu-product__price">{available ? <><span>يبدأ من</span><strong>{item.priceFrom} ج.م</strong></> : <span>غير متاح حاليًا</span>}</div>
                          <button type="button" disabled={!available} onClick={()=>setSelectedProduct(item)} aria-label={available ? 'اختيار تفاصيل ' + item.name : item.name + ' غير متاح'}>
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
      <RebirthProductDialog item={selectedProduct} onClose={()=>setSelectedProduct(null)} />
      {sourceVerified && <FloatingCartCta />}
    </div>
  );
}
