import Link from 'next/link';

import { PageHero } from '@/components/shared/page-hero';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const tableNumbers = Array.from({ length: 20 }, (_, index) => index + 1);

function buildTableMenuPath(tableReference: string): string {
  const params = new URLSearchParams({ table: tableReference });
  return `/menu?${params.toString()}`;
}

export default function AdminTablesPage() {
  return (
    <div className="space-y-6">
      <PageHero title="روابط الطاولات" subtitle="روابط سريعة لاستخدام QR للطاولات (بدون توليد صور في هذه المرحلة)." />

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-700">انسخ الرابط المطلوب واربطة بأي مولد QR خارجي عند الحاجة.</p>
      </section>

      <section className="space-y-3">
        {tableNumbers.map((tableNumber) => {
          const tableReference = String(tableNumber);
          const menuPath = buildTableMenuPath(tableReference);

          return (
            <article key={tableReference} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-900">طاولة {tableReference}</p>
                  <p className="text-xs text-slate-600">{menuPath}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    readOnly
                    value={menuPath}
                    className="w-56 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs text-slate-700"
                  />
                  <Link
                    href={menuPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-red hover:text-brand-red"
                  >
                    فتح الرابط
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
