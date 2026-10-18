'use client';

import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import type { MenuCategory, MenuItem } from '@/types/menu';

type FormId = 'all'|'crepe'|'pizza'|'sandwich'|'pasta';
type TagId = 'all'|'spicy'|'new';
type BudgetId = 'any'|'up150'|'up250';
type Props={categories:MenuCategory[];items:MenuItem[];live:boolean};
const forms:{id:FormId;label:string}[]=[{id:'all',label:'مفتوح لكل حاجة'},{id:'crepe',label:'كريب'},{id:'pizza',label:'بيتزا'},{id:'sandwich',label:'ساندوتش'},{id:'pasta',label:'باستا'}];
const tags:{id:TagId;label:string}[]=[{id:'all',label:'كل الاختيارات'},{id:'spicy',label:'اللي عليها علامة حار'},{id:'new',label:'الأصناف الجديدة'}];
const budgets:{id:BudgetId;label:string}[]=[{id:'any',label:'أي ميزانية'},{id:'up150',label:'لحد 150 ج.م'},{id:'up250',label:'لحد 250 ج.م'}];

export function RebirthFoodFinder({categories,items,live}:Props) {
  const [form,setForm]=useState<FormId|null>(null);
  const [tag,setTag]=useState<TagId|null>(null);
  const [budget,setBudget]=useState<BudgetId|null>(null);
  const finished=form!==null && tag!==null && budget!==null;
  const recommendations=useMemo(()=>{
    if(!live||!finished) return [];
    const available=items.filter(x=>x.availability!=='unavailable' && Number.isFinite(x.priceFrom) && x.priceFrom>=0);
    return available.filter(item=>{
      const category=categories.find(c=>c.slug===item.categorySlug);
      const label=(category?.slug||'').toLowerCase();
      const matchesForm=form==='all' || (form==='crepe'&&label.startsWith('crepe-')) || (form==='pizza'&&label.startsWith('pizza-')) || (form==='sandwich'&&label.startsWith('sandwiches-')) || (form==='pasta'&&label==='pasta');
      const matchesTag=tag==='all' || (tag==='spicy'&&item.tags?.includes('حار')) || (tag==='new'&&item.tags?.includes('جديد'));
      const matchesBudget=budget==='any' || (budget==='up150'&&item.priceFrom<=150) || (budget==='up250'&&item.priceFrom<=250);
      return matchesForm&&matchesTag&&matchesBudget;
    }).sort((a,b)=>a.priceFrom-b.priceFrom).slice(0,8);
  },[budget,categories,finished,form,items,live,tag]);

  function reset() {setForm(null);setTag(null);setBudget(null)}
  const format=(value:number)=>new Intl.NumberFormat('ar-EG',{maximumFractionDigits:2}).format(value);
  return (
    <div className="t-page t-finder-page" dir="rtl">
      <a className="t-skip" href="#t-finder-main">انتقل لاختيار الأكل</a>
      <ExperienceHeader/>
      <main id="t-finder-main">
        <header className="t-finder-hero t-shell">
          <span className="t-index">FIND YOUR FOOD / NOT A GUESS</span>
          <div><h1>على<br/><em>مزاجك.</em></h1><p>مش لازم تعرف أسماء كل الأصناف. 3 اختيارات بسيطة تساعدك تلاقي حاجة من المنيو الفعلية، لو بياناتها متاحة.</p></div>
          <Link href="/menu">عارف طلبك؟ روح للمنيو ↗</Link>
        </header>
        <div className="t-shell t-finder-content">
          {!live ? (
            <section className="t-finder-unavailable" role="status">
              <span className="t-index">LIVE MENU NEEDED</span><h2>مش هنرشّح<br/>أكل من منيو قديمة.</h2>
              <p>معلومات الأصناف المتاحة مش مؤكدة حاليًا. تقدر ترجع للمنيو أو تتواصل مع المطعم للتأكد.</p><Link href="/contact">تواصل مع المطعم ↗</Link>
            </section>
          ) : (
            <>
              <div className="t-finder-progress"><span>3 STEPS / YOUR CHOICE</span><span>{finished?'جاهز':form===null?'01 / 03':tag===null?'02 / 03':'03 / 03'}</span></div>
              <fieldset className="t-finder-question">
                <legend><small>01 — THE FORM</small><strong>نفسك في نوع أكل إيه؟</strong></legend>
                <div>{forms.map(x=><button key={x.id} type="button" aria-pressed={form===x.id} onClick={()=>{setForm(x.id);setTag(null);setBudget(null)}}>{x.label}</button>)}</div>
              </fieldset>
              {form!==null&&<fieldset className="t-finder-question">
                <legend><small>02 — PRODUCT TAGS</small><strong>تحب ندوّر على إيه؟</strong></legend>
                <div>{tags.map(x=><button key={x.id} type="button" aria-pressed={tag===x.id} onClick={()=>{setTag(x.id);setBudget(null)}}>{x.label}</button>)}</div>
                <p>بنعتمد على العلامات المسجّلة للمنتجات؛ مش بنفترض طعم أو درجة حرارة غير موثقة.</p>
              </fieldset>}
              {form!==null&&tag!==null&&<fieldset className="t-finder-question">
                <legend><small>03 — STARTING PRICE</small><strong>حابب تبدأ من كام؟</strong></legend>
                <div>{budgets.map(x=><button key={x.id} type="button" aria-pressed={budget===x.id} onClick={()=>setBudget(x.id)}>{x.label}</button>)}</div>
                <p>التصفية بالسعر الابتدائي فقط؛ الإضافات والأحجام ممكن تغيّر الإجمالي.</p>
              </fieldset>}
              {finished&&<section className="t-finder-results" aria-labelledby="t-finder-result-title">
                <div className="t-finder-results__top"><div><span className="t-index">THE ACTUAL MENU / MATCHING RESULTS</span><h2 id="t-finder-result-title">لقيّنا إيه؟</h2></div><button type="button" onClick={reset}>ابدأ من جديد ↺</button></div>
                {recommendations.length===0 ? <p className="t-finder-results__empty">مفيش أصناف من القائمة الحالية بتطابق الثلاث اختيارات مع بعض. جرّب اختيارات تانية أو افتح المنيو.</p> :
                  <div className="t-finder-results__grid">{recommendations.map(item=><article key={item.id}>
                    <span>{categories.find(c=>c.slug===item.categorySlug)?.name??'من المنيو'}</span><h3>{item.name}</h3>
                    <p>يبدأ من <strong>{format(item.priceFrom)} ج.م</strong> قبل الإضافات</p>
                    <Link href={`/menu?category=${encodeURIComponent(item.categorySlug)}`}>افتح القسم واختار التفاصيل ↗</Link>
                  </article>)}</div>}
                <Link className="t-finder-results__menu" href="/menu">شوف المنيو كلها ↗</Link>
              </section>}
            </>
          )}
        </div>
      </main>
      <ExperienceFooter />
    </div>
  );
}
