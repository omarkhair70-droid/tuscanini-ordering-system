'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PageHero } from '@/components/shared/page-hero';
import {
  finderBudgetOptions,
  finderIntentOptions,
  finderPreferenceOptions,
  getFoodFinderRecommendations,
  type FinderBudgetId,
  type FinderIntentId,
  type FinderPreferenceId,
} from '@/lib/food-finder';

type QuestionOption<T extends string> = {
  id: T;
  label: string;
};

function QuestionStep<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: QuestionOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-brand-dark/15 bg-brand-white p-4 shadow-[0_8px_22px_rgba(18,18,18,0.08)]">
      <h2 className="text-lg font-black text-brand-dark">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const isActive = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-xl border px-3 py-3 text-sm font-extrabold transition ${
                isActive
                  ? 'border-brand-red bg-brand-red text-brand-white'
                  : 'border-brand-dark/20 bg-brand-yellow/70 text-brand-dark'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function FoodFinderPage() {
  const [intent, setIntent] = useState<FinderIntentId | null>(null);
  const [preference, setPreference] = useState<FinderPreferenceId | null>(null);
  const [budget, setBudget] = useState<FinderBudgetId | null>(null);

  const isComplete = intent !== null && preference !== null && budget !== null;

  const result = useMemo(() => {
    if (!isComplete || !intent || !preference || !budget) {
      return null;
    }

    return getFoodFinderRecommendations({ intent, preference, budget });
  }, [budget, intent, isComplete, preference]);

  const currentStepLabel = !intent ? '1 / 3' : !preference ? '2 / 3' : !budget ? '3 / 3' : 'اكتملت';

  const resetFlow = () => {
    setIntent(null);
    setPreference(null);
    setBudget(null);
  };

  return (
    <div className="safe-bottom-mobile space-y-6">
      <PageHero title="مش عارف تاكل إيه؟" subtitle="جاوب 3 أسئلة سريعة وهتلاقي ترشيحات مناسبة من منيو توسكانيني." />

      <section className="rounded-2xl border border-brand-dark/15 bg-brand-yellow/80 p-3 text-center font-black text-brand-dark shadow-[0_4px_14px_rgba(18,18,18,0.06)]">
        المرحلة الحالية: <span className="text-brand-red">{currentStepLabel}</span> — اختياراتك بتتقفل تلقائيًا لما تكمّل 3 خطوات.
      </section>

      <QuestionStep title="نفسك في إيه؟" options={finderIntentOptions} value={intent} onChange={setIntent} />

      {intent ? (
        <QuestionStep
          title="تحبها؟"
          options={finderPreferenceOptions}
          value={preference}
          onChange={setPreference}
        />
      ) : null}

      {intent && preference ? (
        <QuestionStep title="السعر؟" options={finderBudgetOptions} value={budget} onChange={setBudget} />
      ) : null}

      {result ? (
        <section className="space-y-3">
          <div className="rounded-2xl bg-gradient-to-b from-brand-red to-[#8f0000] p-5 text-brand-white shadow-[0_14px_30px_rgba(128,0,0,0.35)]">
            <h2 className="text-xl font-black">اقتراحاتك الجاهزة 🔥</h2>
            <p className="mt-1 text-sm font-bold">
              {result.mode === 'exact'
                ? 'دي أقرب اختيارات مطابقة لإجاباتك بشكل مباشر.'
                : 'مفيش تطابق كامل، فجبنالك أقرب اختيارات مناسبة بنفس الروح.'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {result.recommendations.map(({ item, categoryName, reason }) => (
              <article key={item.id} className="rounded-2xl border border-brand-dark/15 bg-brand-white p-4 shadow-[0_8px_22px_rgba(18,18,18,0.08)]">
                <h3 className="text-lg font-black text-brand-dark">{item.name}</h3>
                <p className="mt-1 text-sm font-bold text-brand-charcoal">{categoryName}</p>
                <p className="mt-2 text-xs font-semibold text-brand-charcoal">يبدأ من</p>
                <p className="text-lg font-extrabold text-brand-red">{item.priceFrom} ج.م</p>
                <p className="mt-2 text-sm leading-7 font-semibold text-brand-charcoal">{reason}</p>
                <Link
                  href={`/menu?category=${item.categorySlug}`}
                  className="mt-4 inline-flex rounded-full border border-brand-dark/25 bg-brand-yellow px-4 py-2.5 text-sm font-black text-brand-dark"
                >
                  افتح القسم في المنيو
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={resetFlow}
        className="w-full rounded-full border border-brand-dark/20 bg-brand-white px-4 py-3 text-sm font-black text-brand-dark"
      >
        ابدأ من جديد
      </button>
    </div>
  );
}
