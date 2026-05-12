// src/components/Navbar/Navbar.tsx
import React, { useState, useRef } from 'react';
import { getAllCategories } from '../../services/categoryService';
import type { CategoryDropdownData } from '../../types';
import CategoryDropdown from '../CategoryDropdown/CategoryDropdown';
import styles from './Navbar.module.css';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onLogoClick }) => {
  const categories = getAllCategories();
  const [searchValue, setSearchValue] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cartCount] = useState(0);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (categoryId: string) => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setActiveCategory(categoryId);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => setActiveCategory(null), 150);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchValue);
  };

  const activeData = categories.find(c => c.id === activeCategory);

  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.logo} onClick={onLogoClick}>
          <span className={styles.logoDot1}>●</span>
          <span className={styles.logoDot2}>◉</span>
          <span className={styles.logoText}>
            <span className={styles.logoCore}>Core</span>
            <span className={styles.logoSystems}>Systems</span>
          </span>
        </div>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Gaming Laptop"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <button className={styles.searchBtn} type="submit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>

        <nav className={styles.topActions}>
          <button className={styles.iconBtn} aria-label="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button className={styles.iconBtn} aria-label="Account">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
          <button className={styles.iconBtn} aria-label="Cart" style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </button>
        </nav>
      </div>

      {/* Category Nav */}
      <nav className={styles.catNav}>
        <button className={styles.allCategoriesBtn}>
          <span className={styles.hamburger}>≡</span>
          <span>All Categories</span>
        </button>

        {categories.map(cat => (
          <div
            key={cat.id}
            className={styles.catItemWrapper}
            onMouseEnter={() => handleMouseEnter(cat.id)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`${styles.catItem} ${cat.id === 'trending' ? styles.trending : ''} ${cat.id === 'on-sale' ? styles.onSale : ''} ${activeCategory === cat.id ? styles.catItemActive : ''}`}
            >
              {cat.label}
            </button>

            {activeCategory === cat.id && activeData && (
              <div
                className={styles.dropdownWrapper}
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onMouseLeave={handleMouseLeave}
              >
                <CategoryDropdown
                  category={activeData}
                  onItemClick={() => setActiveCategory(null)}
                />
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;