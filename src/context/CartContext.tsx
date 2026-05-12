// src/context/CartContext.tsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Product } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM';    product: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: number | string }
  | { type: 'UPDATE_QTY';  productId: number | string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' };

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.findIndex(i => String(i.product.id) === String(action.product.id));
      if (existing >= 0) {
        const updated = [...state.items];
        updated[existing] = {
          ...updated[existing],
          quantity: updated[existing].quantity + (action.quantity ?? 1),
        };
        return { ...state, items: updated };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity ?? 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => String(i.product.id) !== String(action.productId)) };
    case 'UPDATE_QTY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => String(i.product.id) !== String(action.productId)) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          String(i.product.id) === String(action.productId) ? { ...i, quantity: action.quantity } : i
        ),
      };
    }
    case 'CLEAR':   return { ...state, items: [] };
    case 'OPEN':    return { ...state, isOpen: true };
    case 'CLOSE':   return { ...state, isOpen: false };
    case 'TOGGLE':  return { ...state, isOpen: !state.isOpen };
    default:        return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const addItem      = useCallback((product: Product, quantity = 1) => dispatch({ type: 'ADD_ITEM', product, quantity }), []);
  const removeItem   = useCallback((productId: number | string) => dispatch({ type: 'REMOVE_ITEM', productId }), []);
  const updateQuantity = useCallback((productId: number | string, quantity: number) => dispatch({ type: 'UPDATE_QTY', productId, quantity }), []);
  const clearCart    = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const openCart     = useCallback(() => dispatch({ type: 'OPEN' }), []);
  const closeCart    = useCallback(() => dispatch({ type: 'CLOSE' }), []);
  const toggleCart   = useCallback(() => dispatch({ type: 'TOGGLE' }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items, isOpen: state.isOpen,
      totalItems, totalPrice,
      addItem, removeItem, updateQuantity, clearCart,
      openCart, closeCart, toggleCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}