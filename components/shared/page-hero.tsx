type PageHeroProps = {
  title: string;
  subtitle: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="rounded-2xl bg-brand-red p-6 text-brand-white shadow-punch">
      <h1 className="text-3xl font-black">{title}</h1>
      <p className="mt-2 text-sm text-brand-white/90">{subtitle}</p>
    </section>
  );
}
