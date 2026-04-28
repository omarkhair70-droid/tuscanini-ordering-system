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
    href: '/admin/settings',
    title: 'إعدادات الموقع',
    description: 'إعدادات عامة (Placeholder حالياً).',
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
    <article className="rounded-2xl border border-slate-200 bg-white p-4 text-right">
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

  const { summary, operational, latestOrders } = result.data;

  return (
    <div className="space-y-6">
      <PageHero title="لوحة الإدارة" subtitle="نظرة سريعة على تشغيل الطلبات اليوم مع أحدث الطلبات." />

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
          <h2 className="text-lg font-black text-slate-900">ملخص اليوم</h2>
          <span className="text-xs font-bold text-slate-500">قراءة فقط</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="طلبات اليوم" value={String(summary.ordersToday)} />
          <StatCard title="مبيعات تقديرية اليوم" value={formatMoney(summary.estimatedSalesToday)} />
          <StatCard title="بانتظار التأكيد اليوم" value={String(summary.pendingConfirmationToday)} />
          <StatCard title="قيد التحضير/نشط اليوم" value={String(summary.preparingActiveToday)} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">بطاقات التشغيل</h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard title="طلبات جديدة" value={String(operational.newOrders)} hint="كل الطلبات الحالية بهذه الحالة" />
          <StatCard title="جاري التحضير" value={String(operational.preparing)} hint="كل الطلبات الحالية بهذه الحالة" />
          <StatCard title="جاهز" value={String(operational.ready)} hint="كل الطلبات الحالية بهذه الحالة" />
          <StatCard title="تم التسليم اليوم" value={String(operational.deliveredToday)} />
          <StatCard title="ملغي اليوم" value={String(operational.cancelledToday)} />
        </div>
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
