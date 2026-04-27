import { PageHero } from '@/components/shared/page-hero';
import { featuredItems, menuCategories } from '@/lib/mock-data';

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <PageHero title="المنيو" subtitle="بيانات تجريبية ثابتة لحين ربط قاعدة البيانات." />
      <section className="grid grid-cols-2 gap-3">
        {menuCategories.map((cat) => (
          <div key={cat.id} className="rounded-xl bg-brand-yellow p-3 font-black text-brand-dark">
            {cat.name}
          </div>
        ))}
      </section>
      <section className="space-y-3">
        {featuredItems.map((item) => (
          <article key={item.id} className="rounded-2xl border p-4">
            <h2 className="font-extrabold">{item.name}</h2>
            <p className="text-sm text-brand-charcoal">{item.description}</p>
            <p className="mt-1 text-sm font-black text-brand-red">تبدأ من {item.priceFrom} ج.م</p>
          </article>
        ))}
      </section>
    </div>
  );
}
