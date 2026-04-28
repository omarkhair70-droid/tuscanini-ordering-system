'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type KitchenDisplayControlsProps = {
  activeOrdersCount: number;
};

function beepOnce() {
  const AudioContextImpl = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextImpl) {
    return;
  }

  const audioContext = new AudioContextImpl();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.value = 880;

  gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.25);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.26);

  window.setTimeout(() => {
    void audioContext.close();
  }, 400);
}

export function KitchenDisplayControls({ activeOrdersCount }: KitchenDisplayControlsProps) {
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const prevCountRef = useRef(activeOrdersCount);

  useEffect(() => {
    setIsFullscreenSupported(typeof document !== 'undefined' && typeof document.documentElement.requestFullscreen === 'function');

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    onFullscreenChange();
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!alertsEnabled) {
      prevCountRef.current = activeOrdersCount;
      return;
    }

    if (activeOrdersCount > prevCountRef.current) {
      try {
        beepOnce();
      } catch {
        // intentionally non-blocking
      }
    }

    prevCountRef.current = activeOrdersCount;
  }, [activeOrdersCount, alertsEnabled]);

  const fullscreenHint = useMemo(() => {
    if (!isFullscreenSupported) {
      return 'المتصفح الحالي لا يدعم ملء الشاشة بشكل كامل.';
    }

    if (isFullscreen) {
      return 'وضع ملء الشاشة مُفعّل. اضغط Esc للخروج.';
    }

    return 'لأفضل عرض على شاشة المطبخ: فعّل وضع ملء الشاشة.';
  }, [isFullscreen, isFullscreenSupported]);

  const handleFullscreenToggle = async () => {
    if (!isFullscreenSupported) {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await document.documentElement.requestFullscreen();
    } catch {
      // intentionally non-blocking
    }
  };

  return (
    <section className="rounded-2xl border-2 border-slate-300 bg-slate-950 p-4 text-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-100">{fullscreenHint}</p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleFullscreenToggle}
            className="rounded-xl border border-slate-500 bg-slate-900 px-4 py-2 text-sm font-black text-white transition hover:border-emerald-400 hover:text-emerald-300"
          >
            {isFullscreen ? 'الخروج من ملء الشاشة' : 'وضع ملء الشاشة'}
          </button>

          <button
            type="button"
            onClick={() => setAlertsEnabled((value) => !value)}
            className="rounded-xl border border-amber-500 bg-amber-950 px-4 py-2 text-sm font-black text-amber-100 transition hover:border-amber-300"
          >
            {alertsEnabled ? 'إيقاف التنبيهات' : 'تشغيل التنبيهات'}
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs font-bold text-slate-300">
        التنبيهات الصوتية اختيارية وتعمل بعد تفاعل المستخدم فقط، وتصدر عند زيادة عدد الطلبات النشطة.
      </p>
    </section>
  );
}
