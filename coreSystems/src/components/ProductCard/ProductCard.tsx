// src/components/ProductCard/ProductCard.tsx
import React from 'react';
import { type Product } from '../../types';
import { formatPrice } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Evitar que el click del botón dispare onClick del card
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <div className={styles.card} onClick={() => onClick?.(product)}>
      {product.isOnSale && product.discountPercent && (
        <span className={styles.badge}>-{product.discountPercent}%</span>
      )}
      <div className={styles.imageWrapper}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/220x180?text=No+Image';
          }}
        />
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <button
          type="button"
          className={styles.addBtn}
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
