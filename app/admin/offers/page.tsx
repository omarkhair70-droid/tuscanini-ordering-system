import { PageHero } from '@/components/shared/page-hero';
import { getAdminOffersOrThrow } from '@/lib/admin/offers-admin-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toDatetimeLocal(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function AdminOffersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const success = typeof params.action_success === 'string' ? params.action_success : '';
  const error = typeof params.action_error === 'string' ? params.action_error : '';

  const result = await getAdminOffersOrThrow()
    .then((data) => ({ data, error: null as string | null }))
    .catch((loadError: unknown) => ({
      data: [],
      error: loadError instanceof Error ? loadError.message : 'تعذر تحميل العروض.',
    }));

  return (
    <div className="space-y-6">
      <PageHero title="إدارة العروض" subtitle="إنشاء وتعديل وتفعيل عروض الموقع بشكل آمن." />

      {success ? <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{success}</p> : null}
      {error ? <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p> : null}
      {result.error ? <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">{result.error}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-black text-slate-900">إضافة عرض جديد</h2>
        <form action="/admin/offers/api/offers" method="post" className="grid gap-3 md:grid-cols-2">
          <input name="title_ar" placeholder="عنوان العرض" required className="rounded-xl border border-slate-300 px-3 py-2" />
          <input name="badge_ar" placeholder="شارة العرض (اختياري)" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input name="price_text" placeholder="نص السعر (اختياري)" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input name="sort_order" type="number" defaultValue={0} className="rounded-xl border border-slate-300 px-3 py-2" />
          <input name="starts_at" type="datetime-local" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input name="ends_at" type="datetime-local" className="rounded-xl border border-slate-300 px-3 py-2" />
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" name="is_active" value="true" /> تفعيل العرض فورًا
          </label>
          <textarea name="description_ar" placeholder="وصف العرض (اختياري)" className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" rows={3} />
          <button type="submit" className="rounded-xl bg-brand-red px-4 py-2 text-sm font-black text-white md:col-span-2">حفظ العرض</button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">العروض الحالية</h2>
        {result.data.length === 0 ? <p className="surface-card-soft">لا توجد عروض بعد.</p> : null}
        {result.data.map((offer) => (
          <article key={offer.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <form action={`/admin/offers/api/offers/${offer.id}`} method="post" className="grid gap-3 md:grid-cols-2">
              <input name="intent" type="hidden" value="update" />
              <input name="title_ar" defaultValue={offer.titleAr} required className="rounded-xl border border-slate-300 px-3 py-2" />
              <input name="badge_ar" defaultValue={offer.badgeAr ?? ''} className="rounded-xl border border-slate-300 px-3 py-2" />
              <input name="price_text" defaultValue={offer.priceText ?? ''} className="rounded-xl border border-slate-300 px-3 py-2" />
              <input name="sort_order" type="number" defaultValue={offer.sortOrder} className="rounded-xl border border-slate-300 px-3 py-2" />
              <input name="starts_at" type="datetime-local" defaultValue={toDatetimeLocal(offer.startsAt)} className="rounded-xl border border-slate-300 px-3 py-2" />
              <input name="ends_at" type="datetime-local" defaultValue={toDatetimeLocal(offer.endsAt)} className="rounded-xl border border-slate-300 px-3 py-2" />
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <input type="checkbox" name="is_active" value="true" defaultChecked={offer.isActive} /> العرض نشط
              </label>
              <textarea name="description_ar" defaultValue={offer.descriptionAr ?? ''} className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" rows={3} />
              <div className="md:col-span-2 flex flex-wrap gap-2">
                <button type="submit" className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-black">حفظ التعديلات</button>
              </div>
            </form>
            <form action={`/admin/offers/api/offers/${offer.id}`} method="post" className="mt-2">
              <input type="hidden" name="intent" value="toggle" />
              <input type="hidden" name="is_active" value={offer.isActive ? 'false' : 'true'} />
              <button type="submit" className="rounded-xl border border-brand-red px-3 py-2 text-sm font-black text-brand-red">
                {offer.isActive ? 'إلغاء تفعيل العرض' : 'تفعيل العرض'}
              </button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
