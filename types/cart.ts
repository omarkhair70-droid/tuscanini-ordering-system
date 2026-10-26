import type {MenuCategorySlug} from '@/types/menu';

export type CartItemAddon = {
  id: string;
  label: string;
  price: number;
};

export type CartItemSize = {
  id: string;
  label: string;
  price: number;
};

export type ProductCartItem = {
  lineId: string;
  kind: 'product';
  productId: string;
  productName: string;
  /** Optional only for legacy saved baskets; new additions always capture it. */
  categorySlug?: MenuCategorySlug;
  selectedSize: CartItemSize | null;
  selectedAddons: CartItemAddon[];
  quantity: number;
  itemNotes: string;
  unitPrice: number;
  totalItemPrice: number;
};

export type OfferCartItem = {
  lineId: string;
  kind: 'offer';
  offerId: string;
  offerTitle: string;
  quantity: number;
  unitPrice: number;
  totalItemPrice: number;
  itemNotes: string;
};

export type CartItem = ProductCartItem | OfferCartItem;

export type CartDraftItemInput = {
  productId: string;
  productName: string;
  categorySlug: MenuCategorySlug;
  selectedSize: CartItemSize | null;
  selectedAddons: CartItemAddon[];
  quantity: number;
  itemNotes: string;
  unitPrice: number;
};

export type CartDraftOfferItemInput = {
  offerId: string;
  offerTitle: string;
  quantity?: number;
  unitPrice: number;
  itemNotes?: string;
};

export type OrderType = 'delivery' | 'pickup';
/** A preferred way to pay at handoff, not an online payment transaction. */
export type HandoffPaymentMethod = 'cash' | 'instapay_on_handoff' | 'vodafone_cash_on_handoff';

/** Exact user-selected doorstep coordinate, not restaurant location or IP estimate. */
export type CustomerDeliveryLocation = { lat: number; lng: number };

export type CartCustomerForm = {
  name: string;
  phone: string;
  address: string;
  deliveryLocation?: CustomerDeliveryLocation | null;
  /** Suggested neighborhood from consented GPS lookup, NOT a confirmed street. */
  deliveryArea?: string;
  orderType: OrderType;
  paymentMethod: HandoffPaymentMethod;
  generalNotes: string;
  confirmedAccurateDetails: boolean;
};

export type CartState = {
  items: CartItem[];
  customer: CartCustomerForm;
  tableReference: string | null;
};
