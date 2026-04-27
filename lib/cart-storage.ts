import type { CartState } from '@/types/cart';

const CART_STORAGE_KEY = 'tuscanini-cart-v1';

export const defaultCartState: CartState = {
  items: [],
  customer: {
    name: '',
    phone: '',
    address: '',
    orderType: 'delivery',
    generalNotes: '',
    confirmedAccurateDetails: false,
  },
};

export function loadCartState(): CartState {
  if (typeof window === 'undefined') {
    return defaultCartState;
  }

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    return defaultCartState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CartState>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      customer: {
        ...defaultCartState.customer,
        ...(parsed.customer ?? {}),
      },
    };
  } catch {
    return defaultCartState;
  }
}

export function saveCartState(state: CartState): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
}
