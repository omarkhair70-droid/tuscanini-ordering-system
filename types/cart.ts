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

export type CartCustomerForm = {
  name: string;
  phone: string;
  address: string;
  orderType: OrderType;
  generalNotes: string;
  confirmedAccurateDetails: boolean;
};

export type CartState = {
  items: CartItem[];
  customer: CartCustomerForm;
  tableReference: string | null;
};
