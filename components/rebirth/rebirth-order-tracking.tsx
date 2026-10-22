'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

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

  const status=order?getStatus(order):null;
  const facts=order?getOrderFacts(order):[];
  return (
    <section className="t-order-tracking" aria-labelledby="t-order-track-title">
      <div className="t-order-tracking__main">
        <span className="t-index">TRACKING / RECORDED RESTAURANT STATUS</span>
        <h2 id="t-order-track-title" aria-live="polite">{loading?'بنتحقق من الطلب…':status?.label??'محتاجين نتأكد.'}</h2>
        <p>{status?.description??'هنعرض الحالة اللي المطعم سجّلها في النظام، من غير ما نفترض إنه بدأ يجهز الطلب.'}</p>
        {order&&(
          <div className="t-order-facts" aria-label="ما الذي تأكد عن طلبك؟">
            {facts.map((fact,index)=>(
              <div className="t-order-fact" data-state={fact.state} key={fact.label}>
                <span className="t-order-fact__number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
                <div>
                  <span className="t-order-fact__label">{fact.label}</span>
                  <strong>{fact.value}</strong>
                  <small>{fact.detail}</small>
                </div>
              </div>
            ))}
          </div>
        )}
        {error&&<p role="alert" className="t-order-tracking__error">{error}</p>}
        <div className="t-order-tracking__controls">
          <button type="button" disabled={updating} onClick={()=>void reload()} className="t-order-tracking__refresh">{updating?'جاري التحديث…':'حدّث الحالة ↻'}</button>
          {lastUpdated&&<span className="t-order-tracking__time">آخر تحديث ناجح: {lastUpdated}{error?' — البيانات قديمة':''}</span>}
        </div>
      </div>
      <div className="t-order-tracking__details">
        <span className="t-index">YOUR REFERENCE / KEEP IT</span>
        <strong>{order?.reference??'لا يوجد مرجع مؤكد بعد'}</strong>
        <dl>
          <div><dt>نوع الطلب</dt><dd>{order?.orderType==='delivery'?'دليفري':order?.orderType==='pickup'?'استلام':'غير متاح'}</dd></div>
          <div><dt>إجمالي الأصناف المسجل</dt><dd>{order?formatMoney(order.totalEstimate)+' ج.م':'غير متاح'}</dd></div>
          <div><dt>الطاولة</dt><dd>{order?.tableReference??'—'}</dd></div>
          <div><dt>وقت التسجيل</dt><dd>{order?.createdAt?new Date(order.createdAt).toLocaleString('ar-EG'):'غير متاح'}</dd></div>
        </dl>
        <p>الأرقام وحالة التوصيل بتتأكد مع المطعم. آخر تحديث ناجح هو المرجع، ولو الاتصال انقطع ممكن الحالة تتأخر.</p>
      </div>
    </section>
  );
}
