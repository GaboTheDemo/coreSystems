// src/pages/ProductDetailPage/ProductDetailPage.tsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productsData from '../../data/longProducts.json'; // ← CAMBIO IMPORTANTE
import type { Product } from '../../types';
import styles from './ProductDetailPage.module.css';

const ALL_PRODUCTS = productsData as Product[];

function findProduct(slugOrId: string): Product | undefined {
  return ALL_PRODUCTS.find(
    p => p.slug === slugOrId || String(p.id) === slugOrId
  );
}

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-CO')} COP`;
}

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

const ProductDetailPage: React.FC = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const navigate = useNavigate();

  const product = useMemo(() => findProduct(slugOrId ?? ''), [slugOrId]);

  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
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

  // ─── Construcción DINÁMICA de especificaciones usando todas las claves de specs ───
  const specSections: SpecSectionProps[] = [];
  const specs = product.specs || {};

  // Mapeo de claves a títulos en español
  const titleMap: Record<string, string> = {
    screenSize: 'Pantalla',
    screenType: 'Tipo de pantalla',
    resolution: 'Resolución',
    refreshRate: 'Frecuencia',
    panel: 'Panel',
    hdr: 'HDR',
    camera: 'Cámaras',
    frontCamera: 'Cámara frontal',
    videoRecording: 'Grabación de video',
    processor: 'Procesador',
    processorDetails: 'Detalles del procesador',
    ram: 'Memoria RAM',
    storage: 'Almacenamiento',
    gpu: 'GPU',
    battery: 'Batería',
    charging: 'Carga',
    chargingSpeed: 'Velocidad de carga',
    connectivity: 'Conectividad',
    gps: 'GPS',
    simCard: 'SIM',
    ports: 'Puertos',
    audioOutput: 'Audio',
    vrSupport: 'Soporte VR',
    os: 'Sistema operativo',
    smartOS: 'Smart OS',
    sensors: 'Sensores',
    emergencySOS: 'Emergencia SOS',
    crashDetection: 'Detección de accidentes',
    altimeter: 'Altímetro',
    compass: 'Brújula',
    spen: 'S Pen',
    dimensions: 'Dimensiones',
    weight: 'Peso',
    waterResistance: 'Resistencia al agua',
    body: 'Material',
    wirelessCharging: 'Carga inalámbrica',
    nfc: 'NFC',
    keyboard: 'Teclado',
    webcam: 'Webcam',
    optical: 'Lector óptico',
    coolingSystem: 'Sistema de refrigeración',
    displayTech: 'Tecnología de pantalla',
  };

  // Agrupar especificaciones por clave (cada clave se convierte en una sección)
  Object.entries(specs).forEach(([key, value]) => {
    if (value && typeof value === 'string') {
      const title = titleMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
      specSections.push({ title, lines: [value] });
    }
  });

  // Si no hay especificaciones, mostrar un mensaje (opcional)
  if (specSections.length === 0) {
    specSections.push({ title: 'Especificaciones', lines: ['No hay información adicional'] });
  }

  const visibleSpecs = specsExpanded ? specSections : specSections.slice(0, 2);

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb}>
        <button onClick={() => navigate('/')}>Home</button>
        <span>›</span>
        <button onClick={() => navigate(`/search?q=${encodeURIComponent(product.category)}`)}>
          {product.category}
        </button>
        <span>›</span>
        <span>{product.name}</span>
      </nav>

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

          <button className={styles.addToCartBtn}>Agregar al carrito</button>
          <button className={styles.buyNowBtn}>Comprar</button>

          <ul className={styles.quickSpecs}>
            {specs.storage && <li>· Capacidad de almacenamiento: {specs.storage}</li>}
            {specs.screenSize && <li>· Tamaño de la pantalla: {specs.screenSize}</li>}
            {specs.camera && <li>· Cámara posterior: {specs.camera}</li>}
            {specs.ram && <li>· Memoria RAM: {specs.ram}</li>}
            {product.color && <li>· Color: {product.color}</li>}
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