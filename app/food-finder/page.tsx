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
    <section className="space-y-3 rounded-2xl border-2 border-brand-dark bg-brand-white p-4">
      <h2 className="text-lg font-black text-brand-dark">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const isActive = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-xl border-2 px-3 py-3 text-sm font-extrabold transition ${
                isActive
                  ? 'border-brand-red bg-brand-red text-brand-white'
                  : 'border-brand-dark bg-brand-yellow/70 text-brand-dark'
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
    <div className="space-y-6 pb-24 md:pb-6">
      <PageHero title="مش عارف تاكل إيه؟" subtitle="جاوب 3 أسئلة سريعة وهتلاقي اقتراحات مناسبة من منيو توسكانيني." />

      <section className="rounded-2xl border-2 border-brand-dark bg-brand-yellow p-3 text-center font-black text-brand-dark">
        المرحلة الحالية: <span className="text-brand-red">{currentStepLabel}</span>
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
          <div className="rounded-2xl border-2 border-brand-dark bg-brand-red p-4 text-brand-white">
            <h2 className="text-lg font-black">اقتراحاتك الجاهزة</h2>
            <p className="mt-1 text-sm font-bold">
              {result.mode === 'exact'
                ? 'دي أفضل اختيارات مطابقة لإجاباتك.'
                : 'مفيش تطابق كامل، فجبنالك أقرب اختيارات مناسبة.'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {result.recommendations.map(({ item, categoryName, reason }) => (
              <article key={item.id} className="rounded-2xl border-2 border-brand-dark bg-brand-white p-4">
                <h3 className="text-lg font-black text-brand-dark">{item.name}</h3>
                <p className="mt-1 text-sm font-bold text-brand-charcoal">{categoryName}</p>
                <p className="mt-2 text-sm font-extrabold text-brand-red">تبدأ من {item.priceFrom} ج.م</p>
                <p className="mt-2 text-sm font-semibold text-brand-charcoal">{reason}</p>
                <Link
                  href={`/menu?category=${item.categorySlug}`}
                  className="mt-3 inline-flex rounded-full border-2 border-brand-dark bg-brand-yellow px-4 py-2 text-sm font-black text-brand-dark"
                >
                  روح للقسم
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={resetFlow}
        className="w-full rounded-full border-2 border-brand-dark bg-brand-white px-4 py-3 text-sm font-black text-brand-dark"
      >
        ابدأ من جديد
      </button>
    </div>
  );
}
