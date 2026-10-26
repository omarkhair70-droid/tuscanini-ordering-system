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
import { productCartIdentity } from '@/lib/rebirth/cart-product-identity';
import type { CartItem } from '@/types/cart';

type RuntimeSettings = { isOrderingOpen: boolean; deliveryEnabled: boolean; whatsappOrderNumber: string; studioMode?: boolean };
type ApiResult = { ok: true; orderId: string; reference?: string; orderNumber?: number | null; tableReference?: string | null }
  | { ok: false; error?: string; code?: string };
type ErrorField = 'name' | 'phone' | 'address' | 'confirmedAccurateDetails';
type Errors = Partial<Record<ErrorField, string>>;
const money = (value: number) => new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(value);
const cartLineName = (line: CartItem) =>
  line.kind === 'offer' ? 'عرض: '+line.offerTitle : productCartIdentity(line).name;

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
    if(settings?.isOrderingOpen && !settings.deliveryEnabled && customer.orderType==='delivery'){
      updateCustomer({orderType:'pickup'});
    }
  },[settings,customer.orderType,updateCustomer]);

  function validate(): Errors {
    const next: Errors = {};
    if (!customer.name.trim()) next.name = 'اكتب اسمك عشان المطعم يقدر يتواصل معاك.';
    if (!/^01\d{9}$/.test(customer.phone.replace(/\D/g, ''))) next.phone = 'اكتب رقم موبايل مصري من 11 رقم يبدأ بـ 01.';
    if (customer.orderType === 'delivery' && !customer.address.trim()) next.address = 'حدد المنطقة واكتب الشارع ورقم العمارة والمدخل.';
    if (customer.orderType === 'delivery' && customer.deliveryArea?.trim() &&
        customer.address.trim()===customer.deliveryArea.trim())
      next.address = 'عرفنا المنطقة تقريبًا. كمّل اسم الشارع ورقم العمارة والمدخل عشان الدليفري يوصل.';
    if (customer.orderType === 'delivery' && customer.deliveryLocation &&
        customer.address.length > 230) next.address = 'اختصر وصف العنوان عشان نضيف موقع الدبوس.';
    if (customer.orderType === 'delivery' && customer.deliveryLocation &&
        !customer.address.split('\nموقع التوصيل:')[0].trim())
      next.address = 'اكتب اسم الشارع ورقم العمارة أو علامة تساعد الدليفري يوصل.';
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
        deliveryLocation:customer.orderType==='delivery'?(customer.deliveryLocation??null):null,
      };
      const data={ customer:orderCustomer, items, subtotal, tableReference };
      const hash=JSON.stringify(data);
      if(!requestRef.current||requestRef.current.hash!==hash)
        requestRef.current={hash,key:'studio-'+crypto.randomUUID()};
      // Oracle customer identity lives in a first-party HttpOnly cookie.
      // The server verifies ownership; browser JS cannot read the session.
      const response = await fetch('/api/orders', {
        method: 'POST', credentials:'same-origin', headers: {'Content-Type': 'application/json'},
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
      !settings.isOrderingOpen ? 'تقدر تكمّل اختياراتك وعنوانك؛ إرسال الأوردر للمطعم متوقف حاليًا.' :
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
                <p>السلة محفوظة وتقدر تجهز عنوانك وموقعك وتكمل بياناتك. إرسال الأوردر للمطعم مش متاح دلوقتي.</p></div>
              <Link href="/contact">تواصل مع المطعم ↗</Link>
            </section>}
          {isHydrated && items.length>0 && settingsFailed &&
            <section className="t-checkout-availability" role="alert" aria-labelledby="t-checkout-availability-title">
              <div><h2 id="t-checkout-availability-title">مش قادرين نتحقق من استقبال الطلبات.</h2>
                <p>السلة محفوظة وتقدر تكمل تفاصيلها. الإرسال هيفضل متوقف لحد التحقق من اتصال المطعم.</p></div>
              <Link href="/contact">طرق التواصل ↗</Link>
            </section>}
          {isHydrated && items.length > 0 && (
            <nav className="t-checkout-quicknav" aria-label="اختصارات مراجعة الطلب">
              <div>
                <span>إجمالي الأصناف التقديري · {count} قطعة</span>
                <strong>{money(subtotal)} ج.م</strong>
              </div>
              <a href="#t-checkout-fields">كمّل التفاصيل <span aria-hidden="true">↓</span></a>
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
                        {line.kind==='product' && productCartIdentity(line).category &&
                           <span className="t-checkout-item__category">{productCartIdentity(line).category}</span>}
                        <h3>{cartLineName(line)}</h3>
                        {line.kind === 'product' && (
                          <div className="t-checkout-item__choices" aria-label={'اختيارات '+cartLineName(line)}>
                            {line.selectedSize?.label && <span><b>الحجم</b> {line.selectedSize.label}</span>}
                            {line.selectedAddons.length ?
                              line.selectedAddons.map(addon=><span key={addon.id}><b>إضافة</b> {addon.label}</span>)
                              : <span className="t-checkout-item__no-addons">بدون إضافات</span>}
                          </div>
                        )}
                        {line.itemNotes && <p className="t-checkout-item__notes">ملاحظات للمطعم: {line.itemNotes}</p>}
                        <strong>{money(line.totalItemPrice)} ج.م</strong>
                        <div className="t-checkout-item__controls">
                          {line.kind==='product'&&<Link
                            className="t-checkout-edit"
                            href={`/menu?editLine=${encodeURIComponent(line.lineId)}`}
                            aria-label={`تعديل الحجم والإضافات وملاحظات ${cartLineName(line)}`}>
                            تعديل التفاصيل ↗
                          </Link>}
                          <div className="t-checkout-stepper" role="group" aria-label={`كمية ${cartLineName(line)}`}>
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

                <section className="t-checkout-section" id="t-checkout-fields" aria-labelledby="t-cart-customer-title">
                  <div className="t-checkout-section__head"><span className="t-index">02 — بيانات الطلب</span><h2 id="t-cart-customer-title">تكمل إزاي؟</h2></div>
                  <div className="t-checkout-inputs">
                    <label>اسمك <input id="t-checkout-name" type="text" autoComplete="name" value={customer.name} aria-invalid={!!errors.name} aria-describedby={errors.name?'t-error-name':undefined}
                      onChange={e=>{updateCustomer({name:e.target.value});setErrors(x=>({...x,name:undefined}))}} placeholder="الاسم" maxLength={100}/></label>
                    {errors.name && <p id="t-error-name" className="t-checkout-error">{errors.name}</p>}
                    <label>رقم الموبايل <input id="t-checkout-phone" type="tel" inputMode="tel" autoComplete="tel" value={customer.phone} aria-invalid={!!errors.phone} aria-describedby={errors.phone?'t-error-phone':undefined}
                      onChange={e=>{updateCustomer({phone:e.target.value});setErrors(x=>({...x,phone:undefined}))}} placeholder="01xxxxxxxxx" maxLength={20}/></label>
                    {errors.phone && <p id="t-error-phone" className="t-checkout-error">{errors.phone}</p>}
                    <fieldset className="t-checkout-type" aria-describedby="t-checkout-service-note"><legend>هتستلم أوردرِك إزاي؟</legend><div>
                      <label><input type="radio" name="fulfillment" checked={customer.orderType==='delivery'} disabled={Boolean(settings?.isOrderingOpen&&!settings.deliveryEnabled)} onChange={()=>updateCustomer({orderType:'delivery'})}/><span>{settings?.deliveryEnabled?'دليفري':settings?.isOrderingOpen?'دليفري (غير متاح حاليًا)':'توصيل لعنوانك'}</span></label>
                      <label><input type="radio" name="fulfillment" checked={customer.orderType==='pickup'} onChange={()=>{updateCustomer({orderType:'pickup'});setErrors(x=>({...x,address:undefined}))}}/><span>استلام من المطعم</span></label>
                    </div></fieldset>
                    <p className="t-checkout-service-note" id="t-checkout-service-note" role="status">
                      {customer.orderType==='pickup'
                        ? (settings?.isOrderingOpen?'هتستلم بنفسك من المطعم. مش محتاجين عنوان توصيل.':'تقدر تجهز اختيار الاستلام أو عنوان الدليفري، وإرسال الطلبات متوقف حاليًا.')
                        : 'اختار موقعك على الخريطة واكتب الشارع ورقم العمارة والمدخل عشان الدليفري يوصل بدقة.'}
                    </p>
                    {customer.orderType==='delivery' && <>
                  <CustomerDeliveryPin onSelect={(point, area) => {
                    // GPS gives coordinates, and the optional reverse lookup
                    // suggests a neighborhood only. It cannot identify a
                    // building, apartment or doorstep without customer input.
                    const typed=customer.address.split('\nموقع التوصيل:')[0].trim();
                    const previouslySuggested=customer.deliveryArea?.trim()??'';
                    const safeArea=(area??'').trim().slice(0,130);
                    const address=(!typed || (previouslySuggested && typed===previouslySuggested))
                      ? safeArea : typed;
                    if(address.length>230){
                      setErrors(x=>({...x,address:'اختصر تفاصيل العنوان شوية عشان نحفظ الدبوس.'}));
                      return;
                    }
                    updateCustomer({address,deliveryLocation:point,deliveryArea:safeArea});
                    setErrors(x=>({...x,address:undefined}));
                  }} />
                  {customer.deliveryLocation && (
                    <div className="t-checkout-delivery-pin__selected" role="status">
                      <span aria-hidden="true">✓</span>
                      <span><strong>تم تثبيت نقطة التوصيل على الخريطة.</strong> الدليفري هيشوف الدبوس، وراجع العنوان المكتوب تحت.</span>
                      <a href={'https://www.google.com/maps/search/?api=1&query='+customer.deliveryLocation.lat+','+customer.deliveryLocation.lng}
                        target="_blank" rel="noopener noreferrer">شوف المكان ↗</a>
                    </div>
                  )}
                  {customer.deliveryArea && (
                    <div className="t-checkout-delivery-area" role="status">
                      <strong>الموقع التقريبي: {customer.deliveryArea}</strong>
                      <span>دي المنطقة المقترحة من الموقع، مش عنوان العمارة. كمّل بيانات المدخل.</span>
                    </div>
                  )}
                  <label>عنوان التوصيل <textarea id="t-checkout-address" rows={3} value={customer.address} aria-invalid={!!errors.address} aria-describedby={errors.address?'t-error-address':undefined}
                      onChange={e=>{updateCustomer({address:e.target.value});setErrors(x=>({...x,address:undefined}))}} placeholder="اسم الشارع، رقم العمارة، الدور والشقة، وأقرب علامة مميزة" maxLength={customer.deliveryLocation?230:300}/></label>
                      {errors.address && <p id="t-error-address" className="t-checkout-error">{errors.address}</p>}</>}
                    <label>ملاحظات عامة (اختياري) <textarea rows={2} value={customer.generalNotes} onChange={e=>updateCustomer({generalNotes:e.target.value})} maxLength={500} placeholder="أي تفاصيل تساعد المطعم"/></label>
                  </div>
                </section>
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
                  <h3>تدفع إزاي وقت الاستلام؟</h3>
                  <fieldset className="t-checkout-payment-methods">
                    <legend>اختار الطريقة المناسبة ليك</legend>
                    {[
                      {value:'cash',title:'كاش',hint:'تدفع عند الاستلام'},
                      {value:'instapay_on_handoff',title:'إنستا باي',hint:'تحويل وقت الاستلام'},
                      {value:'vodafone_cash_on_handoff',title:'فودافون كاش',hint:'تحويل وقت الاستلام'},
                    ].map(option => <label key={option.value} className="t-checkout-payment-method">
                      <input name="handoff-payment" type="radio" value={option.value}
                        checked={customer.paymentMethod===option.value}
                        onChange={() => updateCustomer({paymentMethod:option.value as typeof customer.paymentMethod})}/>
                      <span className="t-checkout-payment-method__copy"><strong>{option.title}</strong><small>{option.hint}</small></span>
                    </label>)}
                  </fieldset>
                  <p role="note">ده اختيار لطريقة الدفع وقت الاستلام، مش عملية دفع من الموقع. التحويل بيتم فقط بعد تأكيد تفاصيله مع المطعم.</p>
                  {customer.orderType==='delivery' &&
                    <p>رسوم التوصيل بتتحسب بعد اعتماد منطقة الدليفري؛ إجمالي الأصناف لوحده مش شاملها.</p>}
                </section>
                {tableReference && <p className="t-checkout-summary__table">مرجع الطاولة: {tableReference}</p>}
                <label className="t-checkout-confirm"><input id="t-checkout-confirm" type="checkbox" checked={customer.confirmedAccurateDetails}
                  onChange={e=>{updateCustomer({confirmedAccurateDetails:e.target.checked});setErrors(x=>({...x,confirmedAccurateDetails:undefined}))}}/>
                  <span>راجعت الأصناف وبيانات الطلب، وعارف إن الدفع مش بيتم من الموقع حاليًا.</span></label>
                {errors.confirmedAccurateDetails && <p className="t-checkout-error">{errors.confirmedAccurateDetails}</p>}
                <p className="t-checkout-status" role="status">{status}</p>
                {error && <p className="t-checkout-error t-checkout-error--large" role="alert">{error}</p>}
                <button type="submit" className="t-checkout-action t-checkout-action--full" disabled={disabled}
                  title={!settings?.isOrderingOpen?'إرسال الطلب للمطعم متوقف حاليًا':undefined}>
                  {sending ? 'بنرسل طلبك…' : uncertain ? 'راجع المطعم قبل إعادة الإرسال'
                    : settings?.isOrderingOpen ? 'سجّل الطلب للمطعم ↗' : 'إرسال الطلب متوقف حاليًا'}
                </button>
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
