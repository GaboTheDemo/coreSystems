// src/types/index.ts

// =========================
// AUTH
// =========================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthProvider = "google" | "facebook" | "apple" | "email";

export interface LoginFormData {
  identifier: string;
  provider?: AuthProvider;
}

// =========================
// PRODUCTS (unificado con search.ts)
// =========================

export interface ProductSpec {
  camera?: string;
  storage?: string;
  screenSize?: string;
  ram?: string;
  [key: string]: string | undefined; // índice flexible para otras especificaciones
}

export interface Product {
  id: string | number;        // compatible con number del primer tipo y string del segundo
  name: string;
  slug?: string;
  brand: string;              // lo hacemos obligatorio porque la página lo usa sin `?`
  price: number;
  originalPrice?: number;     // opcional por si algún producto no tiene oferta
  image: string;
  category: string;
  subcategory?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  isTrending?: boolean;
  isOnSale?: boolean;
  discount?: number;
  color?: string;
  specs: ProductSpec;         // ahora siempre presente, pero puede ser vacío
  badges?: string[];           // array (puede estar vacío)
  description?: string;
  // Campos extra del primer tipo (poco usados)
  discountPercent?: number;
  avatar?: string;
  createdAt?: string;
}

export type Category =
  | "smartphones"
  | "laptops"
  | "tablets"
  | "consoles"
  | "televisions"
  | "smartwatches";

export interface CategoryItem {
  id: Category;
  label: string;
  slug: string;
}

// =========================
// CATEGORY DROPDOWNS
// =========================

export interface CategoryBrand {
  label: string;
  items: string[];
}

export interface CategoryFilter {
  label: string;
  items: string[];
}

export interface CategoryAccessory {
  label: string;
  items: string[];
}

export interface CategoryExtra {
  label: string;
  items: string[];
}

export interface CategoryDropdownData {
  id: string;
  label: string;
  icon: string;
  sections: {
    main: { title: string; filters: CategoryFilter[] };
    accessories: { title: string; items: CategoryAccessory[] };
    more: { title: string; label: string; items: string[] };
  };
}

export interface NavCategory {
  id: string;
  label: string;
}

// =========================
// CART
// =========================

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// =========================
// HERO
// =========================

export interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  backgroundGradient: string;
}

// =========================
// SEARCH & FILTERS (unificado con search.ts)
// =========================

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';

export interface SearchFilters {
  query: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sortBy?: SortOption;
}

export interface PriceRange {
  label: string;
  min: number;
  max: number | null;
}

export interface SearchResult {
  products: Product[];
  total: number;
  filters: {
    brands: { name: string; count: number }[];
    colors: { name: string; count: number }[];
    priceRanges: (PriceRange & { count: number })[];
  };
}

// Para compatibilidad con el primer servicio (si se necesita)
export type ActiveFilters = SearchFilters;