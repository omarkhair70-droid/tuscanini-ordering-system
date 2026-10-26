'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useCart} from '@/components/cart/cart-provider';

type Person={id:string;email:string};
type Address={id:string;label:string;formatted_address:string;latitude:number;longitude:number;is_default:boolean};
type OwnOrder={id:string;status:string;order_type:'pickup'|'delivery';subtotal_cents:string;created_at:string};
type Reply={customer?:Person;addresses?:Address[];orders?:OwnOrder[];error?:string;ok?:boolean};

async function read(resource:string):Promise<{status:number;data:Reply}>{
  const response=await fetch('/api/customer/oracle?resource='+resource,{cache:'no-store',credentials:'same-origin'});
  return {status:response.status,data:await response.json() as Reply};
}
async function send(action:string,payload:Record<string,unknown>={}):Promise<Reply>{
  const response=await fetch('/api/customer/oracle?action='+action,{
    method:'POST',headers:{'Content-Type':'application/json'},
    credentials:'same-origin',body:JSON.stringify(payload)});
  const data=await response.json() as Reply;
  if(!response.ok)throw new Error(data.error??'تعذّر الاتصال بالحساب.');
  return data;
}

export function CustomerAccount(){
  const router=useRouter();
  const {customer,updateCustomer}=useCart();
  const [user,setUser]=useState<Person|null>(null);
  const [loading,setLoading]=useState(true);
  const [available,setAvailable]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [addresses,setAddresses]=useState<Address[]>([]);
  const [orders,setOrders]=useState<OwnOrder[]>([]);
  const [historyError,setHistoryError]=useState('');
  const [label,setLabel]=useState('البيت');

  useEffect(()=>{
    let active=true;
    void read('session').then(({status,data})=>{
      if(!active)return;
      if(status===503)setAvailable(false);
      if(status===200&&data.customer)setUser(data.customer);
    }).catch(()=>{if(active)setAvailable(false)}).finally(()=>{if(active)setLoading(false)});
    return()=>{active=false};
  },[]);
  useEffect(()=>{
    if(!user)return;
    let active=true;
    void Promise.all([read('addresses'),read('orders')]).then(([a,o])=>{
      if(!active)return;
      setAddresses(a.status===200?a.data.addresses??[]:[]);
      setOrders(o.status===200?o.data.orders??[]:[]);
      setHistoryError(o.status===200?'':'تعذّر تحميل طلباتك دلوقتي.');
      if(a.status!==200)setError('تعذّر تحميل عناوينك دلوقتي.');
    }).catch(()=>{if(active)setHistoryError('تعذّر تحميل طلباتك دلوقتي.')});
    return()=>{active=false};
  },[user]);

  async function refresh(){
    const [a,o]=await Promise.all([read('addresses'),read('orders')]);
    if(a.status!==200||o.status!==200)throw new Error('تعذّر تحديث بيانات حسابك.');
    setAddresses(a.data.addresses??[]);setOrders(o.data.orders??[]);
    setHistoryError('');
  }
  const showError=(e:unknown)=>setError(e instanceof Error?e.message:'حصلت مشكلة في الاتصال.');
  async function logout(){
    setBusy(true);setError('');
    try{await send('logout');setUser(null);setAddresses([]);setOrders([]);setNotice('تم تسجيل الخروج.');}
    catch(e){showError(e)}finally{setBusy(false)}
  }
  async function saveAddress(){
    if(!customer.deliveryLocation||!customer.address.trim()){setError('حدد موقع الدليفري والعنوان من السلة الأول.');return;}
    setBusy(true);setError('');
    try{await send('save-address',{
        label:label.trim()||'البيت',formatted_address:customer.address.trim(),
        latitude:customer.deliveryLocation.lat,longitude:customer.deliveryLocation.lng,
      });await refresh();setNotice('اتحفظ العنوان في حسابك.');}
    catch(e){showError(e)}finally{setBusy(false)}
  }
  async function deleteAddress(id:string){
    setBusy(true);setError('');
    try{const r=await fetch('/api/customer/oracle?id='+encodeURIComponent(id),{
      method:'DELETE',credentials:'same-origin'});
      if(!r.ok)throw Error('تعذّر حذف العنوان.');
      await refresh();setNotice('اتحذف العنوان.');}
    catch(e){showError(e)}finally{setBusy(false)}
  }
  function useAddress(a:Address){
    updateCustomer({orderType:'delivery',address:a.formatted_address,
      deliveryLocation:{lat:Number(a.latitude),lng:Number(a.longitude)}});
    router.push('/cart');
  }
  if(loading)return <section className="t-account-panel" role="status">بنفتح حسابك…</section>;
  if(!available)return <section className="t-account-panel" role="status">
    <h2>حسابك.</h2><p>حسابات توسكانيني مش متاحة دلوقتي. تقدر تتفرج على المنيو وتجهّز طلبك كضيف.</p>
    <Link className="t-account-minor-link" href="/menu">افتح المنيو</Link>
  </section>;

  return <div className="t-account-grid">
    <section className="t-account-panel">
      <h2>{user?'أهلًا بيك.':'ادخل حسابك.'}</h2>
      {user?<><p className="t-account-email" dir="ltr">{user.email}</p>
        <p>عناوينك وطلباتك مرتبطة بحسابك هنا.</p>
        <button type="button" className="t-account-button t-account-button--outline"
          disabled={busy} onClick={()=>void logout()}>تسجيل الخروج</button></>:<>
        <p>سجّل بحساب Google في خطوة واحدة، واحتفظ بعناوينك وطلباتك.</p>
        <a className="t-account-button" href="/api/customer/google/start">المتابعة باستخدام Google</a>
        <p>مش حابب تسجل؟ كمل كضيف عادي.</p>
        <Link className="t-account-minor-link" href="/menu">كمّل كضيف من المنيو</Link>
      </>}
      {error&&<p role="alert" className="t-account-error">{error}</p>}
      {notice&&<p role="status" className="t-account-notice">{notice}</p>}
    </section>
    {user&&<>
      <section className="t-account-panel">
        <div className="t-account-panel__head"><h2>عناوينك.</h2><span>{addresses.length} عنوان</span></div>
        {addresses.map(a=><article key={a.id} className="t-account-address">
          <strong>{a.label}</strong><p>{a.formatted_address}</p>
          <div className="t-account-actions">
            <button type="button" disabled={busy} onClick={()=>useAddress(a)}>استخدمه في الطلب</button>
            <button type="button" disabled={busy} onClick={()=>void deleteAddress(a.id)}>احذف</button>
          </div>
        </article>)}
        {!addresses.length&&<p>لسه مفيش عناوين محفوظة. اختار موقعك من السلة.</p>}
        <div className="t-account-save">
          <label htmlFor="t-account-label">اسم العنوان</label>
          <input id="t-account-label" maxLength={40} value={label} onChange={e=>setLabel(e.target.value)}/>
          <button type="button" className="t-account-button" disabled={busy||!customer.deliveryLocation||!customer.address.trim()}
            onClick={()=>void saveAddress()}>احفظ عنوان السلة الحالي</button>
          {!customer.deliveryLocation&&<Link href="/cart">حدّد مكان التوصيل من السلة</Link>}
        </div>
      </section>
      <section className="t-account-panel t-account-panel--orders">
        <div className="t-account-panel__head"><h2>طلباتك.</h2><span>{orders.length} طلب</span></div>
        {historyError?<p role="status">{historyError}</p>:
          orders.length?orders.map(order=><article key={order.id} className="t-account-order">
            <div><strong>طلب #{order.id.slice(0,8)}</strong><span>{order.status}</span></div>
            <p>{new Date(order.created_at).toLocaleDateString('ar-EG')} · {order.order_type==='delivery'?'دليفري':'استلام'} · {Number(order.subtotal_cents)/100} ج.م</p>
            <Link href={'/order-success?orderId='+encodeURIComponent(order.id)}>شوف حالة الطلب</Link>
          </article>):<p>لسه مفيش طلبات في حسابك.</p>}
      </section>
    </>}
  </div>;
}
