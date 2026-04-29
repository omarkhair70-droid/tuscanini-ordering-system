import Link from 'next/link';
import { menuCategories } from '@/lib/mock-data';

export function CategoriesPreview() {
  return (
    <section className="space-y-4">
      <h2 className="section-title">أقسام المنيو</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {menuCategories.map((category) => (
          <Link
            key={category.id}
            href={`/menu?category=${category.slug}`}
            className="block h-full rounded-2xl border border-brand-dark/10 bg-brand-white p-4 transition hover:-translate-y-0.5 hover:border-brand-dark/15 hover:shadow-[0_10px_18px_rgba(0,0,0,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
          >
            <article className="h-full">
              <h3 className="text-lg font-black">{category.name}</h3>
              <p className="mt-1 text-xs leading-6 text-brand-charcoal/95">{category.description}</p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
