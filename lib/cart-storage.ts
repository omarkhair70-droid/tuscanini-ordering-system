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
    paymentMethod: 'cash',
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
        paymentMethod: ['cash','instapay_on_handoff','vodafone_cash_on_handoff'].includes(String(parsed.customer?.paymentMethod))
          ? parsed.customer!.paymentMethod : 'cash',
        address: typeof parsed.customer?.address === 'string'
          ? parsed.customer.address.split('\nموقع التوصيل:')[0] : '',
        // Old saved carts remain loadable, but a malformed coordinate never
        // becomes a selected delivery point in the new cart model.
        deliveryLocation: (() => {
          const oldAddress = typeof parsed.customer?.address === 'string' ? parsed.customer.address : '';
          const previous = oldAddress.match(/\nموقع التوصيل: https:\/\/maps\.google\.com\/\?q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
          const legacyPin = previous ? {lat:Number(previous[1]),lng:Number(previous[2])} : null;
          const pin = parsed.customer?.deliveryLocation ?? legacyPin;
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
