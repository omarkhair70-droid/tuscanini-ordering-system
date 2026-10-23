'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Order = {
  orderNumber: number | null;
  reference: string;
  status: string;
  confirmationStatus: 'pending' | 'confirmed' | 'unreachable' | 'rejected';
  tableReference: string | null;
  createdAt: string;
  orderType: 'delivery' | 'pickup';
  totalEstimate: number;
};
type Reply = { ok: true; order: Order } | { ok: false; error?: string };
type StatusKey = 'pending'|'unreachable'|'confirmed'|'preparing'|'ready'|'out'|'delivered'|'cancelled'|'unknown';
type Stage = { key: StatusKey; label: string; description: string };
type Fact = { label: string; value: string; detail: string; state: 'verified'|'waiting'|'attention' };
const formatMoney = (number: number) => new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(number);

// A prefilled external request is not an order status mutation.
// Never collect a card number or claim a cancellation/refund succeeded.
function supportMessage(reference:string,kind:'cancel'|'change'|'help'):string{
  const intro='مرحبًا توسكانيني، بخصوص الطلب '+reference+'.';
  if(kind==='cancel')return intro+'\nحابب أستفسر عن إمكانية إلغاء الطلب. عارف إن الإلغاء مش مؤكد لحد ما المطعم يرد ويحدّث الحالة.';
  if(kind==='change')return intro+'\nحابب أطلب تعديل تفاصيل الطلب إن كان لسه ممكن. برجاء التأكيد قبل أي تغيير.';
  return intro+'\nمحتاج مساعدة أو توضيح بخصوص حالة الطلب. برجاء التواصل.';
}
function validatedWhatsApp(number:string):string|null{
  const digits=number.replace(/\D/g,'');
  const international=digits.startsWith('0')?'20'+digits.slice(1):digits;
  return /^\d{10,15}$/.test(international)?international:null;
}
function whatsAppRequest(phone:string,reference:string,kind:'cancel'|'change'|'help'){
  const digits=validatedWhatsApp(phone);
  return digits?'https://wa.me/'+digits+'?text='+encodeURIComponent(supportMessage(reference,kind)):null;
}

function getStatus(order: Order): Stage {
  if (order.confirmationStatus==='rejected'||order.status==='ملغي') return {key:'cancelled',label:'الطلب اتلغى',description:'تواصل مع المطعم للاستفسار عن تفاصيل الإلغاء.'};
  if (order.status==='تم التسليم') return {key:'delivered',label:'الطلب اتسلّم',description:'الطلب مسجل إنه اتسلّم بالفعل.'};
  if (order.status==='خرج للدليفري') return {key:'out',label:'الطلب خرج للدليفري',description:'المطعم سجّل إن الطلب خرج للتوصيل.'};
  if (order.status==='جاهز للاستلام') return {key:'ready',label:order.orderType==='pickup'?'الطلب جاهز للاستلام':'الطلب جاهز عند المطعم',description:order.orderType==='pickup'?'تقدر تتواصل مع المطعم بخصوص الاستلام.':'الطلب جاهز، ولسه مفيش حالة مؤكدة إنه خرج للتوصيل.'};
  if (order.status==='جاري التحضير') return {key:'preparing',label:'الطلب بيتحضّر',description:'المطعم حدّث حالة الطلب إلى جاري التحضير.'};
  if (order.confirmationStatus==='unreachable') return {key:'unreachable',label:'المطعم حاول يتواصل معاك',description:'ما قدرش يتأكد من تفاصيل الطلب. تواصل مع المطعم.'};
  if (order.confirmationStatus==='confirmed') return {key:'confirmed',label:'المطعم أكّد الطلب',description:'تم تأكيد طلبك. تابع الحالة هنا للتحديثات.'};
  if (order.confirmationStatus==='pending') return {key:'pending',label:'بانتظار تأكيد المطعم',description:'الطلب محفوظ، لكنه لسه مش متأكد ومش معناه إن التحضير بدأ.'};
  return {key:'unknown',label:'حالة الطلب غير معروفة',description:'المطعم ما قدّمش حالة مفهومة دلوقتي؛ تواصل معاه للتأكد.'};
}

/* These are separate server facts, not invented sequential checkmarks.
   In the inherited software preparing may coexist with pending confirmation.
   Show that contradiction accurately rather than silently assuming approval. */
function getOrderFacts(order: Order): Fact[] {
  let confirmation: Fact;
  switch(order.confirmationStatus){
    case 'confirmed':
      confirmation={label:'تأكيد المطعم',value:'تم التأكيد',detail:'مسجل كتأكيد من المطعم',state:'verified'};break;
    case 'rejected':
      confirmation={label:'تأكيد المطعم',value:'مرفوض',detail:'اتواصل مع المطعم لمعرفة السبب',state:'attention'};break;
    case 'unreachable':
      confirmation={label:'تأكيد المطعم',value:'التواصل لم يكتمل',detail:'اتواصل مع المطعم لتأكيد التفاصيل',state:'attention'};break;
    default:
      confirmation={label:'تأكيد المطعم',value:'بانتظار التأكيد',detail:'لم تُسجل موافقة المطعم بعد',state:'waiting'};
  }
  let progress: Fact={label:'التجهيز والتسليم',value:'في انتظار تحديث',detail:'مفيش حالة تجهيز أو تسليم مسجلة',state:'waiting'};
  if(order.status==='جاري التحضير') progress={label:'التجهيز والتسليم',value:'جاري التحضير',detail:'حالة مسجلة في نظام المطعم',state:'verified'};
  if(order.status==='جاهز للاستلام') progress={label:'التجهيز والتسليم',value:'جاهز',detail:order.orderType==='pickup'?'جاهز للاستلام حسب تحديث المطعم':'جاهز عند المطعم حسب آخر تحديث',state:'verified'};
  if(order.status==='خرج للدليفري') progress={label:'التجهيز والتسليم',value:'خرج للتوصيل',detail:'مسجل أنه خرج من المطعم',state:'verified'};
  if(order.status==='تم التسليم') progress={label:'التجهيز والتسليم',value:'تم التسليم',detail:'المطعم سجّل تسليم الطلب',state:'verified'};
  if(order.status==='ملغي'||order.confirmationStatus==='rejected') progress={label:'التجهيز والتسليم',value:'الطلب ملغي',detail:'لا تفترض بدء التحضير أو التسليم',state:'attention'};
  return [
    {label:'تسجيل الطلب',value:'تم التسجيل',detail:'الطلب محفوظ في نظام الموقع',state:'verified'},
    confirmation,progress,
  ];
}

export function RebirthOrderTracking({orderId}:{orderId:string}) {
  const [order,setOrder]=useState<Order|null>(null);
  const [loading,setLoading]=useState(true);
  const [updating,setUpdating]=useState(false);
  const [error,setError]=useState('');
  const [lastUpdated,setLastUpdated]=useState<string|null>(null);
  const [supportNumber,setSupportNumber]=useState('');
  const requestRef=useRef<AbortController|null>(null);
  const reload=useCallback(async()=>{
    // Manual refresh and returning from background cancel an older pending poll:
    // an old network reply cannot overwrite a newer restaurant status.
    requestRef.current?.abort();
    const controller=new AbortController();
    requestRef.current=controller;
    setUpdating(true);
    try {
      const resp=await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId)}`,{cache:'no-store',signal:controller.signal});
      const data=await resp.json() as Reply;
      if(controller.signal.aborted) return;
      if(!resp.ok||!data.ok){
        setError(!data.ok?data.error||'تعذر قراءة حالة الطلب.':'تعذر قراءة حالة الطلب.');
      }else{
        setOrder(data.order);
        setError('');
        setLastUpdated(new Date().toLocaleTimeString('ar-EG',{hour:'numeric',minute:'2-digit'}));
      }
    }catch{
      if(!controller.signal.aborted) setError('مش قادرين نحدّث الحالة دلوقتي. آخر حالة ناجحة لسه ظاهرة؛ اتأكد من الاتصال أو تواصل مع المطعم.');
    }finally{
      if(requestRef.current===controller){setLoading(false);setUpdating(false);}
    }
  },[orderId]);

  useEffect(()=>{
    void reload();
    const timer=window.setInterval(()=>{
      if(document.visibilityState==='visible')void reload();
    },15000);
    const onResume=()=>{if(document.visibilityState==='visible')void reload();};
    const onOnline=()=>void reload();
    document.addEventListener('visibilitychange',onResume);
    window.addEventListener('online',onOnline);
    return ()=>{
      requestRef.current?.abort();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange',onResume);
      window.removeEventListener('online',onOnline);
    };
  },[reload]);

  useEffect(()=>{
    const controller=new AbortController();
    void fetch('/api/public/site-settings',{cache:'no-store',signal:controller.signal})
      .then(res=>res.ok?res.json():null)
      .then((data:unknown)=>{
        if(controller.signal.aborted || !data || typeof data!=='object')return;
        const settings=(data as {settings?:{whatsappOrderNumber?:unknown}}).settings;
        if(typeof settings?.whatsappOrderNumber==='string')
          setSupportNumber(settings.whatsappOrderNumber);
      }).catch(()=>{ /* Contact page remains the fallback. */ });
    return ()=>controller.abort();
  },[]);

  const status=order?getStatus(order):null;
  const facts=order?getOrderFacts(order):[];
  const assistanceKind: 'cancel'|'change'|'help' =
    status?.key==='pending'||status?.key==='confirmed'?'cancel':
    status?.key==='preparing'?'change':'help';
  const supportLink=order?whatsAppRequest(supportNumber,order.reference,assistanceKind):null;
  const canChange=order&&['pending','confirmed','preparing','unreachable'].includes(status?.key??'');
  const cancellationLink=canChange?whatsAppRequest(supportNumber,order.reference,'cancel'):null;
  const changeLink=canChange?whatsAppRequest(supportNumber,order.reference,'change'):null;
  // Decorative editorial seal: textual status is still exclusively backend-derived.
  // A stamp is not a payment receipt, kitchen ticket, ETA or merchant acceptance.
  const statusStamp: Record<StatusKey,string> = {
    pending: 'SAVED', confirmed: 'CONFIRMED', preparing: 'PREPARING',
    ready: 'READY', out: 'ON THE WAY', delivered: 'DELIVERED',
    cancelled: 'CANCELLED', unreachable: 'CONTACT', unknown: 'CHECKING',
  };
  const stampedText=loading?'CHECKING':statusStamp[status?.key??'unknown'];
  return (
    <section className="t-order-tracking" aria-labelledby="t-order-track-title"
      data-current-status={status?.key??'unknown'} data-connection={error?'stale':'fresh'}>
      <div className="t-order-tracking__main">
        <div className="t-order-story__masthead">
          <span className="t-index">TUSCANINI / ORDER IN MOTION</span>
          <span className="t-order-story__edition" lang="en">THE LIVING TICKET — 001</span>
        </div>
        <div className="t-order-story__hero">
          <div className="t-order-story__headcopy">
            <span className="t-order-story__eyebrow">اللي نعرفه عن طلبك دلوقتي</span>
            <h2 id="t-order-track-title" aria-live="polite" aria-atomic="true">
              {loading?'بنتحقق من الطلب…':status?.label??'محتاجين نتأكد.'}
            </h2>
            <p>{status?.description??'هنعرض الحالة اللي المطعم سجّلها، من غير ما نفترض إنه بدأ يجهز الطلب.'}</p>
          </div>
          <div key={stampedText} className="t-order-story__seal" aria-hidden="true">
            <span className="t-order-story__seal-mark">T<span aria-hidden="true">✳</span></span>
            <span className="t-order-story__seal-text" lang="en">{stampedText}</span>
          </div>
        </div>

        <div className="t-order-story__rule" aria-hidden="true"><span>01</span><span>02</span><span>03</span></div>
        <div className="t-order-story__facts-heading">
          <strong>ورقة الطلب بتتحرّك مع كل تحديث حقيقي.</strong>
          <span lang="en">ONLY RECORDED FACTS</span>
        </div>
        {order&&(
          <div className="t-order-facts" aria-label="ما الذي تأكد عن طلبك؟">
            {facts.map((fact,index)=>(
              <div className="t-order-fact" data-state={fact.state} key={fact.label}>
                <span className="t-order-fact__number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
                <div className="t-order-fact__copy">
                  <span className="t-order-fact__label">{fact.label}</span>
                  <strong>{fact.value}</strong>
                  <small>{fact.detail}</small>
                </div>
                <span className="t-order-fact__signal" aria-hidden="true" />
              </div>
            ))}
          </div>
        )}
        {!order&&<div className="t-order-story__loading" role="status">بنراجع الرقم مع النظام. مش هنقول إن الطلب وصل إلا لما نلاقيه مسجل.</div>}
        {error&&<p role="alert" className="t-order-tracking__error">{error}</p>}
        <div className="t-order-tracking__controls">
          <button type="button" disabled={updating} onClick={()=>void reload()} className="t-order-tracking__refresh">
            <span aria-hidden="true" className="t-order-tracking__refresh-mark">↻</span>
            {updating?'جاري التحديث…':'حدّث الحالة'}
          </button>
          <div className="t-order-tracking__connection">
            <span className="t-order-tracking__connection-dot" aria-hidden="true" />
            <span className="t-order-tracking__time">
              {error?'تعذّر الاتصال — آخر حالة ناجحة محفوظة':
                lastUpdated?'آخر تحديث ناجح: '+lastUpdated:'مستنيين أول تحديث مؤكد'}
              {error&&lastUpdated?' · '+lastUpdated+' — البيانات قديمة':''}
            </span>
          </div>
        </div>
        <p className="t-order-tracking__cadence">الصفحة بتراجع حالة الطلب كل ١٥ ثانية وهي مفتوحة. من غير وعد بوقت تجهيز أو توصيل مش مؤكد.</p>
        {order&&<section className="t-order-assist" aria-labelledby="t-order-assist-title">
          <div className="t-order-assist__head">
            <span className="t-index">NEED SOMETHING CHANGED?</span>
            <h3 id="t-order-assist-title">{status?.key==='cancelled'?'طلبك اتلغى؟ خلّينا نوضح.':
              status?.key==='delivered'?'بعد ما استلمت الطلب.':'فيه حاجة محتاجة تتظبط؟'}</h3>
          </div>
          <p>{status?.key==='cancelled'
            ? 'الطلب مسجل إنه ملغي أو مرفوض. لو كنت دافع خارج الموقع أو محتاج تعرف السبب، اتواصل مع المطعم؛ إحنا مش بنعرض حالة استرداد مالية غير مؤكدة.'
            : status?.key==='delivered'
              ? 'لو فيه مشكلة في الطلب بعد الاستلام، ابعت للمطعم مرجع الأوردر ووضح اللي حصل.'
              : 'تقدر تطلب تعديل أو تستفسر عن الإلغاء مع المطعم. أي طلب مساعدة هنا مش بيغيّر حالة الأوردر تلقائيًا.'}</p>
          <div className="t-order-assist__actions">
            {cancellationLink&&<a href={cancellationLink} target="_blank" rel="noopener noreferrer">
              استفسر عن إمكانية الإلغاء ↗
            </a>}
            {changeLink&&<a href={changeLink} target="_blank" rel="noopener noreferrer">
              اطلب تعديل الأوردر ↗
            </a>}
            {supportLink
              ? <a href={supportLink} target="_blank" rel="noopener noreferrer">راسل المطعم برقم الطلب ↗</a>
              : <Link href="/contact">شوف طرق التواصل مع المطعم ↗</Link>}
          </div>
          <small>الرسالة بتتجهز في واتساب، لكن لازم تراجعها وتضغط إرسال بنفسك. مفيش إلغاء أو رد أموال أو تعديل بيتم من الزر ده.</small>
        </section>}
      </div>
      <div className="t-order-tracking__details">
        <div className="t-order-ticket__masthead">
          <span lang="en">TUSCANINI / YOUR COPY</span>
          <span lang="en">ORDER NOTE · 01</span>
        </div>
        <div className="t-order-ticket__reference">
          <span>مرجع طلبك</span>
          <strong>{order?.reference??'لا يوجد مرجع مؤكد بعد'}</strong>
          <small>احتفظ بالرقم لو احتجت تتواصل مع المطعم.</small>
        </div>
        <div className="t-order-ticket__perforation" aria-hidden="true"><span>✳</span></div>
        <dl>
          <div><dt>نوع الطلب</dt><dd>{order?.orderType==='delivery'?'دليفري':order?.orderType==='pickup'?'استلام':'غير متاح'}</dd></div>
          <div><dt>إجمالي الأصناف المسجل</dt><dd>{order?formatMoney(order.totalEstimate)+' ج.م':'غير متاح'}</dd></div>
          <div><dt>الطاولة</dt><dd>{order?.tableReference??'—'}</dd></div>
          <div><dt>وقت التسجيل</dt><dd>{order?.createdAt?new Date(order.createdAt).toLocaleString('ar-EG'):'غير متاح'}</dd></div>
        </dl>
        <p className="t-order-ticket__disclaimer">الإجمالي حسب الأصناف المسجلة، ومش بالضرورة شامل التوصيل. مفيش دفع إلكتروني أو استرداد فلوس مؤكَّد من الموقع؛ استفسر من المطعم عن طريقة الدفع أو أي مبلغ مدفوع خارجه.</p>
        <div className="t-order-ticket__footer">
          <span lang="en">KEEP THIS REFERENCE</span>
          <span>دي تذكرة متابعة، مش إيصال دفع.</span>
        </div>
      </div>
    </section>
  );
}
