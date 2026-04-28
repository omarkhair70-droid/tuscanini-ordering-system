import { PageHero } from '@/components/shared/page-hero';
import { getSiteSettingsSingletonOrThrow } from '@/lib/admin/site-settings-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getParamValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default async function AdminSettingsPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const saveSuccessMessage = getParamValue(resolvedSearchParams.save_success);
  const saveErrorMessage = getParamValue(resolvedSearchParams.save_error);

  const result = await getSiteSettingsSingletonOrThrow()
    .then((data) => ({ data, error: null as string | null }))
    .catch((error: unknown) => ({
      data: null,
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء تحميل إعدادات الموقع.',
    }));

  if (result.error || !result.data) {
    return (
      <div className="space-y-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-900">
        <h1 className="text-xl font-black">تعذر تحميل إعدادات الموقع</h1>
        <p className="text-sm">{result.error ?? 'حدث خطأ غير معروف.'}</p>
      </div>
    );
  }

  const settings = result.data;

  return (
    <div className="space-y-6" dir="rtl">
      <PageHero
        title="إعدادات الموقع"
        subtitle="إدارة حالة استقبال الطلبات وبيانات التواصل العامة من لوحة الإدارة."
      />

      {saveSuccessMessage ? (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{saveSuccessMessage}</p>
      ) : null}

      {saveErrorMessage ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">{saveErrorMessage}</p>
      ) : null}

      {!settings.is_ordering_open ? (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <h2 className="text-base font-black">تنبيه إداري: استقبال الطلبات متوقف الآن</h2>
          <p className="mt-1 text-sm">العملاء قد لا يتمكنون من إكمال الطلبات إذا تم تطبيق هذا الإعداد على الواجهة العامة في مرحلة لاحقة.</p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <form action="/admin/settings/api" method="post" className="space-y-5">
          <section className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <h2 className="text-base font-black text-slate-900">حالة الطلبات</h2>
            <p className="text-xs text-slate-600">يمكن إغلاق استقبال الطلبات مؤقتًا عند الحاجة.</p>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-300 p-3 text-sm">
                <input
                  type="radio"
                  name="is_ordering_open"
                  value="true"
                  defaultChecked={settings.is_ordering_open}
                  className="mt-1"
                />
                <span>
                  <strong className="block text-slate-900">مفتوح</strong>
                  <span className="text-slate-600">السماح باستقبال الطلبات.</span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-300 p-3 text-sm">
                <input
                  type="radio"
                  name="is_ordering_open"
                  value="false"
                  defaultChecked={!settings.is_ordering_open}
                  className="mt-1"
                />
                <span>
                  <strong className="block text-slate-900">مغلق</strong>
                  <span className="text-slate-600">إيقاف استقبال الطلبات مؤقتًا.</span>
                </span>
              </label>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <h2 className="text-base font-black text-slate-900">واتساب الطلبات</h2>
            <label className="block space-y-1 text-sm">
              <span className="font-bold text-slate-800">رقم واتساب الطلبات</span>
              <input
                type="tel"
                name="whatsapp_order_number"
                required
                defaultValue={settings.whatsapp_order_number}
                placeholder="01xxxxxxxxx"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-left outline-none ring-brand-red/30 transition focus:border-brand-red focus:ring"
                dir="ltr"
              />
            </label>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <h2 className="text-base font-black text-slate-900">أرقام التواصل</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1 text-sm">
                <span className="font-bold text-slate-800">رقم الهاتف الأساسي</span>
                <input
                  type="tel"
                  name="phone_primary"
                  required
                  defaultValue={settings.phone_primary}
                  placeholder="01xxxxxxxxx"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-left outline-none ring-brand-red/30 transition focus:border-brand-red focus:ring"
                  dir="ltr"
                />
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-bold text-slate-800">رقم الهاتف الثانوي (اختياري)</span>
                <input
                  type="tel"
                  name="phone_secondary"
                  defaultValue={settings.phone_secondary}
                  placeholder="01xxxxxxxxx"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-left outline-none ring-brand-red/30 transition focus:border-brand-red focus:ring"
                  dir="ltr"
                />
              </label>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <h2 className="text-base font-black text-slate-900">العنوان</h2>
            <label className="block space-y-1 text-sm">
              <span className="font-bold text-slate-800">العنوان بالعربية</span>
              <textarea
                name="address_ar"
                required
                maxLength={280}
                defaultValue={settings.address_ar}
                rows={3}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-brand-red/30 transition focus:border-brand-red focus:ring"
              />
            </label>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <h2 className="text-base font-black text-slate-900">رابط فيسبوك</h2>
            <label className="block space-y-1 text-sm">
              <span className="font-bold text-slate-800">رابط الصفحة (اختياري)</span>
              <input
                type="url"
                name="facebook_url"
                defaultValue={settings.facebook_url}
                placeholder="https://www.facebook.com/..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-left outline-none ring-brand-red/30 transition focus:border-brand-red focus:ring"
                dir="ltr"
              />
            </label>
          </section>

          <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">آخر تحديث: {formatDate(settings.updated_at)}</p>
            <button
              type="submit"
              className="rounded-xl bg-brand-red px-4 py-2 text-sm font-black text-white transition hover:opacity-90"
            >
              حفظ الإعدادات
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
