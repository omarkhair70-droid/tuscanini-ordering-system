import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';

type StatusTone = 'success' | 'error' | 'warning';

type StatusItemProps = {
  label: string;
  message: string;
  tone: StatusTone;
};

const statusStyles: Record<StatusTone, string> = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  error: 'border-red-300 bg-red-50 text-red-900',
  warning: 'border-amber-300 bg-amber-50 text-amber-900',
};

function StatusItem({ label, message, tone }: StatusItemProps) {
  return (
    <li className={`rounded-xl border p-3 text-sm ${statusStyles[tone]}`}>
      <p className="font-bold">{label}</p>
      <p>{message}</p>
    </li>
  );
}

export default async function SupabaseMenuDebugPage() {
  const supabase = getSupabaseServerAdminClient();

  const connectionCheck = await supabase
    .from('menu_categories')
    .select('id', { head: true, count: 'exact' });

  const connectionOk = !connectionCheck.error;

  const [
    menuCategoriesCount,
    productsCount,
    productSizesCount,
    productAddonsCount,
    productAddonLinksCount,
    siteSettingsResult,
    categoriesSampleResult,
    productsSampleResult,
  ] = await Promise.all([
    supabase.from('menu_categories').select('id', { head: true, count: 'exact' }),
    supabase.from('products').select('id', { head: true, count: 'exact' }),
    supabase.from('product_sizes').select('id', { head: true, count: 'exact' }),
    supabase.from('product_addons').select('id', { head: true, count: 'exact' }),
    supabase.from('product_addon_links').select('id', { head: true, count: 'exact' }),
    supabase.from('site_settings').select('id, is_ordering_open, whatsapp_order_number, phone_primary, phone_secondary, address_ar, facebook_url').eq('id', 1).maybeSingle(),
    supabase
      .from('menu_categories')
      .select('id, name_ar, slug, sort_order')
      .order('sort_order', { ascending: true })
      .limit(5),
    supabase
      .from('products')
      .select('id, name_ar, price_from, availability, sort_order')
      .order('sort_order', { ascending: true })
      .limit(5),
  ]);

  const readErrors = [
    menuCategoriesCount.error,
    productsCount.error,
    productSizesCount.error,
    productAddonsCount.error,
    productAddonLinksCount.error,
    siteSettingsResult.error,
    categoriesSampleResult.error,
    productsSampleResult.error,
  ].filter((error) => error !== null);

  const readOk = readErrors.length === 0;
  const siteSettingsMissing = readOk && !siteSettingsResult.data;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-black">فحص Supabase للمنيو (وضع تصحيح)</h1>
        <p className="text-sm text-slate-700">
          هذه الصفحة للقراءة فقط لتأكيد الاتصال وقابلية قراءة بيانات المنيو المزروعة بدون أي تعديل على البيانات.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold">حالة الاتصال والقراءة</h2>
        <ul className="space-y-2">
          <StatusItem
            label="حالة الاتصال"
            tone={connectionOk ? 'success' : 'error'}
            message={
              connectionOk
                ? 'تم الاتصال بـ Supabase بنجاح.'
                : 'فشل الاتصال بـ Supabase أو الوصول للجدول الأساسي.'
            }
          />
          <StatusItem
            label="حالة قراءة البيانات"
            tone={readOk ? 'success' : 'error'}
            message={readOk ? 'تم تنفيذ جميع قراءات البيانات المطلوبة بنجاح.' : 'فشل في قراءة جزء من البيانات المطلوبة.'}
          />
          <StatusItem
            label="حالة site_settings (id=1)"
            tone={siteSettingsMissing ? 'warning' : siteSettingsResult.error ? 'error' : 'success'}
            message={
              siteSettingsResult.error
                ? 'تعذر قراءة site_settings.'
                : siteSettingsMissing
                  ? 'لم يتم العثور على site_settings بالمعرف 1.'
                  : 'تم العثور على site_settings بالمعرف 1.'
            }
          />
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold">إحصائيات الجداول</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="text-slate-600">menu_categories</p>
            <p className="text-xl font-black">{menuCategoriesCount.count ?? '—'}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="text-slate-600">products</p>
            <p className="text-xl font-black">{productsCount.count ?? '—'}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="text-slate-600">product_sizes</p>
            <p className="text-xl font-black">{productSizesCount.count ?? '—'}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="text-slate-600">product_addons</p>
            <p className="text-xl font-black">{productAddonsCount.count ?? '—'}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="text-slate-600">product_addon_links</p>
            <p className="text-xl font-black">{productAddonLinksCount.count ?? '—'}</p>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold">عينة آمنة (أول 5 أقسام)</h2>
        {categoriesSampleResult.data && categoriesSampleResult.data.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {categoriesSampleResult.data.map((category) => (
              <li key={category.id} className="rounded-xl border border-slate-200 p-3">
                <p className="font-bold">{category.name_ar}</p>
                <p className="text-slate-600">slug: {category.slug}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">لا توجد بيانات أقسام للعرض.</p>
        )}
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold">عينة آمنة (أول 5 منتجات)</h2>
        {productsSampleResult.data && productsSampleResult.data.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {productsSampleResult.data.map((product) => (
              <li key={product.id} className="rounded-xl border border-slate-200 p-3">
                <p className="font-bold">{product.name_ar}</p>
                <p className="text-slate-600">
                  السعر يبدأ من: {product.price_from} • الحالة: {product.availability}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">لا توجد بيانات منتجات للعرض.</p>
        )}
      </section>
    </div>
  );
}
