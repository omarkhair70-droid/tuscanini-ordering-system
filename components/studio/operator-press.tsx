'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase='received'|'accepted'|'preparing'|'ready'|'delivered'|'rejected';
type Variant={label:string;price_cents?:number};
type Line={sku:string;name:string;qty:number;price_cents:number;
  selection?:{size?:Variant|null;addons?:Variant[]};notes?:string};
type Order={id:string;status:string;subtotal_cents:string;created_at:string;items:Line[];
  order_type?:string;table_reference?:string|null;
  customer_snapshot?:{name?:string;phone?:string;address?:string;generalNotes?:string}};
type Layout='press'|'rail';
type Filter='all'|'received'|'making'|'ready'|'done';
type Data={orders?:Order[];error?:string};

const STATUS:Record<string,{label:string;marker:string;index:string}>={
  received:{label:'طلب جديد',marker:'NEW',index:'01'},
  accepted:{label:'اتقبل · مستني التحضير',marker:'QUEUED',index:'02'},
  preparing:{label:'بيتحضّر',marker:'COOKING',index:'03'},
  ready:{label:'جاهز',marker:'READY',index:'04'},
  delivered:{label:'اتسلّم',marker:'DONE',index:'05'},
  rejected:{label:'اترفض',marker:'DECLINED',index:'06'},
};
const DEMO_NEXT_STATE:Record<string,Phase>={
  accept:'accepted',reject:'rejected',start:'preparing',ready:'ready',deliver:'delivered',
};
const ACTIONS:Record<string,Array<{key:string;label:string}>>={
  received:[{key:'accept',label:'اقبل الأوردر'},{key:'reject',label:'اعتذر عن الأوردر'}],
  accepted:[{key:'start',label:'ابدأ التحضير'}],
  preparing:[{key:'ready',label:'الطلب جاهز'}],
  ready:[{key:'deliver',label:'تم التسليم'}],
};
const money=(n:number|string)=>new Intl.NumberFormat('ar-EG',{maximumFractionDigits:2}).format(Number(n)/100)+' ج.م';
const short=(id:string)=>'#'+id.slice(0,8).toUpperCase();
const matching=(o:Order,f:Filter)=>f==='all'||f==='received'&&o.status==='received'||
  f==='making'&&(o.status==='accepted'||o.status==='preparing')||
  f==='ready'&&o.status==='ready'||
  f==='done'&&(o.status==='delivered'||o.status==='rejected');
function age(date:string){
  const n=Date.parse(date);if(!Number.isFinite(n))return '—';
  const minutes=Math.max(0,Math.floor((Date.now()-n)/60000));
  return minutes<1?'دلوقتي':minutes<60?minutes+' د':Math.floor(minutes/60)+' س '+minutes%60+' د';
}
/** Soft two-tone order cue; only ever armed by a staff click. */
function playOrderCue(context:AudioContext){
  const now=context.currentTime;
  [0,0.16].forEach((delay,i)=>{
    const tone=context.createOscillator();
    const volume=context.createGain();
    tone.type='sine';
    tone.frequency.setValueAtTime(i===0?740:988,now+delay);
    volume.gain.setValueAtTime(0.0001,now+delay);
    volume.gain.exponentialRampToValueAtTime(0.13,now+delay+0.025);
    volume.gain.exponentialRampToValueAtTime(0.0001,now+delay+0.23);
    tone.connect(volume);volume.connect(context.destination);
    tone.start(now+delay);tone.stop(now+delay+0.24);
  });
}
function makePreviewOrders():Order[]{
  const labels=['تشيكن فاير','كريب برجر','بيتزا تشيكن رانش','كريب مكس جبن','توسكانيني سبيشال','مياه معدنية'];
  const statuses:Phase[]=['received','received','preparing','accepted','ready','received','preparing','delivered','ready','accepted',
    'received','preparing','preparing','received','ready','accepted','delivered','received','rejected','accepted'];
  return statuses.map((status,i)=>{
    const qty=1+i%3, p=labels[i%labels.length], add=i%4===0?[{label:'موتزاريلا'}]:i%5===0?[{label:'صوص إضافي'}]:[];
    return {
      // Unique receipt prefixes: the eight-character order ref must not
      // collapse every preview ticket to '#PREVIEW-'.
      id:(1000+i).toString(16).toUpperCase().padStart(8,'0')+'-1111-4111-8111-111111111111',status,
      subtotal_cents:String((65+(i%6)*27)*100*qty),
      created_at:new Date(Date.now()-(i*3+2)*60000).toISOString(),
      order_type:i%4===0?'delivery':'pickup',table_reference:i%6===0?'A-'+(i%8+1):null,
      customer_snapshot:{name:'عميل '+String(i+1).padStart(2,'0'),
        generalNotes:i%7===0?'مهم: من غير بصل':''},
      items:[{sku:'visual-'+i,name:p,qty,price_cents:9500,
        selection:{size:{label:i%3===0?'كبير':'صغير'},addons:add},notes:i%5===0?'تسوية زيادة':''},
        ...(i%4===0?[{sku:'water',name:'مياه معدنية',qty:1,price_cents:1800,selection:{size:{label:'سعر واحد'}},notes:''}]:[])],
    };
  });
}
async function requestInbox(key:string):Promise<Order[]>{
  const response=await fetch('/api/studio/bridge?resource=inbox',{cache:'no-store',headers:{'x-studio-operator-key':key}});
  const data=await response.json() as Data;
  if(!response.ok)throw Error(data.error??'تعذر تحديث الأوردرات');
  return data.orders??[];
}
async function requestAction(key:string,id:string,action:string){
  const response=await fetch('/api/studio/bridge?resource=action&orderId='+encodeURIComponent(id),{
    method:'POST',headers:{'Content-Type':'application/json','x-studio-operator-key':key},
    body:JSON.stringify({action}),cache:'no-store'});
  const data=await response.json() as {error?:string};
  if(!response.ok)throw Error(data.error??'حالة الطلب ما اتغيرتش');
}
function LineDetails({lines}:{lines:Line[]}){
  return <ul className="op-lines">{lines.map((line,i)=><li key={i}>
    <span className="op-lines__qty">{line.qty} ×</span>
    <span className="op-lines__details"><strong>{line.name}</strong>
      <span className="op-lines__mods">
        {line.selection?.size?.label&&<span>{line.selection.size.label}</span>}
        {(line.selection?.addons??[]).map((a,k)=><span key={k}>{a.label}</span>)}
      </span>
      {line.notes&&<em>{line.notes}</em>}
    </span></li>)}</ul>;
}
function OrderActions({order,pending,preview,onAction}:{
  order:Order;pending:boolean;preview:boolean;onAction:(id:string,action:string)=>void;
}){
  const acts=ACTIONS[order.status]??[];
  if(!acts.length)return <span className="op-finished">الأوردر مقفول</span>;
  return <div className="op-actions">{acts.map((a,i)=><button key={a.key} type="button"
    className={i===0?'op-actions__primary':'op-actions__alt'} disabled={pending||preview}
    onClick={()=>onAction(order.id,a.key)}>{pending?'بنحدّث…':a.label}<span aria-hidden="true">↗</span></button>)}</div>;
}
function OrderTicket({order,preview,pending,onAction,compact=false}:{
  order:Order;preview:boolean;pending:boolean;onAction:(id:string,a:string)=>void;compact?:boolean;
}){
  const phase=STATUS[order.status]??{label:order.status,marker:'STATUS',index:'--'};
  return <article className={'t-studio__order op-ticket'+(compact?' op-ticket--compact':'')+
    (order.status==='received'?' t-studio__order--new':'')} data-order-state={order.status}>
    <div className="op-ticket__masthead"><strong lang="en">{short(order.id)}</strong>
      <span className="op-ticket__stage" data-phase={order.status}>{phase.marker} / {phase.label}</span></div>
    <div className="op-ticket__meta"><span>{age(order.created_at)}</span>
      <span>{order.order_type==='delivery'?'دليفري':'استلام'}{order.table_reference?' · '+order.table_reference:''}</span></div>
    <div className="op-ticket__name">{order.customer_snapshot?.name??'عميل'}</div>
    {order.customer_snapshot?.generalNotes&&<p className="op-ticket__warning">{order.customer_snapshot.generalNotes}</p>}
    <LineDetails lines={order.items}/>
    {!compact&&<div className="op-ticket__details">
      {order.customer_snapshot?.phone&&<span>☎ {order.customer_snapshot.phone}</span>}
      {order.customer_snapshot?.address&&<span>{order.customer_snapshot.address}</span>}
    </div>}
    {!preview && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(order.id) &&
      <a className="op-ticket__customer-view"
        href={'/order-success?orderId='+encodeURIComponent(order.id)}
        target="_blank" rel="noopener noreferrer"
        aria-label={'افتح متابعة العميل للطلب '+short(order.id)}>
        افتح تذكرة متابعة العميل ↗
      </a>}
    <div className="op-ticket__bottom"><strong>{money(order.subtotal_cents)}</strong><OrderActions order={order}
      preview={preview} pending={pending} onAction={onAction}/></div>
  </article>;
}
function AllDay({orders}:{orders:Order[]}){
  const active=orders.filter(o=>o.status==='accepted'||o.status==='preparing');
  const count=new Map<string,number>();
  active.forEach(o=>o.items.forEach(line=>count.set(line.name,(count.get(line.name)??0)+line.qty)));
  const sorted=[...count].sort((a,b)=>b[1]-a[1]).slice(0,5);
  return <div className="op-allday" aria-label="تجميع الأصناف المطلوب تجهيزها">
    <div className="op-allday__label"><b>ALL DAY</b><span>على النار دلوقتي</span></div>
    <div className="op-allday__counts">{sorted.length?sorted.map(([name,qty])=>
      <div key={name}><strong>{qty.toLocaleString('ar-EG')}</strong><span>{name}</span></div>):
      <p>مفيش أصناف قيد التحضير</p>}</div>
    <small>تجميع من الأوردرات المقبولة أو قيد التحضير فقط</small>
  </div>;
}
export function OperatorPress({publicDemo=false,canSyncCatalog=false}:{publicDemo?:boolean;canSyncCatalog?:boolean}){
  const [key,setKey]=useState('');
  const [orders,setOrders]=useState<Order[]>([]);
  const [layout,setLayout]=useState<Layout>('press');
  const [filter,setFilter]=useState<Filter>('all');
  const [preview,setPreview]=useState(publicDemo);
  const [demoStatuses,setDemoStatuses]=useState<Record<string,Phase>>({});
  const [selectedId,setSelectedId]=useState('');
  const [message,setMessage]=useState('');
  const [lastSync,setLastSync]=useState('');
  const [pendingId,setPendingId]=useState('');
  const [connecting,setConnecting]=useState(false);
  const [catalogSyncing,setCatalogSyncing]=useState(false);
  const [search,setSearch]=useState('');
  const [clock,setClock]=useState(0);
  const [soundOn,setSoundOn]=useState(false);
  const [newArrivals,setNewArrivals]=useState(0);
  const [syncError,setSyncError]=useState(false);
  const knownReceived=useRef<Set<string>|null>(null);
  const audioContext=useRef<AudioContext|null>(null);
  const audioArmed=useRef(false);
  const railTrack=useRef<HTMLDivElement|null>(null);

  useEffect(()=>{
    if(publicDemo || new URLSearchParams(window.location.search).get('preview')==='20')setPreview(true);
    const timer=window.setInterval(()=>setClock(v=>v+1),30000);
    return ()=>{window.clearInterval(timer);void audioContext.current?.close();audioContext.current=null;};
  },[publicDemo]);
  const toggleSound=async()=>{
    if(audioArmed.current){audioArmed.current=false;setSoundOn(false);return;}
    try{
      const context=audioContext.current??new AudioContext();
      audioContext.current=context;
      await context.resume();
      audioArmed.current=true;setSoundOn(true);
      playOrderCue(context);
    }catch{
      setSyncError(true);setMessage('الصوت مش متاح في المتصفح ده');
    }
  };
  const syncCatalog=async()=>{
    if(publicDemo||preview||!canSyncCatalog||!key||catalogSyncing)return;
    // Historical catalog prices are not yet confirmed by the restaurant.
    const agreed=window.confirm('تحميل ١١٣ صنف من المنيو الموجود في الريبو إلى PostgreSQL؟ الأسعار الحالية للتجربة فقط وليست معتمدة من المطعم.');
    if(!agreed)return;
    setCatalogSyncing(true);
    try{
      const response=await fetch('/api/internal/orders/catalog-sync',{
        method:'POST',cache:'no-store',
        headers:{'x-studio-operator-key':key},
      });
      const result=await response.json() as {ok?:boolean;count?:number;error?:string};
      if(!response.ok||!result.ok||typeof result.count!=='number')
        throw Error(result.error??'لم يتم نسخ المنيو');
      setSyncError(false);
      setMessage('تم نسخ '+result.count.toLocaleString('ar-EG')+
        ' صنف للتجربة في Oracle · الأسعار لم يعتمدها المطعم بعد');
    }catch(error){
      setSyncError(true);
      setMessage(error instanceof Error?error.message:'تعذر نسخ منيو التجربة');
    }finally{setCatalogSyncing(false);}
  };
  const moveRail=(direction:'next'|'previous')=>{
    railTrack.current?.scrollBy({
      left:direction==='next'?-320:320,
      behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',
    });
  };
  const sync=useCallback(async(operatorKey:string)=>{
    if(!operatorKey)return;
    try{
      const data=await requestInbox(operatorKey);
      const received=new Set(data.filter(o=>o.status==='received').map(o=>o.id));
      const added=knownReceived.current===null?[]:[...received].filter(id=>!knownReceived.current?.has(id));
      knownReceived.current=received;
      if(added.length){
        setNewArrivals(added.length);
        if(audioArmed.current&&audioContext.current?.state==='running')playOrderCue(audioContext.current);
      }
      setOrders(data);setLastSync(new Date().toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'}));
      setSyncError(false);setMessage('');
    }catch(e){setSyncError(true);setMessage(e instanceof Error?e.message:'تعذّر الاتصال بالمحرك');}
  },[]);
  useEffect(()=>{
    if(preview||!key)return;
    void sync(key);
    const timer=window.setInterval(()=>{if(document.visibilityState==='visible')void sync(key);},3500);
    const wake=()=>{if(document.visibilityState==='visible')void sync(key);};
    document.addEventListener('visibilitychange',wake);
    window.addEventListener('online',wake);
    return ()=>{window.clearInterval(timer);document.removeEventListener('visibilitychange',wake);
      window.removeEventListener('online',wake);};
  },[key,preview,sync]);

  const data=useMemo(()=>preview?makePreviewOrders().map(o=>({
    ...o,status:demoStatuses[o.id]??o.status,
  })):orders,[orders,preview,clock,demoStatuses]);
  const filtered=useMemo(()=>data.filter(o=>matching(o,filter)&&(
    !search||[o.id,o.customer_snapshot?.name,...o.items.map(i=>i.name)].join(' ').toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )),[data,filter,search]);
  const active=filtered.filter(o=>!['delivered','rejected'].includes(o.status));
  const focus=filtered.find(o=>o.id===selectedId)??active[0]??filtered[0];
  const queue=filtered.filter(o=>o.id!==focus?.id);
  const buckets={
    received:data.filter(o=>o.status==='received').length,
    making:data.filter(o=>o.status==='accepted'||o.status==='preparing').length,
    ready:data.filter(o=>o.status==='ready').length,
    done:data.filter(o=>o.status==='delivered'||o.status==='rejected').length,
  };
  const apply=async(id:string,action:string)=>{
    if(publicDemo&&preview){
      const order=data.find(o=>o.id===id);
      const valid=ACTIONS[order?.status??'']?.some(a=>a.key===action);
      if(!order||!valid)return;
      // Public interactions change ONLY synthetic state in this React view.
      // They NEVER call the restaurant API or persist real orders.
      setDemoStatuses(previous=>({...previous,[id]:DEMO_NEXT_STATE[action]}));
      setSelectedId(id);
      setMessage('تم تحديث '+short(id)+' داخل التجربة فقط');
      return;
    }
    if(preview||pendingId||!key)return;
    // Keep this ticket in focus as it advances stages; otherwise another
    // incoming order would steal the canvas while staff are mid-task.
    setSelectedId(id);
    setPendingId(id);
    try{
      await requestAction(key,id,action);await sync(key);
      setSyncError(false);setNewArrivals(0);setMessage('اتحدث '+short(id)+' بنجاح');
    }catch(e){setSyncError(true);setMessage(e instanceof Error?e.message:'تعذر تحديث الأوردر');}
    finally{setPendingId('');}
  };
  const filters:[Filter,string,number][]=[
    ['all','كل الطلبات',data.length],['received','جديد',buckets.received],
    ['making','التحضير',buckets.making],['ready','جاهز',buckets.ready],['done','مكتمل',buckets.done],
  ];
  return <section className="op-root" aria-label="Tuscanini operator order press" data-layout={layout} data-preview={preview?'true':'false'}>
    <div className="op-toolbar">
      <div className="op-toolbar__identity"><span lang="en">T / ORDER PRESS</span><strong>الأوردرات بتتحرّك.</strong>
        <small>ORDER OPERATIONS · TUSCANINI</small></div>
      <div className="op-toolbar__tools">
        <div className="op-view" role="group" aria-label="تغيير طريقة عرض الأوردرات">
          <button type="button" aria-pressed={layout==='press'} onClick={()=>setLayout('press')}>المسرح الرئيسي</button>
          <button type="button" aria-pressed={layout==='rail'} onClick={()=>setLayout('rail')}>شريط التذاكر</button>
        </div>
        <button type="button" className="op-preview" aria-pressed={preview} onClick={()=>{
          if(publicDemo){setDemoStatuses({});setMessage('رجّعنا الـ٢٠ أوردر لحالتهم الأولى');}
          else setPreview(v=>!v);
          setFilter('all');setSelectedId('');setNewArrivals(0);
        }}>{publicDemo?'إعادة ضبط ٢٠ طلبًا':preview?'العودة للأوردرات':'جرّب ضغط 20 طلبًا'}</button>
      </div>
    </div>
    <div className="op-health">
      {preview?<span className="op-health__mark">{publicDemo
        ?'تجربة تفاعلية · ٢٠ طلبًا خياليًا · لا يوجد اتصال بالمطعم'
        :'عرض تصميم · ٢٠ طلبًا تجريبيًا · الأزرار غير مفعّلة'}</span>:
        <label className="op-health__key"><span>مفتاح تجربة الموظف</span><input type="password" placeholder="Studio operator key"
          value={key} onChange={e=>setKey(e.target.value)} autoComplete="off"/></label>}
      <button type="button" className="op-health__sound" aria-pressed={soundOn}
        onClick={()=>{void toggleSound();}} title="تنبيه صوتي عند وصول طلب جديد">
        {soundOn?'♪ الصوت شغال':'♪ فعّل تنبيه الأوردر'}
      </button>
      {canSyncCatalog&&!preview&&<button type="button" className="op-health__catalog"
        disabled={!key||catalogSyncing} onClick={()=>{void syncCatalog();}}>
        {catalogSyncing?'بننسخ المنيو…':'حمّل منيو الاختبار (113 صنف)'}
      </button>}
      <button type="button" className="op-health__sync" disabled={preview||!key||connecting} onClick={async()=>{
        setConnecting(true);await sync(key);setConnecting(false);
      }}>حدّث الأوردرات ↻</button>
      <span className={'op-health__link'+(syncError?' op-health__link--error':'')} role="status">
        {message ? message : lastSync ? 'آخر مزامنة '+lastSync : 'من غير اتصال لسه'}
      </span>
      {!preview&&newArrivals>0&&<strong className="op-health__arrival" role="status" aria-live="polite">
        وصل {newArrivals.toLocaleString('ar-EG')} أوردر جديد
      </strong>}
    </div>
    <div className="op-pulse" aria-label="عدد الطلبات حسب الحالة">
      <div className="op-pulse__live"><b lang="en">LIVE QUEUE</b><strong>{data.length.toLocaleString('ar-EG')}</strong>
        <span>أوردر في القائمة</span></div>
      <div><b lang="en">01 / INCOMING</b><strong>{buckets.received.toLocaleString('ar-EG')}</strong><span>جديد</span></div>
      <div><b lang="en">02 / ON FIRE</b><strong>{buckets.making.toLocaleString('ar-EG')}</strong><span>قيد التحضير</span></div>
      <div><b lang="en">03 / PICKUP</b><strong>{buckets.ready.toLocaleString('ar-EG')}</strong><span>جاهز</span></div>
    </div>
    <div className="op-filters">
      <div className="op-filters__tabs" aria-label="فلترة الأوردرات">{filters.map(([id,label,count])=>
        <button type="button" key={id} aria-pressed={filter===id} onClick={()=>{setFilter(id);setSelectedId('');}}>
          {label}<span>{count.toLocaleString('ar-EG')}</span></button>)}</div>
      <input aria-label="ابحث عن أوردر أو صنف" type="search" placeholder="رقم الأوردر أو الصنف…" value={search}
        onChange={e=>setSearch(e.target.value)} />
    </div>
    {!preview&&!key?<p className="op-nokey">حط مفتاح بيئة الاختبار عشان تشوف أوردراتك الحقيقية.</p>:
      !filtered.length?<p className="op-nokey">مفيش أوردرات مطابقة. اختار قسم تاني أو امسح البحث.</p>:
      layout==='press'?<div className="op-stage" data-testid="order-press">
        <div className="op-stage__focus">
          <div className="op-section-title"><span>01 / NOW ON STAGE</span><strong>الأوردر تحت إيدك</strong></div>
          {focus&&<OrderTicket key={focus.id} order={focus} preview={preview&&!publicDemo} pending={pendingId===focus.id} onAction={apply}/>}
        </div>
        <div className="op-stage__queue">
          <div className="op-section-title"><span>02 / NEXT IN LINE</span><strong>الطابور <em>{queue.length.toLocaleString('ar-EG')}</em></strong></div>
          <div className="op-queue-list">{queue.map(o=><button type="button" key={o.id} className="op-queue-row"
            onClick={()=>setSelectedId(o.id)} aria-label={'افتح أوردر '+short(o.id)}>
            <span className="op-queue-row__id">{short(o.id)}</span><strong>{o.items[0]?.name??'أوردر'}</strong>
            <span className="op-queue-row__details">{o.items.reduce((n,x)=>n+x.qty,0)} قطعة · {age(o.created_at)}</span>
            <small data-phase={o.status}>{STATUS[o.status]?.label??o.status}</small></button>)}</div>
        </div>
      </div>:<div className="op-rail" data-testid="order-ticket-rail" aria-label="شريط التذاكر الأفقي">
        <div className="op-section-title op-section-title--rail">
          <span>ROLLING TICKETS / SWIPE</span><strong>كل أوردر ورقة.</strong>
          <div className="op-rail__navigation" role="group" aria-label="تحريك شريط التذاكر">
            <button type="button" onClick={()=>moveRail('previous')} aria-label="التذاكر السابقة">→</button>
            <button type="button" onClick={()=>moveRail('next')} aria-label="التذاكر التالية">←</button>
          </div>
        </div>
        <div className="op-rail__track" ref={railTrack} tabIndex={0} aria-label="اسحب أفقيًا لمراجعة التذاكر">{filtered.map(o=><OrderTicket key={o.id} order={o} preview={preview&&!publicDemo}
          pending={pendingId===o.id} onAction={apply} compact/>)}</div>
      </div>}
    <AllDay orders={data}/>
    <footer className="op-foot"><span lang="en">TUSCANINI / OPERATIONAL PRINT</span>
      <span>{preview?'المعاينة منفصلة عن قاعدة البيانات':"حالات السيرفر هي اللي بتحرّك أوردرات التابلت"}</span></footer>
  </section>;
}
