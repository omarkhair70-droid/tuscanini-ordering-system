import { PageHero } from '@/components/shared/page-hero';
import { getAdminOrdersDashboardData } from '@/lib/admin/orders-admin-queries';
import { ADMIN_CONFIRMATION_STATUSES, ADMIN_ORDER_STATUSES, type AdminOrderSummaryView } from '@/types/admin-orders';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

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

function formatMoney(value: number): string {
  return `${value.toFixed(2)} ج.م`;
}

function formatOrderType(value: 'delivery' | 'pickup'): string {
  return value === 'delivery' ? 'دليفري' : 'استلام من الفرع';
}

function formatConfirmationStatus(value: string): string {
  if (value === 'confirmed') {
    return 'تم التأكيد';
  }

  if (value === 'unreachable') {
    return 'لا يمكن التواصل';
  }

  if (value === 'rejected') {
    return 'مرفوض';
  }

  return 'بانتظار التأكيد';
}

function toQueryString(searchParams: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item) {
          params.append(key, item);
        }
      }

      continue;
    }

    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

function ActionButton({ action, label, tone = 'default' }: { action: string; label: string; tone?: 'default' | 'danger' }) {
  return (
    <button
      type="submit"
      name="action"
      value={action}
      className={`rounded-lg border px-3 py-2 text-xs font-black transition ${
        tone === 'danger'
          ? 'border-red-300 text-red-700 hover:border-red-500 hover:text-red-800'
          : 'border-slate-300 text-slate-700 hover:border-brand-red hover:text-brand-red'
      }`}
    >
      {label}
    </button>
  );
}

function OrderCard({ order, returnTo }: { order: AdminOrderSummaryView; returnTo: string }) {
  return (
    <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black text-slate-900">طلب {order.reference}</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{formatDate(order.createdAt)}</span>
        </div>

        <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-bold text-slate-900">العميل:</span> {order.customerName || 'غير مسجل'}
          </p>
          <p>
            <span className="font-bold text-slate-900">الهاتف:</span> {order.customerPhone}
          </p>
          <p>
            <span className="font-bold text-slate-900">نوع الطلب:</span> {formatOrderType(order.orderType)}
          </p>
          <p>
            <span className="font-bold text-slate-900">الطاولة:</span> {order.tableReference || '—'}
          </p>
          <p>
            <span className="font-bold text-slate-900">الإجمالي التقديري:</span> {formatMoney(order.totalEstimate)}
          </p>
          <p>
            <span className="font-bold text-slate-900">الحالة:</span> {order.status}
          </p>
          <p>
            <span className="font-bold text-slate-900">حالة التأكيد:</span> {formatConfirmationStatus(order.confirmationStatus)}
          </p>
        </div>

        {order.orderType === 'delivery' && order.customerAddress ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <span className="font-bold">عنوان الدليفري:</span> {order.customerAddress}
          </p>
        ) : null}
      </header>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <h3 className="text-sm font-black text-slate-900">تفاصيل الأصناف</h3>

        <div className="space-y-3">
          {order.items.length === 0 ? (
            <p className="text-sm text-slate-600">لا توجد عناصر مرتبطة بهذا الطلب.</p>
          ) : (
            order.items.map((item, index) => (
              <div key={item.id} className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <p className="font-bold text-slate-900">
                  {index + 1}. {item.lineType === 'offer' ? `عرض: ${item.productNameSnapshot.replace(/^عرض:\s*/, '')}` : item.productNameSnapshot}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <p>
                    <span className="font-bold text-slate-900">الحجم:</span> {item.selectedSizeLabel || 'بدون حجم'}
                  </p>
                  <p>
                    <span className="font-bold text-slate-900">الكمية:</span> {item.quantity}
                  </p>
                  <p>
                    <span className="font-bold text-slate-900">إجمالي السطر:</span> {formatMoney(item.lineTotal)}
                  </p>
                  <p>
                    <span className="font-bold text-slate-900">ملاحظات الصنف:</span> {item.itemNotes || 'لا يوجد'}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-900">الإضافات:</p>
                  {item.addons.length === 0 ? (
                    <p className="text-xs text-slate-500">بدون إضافات</p>
                  ) : (
                    <ul className="mt-1 space-y-1 text-xs text-slate-700">
                      {item.addons.map((addon) => (
                        <li key={addon.id} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                          {addon.labelSnapshot} (+{formatMoney(addon.price)})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-sm text-slate-700">
          <span className="font-bold text-slate-900">ملاحظات عامة:</span> {order.generalNotes || 'لا يوجد'}
        </p>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-black text-slate-900">إجراءات الحالة</p>
        <form
          action={`/admin/orders/api/orders/${order.id}/status?returnTo=${encodeURIComponent(returnTo)}`}
          method="post"
          className="flex flex-wrap gap-2"
        >
          <ActionButton action="confirm" label="تأكيد الطلب" />
          <ActionButton action="preparing" label="جاري التحضير" />
          <ActionButton action="ready" label="جاهز" />
          <ActionButton action="delivered" label="تم التسليم" />
          <ActionButton action="cancel" label="إلغاء" tone="danger" />
        </form>
      </section>
    </article>
  );
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const result = await getAdminOrdersDashboardData(resolvedSearchParams)
    .then((data) => ({ data, error: null as string | null }))
    .catch((error: unknown) => ({
      data: null,
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء تحميل الطلبات.',
    }));

  const returnTo = `/admin/orders${toQueryString(resolvedSearchParams)}`;
  const actionSuccessParam =
    typeof resolvedSearchParams.action_success === 'string' ? resolvedSearchParams.action_success : '';
  const actionErrorParam = typeof resolvedSearchParams.action_error === 'string' ? resolvedSearchParams.action_error : '';

  if (result.error || !result.data) {
    return (
      <div className="space-y-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-900">
        <h1 className="text-xl font-black">تعذر تحميل الطلبات</h1>
        <p className="text-sm">{result.error ?? 'حدث خطأ غير معروف.'}</p>
      </div>
    );
  }

  const { filters, orders } = result.data;

  return (
    <div className="space-y-6">
      <PageHero title="إدارة الطلبات" subtitle="متابعة الطلبات الواردة من السلة المخزنة في Supabase." />

      {actionSuccessParam ? (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{actionSuccessParam}</p>
      ) : null}

      {actionErrorParam ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">{actionErrorParam}</p>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-black text-slate-900">فلترة الطلبات</h2>

        <form action="/admin/orders" method="get" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1 text-right text-sm">
            <span className="font-bold text-slate-700">حالة الطلب</span>
            <select name="status" defaultValue={filters.status} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
              <option value="all">الكل</option>
              {ADMIN_ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-right text-sm">
            <span className="font-bold text-slate-700">حالة التأكيد</span>
            <select
              name="confirmation_status"
              defaultValue={filters.confirmationStatus}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
            >
              <option value="all">الكل</option>
              {ADMIN_CONFIRMATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatConfirmationStatus(status)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-right text-sm sm:col-span-2 lg:col-span-1">
            <span className="font-bold text-slate-700">بحث (هاتف / رقم الطلب)</span>
            <input
              type="text"
              name="q"
              defaultValue={filters.q}
              placeholder="مثال: 010 أو 123"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-left"
            />
          </label>

          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
            <button type="submit" className="rounded-xl bg-brand-red px-4 py-2 text-sm font-black text-white transition hover:opacity-90">
              تطبيق الفلاتر
            </button>
            <a
              href="/admin/orders"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-brand-red hover:text-brand-red"
            >
              إعادة تعيين
            </a>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">أحدث الطلبات</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{orders.length} طلب</span>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">لا توجد طلبات مطابقة للفلاتر الحالية.</div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} returnTo={returnTo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
