type Stage = 'checkout' | 'tracking';

/** Navigation milestones, not inferred POS or restaurant status events. */
export function CustomerJourney({ stage }: { stage: Stage }) {
  const steps = [
    { label: 'اختار أكلك', state: 'done' },
    { label: 'راجع التفاصيل', state: stage === 'checkout' ? 'current' : 'done' },
    { label: 'تابع الطلب', state: stage === 'tracking' ? 'current' : 'future' },
  ] as const;

  return (
    <nav className="t-customer-journey" aria-label="مراحل رحلة الطلب">
      <ol>
        {steps.map((step, index) => (
          <li key={step.label} data-step-state={step.state}
            aria-current={step.state === 'current' ? 'step' : undefined}>
            <span className="t-customer-journey__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{step.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
