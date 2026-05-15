export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-brand-dark/10 bg-brand-white px-6 py-12 text-center shadow-[0_18px_36px_rgba(18,18,18,0.08)]">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-red">Tuscanini</p>
      <h1 className="mt-4 text-3xl font-black text-brand-dark">أنت غير متصل بالإنترنت</h1>
      <p className="mt-4 text-base leading-8 text-brand-charcoal">
        أنت غير متصل بالإنترنت. افتح الاتصال لإرسال الطلب أو متابعة حالته.
      </p>
    </div>
  );
}
