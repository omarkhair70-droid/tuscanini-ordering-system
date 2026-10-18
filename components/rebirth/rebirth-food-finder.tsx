'use client';

import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import type { MenuCategory, MenuItem } from '@/types/menu';

type FormId='all'|'crepe'|'pizza'|'sandwich'|'pasta'|'sweet'|'drinks'|'sides';
type BudgetId='any'|'up75'|'up150'|'up250';
type Props={categories:MenuCategory[];items:MenuItem[];catalogReady:boolean;priceNote:string};
const forms:{id:FormId;label:string}[]=[
  {id:'all',label:'أي حاجة حلوة'},
  {id:'crepe',label:'كريب'},
  {id:'pizza',label:'بيتزا'},
  {id:'sandwich',label:'ساندوتش'},
  {id:'pasta',label:'باستا'},
  {id:'sweet',label:'حلو ووافل'},
  {id:'drinks',label:'مشروبات'},
  {id:'sides',label:'مقبلات'},
];
const budgets:{id:BudgetId;label:string;max:number}[]=[
  {id:'any',label:'على راحتي',max:Infinity},
  {id:'up75',label:'لحد 75 ج.م',max:75},
  {id:'up150',label:'لحد 150 ج.م',max:150},
  {id:'up250',label:'لحد 250 ج.م',max:250},
];
function matchesFamily(slug:string,form:FormId):boolean{
  if (slug==='crepe-addons') return false; // addons are not a stand-alone meal recommendation
  if(form==='all')return true;
  if(form==='crepe')return slug.startsWith('crepe-');
  if(form==='pizza')return slug.startsWith('pizza-');
  if(form==='sandwich')return slug.startsWith('sandwiches-');
  if(form==='pasta')return slug==='pasta';
  if(form==='sweet')return slug==='waffle'||slug==='crepe-sweet';
  if(form==='drinks')return slug==='drinks';
  return slug==='appetizers';
}
const money=(value:number)=>new Intl.NumberFormat('ar-EG',{maximumFractionDigits:2}).format(value);

export function RebirthFoodFinder({categories,items,catalogReady,priceNote}:Props){
  const [form,setForm]=useState<FormId|null>(null);
  const [budget,setBudget]=useState<BudgetId|null>(null);
  const finished=form!==null && budget!==null;
  const recommendations=useMemo(()=>{
    if(!catalogReady || !finished || !form || !budget)return [];
    const cap=budgets.find(x=>x.id===budget)?.max??Infinity;
    return items.filter(item=>
      item.availability!=='unavailable' &&
      Number.isFinite(item.priceFrom) && item.priceFrom>0 &&
      matchesFamily(item.categorySlug,form) && item.priceFrom<=cap
    ).sort((a,b)=>a.priceFrom-b.priceFrom).slice(0,8);
  },[budget,catalogReady,finished,form,items]);
  function reset(){setForm(null);setBudget(null)}
  return (
    <div className="t-page t-finder-page" dir="rtl">
      <a className="t-skip" href="#t-finder-main">انتقل لاختيار الأكل</a>
      <ExperienceHeader/>
      <main id="t-finder-main">
        <header className="t-finder-hero t-shell">
          <span className="t-index">02 CHOICES / REAL RECORDED MENU</span>
          <div><h1>تختار<br/><em>إزاي؟</em></h1><p>مش لازم تحفظ أسماء الأصناف. اختار نوع الأكل والميزانية، وشوف اختيارات من نفس منيو توسكانيني السابق بأسعاره.</p></div>
          <Link href="/menu">عارف طلبك؟ روح للمنيو ↗</Link>
        </header>
        <div className="t-shell t-finder-content">
          <p className="t-finder-source" role="note">{priceNote}</p>
          {!catalogReady ? (
            <section className="t-finder-unavailable" role="status">
              <span className="t-index">منيو توسكانيني</span>
              <h2>الاختيارات مش<br/><em>ظاهرة دلوقتي.</em></h2>
              <p>معلومات الأصناف مش متاحة للعرض حاليًا؛ تقدر تكلم المطعم مباشرة.</p>
              <div className="t-finder-unavailable__links">
                <Link href="/menu">افتح المنيو <span aria-hidden="true">↗</span></Link>
                <Link href="/contact">اسأل المطعم <span aria-hidden="true">↗</span></Link>
              </div>
            </section>
          ):(
            <>
              <div className="t-finder-progress"><span>2 STEPS / YOUR FOOD</span><span>{finished?'جاهز':form===null?'01 / 02':'02 / 02'}</span></div>
              <fieldset className="t-finder-question">
                <legend><small>01 — THE FOOD</small><strong>نفسك في نوع أكل إيه؟</strong></legend>
                <div>{forms.map(x=><button key={x.id} type="button" aria-pressed={form===x.id} onClick={()=>{setForm(x.id);setBudget(null)}}>{x.label}</button>)}</div>
              </fieldset>
              {form!==null&&<fieldset className="t-finder-question">
                <legend><small>02 — STARTING PRICE</small><strong>تبدأ من كام؟</strong></legend>
                <div>{budgets.map(x=><button key={x.id} type="button" aria-pressed={budget===x.id} onClick={()=>setBudget(x.id)}>{x.label}</button>)}</div>
                <p>السعر الابتدائي من المنيو السابق؛ الأحجام والإضافات ممكن تغيّر الإجمالي، والتوافر النهائي بيتأكد مع المطعم.</p>
              </fieldset>}
              {finished&&<section className="t-finder-results" aria-labelledby="t-finder-result-title">
                <div className="t-finder-results__top"><div><span className="t-index">PREVIOUS MENU / REAL PRICES</span><h2 id="t-finder-result-title">لقيّنا إيه؟</h2></div><button type="button" onClick={reset}>ابدأ من جديد ↺</button></div>
                {recommendations.length===0 ? <p className="t-finder-results__empty">مفيش صنف من المنيو السابق بيطابق النوع والميزانية مع بعض. جرّب ميزانية أو نوع تاني.</p>:
                  <div className="t-finder-results__grid">{recommendations.map(item=><article key={item.id}>
                    <span>{categories.find(c=>c.slug===item.categorySlug)?.name??'من المنيو'}</span><h3>{item.name}</h3>
                    <p>يبدأ من <strong>{money(item.priceFrom)} ج.م</strong> قبل الإضافات</p>
                    <Link href={`/menu?category=${encodeURIComponent(item.categorySlug)}`}>افتح القسم واختار الحجم ↗</Link>
                  </article>)}</div>}
                <Link className="t-finder-results__menu" href="/menu">شوف المنيو كلها ↗</Link>
              </section>}
            </>
          )}
        </div>
      </main>
      <ExperienceFooter/>
    </div>
  );
}
