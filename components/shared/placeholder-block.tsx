type PlaceholderBlockProps = {
  title: string;
  description: string;
};

export function PlaceholderBlock({ title, description }: PlaceholderBlockProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-brand-charcoal/30 bg-brand-white p-5">
      <h2 className="text-xl font-extrabold">{title}</h2>
      <p className="mt-2 text-sm text-brand-charcoal">{description}</p>
    </div>
  );
}
