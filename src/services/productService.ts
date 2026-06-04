// src/services/productService.ts
import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types';

export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products_full')
    .select('*');
  if (error) throw error;
  return (data ?? []) as Product[];
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products_full')
    .select('*')
    .eq('category_id', category);
  if (error) throw error;
  return (data ?? []) as Product[];
};

export const getProductsByBrand = async (brand: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products_full')
    .select('*')
    .ilike('brand_name', brand);
  if (error) throw error;
  return (data ?? []) as Product[];
};

export const getSaleProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products_full')
    .select('*')
    .eq('is_on_sale', true);
  if (error) throw error;
  return (data ?? []) as Product[];
};

export const getTrendingProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products_full')
    .select('*')
    .eq('is_trending', true)
    .limit(6);
  if (error) throw error;
  return (data ?? []) as Product[];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products_full')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Product | null;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products_full')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data as Product | null;
};

export const formatPrice = (price: number): string =>
  `$ ${price.toLocaleString('es-CO')}`;