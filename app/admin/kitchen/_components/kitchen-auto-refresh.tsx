'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

type KitchenAutoRefreshProps = {
  intervalMs?: number;
};

export function KitchenAutoRefresh({ intervalMs = 25_000 }: KitchenAutoRefreshProps) {
  const router = useRouter();
  const safeIntervalMs = useMemo(() => {
    if (!Number.isFinite(intervalMs)) {
      return 25_000;
    }

    return Math.min(30_000, Math.max(20_000, Math.floor(intervalMs)));
  }, [intervalMs]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      router.refresh();
    }, safeIntervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [router, safeIntervalMs]);

  return null;
}
