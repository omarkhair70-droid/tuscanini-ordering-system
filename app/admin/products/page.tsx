import { MenuAdminDashboard } from '@/app/admin/products/_components/menu-admin-dashboard';
import { getAdminMenuDashboardData } from '@/lib/admin/menu-admin-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProductsPage() {
  const result = await getAdminMenuDashboardData()
    .then((data) => ({ data, error: null as string | null }))
    .catch((error: unknown) => ({
      data: null,
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء تحميل بيانات المنيو.',
    }));

  if (result.error || !result.data) {
    return (
      <div className="space-y-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-900">
        <h1 className="text-xl font-black">تعذر تحميل لوحة المنيو</h1>
        <p className="text-sm">{result.error ?? 'حدث خطأ غير معروف.'}</p>
      </div>
    );
  }

  return <MenuAdminDashboard data={result.data} />;
}
