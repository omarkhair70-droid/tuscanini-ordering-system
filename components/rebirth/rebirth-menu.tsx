'use client';

import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import Link from 'next/link';
import Image from 'next/image';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/cart-provider';
import { FloatingCartCta } from '@/components/cart/floating-cart-cta';
import { RebirthProductDialog } from '@/components/rebirth/rebirth-product-dialog';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import type { MenuCategory, MenuItem } from '@/types/menu';
import type { ProductCartItem } from '@/types/cart';
import { MaterialGlyph, categoryMaterialGlyph } from '@/components/rebirth/material-glyph';
import { ProductArtwork } from '@/components/rebirth/product-artwork';
import { getCategoryContextPhoto } from '@/lib/rebirth/verified-menu-photographs';
import { getMenuEditorialPhotograph } from '@/lib/rebirth/editorial-photo-selection';
import { MenuEditorialPhoto } from '@/components/rebirth/menu-editorial-photo';
import { trackCustomerInsight } from '@/lib/rebirth/customer-insights';
import type { RebirthCatalog } from '@/lib/rebirth/previous-menu-catalog';

/**
 * Homepage navigation groups are a presentation-only map over the 16 recorded
 * menu categories. No product IDs, backend prices or stock rules are changed.
 */
const MENU_FAMILIES = [
  { key: 'crepe', label: 'الكريب', iconSlug: 'crepe-meat', slugs: ['crepe-meat','crepe-chicken','crepe-mixed','crepe-tuscanini','crepe-sweet'] },
  { key: 'pizza', label: 'البيتزا', iconSlug: 'pizza-meat', slugs: ['pizza-meat','pizza-chicken','pizza-mixed','pizza-tuscanini'] },
  { key: 'sandwiches', label: 'الساندوتشات', iconSlug: 'sandwiches-french', slugs: ['sandwiches-french','sandwiches-kaiser'] },
  { key: 'pasta', label: 'الباستا', iconSlug: 'pasta', slugs: ['pasta'] },
  { key: 'sweets', label: 'الحلو', iconSlug: 'waffle', slugs: ['waffle','crepe-sweet'] },
  { key: 'sides', label: 'المقبلات', iconSlug: 'appetizers', slugs: ['appetizers'] },
  { key: 'drinks', label: 'المشروبات', iconSlug: 'drinks', slugs: ['drinks'] },
] as const;

type Props = {
  categories: MenuCategory[];
  items: MenuItem[];
  initialTableReference: string | null;
  source: RebirthCatalog['source'];
  presentation?: 'original' | 'menu-first';
};

const PAGE_SIZE = 20;
function normalizeArabic(text: string) {
  return text.normalize('NFKC')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .toLocaleLowerCase('ar').trim().replace(/\s+/g, ' ');
}

export function RebirthMenu({ categories, items, initialTableReference, source, presentation = 'original' }: Props) {
  const router=useRouter();
  const { tableReference, updateTableReference, items:cartItems, isHydrated } = useCart();
  const editAttempt=useRef(false);
  const [editingLine,setEditingLine]=useState<ProductCartItem|null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [originRect,setOriginRect] = useState<{left:number;top:number;width:number;height:number}|null>(null);

  useEffect(() => {
    const current = new URLSearchParams(window.location.search).get('category');
    if (current && (categories.some((item) => item.slug === current)
      || (presentation === 'menu-first' && MENU_FAMILIES.some(family => family.key === current)))) setCategory(current);
  }, [categories, presentation]);

  useEffect(() => {
    // Editing an existing cart choice must never wipe its table reference.
    if(new URLSearchParams(window.location.search).has('editLine'))return;
    if (tableReference !== initialTableReference) updateTableReference(initialTableReference);
  }, [initialTableReference, tableReference, updateTableReference]);

  useEffect(()=>{
    if(!isHydrated || editAttempt.current)return;
    const lineId=new URLSearchParams(window.location.search).get('editLine');
    if(!lineId)return;
    editAttempt.current=true;
    const line=cartItems.find(x=>x.lineId===lineId);
    const product=line?.kind==='product'?items.find(item=>item.id===line.productId):null;
    if(!line || line.kind!=='product' || !product){
      router.replace('/cart');
      return;
    }
    setEditingLine(line);
    setOriginRect(null);
    setSelectedProduct(product);
  },[isHydrated,cartItems,items,router]);

  const validItems = items;
  const catalogPresent = categories.length > 0 && items.length > 0;
  const filtered = useMemo(() => {
    const terms = normalizeArabic(query).split(' ').filter(Boolean);
    return validItems.filter(item => {
      if (category !== 'all') {
        if (presentation === 'menu-first') {
          const family = MENU_FAMILIES.find(group => group.key === category);
          if (family ? !(family.slugs as readonly string[]).includes(item.categorySlug) : item.categorySlug !== category) return false;
        } else if (item.categorySlug !== category) return false;
      }
      if (!terms.length) return true;
      const familyName = categories.find(family => family.slug === item.categorySlug)?.name ?? '';
      const searchable = normalizeArabic([item.name, item.description, familyName].join(' '));
      // A guest can type the words in any order, with or without Arabic diacritics.
      return terms.every(term => searchable.includes(term));
    });
  }, [validItems, categories, category, query, presentation]);

  const displayed = filtered.slice(0, limit);
  const contextPhoto = presentation === 'menu-first' || category==='all' ? null : getCategoryContextPhoto(category as MenuItem['categorySlug']);
  // Do not interrupt searching, short categories, or the first visible food.
  // Photographs are actual restaurant documentation, never a named SKU match.
  const editorialPhoto = presentation === 'menu-first' && !query.trim() && displayed.length >= 9
    ? getMenuEditorialPhotograph(category)
    : null;
  function openProduct(item:MenuItem,trigger:HTMLElement){
    const art=trigger.querySelector<HTMLElement>('.t-product-art')??trigger.closest('.t-menu-product')?.querySelector<HTMLElement>('.t-product-art');
    const rect=art?.getBoundingClientRect();
    setOriginRect(rect&&rect.width>0&&rect.height>0?{left:rect.left,top:rect.top,width:rect.width,height:rect.height}:null);
    trackCustomerInsight('menu_product_open');
    setSelectedProduct(item);
  }
  function chooseCategory(slug: string) {
    // Choosing a new family leaves the previous text search behind. Otherwise
    // the menu can look empty even though that family has available items.
    setQuery('');
    setCategory(slug);
    trackCustomerInsight('menu_category_select');
    setLimit(PAGE_SIZE);
    const url = new URL(window.location.href);
    if (slug === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', slug);
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }
  function searchAcrossMenu(value: string) {
    setQuery(value);
    setLimit(PAGE_SIZE);
    // Typed search always spans the menu. A previously chosen category must
    // never silently hide the food a guest explicitly asked for by name.
    if (value.trim() && category !== 'all') {
      setCategory('all');
      const url = new URL(window.location.href);
      url.searchParams.delete('category');
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
  }

  const searchControls = (
              <section aria-label="ابحث عن الأصناف" className="t-menu-search" id="t-menu-search">
                <label htmlFor="t-menu-query">دور على أكلك بالاسم</label>
                <div className="t-menu-search__inputrow">
                  <input id="t-menu-query" type="search" autoComplete="off" maxLength={80} value={query} onChange={event=>searchAcrossMenu(event.target.value)} onKeyDown={event=>{if(event.key==='Enter' && !event.nativeEvent.isComposing){event.preventDefault();trackCustomerInsight('menu_search_results');document.getElementById('t-menu-items-title')?.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}}} placeholder="تشيكن فاير، بيتزا، كريب..." />
                  {query && <button type="button" onClick={()=>{setQuery('');setLimit(PAGE_SIZE);}}>امسح البحث</button>}
                </div>
                {query.trim() && <div className="t-menu-search__feedback"><span role="status" aria-live="polite">{filtered.length} نتيجة من المنيو كله</span><button type="button" onClick={()=>{trackCustomerInsight('menu_search_results');document.getElementById('t-menu-items-title')?.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}}>شوف النتائج ↓</button></div>}
              </section>
  );

  const activeCategoryLabel = presentation === 'menu-first'
    ? MENU_FAMILIES.find(group => group.key === category)?.label ?? categories.find(item => item.slug === category)?.name
    : categories.find(item => item.slug === category)?.name;

  return (
    <div className={`t-page t-menu-page ${presentation === 'menu-first' ? 't-menu-page--first' : ''}`} dir="rtl">
      <a className="t-skip" href="#t-menu-search">انتقل للبحث في المنيو</a>
      <ExperienceHeader />
      <main className="t-menu-main">
        <header className="t-menu-intro t-shell">
          {presentation === 'menu-first' ? (
            <div className="t-menu-first__entry">
              <div className="t-menu-first__title">
                <span className="t-menu-first__overline">TUSCANINI / بني سويف</span>
                <h1>المنيو<span aria-hidden="true">.</span></h1>
                <p>اختار أكلك.</p>
              </div>
              {searchControls}
            </div>
          ) : (
          <>
          <div className="t-menu-intro__label"><span>توسكانيني / المنيو</span><span>اختياراتك من توسكانيني — بني سويف</span></div>
          <div className="t-menu-intro__headline">
            <div className="t-menu-intro__copy">
              <span className="t-index">منيو توسكانيني</span>
              <h1>كل اللي<br/><em>نفسك فيه.</em></h1>
              <p>عارف أكلك؟ دوّر عليه بالاسم. ولسه بتختار؟ ابدأ من الأقسام.</p>
              <nav className="t-menu-intro__actions" aria-label="اختصارات المنيو">
                <a className="t-menu-intro__jump" href="#t-menu-search">دور بالاسم <span aria-hidden="true">↓</span></a>
                <a className="t-menu-intro__jump t-menu-intro__jump--secondary" href="#t-menu-categories">تصفح الأقسام <span aria-hidden="true">↓</span></a>
              </nav>
              {searchControls}
            </div>
            <div className="t-menu-intro__photo-pair" aria-label="صور كريب وبيتزا من مطعم توسكانيني">
              <figure className="t-menu-intro__photo t-menu-intro__photo--main">
                <Image src="/images/rebirth/food-07.jpg" alt="ثلاثة كريبات حقيقية ظاهرة الحشو من توسكانيني" fill priority sizes="(max-width: 720px) 57vw, 30vw" />
                <figcaption>الكريب من جوّه</figcaption>
              </figure>
              <figure className="t-menu-intro__photo t-menu-intro__photo--accent">
                <Image src="/images/rebirth/food-03.jpg" alt="بيتزا حقيقية داخل علبة توسكانيني المطبوعة" fill sizes="(max-width: 720px) 36vw, 19vw" />
                <figcaption>البيتزا والعلبة</figcaption>
              </figure>
              
            </div>
          </div>
          <div className="t-menu-intro__bottom"><span>اختار الأكل اللي على مزاجك.</span><Link href="/food-finder">مش عارف تختار؟ <span aria-hidden>↗</span></Link></div>
          </>
          )}
        </header>
        <div className="t-shell t-menu-content">
          <p className="t-menu-source-note" role="note" data-visual-disclosure="menu">{source.note}</p>
          <section id="t-menu-categories" aria-label="أقسام المنيو" className="t-menu-categories">
            <div className="t-menu-categories__heading"><span className="t-index">{presentation === 'menu-first' ? 'اختار النوع' : '01 — اختار القسم'}</span><span>{presentation === 'menu-first' ? 'كل الأصناف في مكان واحد' : `${categories.length} قسم`}</span></div>
            <div className="t-menu-categories__scroller">
              <button type="button" aria-pressed={category==='all'} onClick={()=>chooseCategory('all')}><MaterialGlyph name="all" size={26} className="t-menu-category-glyph"/>كل الأصناف</button>
              {presentation === 'menu-first'
                ? MENU_FAMILIES.map(family => (
                  <button key={family.key} type="button" aria-pressed={category === family.key}
                    onClick={() => chooseCategory(family.key)}>
                    <MaterialGlyph name={categoryMaterialGlyph(family.iconSlug)} size={26} className="t-menu-category-glyph"/>{family.label}
                  </button>
                ))
                : categories.map(item => (
                  <button key={item.slug} type="button" aria-pressed={category===item.slug} onClick={()=>chooseCategory(item.slug)}><MaterialGlyph name={categoryMaterialGlyph(item.slug)} size={26} className="t-menu-category-glyph"/>{item.name}</button>
                ))}
            </div>
          </section>
          <section className="t-menu-items" aria-labelledby="t-menu-items-title">
            <div className="t-menu-items__heading">
              <div><span className="t-index">الأصناف</span><h2 id="t-menu-items-title">{query.trim() ? 'نتائج البحث' : category === 'all' ? 'الأصناف' : activeCategoryLabel}</h2></div>
              <span role="status" aria-live="polite">{filtered.length} صنف مطابق · ظاهر {displayed.length}</span>
            </div>

            {catalogPresent && contextPhoto && (
              <figure className="t-menu-family-context">
                <div className="t-menu-family-context__photo"><Image src={contextPhoto.src} alt={contextPhoto.alt} fill
                  sizes="(max-width:720px) 128px, 240px" /></div>
                <figcaption><span className="t-index">من مطبخ توسكانيني</span>
                  <strong>من جوّه المطعم.</strong><span>{contextPhoto.credit}</span></figcaption>
              </figure>
            )}
            {!catalogPresent ? (
              <div className="t-menu-unavailable" role="status">
                <p className="t-index">المنيو</p><h3>حصلت مشكلة في تحميل المنيو.</h3>
                <p>تواصل مع المطعم علشان تتأكد من الأصناف والأسعار.</p>
                <Link href="/contact">تواصل مع توسكانيني ↗</Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="t-menu-unavailable" role="status">
                <h3>ملقيناش الصنف ده.</h3><p>جرّب جزء من الاسم، أو ارجع للمنيو كله.</p>
                <button type="button" onClick={()=>{setQuery('');chooseCategory('all')}}>اعرض كل الأصناف ↗</button>
              </div>
            ) : (
              <>
                <div className="t-menu-items__grid t-menu-items__grid--photo" key={category}>
                  {displayed.map((item,index) => {
                    const available = item.availability !== 'unavailable';
                    const familyName = categories.find(c=>c.slug===item.categorySlug)?.name;
                    return (
                      <Fragment key={item.id}>
                      <article className="t-menu-product">
                        <div className="t-menu-product__top">
                          <span>{String(index+1).padStart(2,'0')}</span>
                          <span className="t-menu-product__family"><MaterialGlyph name={categoryMaterialGlyph(item.categorySlug)} size={22}/>{familyName}</span>
                        </div>
                        <div className="t-menu-product__identity">
                          <button className="t-menu-product__art-trigger" type="button" disabled={!available}
                            onClick={event=>openProduct(item,event.currentTarget)}
                            aria-label={available ? 'افتح تفاصيل ' + familyName + ' — ' + item.name + ' من المعاينة' : item.name + ' غير متاح'}>
                            <ProductArtwork item={item} visualMode="representative"/>
                          </button>
                          <div className="t-menu-product__text">
                            <h3>{item.name}</h3>
                            {item.description && <p className="t-menu-product__description">{item.description}</p>}
                          </div>
                        </div>
                        <div className="t-menu-product__bottom">
                          <div className="t-menu-product__price">{available ? <><span>يبدأ من</span><strong>{item.priceFrom} ج.م</strong></> : <span>غير متاح حاليًا</span>}</div>
                          <button type="button" disabled={!available} onClick={event=>openProduct(item,event.currentTarget)} aria-label={available ? 'اختيار تفاصيل ' + familyName + ' — ' + item.name : familyName + ' — ' + item.name + ' غير متاح'}>
                            {available ? (presentation === 'menu-first' ? 'اختار ↗' : 'اختار التفاصيل ↗') : 'غير متاح'}
                          </button>
                        </div>
                      </article>
                      {editorialPhoto && index === 5 ? <MenuEditorialPhoto photo={editorialPhoto} /> : null}
                      </Fragment>
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
            <p>اختار الحجم والإضافات وشوف السعر قبل ما تضيف للسلة.</p>
            <div><Link href="/cart">راجع السلة ↗</Link><Link href="/contact">محتاج مساعدة؟ ↗</Link></div>
          </footer>
        </div>
      </main>
      <ExperienceFooter />
      <RebirthProductDialog item={selectedProduct} priceSource="previous" visualMode="representative" originRect={originRect}
        editingLine={editingLine} onClose={()=>{
          setSelectedProduct(null);setOriginRect(null);
          if(editingLine){setEditingLine(null);router.push('/cart#t-cart-items-title');}
        }} />
      {catalogPresent && <FloatingCartCta />}
    </div>
  );
}
