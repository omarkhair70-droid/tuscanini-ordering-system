'use client';

import { useEffect, useMemo, useState } from 'react';
import { PwaInstallIosHint } from '@/components/shared/pwa-install-ios-hint';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const DISMISS_KEY = 'tuscanini:pwa-install-dismissed';

export function PwaInstallCta() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setIsDismissed(localStorage.getItem(DISMISS_KEY) === '1');

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const isIosSafari = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const userAgent = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/CriOS|FxiOS/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    return isIos && isSafari && !isStandalone;
  }, []);

  const canShowChromiumInstall = Boolean(installEvent);
  const shouldShow = !isDismissed && (canShowChromiumInstall || isIosSafari);

  const dismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(DISMISS_KEY, '1');
  };

  const onInstall = async () => {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      dismiss();
    }
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-brand-red/25 bg-brand-white p-4 shadow-[0_8px_18px_rgba(18,18,18,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-brand-dark">ثبت تطبيق توسكانيني على موبايلك</h2>
          <p className="mt-1 text-sm text-brand-charcoal">اطلب أسرع وارجع لمتابعة طلبك بسهولة</p>
          {isIosSafari ? <PwaInstallIosHint /> : null}
        </div>
        <button onClick={dismiss} className="text-xs font-bold text-brand-charcoal/70" aria-label="إغلاق">
          إغلاق
        </button>
      </div>

      {canShowChromiumInstall ? (
        <div className="mt-3">
          <button
            onClick={onInstall}
            className="rounded-xl bg-brand-red px-4 py-2 text-sm font-extrabold text-brand-white transition hover:bg-brand-red/90"
          >
            تثبيت التطبيق
          </button>
        </div>
      ) : null}
    </section>
  );
}
