// src/components/Navbar/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../services/categoryService';
import CategoryDropdown from '../CategoryDropdown/CategoryDropdown';
import SearchOverlay from '../SearchOverlay/SearchOverlay';
import CartDrawer from '../CartDrawer/CartDrawer';
import FavoritesDrawer from '../FavoritesDrawer/FavoritesDrawer';
import AvatarPickerModal, { AVATARS } from '../AvatarPickerModal/AvatarPickerModal';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { supabase } from '../../lib/supabaseClient';
import type { CategoryDropdownData } from '../../types';
import type { SearchProduct } from '../../services/searchService';
import styles from './Navbar.module.css';

interface NavbarProps {
  onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogoClick }) => {
  const navigate = useNavigate();
  const { totalItems, toggleCart }                   = useCart();
  const { totalFavorites, toggleDrawer: toggleFavorites } = useFavorites();

  const [categories, setCategories]     = useState<CategoryDropdownData[]>([]);
  const [searchValue, setSearchValue]   = useState('');
  const [searchOpen, setSearchOpen]     = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [avatarOpen, setAvatarOpen]     = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<string>('');

  const inputRef       = useRef<HTMLInputElement>(null);
  const categoryNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getAllCategories().then(setCategories).catch(console.error);
  }, []);

  // Cargar avatar actual del usuario
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.avatar_url) setCurrentAvatar(data.avatar_url);
        });
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryNavRef.current && !categoryNavRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeData = categories.find(c => c.id === activeCategory);

  const openSearch  = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (!searchOpen) setSearchOpen(true);
  };

  const handleTagClick = (tag: string) => {
    setSearchValue(tag);
    inputRef.current?.focus();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    closeSearch();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleProductClick = (product: SearchProduct) => {
    closeSearch();
    navigate(`/search?q=${encodeURIComponent(product.name)}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(prev => (prev === categoryId ? null : categoryId));
  };

  const handleDropdownItemClick = () => setActiveCategory(null);

  // Encuentra el SVG del avatar actual para mostrarlo en el botón
  const currentAvatarData = AVATARS.find(a => a.id === currentAvatar);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className={styles.logo} onClick={onLogoClick}>
            <span className={styles.logoDot1}>●</span>
            <span className={styles.logoDot2}>◉</span>
            <span className={styles.logoText}>
              <span className={styles.logoCore}>Core</span>
              <span className={styles.logoSystems}>Systems</span>
            </span>
          </div>

          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <input
              ref={inputRef}
              className={`${styles.searchInput} ${searchOpen ? styles.searchInputActive : ''}`}
              type="text"
              placeholder="What are you looking for?"
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={openSearch}
              autoComplete="off"
            />
            <button className={styles.searchBtn} type="submit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </form>

          <nav className={styles.topActions}>
            {/* Favoritos */}
            <button
              className={styles.iconBtn}
              aria-label={`Favoritos (${totalFavorites})`}
              onClick={toggleFavorites}
              style={{ position: 'relative' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {totalFavorites > 0 && (
                <span className={styles.cartBadge}>{totalFavorites > 99 ? '99+' : totalFavorites}</span>
              )}
            </button>

            {/* Seller */}
            <button
              className={styles.iconBtn}
              aria-label="Seller Account"
              onClick={() => navigate('/seller/register')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>

            {/* Carrito */}
            <button
              className={styles.iconBtn}
              aria-label={`Carrito (${totalItems} productos)`}
              onClick={toggleCart}
              style={{ position: 'relative' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems > 99 ? '99+' : totalItems}</span>
              )}
            </button>

            {/* Avatar picker */}
            <button
              className={styles.avatarBtn}
              aria-label="Change avatar"
              onClick={() => setAvatarOpen(true)}
              style={currentAvatarData ? { background: currentAvatarData.bg } : undefined}
            >
              {currentAvatarData ? (
                <div className={styles.avatarBtnSvg}>{currentAvatarData.svg}</div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              )}
            </button>
          </nav>
        </div>

        <nav className={styles.catNav} ref={categoryNavRef}>
          <button className={styles.allCategoriesBtn}>
            <span className={styles.hamburger}>≡</span>
            <span>All Categories</span>
          </button>

          {categories.map(cat => (
            <div key={cat.id} className={styles.catItemWrapper}>
              <button
                className={[
                  styles.catItem,
                  cat.id === 'trending' ? styles.trending : '',
                  cat.id === 'on-sale'  ? styles.onSale   : '',
                  activeCategory === cat.id ? styles.catItemActive : '',
                ].join(' ')}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.label}
              </button>
            </div>
          ))}

          {activeCategory && activeData && (
            <div className={styles.dropdownWrapper}>
              <CategoryDropdown
                category={activeData}
                onItemClick={handleDropdownItemClick}
              />
            </div>
          )}
        </nav>
      </header>

      {searchOpen && (
        <SearchOverlay
          query={searchValue}
          onClose={closeSearch}
          onTagClick={handleTagClick}
          onProductClick={handleProductClick}
        />
      )}

      <CartDrawer />
      <FavoritesDrawer />

      {avatarOpen && (
        <AvatarPickerModal
          currentAvatar={currentAvatar}
          onClose={() => setAvatarOpen(false)}
          onSaved={setCurrentAvatar}
        />
      )}
    </>
  );
};

export default Navbar;