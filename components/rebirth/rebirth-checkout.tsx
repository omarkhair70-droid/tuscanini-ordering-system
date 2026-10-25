'use client';

import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/cart-provider';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import { ActiveOrderBanner } from '@/components/shared/active-order-banner';
import { CustomerJourney } from '@/components/rebirth/customer-journey';
import { CustomerDeliveryPin } from '@/components/rebirth/customer-delivery-pin';
import { saveActiveOrder } from '@/lib/active-order-storage';

type RuntimeSettings = { isOrderingOpen: boolean; deliveryEnabled: boolean; whatsappOrderNumber: string; studioMode?: boolean };
type ApiResult = { ok: true; orderId: string; reference?: string; orderNumber?: number | null; tableReference?: string | null }
  | { ok: false; error?: string; code?: string };
type ErrorField = 'name' | 'phone' | 'address' | 'confirmedAccurateDetails';
type Errors = Partial<Record<ErrorField, string>>;
const money = (value: number) => new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(value);

export function RebirthCheckout() {
  const router = useRouter();
  const { items, customer, tableReference, subtotal, updateItemQuantity, removeItem,
    clearCart, updateCustomer, isHydrated } = useCart();
  const [settings, setSettings] = useState<RuntimeSettings | null>(null);
  const [settingsFailed, setSettingsFailed] = useState(false);
  const [sending, setSending] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const submitting = useRef(false);
  const requestRef = useRef<{hash:string;key:string}|null>(null);

  const count = useMemo(() => items.reduce((sum, line) => sum + line.quantity, 0), [items]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadSettings() {
      try {
        const response = await fetch('/api/public/site-settings', { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error('settings-unavailable');
        const data = await response.json() as { ok?: boolean; settings?: RuntimeSettings };
        if (!data.ok || typeof data.settings?.isOrderingOpen !== 'boolean' || typeof data.settings?.deliveryEnabled !== 'boolean') throw new Error('settings-invalid');
        setSettings(data.settings);
      } catch {
        if (!controller.signal.aborted) setSettingsFailed(true);
      }
    }
    void loadSettings();
    return () => controller.abort();
  }, []);

  useEffect(()=>{
    // Return visits can restore an obsolete delivery selection in localStorage.
    // Switch to pickup rather than transmitting an unpriced delivery request.
    if(settings && !settings.deliveryEnabled && customer.orderType==='delivery'){
      updateCustomer({orderType:'pickup'});
    }
  },[settings,customer.orderType,updateCustomer]);

  function validate(): Errors {
    const next: Errors = {};
    if (!customer.name.trim()) next.name = 'اكتب اسمك عشان المطعم يقدر يتواصل معاك.';
    if (!/^01\d{9}$/.test(customer.phone.replace(/\D/g, ''))) next.phone = 'اكتب رقم موبايل مصري من 11 رقم يبدأ بـ 01.';
    if (customer.orderType === 'delivery' && !customer.address.trim()) next.address = 'العنوان مطلوب للدليفري.';
    else if (customer.orderType === 'delivery' && customer.address.trim().length > 300) next.address = 'العنوان أطول من الحد المسموح (٣٠٠ حرف).';
    if (!customer.confirmedAccurateDetails) next.confirmedAccurateDetails = 'أكد صحة البيانات قبل الإرسال.';
    return next;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || uncertain || !settings?.isOrderingOpen || items.length === 0) return;
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) {
      const hasContactError = Boolean(validation.name || validation.phone || validation.address);
      const firstField=validation.name?'t-checkout-name':validation.phone?'t-checkout-phone':
        validation.address?'t-checkout-address':null;
      const target=document.getElementById(firstField??'t-checkout-confirm');
      if(target){
        // Focus the ACTUAL invalid control. Scrolling the entire section after
        // focusing would hide address errors below the phone fields on mobile.
        target.focus();
        target.scrollIntoView({behavior:'auto',block:'center'});
      }else document.getElementById(hasContactError?'t-checkout-fields':'t-checkout-summary')
        ?.scrollIntoView({behavior:'auto',block:'start'});
      return;
    }
    submitting.current = true;
    setSending(true);
    setError('');
    try {
      // Stable key per exact choice+contact payload enables safe retry in staging.
      // A pickup draft may retain a previously typed delivery address for
      // convenience if the customer switches back. Never send that address
      // to the restaurant when the selected fulfillment is pickup.
      const orderCustomer={
        ...customer,
        address:customer.orderType==='delivery'?customer.address.trim():'',
      };
      const data={ customer:orderCustomer, items, subtotal, tableReference };
      const hash=JSON.stringify(data);
      if(!requestRef.current||requestRef.current.hash!==hash)
        requestRef.current={hash,key:'studio-'+crypto.randomUUID()};
      const response = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, requestKey:requestRef.current.key }),
      });
      const payload = await response.json() as ApiResult;
      if (!response.ok || !payload.ok) {
        const reason = !payload.ok ? payload.error : null;
        if (response.status === 400 || response.status === 409) {
          setError(reason || 'محتاجين تراجع تفاصيل الطلب والأسعار الحالية.');
        } else {
          // Server/transport may have persisted the order before the error response.
          setUncertain(!settings?.studioMode);
          setError(settings?.studioMode?'في مشكلة في الاتصال بالتجربة، جرّب الإرسال مرة تانية بنفس الطلب.':'مش قادرين نأكد إذا الطلب اتحفظ أو لأ. بلاش تعيد الإرسال دلوقتي؛ تواصل مع المطعم للتأكد عشان ما يتكررش.');
        }
        return;
      }
      try {
        saveActiveOrder({
          orderId: payload.orderId,
          reference: payload.reference ?? (payload.orderNumber ? `#${payload.orderNumber}` : payload.orderId),
          tableReference: payload.tableReference ?? tableReference,
          createdAt: new Date().toISOString(),
        });
      } catch {
        // Storage is optional; a persisted server order is still successful.
      }
      requestRef.current=null;
      clearCart();
      router.push(`/order-success?orderId=${encodeURIComponent(payload.orderId)}`);
    } catch {
      setUncertain(!settings?.studioMode);
      setError(settings?.studioMode?'الاتصال بالتجربة اتقطع، جرّب تاني.':'الاتصال انقطع أثناء إرسال الطلب، ومش معروف إذا اتحفظ. احتفظ بالأصناف واتواصل مع المطعم قبل أي محاولة جديدة.');
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }

  const disabled = !isHydrated || !items.length || sending || uncertain || !settings?.isOrderingOpen;
  const status = settingsFailed ? 'تعذر التحقق من حالة استقبال الطلبات. الطلب الإلكتروني مش متاح مؤقتًا.' :
    !settings ? 'بنتحقق من استقبال الطلبات…' :
      !settings.isOrderingOpen ? 'المطعم موقف استقبال الطلبات حاليًا.' :
        'جاهز تسجل طلبك؟ هتقدر تتابعه بعد الإرسال.';

  return (
    <div className={'t-page t-checkout-page'+(isHydrated&&items.length?' t-checkout-page--filled':'')} dir="rtl">
      <a className="t-skip" href="#t-checkout-main">انتقل لبيانات الطلب</a>
      <ExperienceHeader />
      <main id="t-checkout-main">
        <header className="t-checkout-hero t-shell">
          <div className="t-checkout-hero__overline"><span>طلبك من توسكانيني</span><span>من اختيار الأكل لتأكيده</span></div>
          <div className="t-checkout-hero__headline"><h1>على<br/><em>مزاجك.</em></h1>
            <div><span className="t-index">راجع طلبك وبياناتك</span>
              <p>راجع أكلك وبياناتك، وبعد الإرسال تابع الطلب خطوة بخطوة.</p></div>
          </div>
          <div className="t-checkout-hero__bottom"><span>01 / راجع اختياراتك</span><span>{count} قطعة في السلة</span></div>
        </header>

        <div className="t-shell t-checkout-content">
          <CustomerJourney stage="checkout" />
          <ActiveOrderBanner />
          {isHydrated && items.length>0 && settings && !settings.isOrderingOpen &&
            <section className="t-checkout-availability" role="status" aria-labelledby="t-checkout-availability-title">
              <div><span className="t-index">حالة استقبال الطلبات</span>
                <h2 id="t-checkout-availability-title">الطلبات أونلاين متوقفة حاليًا.</h2>
                <p>السلة محفوظة عندك وتقدر تعدّل اختياراتك. لتأكيد الأسعار والتوفر أو الطلب مباشرة، تواصل مع المطعم.</p></div>
              <Link href="/contact">تواصل مع المطعم ↗</Link>
            </section>}
          {isHydrated && items.length>0 && settingsFailed &&
            <section className="t-checkout-availability" role="alert" aria-labelledby="t-checkout-availability-title">
              <div><h2 id="t-checkout-availability-title">مش قادرين نتحقق من استقبال الطلبات.</h2>
                <p>السلة محفوظة عندك. تواصل مع المطعم قبل إرسال أي طلب.</p></div>
              <Link href="/contact">طرق التواصل ↗</Link>
            </section>}
          {isHydrated && items.length > 0 && (
            <nav className="t-checkout-quicknav" aria-label="اختصارات مراجعة الطلب">
              <div>
                <span>إجمالي الأصناف التقديري · {count} قطعة</span>
                <strong>{money(subtotal)} ج.م</strong>
              </div>
              {(settingsFailed || (settings && !settings.isOrderingOpen))
                ? <Link href="/contact">تواصل مع المطعم ↗</Link>
                : settings?.isOrderingOpen
                  ? <a href="#t-checkout-fields">اكمل بياناتك <span aria-hidden="true">↓</span></a>
                  : <span role="status">بنتحقق من استقبال الطلبات…</span>}
            </nav>
          )}
          {!isHydrated ? <div className="t-checkout-message" role="status">جاري تجهيز السلة…</div> : null}

          {isHydrated && !items.length ? (
            <section className="t-checkout-empty" aria-labelledby="t-cart-empty-title">
              <span className="t-index">السلة فاضية</span><h2 id="t-cart-empty-title">لسه مفيش<br/><em>حاجة هنا.</em></h2>
              <p>اختار اللي نفسك فيه من المنيو، وارجع هنا تكمل طلبك.</p>
              <Link href="/menu" className="t-checkout-action">افتح المنيو ↗</Link>
            </section>
          ) : null}

          {isHydrated && items.length > 0 ? (
            <form onSubmit={submit} noValidate className="t-checkout-grid">
              <div className="t-checkout-column">
                <section className="t-checkout-section" aria-labelledby="t-cart-items-title">
                  <div className="t-checkout-section__head"><span className="t-index">01 — أصنافك</span><h2 id="t-cart-items-title">طلبك.</h2></div>
                  {items.map((line, index) => (
                    <article key={line.lineId} className="t-checkout-item">
                      <div className="t-checkout-item__number" lang="en">{String(index+1).padStart(2, '0')}</div>
                      <div className="t-checkout-item__details">
                        <h3>{line.kind === 'offer' ? `عرض: ${line.offerTitle}` : line.productName}</h3>
                        {line.kind === 'product' && (
                          <p>الحجم: {line.selectedSize?.label ?? 'بدون حجم'} · الإضافات: {line.selectedAddons.length ? line.selectedAddons.map(a=>a.label).join('، ') : 'بدون إضافات'}</p>
                        )}
                        {line.itemNotes && <p>ملاحظات: {line.itemNotes}</p>}
                        <strong>{money(line.totalItemPrice)} ج.م</strong>
                        <div className="t-checkout-item__controls">
                          {line.kind==='product'&&<Link
                            className="t-checkout-edit"
                            href={`/menu?editLine=${encodeURIComponent(line.lineId)}`}
                            aria-label={`تعديل الحجم والإضافات وملاحظات ${line.productName}`}>
                            تعديل التفاصيل ↗
                          </Link>}
                          <div className="t-checkout-stepper" role="group" aria-label={`كمية ${line.kind === 'offer' ? line.offerTitle : line.productName}`}>
                            <button type="button" aria-label="تقليل الكمية" disabled={line.quantity<=1 || sending || uncertain} onClick={()=>updateItemQuantity(line.lineId,Math.max(1,line.quantity-1))}>−</button>
                            <output aria-live="polite">{line.quantity}</output>
                            <button type="button" aria-label="زيادة الكمية" disabled={line.quantity>=50 || sending || uncertain} onClick={()=>updateItemQuantity(line.lineId,Math.min(50,line.quantity+1))}>+</button>
                          </div>
                          <button type="button" className="t-checkout-remove" disabled={sending || uncertain} onClick={()=>removeItem(line.lineId)}>احذف الصنف</button>
                        </div>
                      </div>
                    </article>
                  ))}
                  <Link href="/menu" className="t-checkout-textlink">+ ضيف أصناف تانية</Link>
                </section>

                {settings?.isOrderingOpen && <section className="t-checkout-section" id="t-checkout-fields" aria-labelledby="t-cart-customer-title">
                  <div className="t-checkout-section__head"><span className="t-index">02 — بيانات الطلب</span><h2 id="t-cart-customer-title">تكمل إزاي؟</h2></div>
                  <div className="t-checkout-inputs">
                    <label>اسمك <input id="t-checkout-name" type="text" autoComplete="name" value={customer.name} aria-invalid={!!errors.name} aria-describedby={errors.name?'t-error-name':undefined}
                      onChange={e=>{updateCustomer({name:e.target.value});setErrors(x=>({...x,name:undefined}))}} placeholder="الاسم" maxLength={100}/></label>
                    {errors.name && <p id="t-error-name" className="t-checkout-error">{errors.name}</p>}
                    <label>رقم الموبايل <input id="t-checkout-phone" type="tel" inputMode="tel" autoComplete="tel" value={customer.phone} aria-invalid={!!errors.phone} aria-describedby={errors.phone?'t-error-phone':undefined}
                      onChange={e=>{updateCustomer({phone:e.target.value});setErrors(x=>({...x,phone:undefined}))}} placeholder="01xxxxxxxxx" maxLength={20}/></label>
                    {errors.phone && <p id="t-error-phone" className="t-checkout-error">{errors.phone}</p>}
                    <fieldset className="t-checkout-type" aria-describedby="t-checkout-service-note"><legend>هتستلم أوردرِك إزاي؟</legend><div>
                      <label><input type="radio" name="fulfillment" checked={customer.orderType==='delivery'} disabled={!settings?.deliveryEnabled} onChange={()=>updateCustomer({orderType:'delivery'})}/><span>{settings?.deliveryEnabled?'دليفري':'دليفري (غير متاح حاليًا)'}</span></label>
                      <label><input type="radio" name="fulfillment" checked={customer.orderType==='pickup'} onChange={()=>{updateCustomer({orderType:'pickup'});setErrors(x=>({...x,address:undefined}))}}/><span>استلام من المطعم</span></label>
                    </div></fieldset>
                    <p className="t-checkout-service-note" id="t-checkout-service-note" role="status">
                      {customer.orderType==='pickup'
                        ? (settings?.deliveryEnabled?'هتستلم بنفسك من المطعم. مش محتاجين عنوان توصيل، وتقدر تتابع حالة التجهيز بعد تسجيل الطلب.':'الطلب متاح للاستلام من المطعم فقط حاليًا. الدليفري هيتفتح بعد تحديد المناطق والرسوم.')
                        : 'اكتب عنوان واضح. المطعم محتاج يتأكد من إمكانية التوصيل وأي رسوم قبل تأكيد الطلب.'}
                    </p>
                    {customer.orderType==='delivery' && <>
                  <CustomerDeliveryPin onSelect={point => {
                    // Attach the exact map pin to the existing persisted order
                    // address field. No new backend schema/transport assumptions.
                    const street=customer.address.split('\nموقع التوصيل:')[0].trim();
                    const mapLink='https://maps.google.com/?q='+point.lat+','+point.lng;
                    const locationLine='موقع التوصيل: '+mapLink;
                    const next=[street, locationLine].filter(Boolean).join('\n');
                    if(next.length>300){
                      setErrors(x=>({...x,address:'اختصر وصف العنوان عشان نضيف رابط الدبوس.'}));
                      return;
                    }
                    updateCustomer({address:next});
                    setErrors(x=>({...x,address:undefined}));
                  }} />
                  {customer.address.includes('موقع التوصيل: https://maps.google.com/?q=') && (
                    <p className="t-checkout-delivery-pin__selected" role="status">
                      <span aria-hidden="true">✓</span> تم تحديد الدبوس. موقعه هيتبعت مع عنوان الطلب.
                    </p>
                  )}
                  <label>عنوان التوصيل <textarea id="t-checkout-address" rows={3} value={customer.address} aria-invalid={!!errors.address} aria-describedby={errors.address?'t-error-address':undefined}
                      onChange={e=>{updateCustomer({address:e.target.value});setErrors(x=>({...x,address:undefined}))}} placeholder="الشارع، المنطقة، علامة مميزة" maxLength={300}/></label>
                      {errors.address && <p id="t-error-address" className="t-checkout-error">{errors.address}</p>}</>}
                    <label>ملاحظات عامة (اختياري) <textarea rows={2} value={customer.generalNotes} onChange={e=>updateCustomer({generalNotes:e.target.value})} maxLength={500} placeholder="أي تفاصيل تساعد المطعم"/></label>
                  </div>
                </section>}
              </div>

              <aside id="t-checkout-summary" className="t-checkout-summary" aria-labelledby="t-checkout-summary-title">
                <span className="t-index">03 — المراجعة الأخيرة</span>
                <h2 id="t-checkout-summary-title">الخلاصة.</h2>
                <div className="t-checkout-summary__line"><span>نوع الطلب</span><strong>{customer.orderType==='delivery'?'دليفري':'استلام من المطعم'}</strong></div>
                <div className="t-checkout-summary__line"><span>عدد القطع</span><strong>{count}</strong></div>
                <div className="t-checkout-summary__line"><span>رسوم التوصيل</span><strong data-testid="checkout-delivery-fee">{customer.orderType==='pickup'?'لا توجد رسوم توصيل':'لسه مش محددة'}</strong></div>
                <div className="t-checkout-summary__food-total">
                  <span>إجمالي الأصناف فقط</span><strong>{money(subtotal)} ج.م</strong>
                </div>
                <section className="t-checkout-payment-note" aria-label="التكلفة وطريقة الدفع">
                  <span className="t-index">طريقة الدفع</span>
                  <h3>الدفع مش بيتم هنا.</h3>
                  <p>هتسجّل طلبك هنا، لكن الدفع مش إلكتروني. اتأكد من طريقة الدفع مع المطعم.</p>
                  <p>{customer.orderType==='pickup'
                    ? 'الاستلام من المطعم، من غير رسوم توصيل. الإجمالي ده للأصناف بس.'
                    : 'رسوم الدليفري والمنطقة المتاحة محتاجين تأكيد المطعم؛ إجمالي الأصناف مش السعر النهائي شامل التوصيل.'}</p>
                  <p>الأسعار المعروضة محتاجة تأكيد من المطعم.</p>
                </section>
                {tableReference && <p className="t-checkout-summary__table">مرجع الطاولة: {tableReference}</p>}
                {settings?.isOrderingOpen && <label className="t-checkout-confirm"><input id="t-checkout-confirm" type="checkbox" checked={customer.confirmedAccurateDetails}
                  onChange={e=>{updateCustomer({confirmedAccurateDetails:e.target.checked});setErrors(x=>({...x,confirmedAccurateDetails:undefined}))}}/>
                  <span>راجعت الأصناف وبيانات الطلب، وفاهم إن السعر النهائي وطريقة الدفع هيتأكدوا مع المطعم.</span></label>}
                {errors.confirmedAccurateDetails && <p className="t-checkout-error">{errors.confirmedAccurateDetails}</p>}
                <p className="t-checkout-status" role="status">{status}</p>
                {error && <p className="t-checkout-error t-checkout-error--large" role="alert">{error}</p>}
                {(settingsFailed || (settings && !settings.isOrderingOpen))
                  ? <Link href="/contact" className="t-checkout-action t-checkout-action--full">تواصل مع المطعم ↗</Link>
                  : <button type="submit" className="t-checkout-action t-checkout-action--full" disabled={disabled}>
                    {sending ? 'بنرسل طلبك…' : uncertain ? 'راجع المطعم قبل إعادة الإرسال' : 'سجّل الطلب للمطعم ↗'}</button>}
                <Link href="/contact" className="t-checkout-summary__support">محتاج مساعدة أو تتأكد من طلبك؟</Link>
              </aside>
            </form>
          ) : null}
        </div>
      </main>
      <ExperienceFooter />
    </div>
  );
}
