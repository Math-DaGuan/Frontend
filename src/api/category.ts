import { request } from '../utils/request';
import type { Category } from './types';

export function getCategories(): Promise<Category[]> {
  return request<Category[]>('/categories');
}
