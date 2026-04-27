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

export type CartItem = {
  lineId: string;
  productId: string;
  productName: string;
  selectedSize: CartItemSize | null;
  selectedAddons: CartItemAddon[];
  quantity: number;
  itemNotes: string;
  unitPrice: number;
  totalItemPrice: number;
};

export type CartDraftItemInput = {
  productId: string;
  productName: string;
  selectedSize: CartItemSize | null;
  selectedAddons: CartItemAddon[];
  quantity: number;
  itemNotes: string;
  unitPrice: number;
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
};
