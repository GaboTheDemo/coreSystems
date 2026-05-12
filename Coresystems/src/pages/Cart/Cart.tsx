// src/pages/Cart/Cart.tsx
// Página del carrito de compras. Replica fielmente los dos estados de los mockups:
//   1. Carrito vacío con icono de bolsa y CTA "Explora productos".
//   2. Carrito con items: lista de productos + resumen del pedido a la derecha.

import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import CartItem from '../../components/CartItem/CartItem';
import { useCart } from '../../context/CartContext';
import { formatCartPrice } from '../../services/cartService';
import styles from './Cart.module.css';

interface CartProps {
  onExploreProducts?: () => void;
  onContinueShopping?: () => void;
  onCheckout?: () => void;
}

const Cart: React.FC<CartProps> = ({
  onExploreProducts,
  onContinueShopping,
  onCheckout,
}) => {
  const {
    items,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const isEmpty = items.length === 0;

  return (
    <div className={styles.page}>
      <Navbar />

      {isEmpty ? (
        <section className={styles.emptyState}>
          <div className={styles.emptyBagIcon} aria-hidden="true">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M6 7h12l-1.2 13.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7z" />
              <path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>
          </div>
          <h1 className={styles.emptyTitle}>Tu carrito esta vacio</h1>
          <p className={styles.emptySubtitle}>
            Descubre nuestros productos y encuentra lo que buscas
          </p>
          <button
            type="button"
            className={styles.exploreBtn}
            onClick={onExploreProducts}
          >
            Explora productos
          </button>
        </section>
      ) : (
        <section className={styles.content}>
          <div className={styles.itemsCol}>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <button
              type="button"
              className={styles.clearBtn}
              onClick={clearCart}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              </svg>
              <span>Vaciar carrito</span>
            </button>
          </div>

          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Resumen del pedido</h2>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Subtotal</span>
              <span className={styles.summaryValueStrong}>
                {formatCartPrice(total)}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Envio</span>
              <span className={styles.summaryFree}>GRATIS</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Descuentos</span>
              <span className={styles.summaryValueStrong}>$0</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>{formatCartPrice(total)}</span>
            </div>
            <p className={styles.installments}>12 cuotas sin interes</p>

            <button
              type="button"
              className={styles.buyBtn}
              onClick={onCheckout}
            >
              Comprar
            </button>

            <button
              type="button"
              className={styles.continueBtn}
              onClick={onContinueShopping}
            >
              Seguir comprando
            </button>

            <div className={styles.secureBox} aria-hidden="true">
              <p className={styles.secureTitle}>Pago seguro</p>
              <p className={styles.secureSubtitle}>Tus datos están seguros</p>
            </div>
          </aside>
        </section>
      )}
    </div>
  );
};

export default Cart;
