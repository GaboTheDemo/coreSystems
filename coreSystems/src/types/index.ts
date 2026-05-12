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
// PRODUCTS
// =========================

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  brand?: string;
  rating?: number;
  isOnSale?: boolean;
  discountPercent?: number;
  specs?: Record<string, string | undefined>;
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
    main: {
      title: string;
      filters: CategoryFilter[];
    };
    accessories: {
      title: string;
      items: CategoryAccessory[];
    };
    more: {
      title: string;
      label: string;
      items: string[];
    };
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