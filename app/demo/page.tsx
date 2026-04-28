import Link from 'next/link';
import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';

function normalizeWhatsappNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `20${digits.slice(1)}`;
  }
  return digits;
}

const currentFeatures = [
  'منيو أونلاين حقيقي بأسعار توسكانيني الفعلية.',
  'تصفح الأصناف حسب الأقسام.',
  'تخصيص المنتج قبل الطلب.',
  'سلة مشتريات كاملة.',
  'تدفق طلب واتساب جاهز.',
  'التحقق من رقم الموبايل المصري.',
  'إلزام تأكيد العميل قبل الإرسال.',
  'حالة الطلب الحالية: انتظار تأكيد المطعم.',
  'ميزة Food Finder لاختيار الوجبة.',
  'أزرار تواصل مباشرة.',
  'استقبال آراء العملاء عبر واتساب.',
  'استقبال الشكاوى عبر واتساب.',
  'صفحة عن توسكانيني وقصة المؤسسين الأربعة.',
  'تجربة Mobile-First من البداية.',
] as const;

const futureUpgrades = [
  'لوحة تحكم للإدارة.',
  'تعديل المنتجات والأسعار بسهولة.',
  'لوحة متابعة الطلبات.',
  'حالات الطلب: جديد / جاري التحضير / جاهز للاستلام / خرج للدليفري / تم التسليم / ملغي.',
  'شاشة تشغيل للمطبخ/التحضير والتسليم.',
  'إدارة العروض.',
  'مراجعة واعتماد آراء العملاء قبل النشر.',
  'لوحة متابعة الشكاوى.',
  'تقارير وتحليلات بسيطة واضحة.',
  'زر فتح/إغلاق الطلبات.',
  'خيار عربون/دفع مقدم للطلبات الكبيرة.',
  'قائمة حظر للعملاء المتسببين في طلبات وهمية.',
  'دومين رسمي + Google Maps + مواعيد عمل واضحة.',
] as const;

const ctaButtons = [
  { href: '/menu', label: 'افتح المنيو' },
  { href: '/food-finder', label: 'جرّب Food Finder' },
  { href: '/cart', label: 'افتح السلة' },
  { href: '/complaints', label: 'الشكاوى' },
  { href: '/reviews', label: 'آراء العملاء' },
] as const;

export default async function DemoPage() {
  const settings = await getRuntimePublicSiteSettings();
  const whatsappUrl = `https://wa.me/${normalizeWhatsappNumber(settings.whatsappOrderNumber)}?text=${encodeURIComponent(
    'مرحبًا توسكانيني 👋\nحابب أعرف تفاصيل التشغيل والتطوير للنظام.',
  )}`;

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <section className="rounded-3xl border-2 border-brand-dark bg-brand-yellow p-5 shadow-punch">
        <p className="text-xs font-extrabold text-brand-red">Owner Demo / عرض خاص بالإدارة</p>
        <h1 className="mt-2 text-2xl font-black text-brand-dark">عرض MVP الحالي وخطة الترقية المتقدمة</h1>
        <p className="mt-3 text-sm leading-7 text-brand-charcoal">
          هذه الصفحة مخصصة لعرض النسخة الحالية لصاحب المطعم وتوضيح التطويرات القادمة. ليست صفحة طلب موجهة للعميل النهائي.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border-2 border-brand-dark bg-brand-white p-4">
        <h2 className="text-xl font-black text-brand-dark">المزايا الحالية في الإنتاج (MVP)</h2>
        <ul className="space-y-2 text-sm font-semibold leading-7 text-brand-charcoal">
          {currentFeatures.map((feature) => (
            <li key={feature} className="rounded-xl bg-brand-yellow/40 px-3 py-2">
              ✅ {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border-2 border-brand-dark bg-brand-white p-4">
        <h2 className="text-xl font-black text-brand-dark">التطويرات القادمة (Advanced Upgrade Plan)</h2>
        <ul className="space-y-2 text-sm font-semibold leading-7 text-brand-charcoal">
          {futureUpgrades.map((feature) => (
            <li key={feature} className="rounded-xl bg-brand-red/10 px-3 py-2">
              🚀 {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border-2 border-brand-dark bg-brand-white p-4">
        <h2 className="text-xl font-black text-brand-dark">تجربة سريعة للعميل</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ctaButtons.map((button) => (
            <Link key={button.href} href={button.href} className="btn-primary text-center">
              {button.label}
            </Link>
          ))}

          <Link href={whatsappUrl} target="_blank" className="btn-secondary text-center">
            تواصل واتساب
          </Link>
        </div>
      </section>
    </div>
  );
}
