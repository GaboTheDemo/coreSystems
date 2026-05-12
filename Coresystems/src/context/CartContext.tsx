// src/context/CartContext.tsx
// Contexto global del carrito: provee el estado y las acciones para manejar
// items del carrito desde cualquier parte de la app (Navbar, ProductCard, Cart page, etc.)

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import type { CartItem, CartState, Product } from '../types';
import {
  calculateCartItemCount,
  calculateCartTotal,
} from '../services/cartService';

// ---------- Tipos ----------

interface CartContextValue extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'INCREASE'; productId: number }
  | { type: 'DECREASE'; productId: number }
  | { type: 'UPDATE_QTY'; productId: number; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] };

// ---------- Estado inicial + persistencia ----------

const STORAGE_KEY = 'coresystems.cart.v1';

const initialItems: CartItem[] = [];

const buildState = (items: CartItem[]): CartState => ({
  items,
  total: calculateCartTotal(items),
  itemCount: calculateCartItemCount(items),
});

// ---------- Reducer ----------

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'HYDRATE':
      return buildState(action.items);

    case 'ADD_ITEM': {
      const existing = state.items.find(
        (it) => it.product.id === action.product.id
      );
      const items = existing
        ? state.items.map((it) =>
            it.product.id === action.product.id
              ? { ...it, quantity: it.quantity + action.quantity }
              : it
          )
        : [...state.items, { product: action.product, quantity: action.quantity }];
      return buildState(items);
    }

    case 'REMOVE_ITEM': {
      const items = state.items.filter((it) => it.product.id !== action.productId);
      return buildState(items);
    }

    case 'INCREASE': {
      const items = state.items.map((it) =>
        it.product.id === action.productId
          ? { ...it, quantity: it.quantity + 1 }
          : it
      );
      return buildState(items);
    }

    case 'DECREASE': {
      const items = state.items
        .map((it) =>
          it.product.id === action.productId
            ? { ...it, quantity: it.quantity - 1 }
            : it
        )
        .filter((it) => it.quantity > 0);
      return buildState(items);
    }

    case 'UPDATE_QTY': {
      const qty = Math.max(0, action.quantity);
      const items = state.items
        .map((it) =>
          it.product.id === action.productId ? { ...it, quantity: qty } : it
        )
        .filter((it) => it.quantity > 0);
      return buildState(items);
    }

    case 'CLEAR':
      return buildState([]);

    default:
      return state;
  }
};

// ---------- Context ----------

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, buildState(initialItems));

  // Hidratar desde localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          dispatch({ type: 'HYDRATE', items: parsed });
        }
      }
    } catch {
      // Ignorar errores de parseo
    }
  }, []);

  // Persistir cambios
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      addItem: (product, quantity = 1) =>
        dispatch({ type: 'ADD_ITEM', product, quantity }),
      removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
      increaseQuantity: (productId) =>
        dispatch({ type: 'INCREASE', productId }),
      decreaseQuantity: (productId) =>
        dispatch({ type: 'DECREASE', productId }),
      updateQuantity: (productId, quantity) =>
        dispatch({ type: 'UPDATE_QTY', productId, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ---------- Hook ----------

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return ctx;
};
