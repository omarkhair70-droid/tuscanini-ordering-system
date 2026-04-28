import Link from 'next/link';

import { PageHero } from '@/components/shared/page-hero';
import { getAdminOverviewData } from '@/lib/admin/admin-overview-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const adminLinks = [
  {
    href: '/admin/products',
    title: 'إدارة المنيو',
    description: 'تعديل الأسعار والتوفر للمنتجات والأحجام من لوحة الإدارة.',
  },
  {
    href: '/admin/orders',
    title: 'إدارة الطلبات',
    description: 'متابعة الطلبات وحالاتها التشغيلية.',
  },
  {
    href: '/admin/kitchen',
    title: 'شاشة المطبخ',
    description: 'وضع مطبخ احترافي مباشر للطلبات النشطة مناسب للشاشات الكبيرة.',
  },
  {
    href: '/admin/settings',
    title: 'إعدادات الموقع',
    description: 'إعدادات عامة (Placeholder حالياً).',
  },
  {
    href: '/admin/tables',
    title: 'روابط طاولات QR',
    description: 'روابط جاهزة لطاولات الصالة (1–20).',
  },
];

function formatMoney(value: number): string {
  return `${value.toFixed(2)} ج.م`;
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

type StatCardProps = {
  title: string;
  value: string;
  hint?: string;
};

function StatCard({ title, value, hint }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-sm">
      <p className="text-sm font-bold text-slate-700">{title}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </article>
  );
}

export default async function AdminPage() {
  const result = await getAdminOverviewData()
    .then((data) => ({ data, error: null as string | null }))
    .catch((error: unknown) => ({
      data: null,
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء تحميل لوحة الإدارة.',
    }));

  if (result.error || !result.data) {
    return (
      <div className="space-y-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-900">
        <h1 className="text-xl font-black">تعذر تحميل لوحة الإدارة</h1>
        <p className="text-sm">{result.error ?? 'حدث خطأ غير معروف.'}</p>
      </div>
    );
  }

  const { summary, operational, warnings, latestOrders, topProductsToday } = result.data;

  return (
    <div className="space-y-6">
      <PageHero title="لوحة العمليات الاحترافية" subtitle="مؤشرات مباشرة للأداء اليومي والتنبيهات التشغيلية في الوقت الفعلي." />

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <form action="/admin/logout" method="post" className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-brand-red hover:text-brand-red"
          >
            تسجيل الخروج
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">مؤشرات اليوم</h2>
          <span className="text-xs font-bold text-slate-500">قراءة فقط</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard title="طلبات اليوم" value={String(summary.ordersToday)} />
          <StatCard title="مبيعات تقديرية اليوم" value={formatMoney(summary.estimatedSalesToday)} />
          <StatCard title="متوسط قيمة الطلب اليوم" value={formatMoney(summary.averageOrderValueToday)} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">الحالة التشغيلية الحالية</h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard title="بانتظار التأكيد" value={String(operational.pendingConfirmation)} hint="كل الطلبات الحالية pending" />
          <StatCard title="جاري التحضير" value={String(operational.preparing)} />
          <StatCard title="جاهز للاستلام" value={String(operational.ready)} />
          <StatCard title="خرج للدليفري" value={String(operational.outForDelivery)} />
          <StatCard title="تم التسليم اليوم" value={String(operational.deliveredToday)} />
          <StatCard title="ملغي اليوم" value={String(operational.cancelledToday)} />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="text-lg font-black text-amber-900">تنبيهات تشغيلية</h2>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-amber-300 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-black text-slate-900">طلبات pending أكثر من 10 دقائق</h3>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">
                {warnings.pendingConfirmationOver10Minutes.length}
              </span>
            </div>
            {warnings.pendingConfirmationOver10Minutes.length === 0 ? (
              <p className="text-sm text-slate-600">لا توجد حالات متأخرة حالياً.</p>
            ) : (
              <ul className="space-y-2 text-sm text-slate-700">
                {warnings.pendingConfirmationOver10Minutes.map((order) => (
                  <li key={order.id} className="rounded-xl border border-slate-200 p-2">
                    <p className="font-bold text-slate-900">{order.reference}</p>
                    <p>{order.customerName || 'غير مسجل'} — {order.customerPhone}</p>
                    <p className="text-xs text-amber-800">متأخر {order.elapsedMinutes} دقيقة</p>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-2xl border border-amber-300 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-black text-slate-900">طلبات جاري التحضير أكثر من 20 دقيقة</h3>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">
                {warnings.preparingOver20Minutes.length}
              </span>
            </div>
            {warnings.preparingOver20Minutes.length === 0 ? (
              <p className="text-sm text-slate-600">لا توجد حالات متأخرة حالياً.</p>
            ) : (
              <ul className="space-y-2 text-sm text-slate-700">
                {warnings.preparingOver20Minutes.map((order) => (
                  <li key={order.id} className="rounded-xl border border-slate-200 p-2">
                    <p className="font-bold text-slate-900">{order.reference}</p>
                    <p>{order.customerName || 'غير مسجل'} — {order.customerPhone}</p>
                    <p className="text-xs text-amber-800">متأخر {order.elapsedMinutes} دقيقة</p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">أفضل المنتجات اليوم</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{topProductsToday.length} منتج</span>
        </div>

        {topProductsToday.length === 0 ? (
          <p className="text-sm text-slate-700">لا توجد مبيعات منتجات اليوم بعد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-bold">المنتج</th>
                  <th className="px-3 py-2 font-bold">الكمية المباعة</th>
                  <th className="px-3 py-2 font-bold">إجمالي المبيعات</th>
                </tr>
              </thead>
              <tbody>
                {topProductsToday.map((product) => (
                  <tr key={product.productName} className="border-b border-slate-100 last:border-none">
                    <td className="px-3 py-2 font-bold text-slate-900">{product.productName}</td>
                    <td className="px-3 py-2 text-slate-700">{product.quantitySold}</td>
                    <td className="px-3 py-2 text-slate-700">{formatMoney(product.salesTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">آخر 5 طلبات</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{latestOrders.length} طلب</span>
        </div>

        {latestOrders.length === 0 ? (
          <p className="text-sm text-slate-700">لا توجد طلبات بعد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-bold">المرجع</th>
                  <th className="px-3 py-2 font-bold">العميل</th>
                  <th className="px-3 py-2 font-bold">الهاتف</th>
                  <th className="px-3 py-2 font-bold">الإجمالي</th>
                  <th className="px-3 py-2 font-bold">الحالة</th>
                  <th className="px-3 py-2 font-bold">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody>
                {latestOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 last:border-none">
                    <td className="px-3 py-2 font-bold text-slate-900">{order.reference}</td>
                    <td className="px-3 py-2 text-slate-700">{order.customerName || 'غير مسجل'}</td>
                    <td className="px-3 py-2 text-slate-700">{order.customerPhone}</td>
                    <td className="px-3 py-2 text-slate-700">{formatMoney(order.totalEstimate)}</td>
                    <td className="px-3 py-2 text-slate-700">{order.status}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">أقسام الإدارة</h2>

        <div className="grid gap-3">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-right transition hover:border-brand-red"
            >
              <p className="text-base font-black text-slate-900">{link.title}</p>
              <p className="mt-1 text-sm text-slate-600">{link.description}</p>
              <p className="mt-2 text-xs font-bold text-brand-red">{link.href}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
