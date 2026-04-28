import Link from 'next/link';

import { PageHero } from '@/components/shared/page-hero';

const adminLinks = [
  {
    href: '/admin/products',
    title: 'إدارة المنيو',
    description: 'لوحة قراءة فقط لعرض التصنيفات والمنتجات والأحجام والإضافات من Supabase.',
  },
  {
    href: '/admin/orders',
    title: 'إدارة الطلبات',
    description: 'قسم الطلبات ما زال Placeholder في هذه المرحلة.',
  },
  {
    href: '/admin/settings',
    title: 'إعدادات الموقع',
    description: 'قسم الإعدادات ما زال Placeholder في هذه المرحلة.',
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHero title="لوحة الإدارة" subtitle="نسخة مبدئية مع لوحة منيو للعرض فقط." />

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
    </div>
  );
}
