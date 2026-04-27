import Link from 'next/link';

const trustLinks = [
  { href: '/about', label: 'عن توسكانيني' },
  { href: '/reviews', label: 'ابعت رأيك' },
  { href: '/complaints', label: 'عندك شكوى؟' },
];

export function TrustFeedbackLinks() {
  return (
    <section className="rounded-2xl border-2 border-brand-yellow/60 bg-brand-white p-5">
      <h2 className="section-title">الثقة والتواصل</h2>
      <p className="mt-2 text-sm text-brand-charcoal">تعرف علينا أكتر وشاركنا رأيك أو شكوتك بسهولة.</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {trustLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-xl border-2 border-brand-red/30 bg-brand-white px-4 py-3 text-sm font-extrabold text-brand-red transition hover:border-brand-red"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
