import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { GENERATED_ASSET_COUNT, GENERATED_ASSET_IDS, GENERATED_MEDIA_READY } from '@/lib/rebirth/generated-menu-media';
import '../../rebirth-home.css';
import '../../rebirth-product-art.css';
import './visual-atlas.css';

export const metadata:Metadata={
  title:'معمل صور الأكل | توسكانيني',
  description:'مراجعة مئة صورة طعام مولدة؛ الصور تصورية ولا تثبت شكل الوجبات الفعلية.',
  robots:{index:false,follow:false}
};
const families=['تجربة التصوير الأولى','توسعة المشاهد الأساسية','كريبات فراخ','كريبات لحوم','كريبات متنوعة','كريب حلو ووافل','بيتزا — صور بانورامية معالجة','ساندوتشات وبرجر','باستا ومقبلات','مشروبات ومقبلات وحلو'];
export default function VisualAtlas(){
  // The 100-image editorial lab is internal source material, not a customer page.
  // Preserve the assets for SKU art review while keeping its route out of retail UX.
  if(process.env.TUSCANINI_INTERNAL_VISUAL_QA!=='yes')notFound();
  return <main className="t-menu-atlas" dir="rtl">
    <nav className="t-menu-atlas__nav"><Link href="/menu">← ارجع للمنيو</Link><span>VISUAL ARCHIVE / TUSCANINI</span></nav>
    <header className="t-menu-atlas__header">
      <span className="t-index">100 / GENERATED FOOD STUDIES</span>
      <h1>الأكل من منظور تاني.</h1>
      <p>مكتبة تصميمية تضم {GENERATED_ASSET_COUNT} صورة مولّدة لتجربة المنيو. كل الصور تخيلية وتوضيحية، وليست صور أطباق توسكانيني الفعلية، ولا تعني توافر أي مكونات أو صنف.</p>
    </header>
    {!GENERATED_MEDIA_READY ? <section className="t-menu-atlas__unavailable" role="status">
      <h2>المكتبة قيد التجهيز.</h2>
      <p>الصور محفوظة داخل أرشيف التصميم، ولسه مش مفعّلة للعرض على الموقع. تقدر تتصفح المنيو الموجود حاليًا.</p>
      <Link href="/menu">روح للمنيو ←</Link>
    </section> : families.map((family,batch)=><section className="t-menu-atlas__batch" key={family}>
      <div className="t-menu-atlas__batch-heading"><span>0{batch+1} / 10</span><h2>{family}</h2></div>
      <div className="t-menu-atlas__grid">
        {GENERATED_ASSET_IDS.slice(batch*10,batch*10+10).map(assetId=>
          <figure className="t-menu-atlas__item" key={assetId}>
            <div className="t-menu-atlas__photo"><Image src={'/images/rebirth/generated/'+assetId.toLowerCase()+'.webp'} alt={'تصوير تخيلي مولد للطعام، مرجع بصري '+assetId+' وليس صورة لطبق حقيقي من المطعم'} fill unoptimized sizes="(max-width:650px) 43vw,(max-width:1080px) 29vw,18vw" loading="lazy"/></div>
            <figcaption><span dir="ltr">{assetId}</span><span>صورة مولّدة للتوضيح</span></figcaption>
          </figure>)}
      </div>
    </section>)}
    <footer><Link href="/menu">اختار أكلك من المنيو ←</Link><p>الأسعار والأحجام من المنيو السابق، وليست مستنتجة من الصور.</p></footer>
  </main>;
}
