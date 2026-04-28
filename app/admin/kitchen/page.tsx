import Link from 'next/link';
import Script from 'next/script';

import { PageHero } from '@/components/shared/page-hero';
import { getKitchenOrdersBoardData } from '@/lib/admin/orders-kitchen-queries';
import { KITCHEN_COLUMNS, type KitchenOrderItemAddonView, type KitchenOrderView } from '@/types/admin-kitchen';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function formatOrderType(value: 'delivery' | 'pickup'): string {
  return value === 'delivery' ? 'دليفري' : 'استلام من الفرع';
}

function formatElapsed(createdAt: string): string {
  const createdTime = new Date(createdAt).getTime();

  if (!Number.isFinite(createdTime)) {
    return 'غير معروف';
  }

  const diffMs = Date.now() - createdTime;

  if (diffMs <= 0) {
    return 'الآن';
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  if (totalMinutes < 1) {
    return 'أقل من دقيقة';
  }

  if (totalMinutes < 60) {
    return `منذ ${totalMinutes} دقيقة`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `منذ ${hours} ساعة`;
  }

  return `منذ ${hours} ساعة و${minutes} دقيقة`;
}

function formatAddon(addon: KitchenOrderItemAddonView): string {
  return `${addon.labelSnapshot} (+${addon.price.toFixed(2)} ج.م)`;
}

function OrderCard({ order }: { order: KitchenOrderView }) {
  return (
    <article className="space-y-4 rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
      <header className="space-y-2 border-b border-slate-200 pb-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl font-black text-slate-900">طلب {order.reference}</h3>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-900">{formatElapsed(order.createdAt)}</span>
        </div>

        <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-black text-slate-900">العميل:</span> {order.customerName || 'غير مسجل'}
          </p>
          <p>
            <span className="font-black text-slate-900">نوع الطلب:</span> {formatOrderType(order.orderType)}
          </p>
          <p>
            <span className="font-black text-slate-900">الطاولة:</span> {order.tableReference || '—'}
          </p>
        </div>
      </header>

      <section className="space-y-3">
        {order.items.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">لا توجد عناصر لهذا الطلب.</p>
        ) : (
          order.items.map((item, index) => (
            <div key={item.id} className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-base font-black text-slate-900">
                {index + 1}. {item.productNameSnapshot}
              </p>

              <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <p>
                  <span className="font-bold text-slate-900">الحجم:</span> {item.selectedSizeLabel || 'بدون حجم'}
                </p>
                <p>
                  <span className="font-bold text-slate-900">الكمية:</span> {item.quantity}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">الإضافات:</p>
                {item.addons.length === 0 ? (
                  <p className="text-xs text-slate-600">بدون إضافات</p>
                ) : (
                  <ul className="mt-1 space-y-1 text-xs text-slate-700">
                    {item.addons.map((addon) => (
                      <li key={addon.id} className="rounded-lg border border-slate-200 bg-white px-2 py-1">
                        {formatAddon(addon)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="text-sm text-slate-700">
                <span className="font-bold text-slate-900">ملاحظات الصنف:</span> {item.itemNotes || 'لا يوجد'}
              </p>
            </div>
          ))
        )}
      </section>

      <footer>
        <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          <span className="font-black text-slate-900">ملاحظات عامة:</span> {order.generalNotes || 'لا يوجد'}
        </p>
      </footer>
    </article>
  );
}

export default async function AdminKitchenPage() {
  const result = await getKitchenOrdersBoardData()
    .then((data) => ({ data, error: null as string | null }))
    .catch((error: unknown) => ({
      data: null,
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء تحميل شاشة المطبخ.',
    }));

  if (result.error || !result.data) {
    return (
      <div className="space-y-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-900">
        <h1 className="text-xl font-black">تعذر تحميل شاشة المطبخ</h1>
        <p className="text-sm">{result.error ?? 'حدث خطأ غير معروف.'}</p>
      </div>
    );
  }

  const { grouped, orders } = result.data;

  return (
    <div className="space-y-6">
      <Script id="kitchen-auto-refresh" strategy="afterInteractive">{`setTimeout(function(){window.location.reload();}, 25000);`}</Script>

      <PageHero title="شاشة المطبخ المباشرة" subtitle="عرض مباشر للطلبات النشطة فقط (تحديث تلقائي كل 25 ثانية)." />

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">إجمالي الطلبات النشطة: {orders.length}</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">تحديث تلقائي: 25 ثانية</span>
          </div>

          <nav className="flex flex-wrap gap-2">
            <Link href="/admin/orders" className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:border-brand-red hover:text-brand-red">
              إدارة الطلبات
            </Link>
            <Link href="/admin/products" className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:border-brand-red hover:text-brand-red">
              إدارة المنيو
            </Link>
            <Link href="/admin" className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:border-brand-red hover:text-brand-red">
              لوحة الإدارة
            </Link>
          </nav>
        </div>
      </section>

      <section className="overflow-x-auto">
        <div className="grid min-w-[1200px] gap-4 xl:grid-cols-4">
          {KITCHEN_COLUMNS.map((column) => {
            const columnOrders = grouped[column.status];

            return (
              <section key={column.status} className="space-y-3 rounded-2xl border-2 border-slate-200 bg-slate-100 p-3">
                <header className="sticky top-0 z-10 rounded-xl bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900">{column.title}</h2>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-700">{columnOrders.length}</span>
                  </div>
                </header>

                {columnOrders.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-6 text-center text-sm font-bold text-slate-500">
                    لا توجد طلبات حالياً
                  </p>
                ) : (
                  <div className="space-y-3">
                    {columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
