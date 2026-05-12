// src/services/productService.ts
import productsData from '../data/products.json';
import { type Product } from '../types';

const products: Product[] = productsData as Product[];

export const getAllProducts = (): Product[] => products;

export const getProductsByCategory = (category: string): Product[] =>
  products.filter(p => p.category === category);

export const getSaleProducts = (): Product[] =>
  products.filter(p => p.isOnSale);

export const getTrendingProducts = (): Product[] =>
  products.slice(0, 6);

export const getProductById = (id: number): Product | undefined =>
  products.find(p => p.id === id);

export const formatPrice = (price: number): string =>
  `$ ${price.toLocaleString('es-CO')}`;