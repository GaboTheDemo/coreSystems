// src/pages/ProductDetailPage/ProductDetailPage.tsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productsData from '../../data/longProducts.json';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import styles from './ProductDetailPage.module.css';

// ─── helpers ──────────────────────────────────────────────────────────────────
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
interface SpecSectionProps { title: string; lines: string[]; }
const SpecSection: React.FC<SpecSectionProps> = ({ title, lines }) => (
  <div className={styles.specSection}>
    <h3 className={styles.specTitle}>{title}</h3>
    <ul className={styles.specList}>
      {lines.map((l, i) => <li key={i}>{l}</li>)}
    </ul>
  </div>
);

// ─── Related card ─────────────────────────────────────────────────────────────
interface RelatedCardProps { product: Product; onClick: () => void; }
const RelatedCard: React.FC<RelatedCardProps> = ({ product, onClick }) => (
  <button className={styles.relatedCard} onClick={onClick}>
    <div className={styles.relatedImageWrap}>
      <img src={product.image} alt={product.name} className={styles.relatedImage} loading="lazy" />
    </div>
    <p className={styles.relatedName}>{product.name}</p>
    <p className={styles.relatedPrice}>${product.price.toLocaleString('es-CO')}</p>
  </button>
);

// ─── AddToCart button with feedback ──────────────────────────────────────────
interface AddToCartBtnProps { onAdd: () => void; }
const AddToCartBtn: React.FC<AddToCartBtnProps> = ({ onAdd }) => {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      className={`${styles.addToCartBtn} ${added ? styles.addToCartBtnAdded : ''}`}
      onClick={handleClick}
    >
      {added ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          ¡Agregado!
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Agregar al carrito
        </>
      )}
    </button>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────
const ProductDetailPage: React.FC = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const product = useMemo(() => findProduct(slugOrId ?? ''), [slugOrId]);

  const [quantity, setQuantity]         = useState(1);
  const [activeThumb, setActiveThumb]   = useState(0);
  const [specsExpanded, setSpecsExpanded] = useState(false);

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

  const thumbs = [product.image, product.image, product.image];

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const specs = product.specs || {};
  const specSections: SpecSectionProps[] = [];

  if (specs.screenSize) {
    specSections.push({
      title: 'Pantalla',
      lines: [
        `Tamaño: ${specs.screenSize}`,
        specs.screenType || 'Pantalla Super Retina XDR OLED',
        specs.refreshRate || 'Tecnología ProMotion hasta 120 Hz',
      ],
    });
  }
  if (specs.processor) {
    specSections.push({
      title: 'Procesador',
      lines: [specs.processor, specs.processorDetails || 'Alto rendimiento para juegos y multitarea'].filter(Boolean),
    });
  }
  if (specs.ram) {
    specSections.push({ title: 'Memoria RAM', lines: [`${specs.ram} de RAM`] });
  }
  if (specs.storage) {
    specSections.push({ title: 'Capacidad de almacenamiento', lines: [specs.storage] });
  }
  if (specs.camera) {
    specSections.push({
      title: 'Cámaras',
      lines: [
        `Cámara principal ${specs.camera}`,
        specs.videoRecording || 'Grabación de video 4K',
        specs.frontCamera || 'Cámara frontal 12 MP',
      ],
    });
  }
  if (specs.battery) {
    specSections.push({
      title: 'Batería',
      lines: [specs.battery, specs.charging || 'Compatible con carga rápida e inalámbrica'].filter(Boolean),
    });
  }
  if (specs.connectivity) {
    specSections.push({ title: 'Conectividad', lines: [specs.connectivity] });
  }

  const visibleSpecs = specsExpanded ? specSections : specSections.slice(0, 2);

  // ── Handlers carrito ──────────────────────────────────────────────────────
  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    openCart();
    // O navega directo a checkout: navigate('/checkout');
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <button onClick={() => navigate('/')}>Home</button>
        <span>›</span>
        <button onClick={() => navigate(`/search?q=${encodeURIComponent(product.category)}`)}>
          {product.category}
        </button>
        <span>›</span>
        <span>{product.name}</span>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
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

        <div className={styles.mainImageWrap}>
          {discount > 0 && <span className={styles.discountBadge}>-{discount}%</span>}
          <img src={thumbs[activeThumb]} alt={product.name} className={styles.mainImage} />
        </div>

        <div className={styles.purchasePanel}>
          <h1 className={styles.productName}>{product.name}</h1>

          {product.rating !== undefined && (
            <div className={styles.ratingRow}>
              <span className={styles.stars}>
                {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
              </span>
              <span className={styles.ratingNum}>{product.rating.toFixed(1)}</span>
              {product.reviewCount !== undefined && (
                <span className={styles.reviewCount}>({product.reviewCount} reviews)</span>
              )}
            </div>
          )}

          {(product.badges ?? []).length > 0 && (
            <div className={styles.badgeRow}>
              {product.badges!.map(b => <span key={b} className={styles.badge}>{b}</span>)}
            </div>
          )}

          <div className={styles.priceBlock}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <div className={styles.quantityRow}>
            <button className={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button className={styles.qtyBtn} onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          {/* Botones de acción con lógica de carrito */}
          <AddToCartBtn onAdd={handleAddToCart} />
          <button className={styles.buyNowBtn} onClick={handleBuyNow}>Comprar</button>

          <ul className={styles.quickSpecs}>
            {specs.storage    && <li>· Capacidad de almacenamiento: {specs.storage}</li>}
            {specs.screenSize && <li>· Tamaño de la pantalla: {specs.screenSize}</li>}
            {specs.camera     && <li>· Cámara posterior: {specs.camera}</li>}
            {specs.ram        && <li>· Memoria RAM: {specs.ram}</li>}
            {product.color    && <li>· Color: {product.color}</li>}
          </ul>

          {product.stock !== undefined && (
            <p className={styles.stock}>
              {product.stock > 0
                ? <><span className={styles.inStock}>●</span> {product.stock} units available</>
                : <><span className={styles.outStock}>●</span> Out of stock</>}
            </p>
          )}
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.detailSection}>
        {product.description && (
          <div className={styles.descBlock}>
            <h2 className={styles.sectionTitle}>Descripción general</h2>
            <p className={styles.description}>{product.description}</p>
          </div>
        )}

        {visibleSpecs.map(s => <SpecSection key={s.title} title={s.title} lines={s.lines} />)}

        {specSections.length > 2 && (
          <button className={styles.toggleSpecs} onClick={() => setSpecsExpanded(v => !v)}>
            {specsExpanded ? '∧ Ver menos' : '∨ Ver más especificaciones'}
          </button>
        )}
      </section>

      <hr className={styles.divider} />

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