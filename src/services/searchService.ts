// src/services/searchService.ts
import { supabase } from '../lib/supabaseClient';
import type { Product, SearchFilters, SortOption, SearchResult, PriceRange } from '../types';

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

export const getPopularSearches = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('popular_searches')
    .select('term')
    .order('sort_order');
  if (error) throw error;
  return (data ?? []).map(r => r.term);
};

export const getRecommendedProducts = async (): Promise<SearchProduct[]> => {
  const { data, error } = await supabase
    .from('recommended_products')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return (data ?? []).map(r => ({
    id: r.id,
    name: r.name,
    price: r.price,
    image: r.image_url,
    category: r.category_id,
    rating: r.rating,
    reviewCount: r.review_count,
    badge: r.badge ?? null,
    isOnSale: r.is_on_sale,
  }));
};

export const searchProducts = async (query: string): Promise<SearchProduct[]> => {
  if (!query.trim()) return getRecommendedProducts();

  const { data, error } = await supabase
    .from('products_full')
    .select('*')
    .or(
      `name.ilike.%${query}%,brand_name.ilike.%${query}%,category_id.ilike.%${query}%`
    )
    .limit(5);
  if (error) throw error;

  return (data ?? []).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image_url,
    category: p.category_id,
    rating: p.rating ?? 4.5,
    reviewCount: p.review_count ?? 0,
    badge: p.badges?.[0] ?? null,
    isOnSale: p.is_on_sale ?? false,
  }));
};

export const formatPrice = (price: number): string =>
  `$${price.toLocaleString('es-CO')}`;

// ─── Búsqueda completa para SearchResultsPage ────────────────────────────────

export async function searchProductsFull(filters: SearchFilters): Promise<SearchResult> {
  let query = supabase.from('products_full').select('*');

  if (filters.query?.trim()) {
    query = query.or(
      `name.ilike.%${filters.query}%,brand_name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
    );
  }
  if (filters.category) query = query.eq('category_id', filters.category);
  if (filters.brand)    query = query.ilike('brand_name', filters.brand);
  if (filters.colors?.length) query = query.in('color', filters.colors);
  if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);

  const { data, error } = await query;
  if (error) throw error;

  const products = (data ?? []) as Product[];
  const sorted   = sortByOption(products, filters.sortBy ?? 'relevance');
  const facets   = buildFacets(products);

  return { products: sorted, total: sorted.length, filters: facets };
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

export const EMPTY_FILTERS: SearchFilters = {
  query: '',
  sortBy: 'relevance',
};