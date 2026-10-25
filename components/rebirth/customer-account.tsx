'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { useCart } from '@/components/cart/cart-provider';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type SavedAddress = {
  id: string;
  label: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
};
type OwnOrder = {
  id: string;
  order_number: number | null;
  placed_at: string;
  status: string;
  order_type: 'pickup' | 'delivery';
  total_estimate: number;
};

function message(error: unknown): string {
  return error instanceof Error ? error.message : 'حصلت مشكلة في الاتصال. جرّب تاني.';
}

export function CustomerAccount() {
  const router = useRouter();
  const { customer, updateCustomer } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [orders, setOrders] = useState<OwnOrder[]>([]);
  const [historyMessage, setHistoryMessage] = useState('');
  const [addressLabel, setAddressLabel] = useState('البيت');

  const loadOwnedData = useCallback(async (verifiedUser: User) => {
    const supabase = getSupabaseBrowserClient();
    const {data, error: addressError} = await supabase
      .from('customer_addresses')
      .select('id,label,formatted_address,latitude,longitude,is_default')
      .eq('user_id',verifiedUser.id)
      .order('created_at',{ascending:false})
      .limit(30);
    if (addressError) {
      setError('العناوين المحفوظة مش متاحة حاليًا. راجع إعداد قاعدة البيانات.');
      setAddresses([]);
    } else {
      setAddresses((data??[]) as SavedAddress[]);
    }
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.access_token) return;
    try {
      const response = await fetch('/api/customer/orders',{
        headers:{Authorization:'Bearer '+session.session.access_token},cache:'no-store',
      });
      const result = await response.json() as {orders?:OwnOrder[];message?:string};
      if (!response.ok) {
        setOrders([]);
        setHistoryMessage(response.status===503
          ? 'سجل الطلبات بيتجهز للربط بحسابك.' : 'تعذّر تحميل طلباتك دلوقتي.');
      } else {
        setOrders(result.orders??[]);
        setHistoryMessage('');
      }
    } catch {
      setHistoryMessage('تعذّر الاتصال بسجل الطلبات.');
    }
  },[]);

  useEffect(()=>{
    let active=true;
    const supabase=getSupabaseBrowserClient();
    void supabase.auth.getUser().then(async ({data})=>{
      if (!active) return;
      setUser(data.user);
      setInitializing(false);
      if(data.user) await loadOwnedData(data.user);
    }).catch(()=>{
      if(active){setInitializing(false);setError('تعذّر التحقق من الحساب دلوقتي.');}
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(!active)return;
      setUser(session?.user??null);
      if(!session?.user){setAddresses([]);setOrders([]);setHistoryMessage('');}
      // Defer data fetch outside auth callback to avoid auth mutex deadlocks.
    });
    return ()=>{active=false;subscription.unsubscribe();};
  },[loadOwnedData]);

  async function requestOtp(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setError('');setNotice('');
    try{
      const supabase=getSupabaseBrowserClient();
      const {error:e}=await supabase.auth.signInWithOtp({
        email:email.trim().toLowerCase(),
        options:{shouldCreateUser:true,emailRedirectTo:window.location.origin+'/account'},
      });
      if(e)throw e;
      setOtpSent(true);setNotice('بعتنالك رسالة على الإيميل. افتح الرابط أو اكتب الكود.');
    }catch(e){setError(message(e));}
    finally{setBusy(false);}
  }

  async function verifyOtp(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setError('');
    try{
      const supabase=getSupabaseBrowserClient();
      const {data,error:e}=await supabase.auth.verifyOtp({
        email:email.trim().toLowerCase(),token:otp.trim(),type:'email',
      });
      if(e)throw e;
      if(!data.user)throw new Error('الكود غير صالح أو انتهت صلاحيته.');
      setUser(data.user);setNotice('دخلت حسابك بنجاح.');setOtp('');
      await loadOwnedData(data.user);
    }catch(e){setError(message(e));}
    finally{setBusy(false);}
  }

  async function saveCurrentAddress(){
    if(!user || !customer.deliveryLocation || !customer.address.trim()) {
      setError('حدّد دبوس الدليفري واكتب العنوان في السلة الأول.');
      return;
    }
    setBusy(true);setError('');setNotice('');
    try{
      const supabase=getSupabaseBrowserClient();
      const {error:e}=await supabase.from('customer_addresses').insert({
        user_id:user.id,
        label:addressLabel.trim().slice(0,40)||'البيت',
        formatted_address:customer.address.trim(),
        latitude:customer.deliveryLocation.lat,
        longitude:customer.deliveryLocation.lng,
      });
      if(e)throw e;
      setNotice('اتحفظ العنوان في حسابك.');
      await loadOwnedData(user);
    }catch(e){setError(message(e));}
    finally{setBusy(false);}
  }

  async function deleteAddress(address:SavedAddress){
    if(!user)return;
    setBusy(true);setError('');setNotice('');
    try{
      const {error:e}=await getSupabaseBrowserClient().from('customer_addresses')
        .delete().eq('user_id',user.id).eq('id',address.id);
      if(e)throw e;
      setNotice('اتحذف العنوان.');
      await loadOwnedData(user);
    }catch(e){setError(message(e));}
    finally{setBusy(false);}
  }

  async function signOut(){
    setBusy(true);
    const {error:e}=await getSupabaseBrowserClient().auth.signOut();
    if(e)setError(message(e));
    else{setUser(null);setAddresses([]);setOrders([]);setNotice('خرجت من حسابك.');}
    setBusy(false);
  }

  function useAddress(address:SavedAddress){
    updateCustomer({
      orderType:'delivery',
      address:address.formatted_address,
      deliveryLocation:{lat:Number(address.latitude),lng:Number(address.longitude)},
    });
    router.push('/cart');
  }

  if(initializing)return <section className="t-account-panel" role="status">بنفتح حسابك…</section>;

  return <div className="t-account-grid">
    <section className="t-account-panel" aria-labelledby="account-identity-title">
      <h2 id="account-identity-title">{user?'أهلًا بيك.':'ادخل حسابك.'}</h2>
      {user ? <>
        <p className="t-account-email" dir="ltr">{user.email}</p>
        <p>العناوين اللي بتحفظها هنا مرتبطة بحسابك، مش بالموبايل اللي بتستخدمه.</p>
        <button className="t-account-button t-account-button--outline" type="button"
          onClick={()=>void signOut()} disabled={busy}>تسجيل الخروج</button>
      </> : <>
        <p>ادخل بإيميلك من غير باسورد. تقدر تطلب كضيف من غير حساب.</p>
        <form onSubmit={requestOtp} className="t-account-form">
          <label htmlFor="t-account-email">الإيميل</label>
          <input id="t-account-email" type="email" inputMode="email" autoComplete="email"
            value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254}
            placeholder="you@example.com" dir="ltr"/>
          <button className="t-account-button" type="submit" disabled={busy||!email.trim()}>
            {busy?'بنرسل…':'ابعت كود الدخول'}
          </button>
        </form>
        {otpSent&&<form onSubmit={verifyOtp} className="t-account-form">
          <label htmlFor="t-account-otp">الكود اللي وصلك</label>
          <input id="t-account-otp" type="text" inputMode="numeric" autoComplete="one-time-code"
            value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,8))}
            minLength={6} required placeholder="000000" dir="ltr"/>
          <button className="t-account-button" type="submit" disabled={busy||otp.length<6}>
            تأكيد الدخول
          </button>
        </form>}
        <Link className="t-account-minor-link" href="/menu">كمّل كضيف من المنيو ↗</Link>
      </>}
      {error&&<p role="alert" className="t-account-error">{error}</p>}
      {notice&&<p role="status" className="t-account-notice">{notice}</p>}
    </section>
    {user&&<>
      <section className="t-account-panel" aria-labelledby="account-addresses-title">
        <div className="t-account-panel__head">
          <h2 id="account-addresses-title">عناوينك.</h2>
          <span>{addresses.length} عنوان</span>
        </div>
        {addresses.length?addresses.map(address=><article key={address.id} className="t-account-address">
          <strong>{address.label}</strong><p>{address.formatted_address}</p>
          <div className="t-account-actions">
            <button type="button" disabled={busy} onClick={()=>useAddress(address)}>استخدمه في الطلب</button>
            <button type="button" disabled={busy} onClick={()=>void deleteAddress(address)}>احذف</button>
          </div>
        </article>):<p>لسه مفيش عناوين محفوظة. اختار دبوس التوصيل في السلة واحفظه هنا.</p>}
        <div className="t-account-save">
          <label htmlFor="t-account-label">اسم العنوان</label>
          <input id="t-account-label" maxLength={40} value={addressLabel}
            onChange={e=>setAddressLabel(e.target.value)}/>
          <button className="t-account-button" type="button" disabled={busy||!customer.deliveryLocation||!customer.address.trim()}
            onClick={()=>void saveCurrentAddress()}>احفظ عنوان السلة الحالي</button>
          {!customer.deliveryLocation&&<Link href="/cart">حدّد مكان التوصيل من السلة ↗</Link>}
        </div>
      </section>
      <section className="t-account-panel t-account-panel--orders" aria-labelledby="account-orders-title">
        <div className="t-account-panel__head">
          <h2 id="account-orders-title">طلباتك.</h2>
          <span>{orders.length} طلب</span>
        </div>
        {historyMessage?<p role="status">{historyMessage}</p>:
          orders.length?orders.map(order=><article key={order.id} className="t-account-order">
            <div><strong>طلب #{order.order_number??order.id.slice(0,8)}</strong>
              <span>{order.status}</span></div>
            <p>{new Date(order.placed_at).toLocaleDateString('ar-EG')} · {order.order_type==='delivery'?'دليفري':'استلام'} · {order.total_estimate} ج.م</p>
            <Link href={'/order-success?orderId='+encodeURIComponent(order.id)}>شوف حالة الطلب ↗</Link>
          </article>):
          <p>أول طلب تعمله وأنت داخل حسابك هيظهر هنا بعد ربط سجل الطلبات.</p>}
      </section>
    </>}
  </div>;
}
