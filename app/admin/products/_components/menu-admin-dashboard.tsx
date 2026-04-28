import type { AdminMenuDashboardData } from '@/types/admin-menu';

type MenuAdminDashboardProps = {
  data: AdminMenuDashboardData;
};

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

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${
        isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
      }`}
    >
      {isActive ? 'نشط' : 'غير نشط'}
    </span>
  );
}

function AvailabilityLabel({ value }: { value: string }) {
  const label = value === 'available' ? 'متاح' : value === 'limited' ? 'متاح بكمية محدودة' : 'غير متاح';

  return <span className="text-sm font-semibold text-slate-800">{label}</span>;
}

function SectionCard({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{count}</span>
      </div>
      {children}
    </section>
  );
}

export function MenuAdminDashboard({ data }: MenuAdminDashboardProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900">لوحة إدارة المنيو (قراءة فقط)</h1>
        <p className="text-sm text-slate-700">هذه الصفحة للعرض فقط ولا تقوم بأي تعديل على البيانات.</p>
      </header>

      <SectionCard title="التصنيفات" count={data.categories.length}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-bold">الاسم</th>
                <th className="px-3 py-2 font-bold">Slug</th>
                <th className="px-3 py-2 font-bold">الترتيب</th>
                <th className="px-3 py-2 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {data.categories.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-none">
                  <td className="px-3 py-2 font-semibold text-slate-900">{row.nameAr}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{row.slug}</td>
                  <td className="px-3 py-2">{row.sortOrder}</td>
                  <td className="px-3 py-2">
                    <StatusBadge isActive={row.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="المنتجات" count={data.products.length}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-bold">اسم المنتج</th>
                <th className="px-3 py-2 font-bold">التصنيف</th>
                <th className="px-3 py-2 font-bold">التوفر</th>
                <th className="px-3 py-2 font-bold">السعر يبدأ من</th>
                <th className="px-3 py-2 font-bold">الحالة</th>
                <th className="px-3 py-2 font-bold">آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-none">
                  <td className="px-3 py-2 font-semibold text-slate-900">{row.nameAr}</td>
                  <td className="px-3 py-2 text-slate-700">{row.categoryNameAr}</td>
                  <td className="px-3 py-2">
                    <AvailabilityLabel value={row.availability} />
                  </td>
                  <td className="px-3 py-2 font-semibold">{formatMoney(row.priceFrom)}</td>
                  <td className="px-3 py-2">
                    <StatusBadge isActive={row.isActive} />
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600">{formatDate(row.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="أحجام المنتجات" count={data.sizes.length}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-bold">المنتج</th>
                <th className="px-3 py-2 font-bold">الحجم</th>
                <th className="px-3 py-2 font-bold">السعر</th>
                <th className="px-3 py-2 font-bold">الحالة</th>
                <th className="px-3 py-2 font-bold">آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {data.sizes.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-none">
                  <td className="px-3 py-2 font-semibold text-slate-900">{row.productNameAr}</td>
                  <td className="px-3 py-2 text-slate-700">{row.labelAr}</td>
                  <td className="px-3 py-2 font-semibold">{formatMoney(row.price)}</td>
                  <td className="px-3 py-2">
                    <StatusBadge isActive={row.isActive} />
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600">{formatDate(row.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="الإضافات" count={data.addons.length}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-bold">اسم الإضافة</th>
                <th className="px-3 py-2 font-bold">السعر</th>
                <th className="px-3 py-2 font-bold">الحالة</th>
                <th className="px-3 py-2 font-bold">مرات الاستخدام</th>
              </tr>
            </thead>
            <tbody>
              {data.addons.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-none">
                  <td className="px-3 py-2 font-semibold text-slate-900">{row.labelAr}</td>
                  <td className="px-3 py-2 font-semibold">{formatMoney(row.price)}</td>
                  <td className="px-3 py-2">
                    <StatusBadge isActive={row.isActive} />
                  </td>
                  <td className="px-3 py-2 text-slate-700">{row.usageCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
