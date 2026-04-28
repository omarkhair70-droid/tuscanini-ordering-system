import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

type SafeQueryError = {
  message: string;
  code?: string;
  details?: string;
};

type CategorySampleRow = {
  id: number;
  name_ar: string;
  slug: string;
  sort_order: number;
};

type ProductSampleRow = {
  id: number;
  name_ar: string;
  price_from: number;
  availability: string;
  sort_order: number;
};

function getSafeQueryError(error: unknown): SafeQueryError | null {
  if (!error || typeof error !== 'object' || !('message' in error)) {
    return null;
  }

  const message = typeof error.message === 'string' ? error.message : 'Unknown error';
  const code = 'code' in error && typeof error.code === 'string' ? error.code : undefined;
  const details = 'details' in error && typeof error.details === 'string' ? error.details : undefined;

  return { message, code, details };
}

function formatSafeQueryError(error: unknown): string {
  const safeError = getSafeQueryError(error);
  if (!safeError) {
    return 'unknown error';
  }

  const segments = [`message: ${safeError.message}`];

  if (safeError.code) {
    segments.push(`code: ${safeError.code}`);
  }

  if (safeError.details) {
    segments.push(`details: ${safeError.details}`);
  }

  return segments.join(' | ');
}

function getCountStatus(label: string, result: { count: number | null; error: unknown }) {
  if (result.error) {
    return {
      label,
      tone: 'error' as const,
      message: `failed | ${formatSafeQueryError(result.error)}`,
    };
  }

  if (result.count === null) {
    return {
      label,
      tone: 'warning' as const,
      message: 'count returned null',
    };
  }

  return {
    label,
    tone: 'success' as const,
    message: `count: ${result.count}`,
  };
}

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
  const categoriesSampleRows = (categoriesSampleResult.data ?? []) as CategorySampleRow[];
  const productsSampleRows = (productsSampleResult.data ?? []) as ProductSampleRow[];

  const queryStatuses: StatusItemProps[] = [
    getCountStatus('menu_categories count', menuCategoriesCount),
    getCountStatus('products count', productsCount),
    getCountStatus('product_sizes count', productSizesCount),
    getCountStatus('product_addons count', productAddonsCount),
    getCountStatus('product_addon_links count', productAddonLinksCount),
    siteSettingsResult.error
      ? {
          label: 'site_settings id=1',
          tone: 'error',
          message: `failed | ${formatSafeQueryError(siteSettingsResult.error)}`,
        }
      : siteSettingsResult.data
        ? {
            label: 'site_settings id=1',
            tone: 'success',
            message: 'found row id=1',
          }
        : {
            label: 'site_settings id=1',
            tone: 'warning',
            message: 'not found',
          },
    categoriesSampleResult.error
      ? {
          label: 'first 5 categories',
          tone: 'error',
          message: `failed | ${formatSafeQueryError(categoriesSampleResult.error)}`,
        }
      : {
          label: 'first 5 categories',
          tone: 'success',
          message: `rows: ${categoriesSampleResult.data?.length ?? 0}`,
        },
    productsSampleResult.error
      ? {
          label: 'first 5 products',
          tone: 'error',
          message: `failed | ${formatSafeQueryError(productsSampleResult.error)}`,
        }
      : {
          label: 'first 5 products',
          tone: 'success',
          message: `rows: ${productsSampleResult.data?.length ?? 0}`,
        },
  ];

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
        <h2 className="text-lg font-bold">حالة كل استعلام</h2>
        <ul className="space-y-2">
          {queryStatuses.map((status) => (
            <StatusItem key={status.label} label={status.label} tone={status.tone} message={status.message} />
          ))}
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
        {categoriesSampleRows.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {categoriesSampleRows.map((category) => (
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
        {productsSampleRows.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {productsSampleRows.map((product) => (
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
