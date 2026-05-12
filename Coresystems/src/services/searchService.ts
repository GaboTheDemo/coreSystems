// src/services/searchService.ts
import searchData from '../data/searchData.json';
import productsData from '../data/products.json';
import { type Product } from '../types';

export interface SearchProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  badge: string | null;
  isOnSale: boolean;
}

export const getPopularSearches = (): string[] => searchData.popularSearches;

export const getRecommendedProducts = (): SearchProduct[] =>
  searchData.recommendedProducts as SearchProduct[];

export const searchProducts = (query: string): SearchProduct[] => {
  if (!query.trim()) return getRecommendedProducts();
  const q = query.toLowerCase();
  const allProducts = productsData as Product[];
  return allProducts
    .filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand?.toLowerCase().includes(q) ?? false)
    )
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      rating: p.rating ?? 4.5,
      reviewCount: Math.floor(Math.random() * 80) + 5,
      badge: null,
      isOnSale: p.isOnSale ?? false,
    }));
};

export const formatPrice = (price: number): string =>
  `$${price.toLocaleString('es-CO')}`;