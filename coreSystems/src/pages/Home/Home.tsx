// src/pages/Home/Home.tsx
import React, { useState, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getSaleProducts } from '../../services/productService';
import styles from './Home.module.css';
import type { Product } from '../../types';

const FEATURE_CARDS = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Enter your Location',
    description: 'So we know where we should sent our products.',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: 'Make an Account',
    description: 'So you can access to all our shopping features.',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Free Delivery',
    description: 'Check which products will get you without costing a penny!',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    ),
    title: 'Most Popular',
    description: "Check out what's all the people's racket about!",
  },
];

const Home: React.FC = () => {
  const saleProducts = getSaleProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [heroBanner] = useState(0);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 240, behavior: 'smooth' });
  };

  const handleProductClick = (product: Product) => {
    console.log('Navigate to product:', product.id);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>The best tech in one place!</h1>
          <p className={styles.heroSubtitle}>For the best price too!</p>
          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary}>
              View Sales <span>›</span>
            </button>
            <button className={styles.ctaSecondary}>Explore Categories</button>
          </div>
        </div>
        <div className={styles.heroDots}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <span key={i} className={`${styles.dot} ${i === heroBanner ? styles.dotActive : ''}`} />
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Check some of these things out!</h2>
        <div className={styles.featureGrid}>
          {FEATURE_CARDS.map(card => (
            <div key={card.title} className={styles.featureCard}>
              <p className={styles.featureCardTitle}>{card.title}</p>
              <div className={styles.featureCardIcon}>{card.icon}</div>
              <p className={styles.featureCardDesc}>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Items on Sale */}
      <section className={styles.saleSection}>
        <div className={styles.saleSectionInner}>
          <h2 className={styles.saleTitle}>Today's items on sale</h2>
          <div className={styles.saleScrollWrapper}>
            <div className={styles.saleScroll} ref={scrollRef}>
              {saleProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>
            <button className={styles.scrollBtn} onClick={scrollRight} aria-label="Scroll right">
              ›
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;