// src/components/CartItem/CartItem.tsx
// Línea de producto dentro del carrito: imagen, nombre, precio, controles de
// cantidad (- / +) y botón para eliminar el item.

import React from 'react';
import type { CartItem as CartItemType } from '../../types';
import { formatCartPrice } from '../../services/cartService';
import styles from './CartItem.module.css';

interface CartItemProps {
  item: CartItemType;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const { product, quantity } = item;

  return (
    <div className={styles.row}>
      <div className={styles.imageWrap}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/96x96?text=No+Image';
          }}
        />
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.price}>{formatCartPrice(product.price)}</p>
      </div>

      <button
        type="button"
        className={styles.removeBtn}
        onClick={() => onRemove(product.id)}
        aria-label="Eliminar producto"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>

      <div className={styles.qtyControls}>
        <button
          type="button"
          className={styles.qtyBtn}
          onClick={() => onDecrease(product.id)}
          aria-label="Disminuir cantidad"
        >
          -
        </button>
        <span className={styles.qtyValue}>{quantity}</span>
        <button
          type="button"
          className={styles.qtyBtn}
          onClick={() => onIncrease(product.id)}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;
