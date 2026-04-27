'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultCartState, loadCartState, saveCartState } from '@/lib/cart-storage';
import type { CartCustomerForm, CartDraftItemInput, CartItem, CartState } from '@/types/cart';

type CartContextValue = {
  items: CartItem[];
  customer: CartCustomerForm;
  isHydrated: boolean;
  itemsCount: number;
  subtotal: number;
  addItem: (input: CartDraftItemInput) => void;
  updateItemQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  updateCustomer: (input: Partial<CartCustomerForm>) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function toCartItem(input: CartDraftItemInput): CartItem {
  const safeQuantity = Math.max(1, input.quantity);

  return {
    lineId: crypto.randomUUID(),
    productId: input.productId,
    productName: input.productName,
    selectedSize: input.selectedSize,
    selectedAddons: input.selectedAddons,
    quantity: safeQuantity,
    itemNotes: input.itemNotes,
    unitPrice: input.unitPrice,
    totalItemPrice: input.unitPrice * safeQuantity,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>(defaultCartState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setState(loadCartState());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    saveCartState(state);
  }, [state, isHydrated]);

  const subtotal = useMemo(() => state.items.reduce((sum, item) => sum + item.totalItemPrice, 0), [state.items]);
  const itemsCount = useMemo(() => state.items.reduce((sum, item) => sum + item.quantity, 0), [state.items]);

  const value: CartContextValue = {
    items: state.items,
    customer: state.customer,
    isHydrated,
    itemsCount,
    subtotal,
    addItem: (input) => {
      setState((current) => {
        const newItem = toCartItem(input);
        return { ...current, items: [...current.items, newItem] };
      });
    },
    updateItemQuantity: (lineId, quantity) => {
      if (quantity < 1) {
        return;
      }

      setState((current) => ({
        ...current,
        items: current.items.map((item) =>
          item.lineId === lineId
            ? {
                ...item,
                quantity,
                totalItemPrice: item.unitPrice * quantity,
              }
            : item,
        ),
      }));
    },
    removeItem: (lineId) => {
      setState((current) => ({
        ...current,
        items: current.items.filter((item) => item.lineId !== lineId),
      }));
    },
    clearCart: () => {
      setState((current) => ({ ...current, items: [] }));
    },
    updateCustomer: (input) => {
      setState((current) => ({
        ...current,
        customer: { ...current.customer, ...input },
      }));
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
