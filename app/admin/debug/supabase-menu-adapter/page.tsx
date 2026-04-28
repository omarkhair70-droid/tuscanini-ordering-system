import { getSupabaseAdaptedMenu } from '@/lib/supabase/menu-adapter';
import { buildMenuParitySummary } from '@/lib/supabase/menu-parity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Tone = 'success' | 'warning';

const toneStyles: Record<Tone, string> = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-300 bg-amber-50 text-amber-900',
};

function getTone(matches: boolean): Tone {
  return matches ? 'success' : 'warning';
}

function StatusCard({
  label,
  expected,
  actual,
  tone,
}: {
  label: string;
  expected: number;
  actual: number;
  tone: Tone;
}) {
  return (
    <div className={`rounded-xl border p-3 text-sm ${toneStyles[tone]}`}>
      <p className="font-bold">{label}</p>
      <p>
        expected: {expected} | actual: {actual}
      </p>
    </div>
  );
}

function JsonBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <pre className="max-h-80 overflow-auto rounded-xl bg-slate-900 p-3 text-xs text-slate-100">
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}

async function loadDebugData() {
  try {
    const adapted = await getSupabaseAdaptedMenu();
    const parity = buildMenuParitySummary(adapted);
    return { adapted, parity, error: null as string | null };
  } catch (error) {
    return {
      adapted: null,
      parity: null,
      error: error instanceof Error ? error.message : 'Unknown adapter error',
    };
  }
}

export default async function SupabaseMenuAdapterDebugPage() {
  const result = await loadDebugData();

  if (result.error || !result.adapted || !result.parity) {
    return (
      <div className="space-y-4 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-900">
        <h1 className="text-xl font-black">Supabase Menu Adapter Debug failed</h1>
        <p className="text-sm">{result.error ?? 'Unknown adapter error'}</p>
      </div>
    );
  }

  const { adapted, parity } = result;
  const adaptedSizesCount = adapted.items.reduce((sum, item) => sum + (item.sizes?.length ?? 0), 0);
  const adaptedAddonsCount = adapted.items.reduce((sum, item) => sum + (item.addons?.length ?? 0), 0);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-black">Supabase Menu Adapter (Debug)</h1>
        <p className="text-sm text-slate-700">
          Read-only adapter output for parity verification. This page does not modify /menu runtime behavior.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold">Adapted output counts</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="text-slate-600">adapted category count</p>
            <p className="text-xl font-black">{adapted.categories.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="text-slate-600">adapted product count</p>
            <p className="text-xl font-black">{adapted.items.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="text-slate-600">adapted size count</p>
            <p className="text-xl font-black">{adaptedSizesCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="text-slate-600">adapted addon count</p>
            <p className="text-xl font-black">{adaptedAddonsCount}</p>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold">Parity summary vs lib/mock-data.ts</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <StatusCard
            label="category count"
            expected={parity.categoryCount.expected}
            actual={parity.categoryCount.actual}
            tone={getTone(parity.categoryCount.matches)}
          />
          <StatusCard
            label="product count"
            expected={parity.productCount.expected}
            actual={parity.productCount.actual}
            tone={getTone(parity.productCount.matches)}
          />
          <StatusCard
            label="size count"
            expected={parity.sizeCount.expected}
            actual={parity.sizeCount.actual}
            tone={getTone(parity.sizeCount.matches)}
          />
          <StatusCard
            label="addon count"
            expected={parity.addonCount.expected}
            actual={parity.addonCount.actual}
            tone={getTone(parity.addonCount.matches)}
          />
        </div>

        <div className="space-y-2 rounded-xl border border-slate-200 p-3 text-sm">
          <p className="font-bold">product ID diff</p>
          <p>missing IDs: {parity.productIds.missing.length}</p>
          <p>extra IDs: {parity.productIds.extra.length}</p>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-200 p-3 text-sm">
          <p className="font-bold">mismatch counters</p>
          <p>priceFrom mismatch: {parity.priceFromMismatches.length}</p>
          <p>size price mismatch: {parity.sizePriceMismatches.length}</p>
        </div>
      </section>

      <JsonBlock title="First 5 adapted categories" value={adapted.categories.slice(0, 5)} />
      <JsonBlock title="First 5 adapted products" value={adapted.items.slice(0, 5)} />
      <JsonBlock title="Missing product IDs" value={parity.productIds.missing} />
      <JsonBlock title="Extra product IDs" value={parity.productIds.extra} />
      <JsonBlock title="priceFrom mismatches" value={parity.priceFromMismatches} />
      <JsonBlock title="size price mismatches" value={parity.sizePriceMismatches} />
    </div>
  );
}
