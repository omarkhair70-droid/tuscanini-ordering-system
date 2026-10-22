'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type CatalogItem={sku:string;name:string;unit_price_cents:number};
type StaffLine={sku:string;name:string;qty:number;price_cents:number;
  selection?:{size?:{label:string}|null;addons?:Array<{label:string}>};notes?:string};
type Order={id:string;status:string;subtotal_cents:string;created_at:string;
  items:StaffLine[];order_type?:string;table_reference?:string|null;
  customer_snapshot?:{name?:string;phone?:string;address?:string;generalNotes?:string}};
type OrderEvent={id:string;status:string;created_at:string;action:string;actor_role:string};
type StudioPayload={items?:CatalogItem[];orders?:Order[];events?:OrderEvent[];id?:string;status?:string;subtotal_cents?:string;error?:string};
type Mode='customer'|'operator';
const states:Record<string,{label:string;seal:string}>={
  received:{label:'اتسجّل الطلب',seal:'SAVED'},
  accepted:{label:'المطعم أكّد الطلب',seal:'ACCEPTED'},
  rejected:{label:'المطعم اعتذر عن الطلب',seal:'DECLINED'},
  preparing:{label:'أكلك بيتجهّز',seal:'COOKING'},
  ready:{label:'طلبك جاهز',seal:'READY'},
  delivered:{label:'اتسلّم الطلب',seal:'DELIVERED'},
};
const actions:Record<string,Array<{action:string;label:string}>>={
  received:[{action:'accept',label:'اقبل الأوردر'},{action:'reject',label:'اعتذر عن الأوردر'}],
  accepted:[{action:'start',label:'ابدأ التحضير'}],
  preparing:[{action:'ready',label:'الطلب جاهز'}],
  ready:[{action:'deliver',label:'تم التسليم'}],
};
const money=(cents:number|string)=>new Intl.NumberFormat('ar-EG',{maximumFractionDigits:2}).format(Number(cents)/100)+' ج.م';
const lastOrderKey='tuscanini:studio:last-order';
function apiUrl(resource:string,orderId?:string){
  return '/api/studio/bridge?resource='+encodeURIComponent(resource)+(orderId?'&orderId='+encodeURIComponent(orderId):'');
}
async function call(resource:string,operatorKey:string,params?:{orderId?:string;body?:unknown}):Promise<StudioPayload>{
  const response=await fetch(apiUrl(resource,params?.orderId),{
    method:params?.body===undefined?'GET':'POST',
    headers:{...(params?.body===undefined?{}:{'Content-Type':'application/json'}),
      ...(operatorKey?{'x-studio-operator-key':operatorKey}:{})},
    body:params?.body===undefined?undefined:JSON.stringify(params.body),
    cache:'no-store',
  });
  const reply=await response.json() as StudioPayload;
  if(!response.ok)throw Error(reply.error??'تعذر تحديث الأوردرات');
  return reply;
}
function shortId(id:string){return '#'+id.slice(0,8).toUpperCase();}
export function StudioOrderRoom({mode}:{mode:Mode}){
  const [catalog,setCatalog]=useState<CatalogItem[]>([]);
  const [quantities,setQuantities]=useState<Record<string,number>>({});
  const [orderId,setOrderId]=useState('');
  const [order,setOrder]=useState<StudioPayload|null>(null);
  const [events,setEvents]=useState<OrderEvent[]>([]);
  const [inbox,setInbox]=useState<Order[]>([]);
  const [operatorKey,setOperatorKey]=useState('');
  const [alertEnabled,setAlertEnabled]=useState(false);
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const [lastSync,setLastSync]=useState('');
  const selected=useMemo(()=>catalog.filter(item=>(quantities[item.sku]??0)>0)
    .map(item=>({...item,qty:quantities[item.sku]})),[catalog,quantities]);
  const total=selected.reduce((sum,item)=>sum+item.unit_price_cents*item.qty,0);

  const refreshCustomer=useCallback(async(id:string)=>{
    if(!id)return;
    try{
      const [next,history]=await Promise.all([call('track','',{orderId:id}),call('events','',{orderId:id})]);
      setOrder(next);setEvents(history.events??[]);setMessage('');
      setLastSync(new Date().toLocaleTimeString('ar-EG',{hour:'numeric',minute:'2-digit'}));
    }catch(e){setMessage(e instanceof Error?e.message:'تعذر تحديث حالة الطلب');}
  },[]);

  const refreshOperator=useCallback(async(key:string)=>{
    if(!key)return;
    try{
      const data=await call('inbox',key);
      setInbox(data.orders??[]);setMessage('');
      setLastSync(new Date().toLocaleTimeString('ar-EG',{hour:'numeric',minute:'2-digit'}));
    }catch(e){setMessage(e instanceof Error?e.message:'تعذّرت مزامنة الأوردرات');}
  },[]);

  useEffect(()=>{
    if(mode!=='customer')return;
    let cancelled=false;
    call('catalog','').then(v=>{if(!cancelled)setCatalog(v.items??[]);})
      .catch(e=>{if(!cancelled)setMessage(e instanceof Error?e.message:'المنيو التجريبي مش متاح');});
    const id=window.localStorage.getItem(lastOrderKey);
    if(id&&/^[0-9a-f-]{36}$/i.test(id))setOrderId(id);
    return ()=>{cancelled=true;};
  },[mode]);

  useEffect(()=>{
    if(mode==='customer'&&orderId)void refreshCustomer(orderId);
    if(mode==='operator'&&operatorKey)void refreshOperator(operatorKey);
    const poll=window.setInterval(()=>{
      if(document.visibilityState!=='visible')return;
      if(mode==='customer'&&orderId)void refreshCustomer(orderId);
      if(mode==='operator'&&operatorKey)void refreshOperator(operatorKey);
    },3500);
    const wake=()=>{
      if(document.visibilityState==='visible'){
        if(mode==='customer'&&orderId)void refreshCustomer(orderId);
        if(mode==='operator'&&operatorKey)void refreshOperator(operatorKey);
      }
    };
    document.addEventListener('visibilitychange',wake);
    window.addEventListener('online',wake);
    return ()=>{window.clearInterval(poll);document.removeEventListener('visibilitychange',wake);window.removeEventListener('online',wake);};
  },[mode,orderId,operatorKey,refreshCustomer,refreshOperator]);

  const submit=async()=>{
    if(!selected.length||busy)return;
    setBusy(true);setMessage('بنسجل طلب التجربة…');
    try{
      const requestKey='studio-'+crypto.randomUUID();
      const saved=await call('create','',{body:{requestKey,items:selected.map(x=>({sku:x.sku,qty:x.qty}))}});
      if(!saved.id)throw Error('لم يصل مرجع الطلب');
      window.localStorage.setItem(lastOrderKey,saved.id);
      setOrderId(saved.id);setMessage('اتسجّل طلبك، تقدر تتابعه هنا.');setQuantities({});
      await refreshCustomer(saved.id);
    }catch(e){setMessage(e instanceof Error?e.message:'تعذّر تسجيل طلب التجربة');}
    finally{setBusy(false);}
  };

  const applyAction=async(orderId:string,action:string)=>{
    setBusy(true);
    try{
      await call('action',operatorKey,{orderId,body:{action}});
      await refreshOperator(operatorKey);setMessage('اتحدّث الأوردر بنجاح.');
    }catch(e){setMessage(e instanceof Error?e.message:'تعذّر تغيير حالة الطلب');}
    finally{setBusy(false);}
  };

  return <section className="t-studio__layout" aria-label={mode==='customer'?'تجربة الطلب':'لوحة تشغيل الأوردرات'}>
    {mode==='customer'?<>
      <section className="t-studio__panel" aria-labelledby="studio-menu">
        <div className="t-studio__panel-head"><h2 id="studio-menu">منيو التجربة</h2><span>01 / PICK</span></div>
        {catalog.length?catalog.map(item=><div key={item.sku} className="t-studio__food">
          <div><strong>{item.name}</strong><small>{money(item.unit_price_cents)}</small></div>
          <input aria-label={'كمية '+item.name} type="number" min="0" max="10" step="1"
            value={quantities[item.sku]??0}
            onChange={event=>{const value=Number(event.target.value);setQuantities(q=>({...q,[item.sku]:Number.isInteger(value)?Math.max(0,Math.min(10,value)):0}));}}/>
        </div>):<p className="t-studio__empty">بنجيب المنيو التجريبي من PostgreSQL…</p>}
        <div className="t-studio__total"><span>الإجمالي</span><strong>{money(total)}</strong></div>
        <button className="t-studio__cta" onClick={()=>void submit()} disabled={busy||!selected.length}>سجّل طلب تجربة <span aria-hidden="true">↗</span></button>
        <small>الأسعار هنا للسيناريو التجريبي فقط؛ مش قائمة توسكانيني الرسمية.</small>
      </section>
      <section className="t-studio__panel t-studio__panel--ticket" aria-labelledby="studio-ticket">
        <div className="t-studio__panel-head"><h2 id="studio-ticket">التذكرة الحيّة</h2><span>02 / LIVE TICKET</span></div>
        {!orderId?<p className="t-studio__empty">اختار أكلك وسجّل الأوردر؛ هتظهر التذكرة هنا وتتحرك مع الموظف.</p>:
          <div className="t-studio__ticket">
            <div className="t-studio__ticket-meta"><span>TUSCANINI / YOUR COPY</span><strong>{shortId(orderId)}</strong></div>
            <div className="t-studio__ticket-state"><div><small>حالة الطلب</small><h3 aria-live="polite">{states[order?.status??'']?.label??'بنتحقق من الحالة…'}</h3></div>
              <div key={order?.status} className="t-studio__stamp" aria-hidden="true">{states[order?.status??'']?.seal??'...'}</div></div>
            <ol className="t-studio__events" aria-label="سجل تحديثات الطلب">
              {events.map((e,i)=><li key={e.id}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{states[e.status]?.label??e.status}</strong><small>{new Date(e.created_at).toLocaleTimeString('ar-EG',{hour:'numeric',minute:'2-digit'})}</small></div></li>)}
            </ol>
            <small>التذكرة بتعرض الأحداث اللي الموظف سجّلها؛ مش إيصال دفع.</small>
          </div>}
        {orderId&&<button className="t-studio__outline" onClick={()=>void refreshCustomer(orderId)}>حدّث الحالة ↻</button>}
      </section>
    </>:<>
      <section className="t-studio__panel t-studio__panel--inbox" aria-labelledby="studio-inbox">
        <div className="t-studio__panel-head"><h2 id="studio-inbox">صندوق الأوردرات</h2><span>OPERATOR / TABLET</span></div>
        <label className="t-studio__key"><span>مفتاح دخول بيئة التجربة</span>
          <input value={operatorKey} onChange={e=>setOperatorKey(e.target.value)} type="password" autoComplete="off"
            placeholder="Studio operator key"/></label>
        <button className="t-studio__outline" disabled={!operatorKey||busy} onClick={()=>void refreshOperator(operatorKey)}>حدّث الأوردرات ↻</button>
        {!operatorKey?<p className="t-studio__empty">اكتب مفتاح بيئة الاختبار لتشغيل شاشة الموظف.</p>:inbox.length===0?<p className="t-studio__empty">لسه مفيش أوردرات ظاهرة. افتح واجهة العميل وسجّل طلبًا.</p>:
          <div className="t-studio__orders">{inbox.map(item=><article key={item.id} className={'t-studio__order'+(item.status==='received'?' t-studio__order--new':'')}>
            <div className="t-studio__order-top"><strong>{shortId(item.id)}</strong><span>{states[item.status]?.label??item.status}</span></div>
            <p className="t-studio__order-customer">
              {item.customer_snapshot?.name||'عميل تجربة'} · {item.order_type==='delivery'?'دليفري':'استلام'}
              {item.table_reference?' · طاولة '+item.table_reference:''}
            </p>
            {item.customer_snapshot?.phone&&<p>الهاتف: {item.customer_snapshot.phone}</p>}
            {item.customer_snapshot?.address&&<p>العنوان: {item.customer_snapshot.address}</p>}
            {item.customer_snapshot?.generalNotes&&<p>ملاحظات الطلب: {item.customer_snapshot.generalNotes}</p>}
            <ul className="t-studio__lines">{item.items.map((line,index)=><li key={index}>
              <strong>{line.qty} × {line.name}</strong>
              {line.selection?.size?.label&&<span>الحجم: {line.selection.size.label}</span>}
              {Boolean(line.selection?.addons?.length)&&<span>الإضافات: {line.selection!.addons!.map(a=>a.label).join('، ')}</span>}
              {line.notes&&<small>ملحوظة: {line.notes}</small>}
            </li>)}</ul>
            <strong>{money(item.subtotal_cents)}</strong>
            <div className="t-studio__actions">{(actions[item.status]??[]).map(a=><button key={a.action} disabled={busy}
              onClick={()=>void applyAction(item.id,a.action)}>{a.label}</button>)}</div>
          </article>)}</div>}
      </section>
      <aside className="t-studio__panel t-studio__guide"><div className="t-studio__panel-head"><h2>التجربة بتحصل إزاي؟</h2><span>03 / WORKFLOW</span></div>
        <p>افتح العميل في نافذة، والتشغيل في نافذة تانية. اقبل الأوردر أو ابدأ التحضير من هنا، وشوف تذكرة العميل بتتغير تلقائيًا.</p>
        <strong>اتسجّل → اتقبل → بيتحضّر → جاهز → اتسلّم</strong>
        <p>الأحداث والأسعار التجريبية محفوظة في PostgreSQL المحلية، مش في تابلت طلبات أو الكاشير.</p>
      </aside>
    </>}
    <div className="t-studio__feedback" role="status" aria-live="polite">
      {message|| (lastSync?'آخر تحديث: '+lastSync:'جاهزين للتجربة')}
      {lastSync&&message?' · آخر مزامنة ناجحة: '+lastSync:''}
    </div>
  </section>;
}
