// src/services/cartService.ts
// Lógica pura para el carrito: cálculos, formato y helpers reutilizables.
// No depende de React: puede usarse desde el reducer del CartContext o desde tests.

import type { CartItem } from '../types';

/** Suma el subtotal de todos los items del carrito (precio * cantidad). */
export const calculateCartTotal = (items: CartItem[]): number =>
  items.reduce((acc, it) => acc + it.product.price * it.quantity, 0);

/** Suma la cantidad total de unidades en el carrito (badge del Navbar). */
export const calculateCartItemCount = (items: CartItem[]): number =>
  items.reduce((acc, it) => acc + it.quantity, 0);

/** Calcula el descuento total acumulado por items en oferta. */
export const calculateCartDiscount = (items: CartItem[]): number =>
  items.reduce((acc, it) => {
    if (it.product.isOnSale && it.product.discountPercent) {
      const lineTotal = it.product.price * it.quantity;
      return acc + (lineTotal * it.product.discountPercent) / 100;
    }
    return acc;
  }, 0);

/** Formato de precio en COP (Pesos Colombianos) — igual al del productService. */
export const formatCartPrice = (price: number): string =>
  `$${Math.round(price).toLocaleString('es-CO')} COP`;
