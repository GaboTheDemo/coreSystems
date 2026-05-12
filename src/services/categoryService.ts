// src/services/categoryService.ts
import categoriesData from '../data/categories.json';
import type { CategoryDropdownData } from '../types';

export const getAllCategories = (): CategoryDropdownData[] => {
  return categoriesData as CategoryDropdownData[];
};

export const getCategoryById = (id: string): CategoryDropdownData | undefined => {
  return (categoriesData as CategoryDropdownData[]).find(cat => cat.id === id);
};

export const getNavCategories = () => {
  return (categoriesData as CategoryDropdownData[]).map(cat => ({
    id: cat.id,
    label: cat.label,
    icon: cat.icon,
  }));
};