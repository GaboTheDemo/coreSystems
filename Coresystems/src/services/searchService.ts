// src/services/searchService.ts
import searchData from '../data/searchData.json';
import allProductsRaw from '../data/longProducts.json';   // ← AHORA APUNTA A longProducts.json
import type { Product, SearchFilters, SortOption, SearchResult, PriceRange } from '../types';

// ── Para el overlay (búsqueda rápida) ─────────────────────────────────────────
export interface SearchProduct {
  id: string | number;
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
  const allProducts = allProductsRaw as Product[];
  return allProducts
    .filter(p =>
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
      reviewCount: p.reviewCount ?? Math.floor(Math.random() * 80) + 5,
      badge: p.badges?.[0] ?? null,
      isOnSale: p.isOnSale ?? false,
    }));
};

export const formatPrice = (price: number): string =>
  `$${price.toLocaleString('es-CO')}`;

// ═════════════════════════════════════════════════════════════════════════════
// BÚSQUEDA COMPLETA para SearchResultsPage
// ═════════════════════════════════════════════════════════════════════════════

const allProducts = allProductsRaw as Product[];

function matchesQuery(product: Product, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  const searchable = [
    product.name,
    product.brand,
    product.category,
    product.subcategory ?? '',
    product.description ?? '',
    ...(product.badges ?? []),
    ...Object.values(product.specs ?? {}),
  ].join(' ').toLowerCase();
  return q.split(/\s+/).every(word => searchable.includes(word));
}

function applyFilters(products: Product[], filters: SearchFilters): Product[] {
  return products.filter(p => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (filters.colors?.length && (!p.color || !filters.colors.includes(p.color))) return false;
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;
    return true;
  });
}

function sortByOption(products: Product[], sortBy: SortOption): Product[] {
  const arr = [...products];
  switch (sortBy) {
    case 'price_asc':  return arr.sort((a, b) => a.price - b.price);
    case 'price_desc': return arr.sort((a, b) => b.price - a.price);
    case 'rating':     return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'newest':     return arr.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    default:           return arr.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
  }
}

function buildFacets(products: Product[]): SearchResult['filters'] {
  const brandMap = new Map<string, number>();
  products.forEach(p => brandMap.set(p.brand, (brandMap.get(p.brand) ?? 0) + 1));
  const brands = Array.from(brandMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const colorMap = new Map<string, number>();
  products.forEach(p => {
    if (p.color) colorMap.set(p.color, (colorMap.get(p.color) ?? 0) + 1);
  });
  const colors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const priceRanges: (PriceRange & { count: number })[] = [
    { label: 'Below $500,000',          min: 0,         max: 500_000,   count: 0 },
    { label: '$500,000 – $1,000,000',   min: 500_000,   max: 1_000_000, count: 0 },
    { label: '$1,000,000 – $3,000,000', min: 1_000_000, max: 3_000_000, count: 0 },
    { label: '$3,000,000 – $5,000,000', min: 3_000_000, max: 5_000_000, count: 0 },
    { label: '$5,000,000+',             min: 5_000_000, max: null,      count: 0 },
  ];
  products.forEach(p => {
    const r = priceRanges.find(r => p.price >= r.min && (r.max === null || p.price <= r.max));
    if (r) r.count++;
  });

  return { brands, colors, priceRanges };
}

export function searchProductsFull(filters: SearchFilters): SearchResult {
  const matched  = allProducts.filter(p => matchesQuery(p, filters.query));
  const facets   = buildFacets(matched);
  const filtered = applyFilters(matched, filters);
  const sorted   = sortByOption(filtered, filters.sortBy ?? 'relevance');
  return { products: sorted, total: filtered.length, filters: facets };
}

export const EMPTY_FILTERS: SearchFilters = {
  query: '',
  sortBy: 'relevance',
};