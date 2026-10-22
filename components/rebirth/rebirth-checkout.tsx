'use client';

import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/cart-provider';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import { ActiveOrderBanner } from '@/components/shared/active-order-banner';
import { CustomerJourney } from '@/components/rebirth/customer-journey';
import { saveActiveOrder } from '@/lib/active-order-storage';

type RuntimeSettings = { isOrderingOpen: boolean; whatsappOrderNumber: string };
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

  const count = useMemo(() => items.reduce((sum, line) => sum + line.quantity, 0), [items]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadSettings() {
      try {
        const response = await fetch('/api/public/site-settings', { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error('settings-unavailable');
        const data = await response.json() as { ok?: boolean; settings?: RuntimeSettings };
        if (!data.ok || typeof data.settings?.isOrderingOpen !== 'boolean') throw new Error('settings-invalid');
        setSettings(data.settings);
      } catch {
        if (!controller.signal.aborted) setSettingsFailed(true);
      }
    }
    void loadSettings();
    return () => controller.abort();
  }, []);

  function validate(): Errors {
    const next: Errors = {};
    if (!customer.name.trim()) next.name = 'اكتب اسمك عشان المطعم يقدر يتواصل معاك.';
    if (!/^01\d{9}$/.test(customer.phone.replace(/\D/g, ''))) next.phone = 'اكتب رقم موبايل مصري من 11 رقم يبدأ بـ 01.';
    if (customer.orderType === 'delivery' && !customer.address.trim()) next.address = 'العنوان مطلوب للدليفري.';
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
      document.getElementById(hasContactError ? 't-checkout-fields' : 't-checkout-summary')?.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
    submitting.current = true;
    setSending(true);
    setError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, items, subtotal, tableReference }),
      });
      const payload = await response.json() as ApiResult;
      if (!response.ok || !payload.ok) {
        const reason = !payload.ok ? payload.error : null;
        if (response.status === 400 || response.status === 409) {
          setError(reason || 'محتاجين تراجع تفاصيل الطلب والأسعار الحالية.');
        } else {
          // Server/transport may have persisted the order before the error response.
          setUncertain(true);
          setError('مش قادرين نأكد إذا الطلب اتحفظ أو لأ. بلاش تعيد الإرسال دلوقتي؛ تواصل مع المطعم للتأكد عشان ما يتكررش.');
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
      clearCart();
      router.push(`/order-success?orderId=${encodeURIComponent(payload.orderId)}`);
    } catch {
      setUncertain(true);
      setError('الاتصال انقطع أثناء إرسال الطلب، ومش معروف إذا اتحفظ. احتفظ بالأصناف واتواصل مع المطعم قبل أي محاولة جديدة.');
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }

  const disabled = !isHydrated || !items.length || sending || uncertain || !settings?.isOrderingOpen;
  const status = settingsFailed ? 'تعذر التحقق من حالة استقبال الطلبات. الطلب الإلكتروني مش متاح مؤقتًا.' :
    !settings ? 'بنتحقق من استقبال الطلبات…' :
      !settings.isOrderingOpen ? 'المطعم موقف استقبال الطلبات حاليًا.' :
        'الطلب بيتسجل في النظام أولًا. تأكيد المطعم والتجهيز حالات منفصلة بتظهر لما تتسجل.';

  return (
    <div className="t-page t-checkout-page" dir="rtl">
      <a className="t-skip" href="#t-checkout-main">انتقل لبيانات الطلب</a>
      <ExperienceHeader />
      <main id="t-checkout-main">
        <header className="t-checkout-hero t-shell">
          <div className="t-checkout-hero__overline"><span>YOUR ORDER / TUSCANINI</span><span>من اختيار الأكل لتأكيده</span></div>
          <div className="t-checkout-hero__headline"><h1>على<br/><em>مزاجك.</em></h1>
            <div><span className="t-index">CART → DETAILS → RESTAURANT CONFIRMATION</span>
              <p>راجع تفاصيلك. بعد تسجيل الطلب تقدر تتابع تأكيد المطعم وحالة التجهيز لما تتسجل.</p></div>
          </div>
          <div className="t-checkout-hero__bottom"><span>01 / REVIEW YOUR FOOD</span><span>{count} قطعة في السلة</span></div>
        </header>

        <div className="t-shell t-checkout-content">
          <CustomerJourney stage="checkout" />
          <ActiveOrderBanner />
          {isHydrated && items.length > 0 && (
            <nav className="t-checkout-quicknav" aria-label="اختصارات مراجعة الطلب">
              <div>
                <span>إجمالي الأصناف التقديري · {count} قطعة</span>
                <strong>{money(subtotal)} ج.م</strong>
              </div>
              <a href="#t-checkout-fields">اكمل بياناتك <span aria-hidden="true">↓</span></a>
            </nav>
          )}
          {!isHydrated ? <div className="t-checkout-message" role="status">جاري تجهيز السلة…</div> : null}

          {isHydrated && !items.length ? (
            <section className="t-checkout-empty" aria-labelledby="t-cart-empty-title">
              <span className="t-index">YOUR CART / 00</span><h2 id="t-cart-empty-title">لسه مفيش<br/><em>حاجة هنا.</em></h2>
              <p>اختار اللي نفسك فيه من المنيو، وارجع هنا تكمل طلبك.</p>
              <Link href="/menu" className="t-checkout-action">افتح المنيو ↗</Link>
            </section>
          ) : null}

          {isHydrated && items.length > 0 ? (
            <form onSubmit={submit} noValidate className="t-checkout-grid">
              <div className="t-checkout-column">
                <section className="t-checkout-section" aria-labelledby="t-cart-items-title">
                  <div className="t-checkout-section__head"><span className="t-index">01 — YOUR FOOD</span><h2 id="t-cart-items-title">طلبك.</h2></div>
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

                <section className="t-checkout-section" id="t-checkout-fields" aria-labelledby="t-cart-customer-title">
                  <div className="t-checkout-section__head"><span className="t-index">02 — ABOUT YOU</span><h2 id="t-cart-customer-title">نوصلّك إزاي؟</h2></div>
                  <div className="t-checkout-inputs">
                    <label>اسمك <input type="text" autoComplete="name" value={customer.name} aria-invalid={!!errors.name} aria-describedby={errors.name?'t-error-name':undefined}
                      onChange={e=>{updateCustomer({name:e.target.value});setErrors(x=>({...x,name:undefined}))}} placeholder="الاسم" maxLength={100}/></label>
                    {errors.name && <p id="t-error-name" className="t-checkout-error">{errors.name}</p>}
                    <label>رقم الموبايل <input type="tel" inputMode="tel" autoComplete="tel" value={customer.phone} aria-invalid={!!errors.phone} aria-describedby={errors.phone?'t-error-phone':undefined}
                      onChange={e=>{updateCustomer({phone:e.target.value});setErrors(x=>({...x,phone:undefined}))}} placeholder="01xxxxxxxxx" maxLength={20}/></label>
                    {errors.phone && <p id="t-error-phone" className="t-checkout-error">{errors.phone}</p>}
                    <fieldset className="t-checkout-type"><legend>نوع الطلب</legend><div>
                      <label><input type="radio" name="fulfillment" checked={customer.orderType==='delivery'} onChange={()=>updateCustomer({orderType:'delivery'})}/><span>دليفري</span></label>
                      <label><input type="radio" name="fulfillment" checked={customer.orderType==='pickup'} onChange={()=>{updateCustomer({orderType:'pickup'});setErrors(x=>({...x,address:undefined}))}}/><span>استلام من المطعم</span></label>
                    </div></fieldset>
                    {customer.orderType==='delivery' && <><label>عنوان التوصيل <textarea rows={3} value={customer.address} aria-invalid={!!errors.address} aria-describedby={errors.address?'t-error-address':undefined}
                      onChange={e=>{updateCustomer({address:e.target.value});setErrors(x=>({...x,address:undefined}))}} placeholder="الشارع، المنطقة، علامة مميزة" maxLength={500}/></label>
                      {errors.address && <p id="t-error-address" className="t-checkout-error">{errors.address}</p>}</>}
                    <label>ملاحظات عامة (اختياري) <textarea rows={2} value={customer.generalNotes} onChange={e=>updateCustomer({generalNotes:e.target.value})} maxLength={500} placeholder="أي تفاصيل تساعد المطعم"/></label>
                  </div>
                </section>
              </div>

              <aside id="t-checkout-summary" className="t-checkout-summary" aria-labelledby="t-checkout-summary-title">
                <span className="t-index">03 — FINAL REVIEW</span>
                <h2 id="t-checkout-summary-title">الخلاصة.</h2>
                <div className="t-checkout-summary__line"><span>نوع الطلب</span><strong>{customer.orderType==='delivery'?'دليفري':'استلام من المطعم'}</strong></div>
                <div className="t-checkout-summary__line"><span>عدد القطع</span><strong>{count}</strong></div>
                <div className="t-checkout-summary__line"><span>إجمالي أصناف الطلب</span><strong>{money(subtotal)} ج.م</strong></div>
                <p className="t-checkout-summary__notice">الإجمالي ده حسب أسعار منيو توسكانيني السابق. لو اتغيّر سعر أو توافر صنف، السيرفر مش هيقبل طلب بسعر مختلف؛ هتحتاج تراجع التفاصيل. رسوم التوصيل بيتأكد منها المطعم.</p>
                {tableReference && <p className="t-checkout-summary__table">مرجع الطاولة: {tableReference}</p>}
                <label className="t-checkout-confirm"><input type="checkbox" checked={customer.confirmedAccurateDetails}
                  onChange={e=>{updateCustomer({confirmedAccurateDetails:e.target.checked});setErrors(x=>({...x,confirmedAccurateDetails:undefined}))}}/>
                  <span>راجعت الأصناف وبياناتي، وفاهم إن تسجيل الطلب مش معناه إن المطعم قبله أو إن التحضير بدأ.</span></label>
                {errors.confirmedAccurateDetails && <p className="t-checkout-error">{errors.confirmedAccurateDetails}</p>}
                <p className="t-checkout-status" role="status">{status}</p>
                {error && <p className="t-checkout-error t-checkout-error--large" role="alert">{error}</p>}
                <button type="submit" className="t-checkout-action t-checkout-action--full" disabled={disabled}>
                  {sending ? 'بنرسل طلبك…' : uncertain ? 'راجع المطعم قبل إعادة الإرسال' : 'سجّل الطلب للمطعم ↗'}</button>
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
