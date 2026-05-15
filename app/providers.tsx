'use client';

import { useEffect } from 'react';
import { CartProvider } from '@/components/cart/cart-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    void navigator.serviceWorker.register('/sw.js');
  }, []);

  return <CartProvider>{children}</CartProvider>;
}
