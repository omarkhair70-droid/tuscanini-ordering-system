'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';

type ComplaintType = 'تأخير في الطلب' | 'مشكلة في الجودة' | 'مشكلة في الطلب' | 'سلوك الخدمة' | 'أخرى';
const complaintTypes: ComplaintType[] = ['تأخير في الطلب', 'مشكلة في الجودة', 'مشكلة في الطلب', 'سلوك الخدمة', 'أخرى'];

function whatsappLink(raw: string, message: string): string | null {
  const digits=raw.replace(/\D/g,'');
  const international=digits.startsWith('0') ? `20${digits.slice(1)}` : digits;
  if (!/^\d{10,15}$/.test(international)) return null;
  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`;
}

export function RebirthComplaintsForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [kind,setKind]=useState<ComplaintType>('تأخير في الطلب');
  const [details,setDetails]=useState('');
  const [error,setError]=useState('');
  const [info,setInfo]=useState('');
  const message=useMemo(() => [
    'مرحبًا توسكانيني 👋',
    'حابب أبلغ عن مشكلة في التجربة، برجاء المتابعة:',
    '',
    'الاسم: '+(name.trim() || 'غير مذكور'),
    'الهاتف: '+(phone.trim() || 'غير مذكور'),
    'نوع المشكلة: '+kind,
    'التفاصيل: '+details.trim(),
  ].join('\n'),[name,phone,kind,details]);
  const link=whatsappLink(whatsappNumber,message);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInfo('');
    if (!details.trim()) {setError('اكتب تفاصيل المشكلة علشان نجهز الرسالة.');return;}
    if (!link) {setError('التواصل بواتساب غير متاح دلوقتي. استخدم صفحة التواصل.');return;}
    setError('');
    const opened=window.open(link,'_blank','noopener,noreferrer');
    // Some browsers always return null when noopener is used, even if they
    // successfully opened the tab. Do not claim send/delivery either way.
    void opened;
    setInfo('جهزنا رابط الرسالة. افتح واتساب وراجع التفاصيل واضغط إرسال بنفسك. لو الصفحة الجديدة مفتحتش، استخدم رابط فتح الرسالة الموجود تحت.');
  }

  return <form className="t-complaints-form" id="t-complaints-form" onSubmit={submit} noValidate>
    <div className="t-complaints-form__head"><span lang="en">MESSAGE FORM / 01</span><span>مافيش إرسال تلقائي</span></div>
    <div className="t-complaints-form__twocol">
      <div className="t-complaints-form__field"><label htmlFor="t-complaint-name">الاسم <small>(اختياري)</small></label>
        <input id="t-complaint-name" type="text" autoComplete="name" maxLength={90} value={name} onChange={e=>setName(e.target.value)} placeholder="اسمك" />
      </div>
      <div className="t-complaints-form__field"><label htmlFor="t-complaint-phone">رقم للتواصل <small>(اختياري)</small></label>
        <input id="t-complaint-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={35} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="رقم تليفونك" />
      </div>
    </div>
    <div className="t-complaints-form__field"><label htmlFor="t-complaint-type">نوع المشكلة</label>
      <select id="t-complaint-type" value={kind} onChange={e=>setKind(e.target.value as ComplaintType)}>
        {complaintTypes.map(option=><option key={option} value={option}>{option}</option>)}
      </select>
    </div>
    <div className="t-complaints-form__field"><label htmlFor="t-complaint-details">إيه اللي حصل؟ <span aria-hidden="true">*</span></label>
      <textarea id="t-complaint-details" rows={6} required maxLength={1800} aria-required="true" aria-invalid={Boolean(error && !details.trim())}
        aria-describedby="t-complaint-error t-complaint-explainer"
        value={details} onChange={e=>{setDetails(e.target.value);setError('');setInfo('');}} placeholder="احكيلنا المشكلة بوضوح، من غير بيانات دفع أو معلومات سرية..." />
      <div className="t-complaints-form__help">
        <small id="t-complaint-explainer">ما تكتبش بيانات بطاقتك أو أي معلومات دفع حساسة.</small>
        <span>{details.length} / 1800</span>
      </div>
    </div>
    {error && <p id="t-complaint-error" className="t-complaints-form__alert" role="alert">{error}</p>}
    {info && <p className="t-complaints-form__info" role="status">{info}</p>}
    <div className="t-complaints-form__bottom">
      <button type="submit" disabled={!link}>جهز الرسالة وافتح واتساب <span aria-hidden="true">↗</span></button>
      <span>الإرسال النهائي منك على واتساب، مش من الموقع.</span>
    </div>
    {details.trim() && link ? <a className="t-complaints-form__fallback" href={link} target="_blank" rel="noopener noreferrer">افتح الرسالة مباشرة لو الزر ما فتحش واتساب ↗</a> : null}
    {!link && <p className="t-complaints-form__unavailable">واتساب غير متاح في الإعدادات الحالية. <Link href="/contact">شوف طرق التواصل ↗</Link></p>}
  </form>;
}
