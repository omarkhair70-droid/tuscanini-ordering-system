import type { CartState } from '@/types/cart';

const CART_STORAGE_KEY = 'tuscanini-cart-v1';

export const defaultCartState: CartState = {
  items: [],
  customer: {
    name: '',
    phone: '',
    address: '',
    deliveryLocation: null,
    // Pickup is the safe default until delivery zones/fees are approved.
    orderType: 'pickup',
    generalNotes: '',
    confirmedAccurateDetails: false,
  },
  tableReference: null,
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
        // Old saved carts remain loadable, but a malformed coordinate never
        // becomes a selected delivery point in the new cart model.
        deliveryLocation: (() => {
          const pin = parsed.customer?.deliveryLocation;
          return pin && typeof pin.lat === 'number' && typeof pin.lng === 'number' &&
            Number.isFinite(pin.lat) && Number.isFinite(pin.lng) &&
            pin.lat >= 22 && pin.lat <= 32 && pin.lng >= 24 && pin.lng <= 37
            ? { lat: Number(pin.lat.toFixed(6)), lng: Number(pin.lng.toFixed(6)) } : null;
        })(),
      },
      tableReference: typeof parsed.tableReference === 'string' ? parsed.tableReference : null,
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
