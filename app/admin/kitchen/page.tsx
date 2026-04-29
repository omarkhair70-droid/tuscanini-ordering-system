import Link from 'next/link';

import { KitchenAutoRefresh } from '@/app/admin/kitchen/_components/kitchen-auto-refresh';
import { KitchenDisplayControls } from '@/app/admin/kitchen/_components/kitchen-display-controls';
import { PageHero } from '@/components/shared/page-hero';
import { getKitchenOrdersBoardData } from '@/lib/admin/orders-kitchen-queries';
import {
  KITCHEN_COLUMNS,
  getKitchenUrgencyLevel,
  type KitchenOrderItemAddonView,
  type KitchenOrderView,
  type KitchenUrgencyLevel,
} from '@/types/admin-kitchen';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function formatOrderType(value: 'delivery' | 'pickup'): string {
  return value === 'delivery' ? 'دليفري' : 'استلام من الفرع';
}

function getElapsedMinutes(createdAt: string): number | null {
  const createdTime = new Date(createdAt).getTime();

  if (!Number.isFinite(createdTime)) {
    return null;
  }

  const diffMs = Date.now() - createdTime;
  if (diffMs <= 0) {
    return 0;
  }

  return Math.floor(diffMs / (1000 * 60));
}

function formatElapsed(createdAt: string): string {
  const totalMinutes = getElapsedMinutes(createdAt);

  if (totalMinutes === null) {
    return 'غير معروف';
  }

  if (totalMinutes < 1) {
    return 'الآن';
  }

  if (totalMinutes < 60) {
    return `${totalMinutes} دقيقة`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} ساعة`;
  }

  return `${hours} ساعة ${minutes} دقيقة`;
}

function formatAddon(addon: KitchenOrderItemAddonView): string {
  return `${addon.labelSnapshot} (+${addon.price.toFixed(2)} ج.م)`;
}

function getUrgencyStyles(level: KitchenUrgencyLevel): { card: string; badge: string; header: string } {
  if (level === 'danger') {
    return {
      card: 'border-red-500 bg-red-50',
      badge: 'bg-red-600 text-white',
      header: 'text-red-900',
    };
  }

  if (level === 'warning') {
    return {
      card: 'border-amber-400 bg-amber-50',
      badge: 'bg-amber-500 text-amber-950',
      header: 'text-amber-900',
    };
  }

  return {
    card: 'border-slate-300 bg-white',
    badge: 'bg-emerald-100 text-emerald-900',
    header: 'text-slate-900',
  };
}

function OrderCard({ order }: { order: KitchenOrderView }) {
  const elapsedMinutes = getElapsedMinutes(order.createdAt) ?? 0;
  const urgency = getKitchenUrgencyLevel(order.status, elapsedMinutes);
  const urgencyStyles = getUrgencyStyles(urgency);

  return (
    <article className={`space-y-4 rounded-2xl border-2 p-4 shadow-sm ${urgencyStyles.card}`}>
      <header className="space-y-3 border-b border-slate-200 pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className={`text-3xl font-black tracking-tight ${urgencyStyles.header}`}>طلب {order.reference}</h3>
          <span className={`rounded-full px-3 py-1 text-sm font-black ${urgencyStyles.badge}`}>منذ {formatElapsed(order.createdAt)}</span>
        </div>

        <div className="grid gap-2 text-sm text-slate-800">
          <p className="text-base">
            <span className="font-black text-slate-950">العميل:</span> {order.customerName || 'غير مسجل'}
          </p>
          <p className="text-base">
            <span className="font-black text-slate-950">نوع الطلب:</span> {formatOrderType(order.orderType)}
          </p>
          <p className="rounded-xl border border-slate-300 bg-slate-900 px-3 py-2 text-lg font-black text-white">
            الطاولة: {order.tableReference || '—'}
          </p>
        </div>
      </header>

      <section className="space-y-3">
        {order.items.length === 0 ? (
          <p className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">لا توجد عناصر لهذا الطلب.</p>
        ) : (
          order.items.map((item, index) => (
            <div key={item.id} className="space-y-2 rounded-xl border border-slate-300 bg-white p-3">
              <p className="text-lg font-black text-slate-900">
                {index + 1}. {item.lineType === 'offer' ? `عرض: ${item.productNameSnapshot.replace(/^عرض:\s*/, '')}` : item.productNameSnapshot}
              </p>

              <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                <p>
                  <span className="font-black text-slate-900">الحجم:</span> {item.selectedSizeLabel || 'بدون حجم'}
                </p>
                <p>
                  <span className="font-black text-slate-900">الكمية:</span> {item.quantity}
                </p>
              </div>

              <div>
                <p className="text-sm font-black text-slate-900">الإضافات:</p>
                {item.addons.length === 0 ? (
                  <p className="text-xs font-bold text-slate-600">بدون إضافات</p>
                ) : (
                  <ul className="mt-1 space-y-1 text-xs text-slate-700">
                    {item.addons.map((addon) => (
                      <li key={addon.id} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                        {formatAddon(addon)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="rounded-lg border border-slate-200 bg-amber-50 px-2 py-2 text-sm text-slate-800">
                <span className="font-black text-slate-900">ملاحظات الصنف:</span> {item.itemNotes || 'لا يوجد'}
              </p>
            </div>
          ))
        )}
      </section>

      <footer>
        <p className="rounded-xl border border-slate-300 bg-slate-950 px-3 py-3 text-sm text-slate-100">
          <span className="font-black text-white">ملاحظات عامة:</span> {order.generalNotes || 'لا يوجد'}
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
    <div className="space-y-6 bg-slate-50">
      <KitchenAutoRefresh intervalMs={25_000} />

      <PageHero title="وضع المطبخ الاحترافي" subtitle="شاشة تشغيلية مباشرة للطلبات النشطة فقط (تحديث تلقائي كل 25 ثانية)." />

      <KitchenDisplayControls activeOrdersCount={orders.length} />

      <section className="rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-black">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-white">إجمالي الطلبات النشطة: {orders.length}</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-900">تحديث تلقائي: 25 ثانية</span>
          </div>

          <nav className="flex flex-wrap gap-2">
            <Link href="/admin/orders" className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-black text-slate-700 hover:border-brand-red hover:text-brand-red">
              إدارة الطلبات
            </Link>
            <Link href="/admin/products" className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-black text-slate-700 hover:border-brand-red hover:text-brand-red">
              إدارة المنيو
            </Link>
            <Link href="/admin" className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-black text-slate-700 hover:border-brand-red hover:text-brand-red">
              لوحة الإدارة
            </Link>
          </nav>
        </div>
      </section>

      <section className="overflow-x-auto pb-2">
        <div className="grid min-w-[1320px] gap-4 xl:grid-cols-4">
          {KITCHEN_COLUMNS.map((column) => {
            const columnOrders = grouped[column.status];

            return (
              <section key={column.status} className="space-y-3 rounded-2xl border-2 border-slate-300 bg-slate-100 p-3">
                <header className="sticky top-0 z-10 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900">{column.title}</h2>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-black text-white">{columnOrders.length}</span>
                  </div>
                </header>

                {columnOrders.length === 0 ? (
                  <p className="rounded-xl border-2 border-dashed border-slate-300 bg-white px-3 py-8 text-center text-sm font-black text-slate-500">
                    لا توجد طلبات حالياً في مرحلة "{column.title}".
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
