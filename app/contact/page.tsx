import type { Metadata } from 'next';
import Link from 'next/link';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';
import '../rebirth-home.css';
import '../rebirth-contact.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'المكان والتواصل | توسكانيني — بني سويف',
  description: 'عنوان توسكانيني في بني سويف، وأرقام التواصل، وطرق الوصول للمطعم مباشرة.',
};

function phoneDigits(raw: string): string | null {
  const normalized = raw.replace(/\D/g, '');
  return /^\d{7,15}$/.test(normalized) ? normalized : null;
}
function whatsappDigits(raw: string): string | null {
  const digits = phoneDigits(raw);
  if (!digits) return null;
  const international = digits.startsWith('0') ? `20${digits.slice(1)}` : digits;
  return /^\d{10,15}$/.test(international) ? international : null;
}
function trustedFacebookUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && ['facebook.com', 'www.facebook.com', 'm.facebook.com'].includes(url.hostname)
      ? url.href : null;
  } catch { return null; }
}

export default async function ContactPage() {
  const settings = await getRuntimePublicSiteSettings();
  const phones = [settings.phonePrimary, settings.phoneSecondary]
    .filter((number, index, all) => Boolean(phoneDigits(number)) && all.indexOf(number) === index);
  const whatsapp = whatsappDigits(settings.whatsappOrderNumber);
  const facebook = trustedFacebookUrl(settings.facebookUrl);
  const address = settings.addressAr.trim() || 'بني سويف — اسأل المطعم عن العنوان الدقيق';

  return (
    <div className="t-page t-contact-page" dir="rtl">
      <a href="#t-contact-main" className="t-skip">انتقل لبيانات التواصل</a>
      <ExperienceHeader />
      <main id="t-contact-main">
        <section className="t-contact-hero" aria-labelledby="t-contact-title">
          <div className="t-contact-hero__grid t-shell">
            <div className="t-contact-hero__main">
              <div className="t-contact-hero__overline"><span>المكان والتواصل</span><span lang="en">TUSCANINI / BENI SUEF</span></div>
              <div>
                <span className="t-index">01 — FIND US / TALK TO US</span>
                <h1 id="t-contact-title">تعالى<br/><em>لحد عندنا.</em></h1>
                <p>عنوان توسكانيني وطرق التواصل المباشرة. اختار اللي يناسبك من غير لفّ ولا خطوات زيادة.</p>
              </div>
              <a className="t-contact-hero__jump" href="#t-contact-methods">كل طرق التواصل <span aria-hidden="true">↓</span></a>
            </div>
            <div className="t-contact-hero__place">
              <span className="t-contact-hero__placemark" lang="en">BS / 01</span>
              <div className="t-contact-hero__place-copy">
                <span className="t-index" lang="en">WHERE TO FIND US</span>
                <h2>بني<br/>سويف.</h2>
                <p>{address}</p>
              </div>
              <div className="t-contact-hero__place-foot">
                <span>ده العنوان المسجّل عندنا، مش دبوس خريطة دقيق.</span>
                <Link href="/about">شوف حكاية المكان <span aria-hidden="true">↗</span></Link>
              </div>
              <span className="t-contact-hero__mark" lang="en" aria-hidden="true">T.</span>
            </div>
          </div>
        </section>
        <section className="t-contact-methods t-shell" id="t-contact-methods" aria-labelledby="t-contact-methods-title">
          <div className="t-contact-methods__head">
            <span className="t-index" lang="en">02 / DIRECT CONTACT</span>
            <div><h2 id="t-contact-methods-title">كل الطرق <em>مباشرة.</em></h2>
              <p>لو بتسأل عن طلب، عنوان، أو أي تفصيلة، دي وسائل التواصل المسجلة للمطعم.</p>
            </div>
          </div>
          <div className="t-contact-methods__rows">
            <div className="t-contact-method">
              <div><span className="t-contact-method__index" lang="en">01 / CALL</span><h3>التليفون</h3></div>
              <div className="t-contact-method__links">
                {phones.length ? phones.map((number, i) => (
                  <a key={number} href={`tel:${phoneDigits(number)}`} aria-label={`اتصل بتوسكانيني على الرقم ${number}`}>
                    <span dir="ltr">{number}</span><span aria-hidden="true">↗</span><span className="sr-only">{i===0?'الرقم الأول':'الرقم الثاني'}</span>
                  </a>
                )) : <p>أرقام التليفون مش متاحة دلوقتي.</p>}
              </div>
            </div>
            <div className="t-contact-method">
              <div><span className="t-contact-method__index" lang="en">02 / MESSAGE</span><h3>واتساب</h3></div>
              <div className="t-contact-method__links">
                {whatsapp ? <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">راسل توسكانيني <span aria-hidden="true">↗</span></a> : <p>رقم واتساب مش متاح دلوقتي.</p>}
              </div>
            </div>
            <div className="t-contact-method">
              <div><span className="t-contact-method__index" lang="en">03 / FOLLOW</span><h3>فيسبوك</h3></div>
              <div className="t-contact-method__links">
                {facebook ? <a href={facebook} target="_blank" rel="noopener noreferrer">افتح صفحة توسكانيني <span aria-hidden="true">↗</span></a> : <p>رابط صفحة المطعم مش متاح دلوقتي.</p>}
              </div>
            </div>
          </div>
        </section>
        <section className="t-contact-unknown" aria-labelledby="t-contact-before-title">
          <div className="t-shell t-contact-unknown__inner">
            <div>
              <span className="t-index" lang="en">BEFORE YOU GO</span>
              <h2 id="t-contact-before-title">قبل ما تتحرك.</h2>
              <p>مواعيد العمل ونطاق التوصيل ودبوس الخريطة الدقيق لسه محتاجين تأكيد. اسأل المطعم مباشرة قبل الزيارة.</p>
            </div>
            <div className="t-contact-unknown__links">
              <Link href="/menu">المنيو <span aria-hidden="true">↗</span></Link>
              <Link href="/complaints">عندك مشكلة؟ <span aria-hidden="true">↗</span></Link>
              <Link href="/reviews">شارك رأيك <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
      </main>
      <ExperienceFooter />
    </div>
  );
}
