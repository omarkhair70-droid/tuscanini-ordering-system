'use client';
import { useCallback, useEffect, useState } from 'react';

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

const formatMoney = (number: number) => new Intl.NumberFormat('ar-EG', {maximumFractionDigits:2}).format(number);
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

export function RebirthOrderTracking({orderId}:{orderId:string}) {
  const [order,setOrder]=useState<Order|null>(null);
  const [loading,setLoading]=useState(true);
  const [updating,setUpdating]=useState(false);
  const [error,setError]=useState('');
  const [lastUpdated,setLastUpdated]=useState<string|null>(null);
  const reload=useCallback(async (signal?:AbortSignal) => {
    setUpdating(true);
    try {
      const resp=await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId)}`,{cache:'no-store',signal});
      const data=await resp.json() as Reply;
      if(signal?.aborted) return;
      if(!resp.ok || !data.ok) {
        setError(!data.ok ? data.error || 'تعذر قراءة حالة الطلب.' : 'تعذر قراءة حالة الطلب.');
      } else {
        setOrder(data.order);
        setError('');
        setLastUpdated(new Date().toLocaleTimeString('ar-EG',{hour:'numeric',minute:'2-digit'}));
      }
    } catch {
      if(!signal?.aborted) setError('مش قادرين نحدّث الحالة دلوقتي. حاول تاني أو تواصل مع المطعم.');
    } finally {
      if(!signal?.aborted) {setLoading(false);setUpdating(false)}
    }
  },[orderId]);

  useEffect(()=>{
    const controller=new AbortController();
    void reload(controller.signal);
    const timer=window.setInterval(()=>{
      if(document.visibilityState==='visible')void reload(controller.signal);
    },15000);
    return ()=>{controller.abort();window.clearInterval(timer)};
  },[reload]);

  const status=order?getStatus(order):null;
  return (
    <section className="t-order-tracking" aria-labelledby="t-order-track-title">
      <div className="t-order-tracking__main">
        <span className="t-index">TRACKING / LIVE RESTAURANT STATE</span>
        <h2 id="t-order-track-title">{loading?'بنتحقق من الطلب…':status?.label??'محتاجين نتأكد.'}</h2>
        <p>{status?.description??'هنعرض الحالة اللي المطعم سجّلها في النظام، من غير ما نفترض إنه بدأ يجهز الطلب.'}</p>
        {error&&<p role="alert" className="t-order-tracking__error">{error}</p>}
        <button type="button" disabled={updating} onClick={()=>void reload()} className="t-order-tracking__refresh">{updating?'جاري التحديث…':'حدّث الحالة ↻'}</button>
        {lastUpdated&&<span className="t-order-tracking__time">آخر تحديث ناجح: {lastUpdated}</span>}
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
