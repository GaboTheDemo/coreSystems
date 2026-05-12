// src/pages/ProductDetailPage/ProductDetailPage.tsx
// Página de detalle de producto.
// Navega desde SearchResultsPage con: navigate(`/product/${product.slug ?? product.id}`)
// Lee el param :slugOrId de la URL y busca el producto en el JSON local.

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productsData from '../../data/products.json';
import type { Product } from '../../types';
import styles from './ProductDetailPage.module.css';

// ─── helpers ─────────────────────────────────────────────────────────────────

const ALL_PRODUCTS = productsData as Product[];

function findProduct(slugOrId: string): Product | undefined {
  return ALL_PRODUCTS.find(
    p => p.slug === slugOrId || String(p.id) === slugOrId
  );
}

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-CO')} COP`;
}

// ─── Spec section block ───────────────────────────────────────────────────────

interface SpecSectionProps {
  title: string;
  lines: string[];
}
const SpecSection: React.FC<SpecSectionProps> = ({ title, lines }) => (
  <div className={styles.specSection}>
    <h3 className={styles.specTitle}>{title}</h3>
    <ul className={styles.specList}>
      {lines.map((l, i) => <li key={i}>{l}</li>)}
    </ul>
  </div>
);

// ─── Related card ─────────────────────────────────────────────────────────────

interface RelatedCardProps {
  product: Product;
  onClick: () => void;
}
const RelatedCard: React.FC<RelatedCardProps> = ({ product, onClick }) => (
  <button className={styles.relatedCard} onClick={onClick}>
    <div className={styles.relatedImageWrap}>
      <img src={product.image} alt={product.name} className={styles.relatedImage} loading="lazy" />
    </div>
    <p className={styles.relatedName}>{product.name}</p>
    <p className={styles.relatedPrice}>${product.price.toLocaleString('es-CO')}</p>
  </button>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const ProductDetailPage: React.FC = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const navigate = useNavigate();

  const product = useMemo(() => findProduct(slugOrId ?? ''), [slugOrId]);

  const [quantity, setQuantity]         = useState(1);
  const [activeThumb, setActiveThumb]   = useState(0);
  const [specsExpanded, setSpecsExpanded] = useState(false);

  // ── Related products (same category, excluding current) ──────────────────
  const related = useMemo(() => {
    if (!product) return [];
    return ALL_PRODUCTS
      .filter(p => p.category === product.category && String(p.id) !== String(product.id))
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p>Product not found.</p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Go back</button>
      </div>
    );
  }

  // Build a small image gallery from the single image (mock multiple angles)
  const thumbs = [product.image, product.image, product.image];

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Build spec sections from product.specs + description
  const specSections = [
    product.specs?.screenSize && {
      title: 'Pantalla',
      lines: [
        `Tamaño: ${product.specs.screenSize}`,
        'Pantalla Super Retina XDR OLED',
        'Tecnología ProMotion hasta 120 Hz',
      ],
    },
    product.specs?.ram && {
      title: 'Memoria RAM',
      lines: [`${product.specs.ram} de RAM`],
    },
    product.specs?.storage && {
      title: 'Capacidad de almacenamiento',
      lines: [product.specs.storage],
    },
    product.specs?.camera && {
      title: 'Cámaras',
      lines: [
        `Cámara principal ${product.specs.camera}`,
        'Grabación de video 4K',
        'Cámara frontal 12 MP',
      ],
    },
  ].filter(Boolean) as SpecSectionProps[];

  const visibleSpecs = specsExpanded ? specSections : specSections.slice(0, 2);

  return (
    <div className={styles.page}>

      {/* ── Breadcrumb ── */}
      <nav className={styles.breadcrumb}>
        <button onClick={() => navigate('/')}>Home</button>
        <span>›</span>
        <button onClick={() => navigate(`/search?q=${encodeURIComponent(product.category)}`)}>
          {product.category}
        </button>
        <span>›</span>
        <span>{product.name}</span>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>

        {/* Thumbnails */}
        <div className={styles.thumbCol}>
          {thumbs.map((src, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${activeThumb === i ? styles.thumbActive : ''}`}
              onClick={() => setActiveThumb(i)}
            >
              <img src={src} alt={`${product.name} view ${i + 1}`} />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className={styles.mainImageWrap}>
          {discount > 0 && (
            <span className={styles.discountBadge}>-{discount}%</span>
          )}
          <img
            src={thumbs[activeThumb]}
            alt={product.name}
            className={styles.mainImage}
          />
        </div>

        {/* Purchase panel */}
        <div className={styles.purchasePanel}>
          <h1 className={styles.productName}>{product.name}</h1>

          {/* Rating */}
          {product.rating !== undefined && (
            <div className={styles.ratingRow}>
              <span className={styles.stars}>
                {'★'.repeat(Math.round(product.rating))}
                {'☆'.repeat(5 - Math.round(product.rating))}
              </span>
              <span className={styles.ratingNum}>{product.rating.toFixed(1)}</span>
              {product.reviewCount !== undefined && (
                <span className={styles.reviewCount}>({product.reviewCount} reviews)</span>
              )}
            </div>
          )}

          {/* Badges */}
          {(product.badges ?? []).length > 0 && (
            <div className={styles.badgeRow}>
              {product.badges!.map(b => (
                <span key={b} className={styles.badge}>{b}</span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className={styles.priceBlock}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Quantity */}
          <div className={styles.quantityRow}>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >−</button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity(q => q + 1)}
              aria-label="Increase quantity"
            >+</button>
          </div>

          {/* CTAs */}
          <button className={styles.addToCartBtn}>
            Agregar al carrito
          </button>
          <button className={styles.buyNowBtn}>
            Comprar
          </button>

          {/* Quick specs summary */}
          <ul className={styles.quickSpecs}>
            {product.specs?.storage    && <li>· Capacidad de almacenamiento: {product.specs.storage}</li>}
            {product.specs?.screenSize && <li>· Tamaño de la pantalla: {product.specs.screenSize}</li>}
            {product.specs?.camera     && <li>· Cámara posterior: {product.specs.camera}</li>}
            {product.specs?.ram        && <li>· Memoria RAM: {product.specs.ram}</li>}
            {product.color             && <li>· Color: {product.color}</li>}
          </ul>

          {/* Stock */}
          {product.stock !== undefined && (
            <p className={styles.stock}>
              {product.stock > 0
                ? <><span className={styles.inStock}>●</span> {product.stock} units available</>
                : <><span className={styles.outStock}>●</span> Out of stock</>
              }
            </p>
          )}
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ── Description + Specs ── */}
      <section className={styles.detailSection}>

        {product.description && (
          <div className={styles.descBlock}>
            <h2 className={styles.sectionTitle}>Descripción general</h2>
            <p className={styles.description}>{product.description}</p>
          </div>
        )}

        {visibleSpecs.map(s => (
          <SpecSection key={s.title} title={s.title} lines={s.lines} />
        ))}

        {specSections.length > 2 && (
          <button
            className={styles.toggleSpecs}
            onClick={() => setSpecsExpanded(v => !v)}
          >
            {specsExpanded ? '∧ Ver menos' : '∨ Ver más especificaciones'}
          </button>
        )}
      </section>

      <hr className={styles.divider} />

      {/* ── Related products ── */}
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Más Productos</h2>
          <div className={styles.relatedGrid}>
            {related.map(p => (
              <RelatedCard
                key={p.id}
                product={p}
                onClick={() => navigate(`/product/${p.slug ?? p.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;