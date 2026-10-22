'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultCartState, loadCartState, saveCartState } from '@/lib/cart-storage';
import type { CartCustomerForm, CartDraftItemInput, CartDraftOfferItemInput, CartItem, CartState } from '@/types/cart';

type CartContextValue = {
  items: CartItem[];
  customer: CartCustomerForm;
  tableReference: string | null;
  isHydrated: boolean;
  itemsCount: number;
  subtotal: number;
  addItem: (input: CartDraftItemInput) => void;
  addOfferItem: (input: CartDraftOfferItemInput) => void;
  replaceProductItem: (lineId: string, input: CartDraftItemInput) => void;
  updateItemQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  updateCustomer: (input: Partial<CartCustomerForm>) => void;
  updateTableReference: (value: string | null) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function toProductCartItem(input: CartDraftItemInput): CartItem {
  const safeQuantity = Math.max(1, input.quantity);
  return { lineId: crypto.randomUUID(), kind: 'product', ...input, quantity: safeQuantity, totalItemPrice: input.unitPrice * safeQuantity };
}

function toOfferCartItem(input: CartDraftOfferItemInput): CartItem {
  const safeQuantity = Math.max(1, input.quantity ?? 1);
  return {
    lineId: crypto.randomUUID(),
    kind: 'offer',
    offerId: input.offerId,
    offerTitle: input.offerTitle,
    quantity: safeQuantity,
    unitPrice: input.unitPrice,
    totalItemPrice: input.unitPrice * safeQuantity,
    itemNotes: input.itemNotes?.trim() ?? '',
  };
}

function normalizeItem(item: any): CartItem | null {
  if (!item || typeof item !== 'object') return null;
  if (item.kind === 'offer' && typeof item.offerId === 'string' && typeof item.offerTitle === 'string') {
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const unitPrice = Number(item.unitPrice) || 0;
    return { ...item, kind: 'offer', quantity, unitPrice, totalItemPrice: unitPrice * quantity, itemNotes: typeof item.itemNotes === 'string' ? item.itemNotes : '' };
  }
  if (typeof item.productId === 'string' && typeof item.productName === 'string') {
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const unitPrice = Number(item.unitPrice) || 0;
    return {
      ...item,
      kind: 'product',
      selectedSize: item.selectedSize ?? null,
      selectedAddons: Array.isArray(item.selectedAddons) ? item.selectedAddons : [],
      itemNotes: typeof item.itemNotes === 'string' ? item.itemNotes : '',
      quantity,
      unitPrice,
      totalItemPrice: unitPrice * quantity,
    };
  }
  return null;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>(defaultCartState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadCartState();
    setState({ ...loaded, items: loaded.items.map(normalizeItem).filter(Boolean) as CartItem[] });
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) saveCartState(state);
  }, [state, isHydrated]);

  const subtotal = useMemo(() => state.items.reduce((sum, item) => sum + item.totalItemPrice, 0), [state.items]);
  const itemsCount = useMemo(() => state.items.reduce((sum, item) => sum + item.quantity, 0), [state.items]);

  // A checkmark describes the current exact basket + fulfillment + contact.
  // An edit invalidates that review so the customer can knowingly confirm it.
  const resetReview=(customer:CartCustomerForm):CartCustomerForm=>({...customer,confirmedAccurateDetails:false});
  const addItem = useCallback((input: CartDraftItemInput) => setState((c) => ({
    ...c,customer:resetReview(c.customer),items: [...c.items, toProductCartItem(input)],
  })), []);
  const addOfferItem = useCallback((input: CartDraftOfferItemInput) => setState((c) => ({
    ...c,customer:resetReview(c.customer),items: [...c.items, toOfferCartItem(input)],
  })), []);
  // Editing an existing receipt line preserves its identity and position.
  // Do not convert an edit into an additional item in the cart.
  const replaceProductItem = useCallback((lineId: string, input: CartDraftItemInput) => {
    setState((c) => {
      const found=c.items.some(item=>item.kind==='product' && item.lineId===lineId && item.productId===input.productId);
      if(!found)return c;
      const quantity=Math.max(1,Math.min(50,input.quantity));
      return {...c,customer:resetReview(c.customer),items:c.items.map(item=>
        item.kind==='product' && item.lineId===lineId && item.productId===input.productId
          ? {...item,...input,kind:'product' as const,lineId,quantity,totalItemPrice:input.unitPrice*quantity}
          : item,
      )};
    });
  }, []);
  const updateItemQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity < 1 || quantity>50) return;
    setState((c) => {
      const existing=c.items.find(item=>item.lineId===lineId);
      if(!existing || existing.quantity===quantity)return c;
      return {...c,customer:resetReview(c.customer),items:c.items.map(item=>
        item.lineId===lineId ? {...item,quantity,totalItemPrice:item.unitPrice*quantity} : item,
      )};
    });
  }, []);
  const removeItem = useCallback((lineId: string) => setState((c) => (
    c.items.some(item=>item.lineId===lineId)
      ? {...c,customer:resetReview(c.customer),items:c.items.filter(item=>item.lineId!==lineId)}
      : c
  )), []);
  const clearCart = useCallback(() => setState((c) => ({
    ...c,items:[],customer:resetReview(c.customer),
  })), []);
  const updateCustomer = useCallback((input: Partial<CartCustomerForm>) => setState((c) => {
    const changed=Object.keys(input).some(key=>key!=='confirmedAccurateDetails');
    return {...c,customer:{
      ...c.customer,...input,
      ...(changed?{confirmedAccurateDetails:false}:{}),
    }};
  }), []);
  const updateTableReference = useCallback((value: string | null) => setState((c) =>
    c.tableReference===value?c:{
      ...c,tableReference:value,customer:resetReview(c.customer),
    }
  ), []);

  const value = useMemo(() => ({ items: state.items, customer: state.customer, tableReference: state.tableReference, isHydrated, itemsCount, subtotal, addItem, addOfferItem, replaceProductItem, updateItemQuantity, removeItem, clearCart, updateCustomer, updateTableReference }), [state, isHydrated, itemsCount, subtotal, addItem, addOfferItem, replaceProductItem, updateItemQuantity, removeItem, clearCart, updateCustomer, updateTableReference]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
