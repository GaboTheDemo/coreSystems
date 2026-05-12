// src/context/FavoritesContext.tsx
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';

// ─── Estado ──────────────────────────────────────────────────────────────────
interface FavoritesState {
  items: Product[];
  isOpen: boolean;
}

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; product: Product }
  | { type: 'REMOVE_FAVORITE'; productId: string | number }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'TOGGLE_DRAWER' };

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      if (state.items.some(p => String(p.id) === String(action.product.id))) return state;
      return { ...state, items: [...state.items, action.product] };
    case 'REMOVE_FAVORITE':
      return { ...state, items: state.items.filter(p => String(p.id) !== String(action.productId)) };
    case 'OPEN_DRAWER':
      return { ...state, isOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, isOpen: false };
    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
};

// ─── Contexto ────────────────────────────────────────────────────────────────
interface FavoritesContextValue {
  items: Product[];
  isOpen: boolean;
  totalFavorites: number;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string | number) => void;
  isFavorite: (productId: string | number) => boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, { items: [], isOpen: false });

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      try {
        const items = JSON.parse(saved);
        if (Array.isArray(items)) {
          items.forEach(p => dispatch({ type: 'ADD_FAVORITE', product: p }));
        }
      } catch (e) {}
    }
  }, []);

  // Guardar en localStorage cuando cambien los favoritos
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(state.items));
  }, [state.items]);

  const addFavorite = useCallback((product: Product) => {
    dispatch({ type: 'ADD_FAVORITE', product });
  }, []);

  const removeFavorite = useCallback((productId: string | number) => {
    dispatch({ type: 'REMOVE_FAVORITE', productId });
  }, []);

  const isFavorite = useCallback((productId: string | number) => {
    return state.items.some(p => String(p.id) === String(productId));
  }, [state.items]);

  const openDrawer = useCallback(() => dispatch({ type: 'OPEN_DRAWER' }), []);
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), []);
  const toggleDrawer = useCallback(() => dispatch({ type: 'TOGGLE_DRAWER' }), []);

  const totalFavorites = state.items.length;

  return (
    <FavoritesContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      totalFavorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextValue => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return ctx;
};