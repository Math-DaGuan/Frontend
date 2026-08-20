import { defineStore } from 'pinia';
import { getCategories } from '../api/category';
import type { Category } from '../api/types';

export interface CategoryMeta {
  syncTime: number;
  totalQuestions: number;
  topLevelNames: string[];
  categoryIds: number[];
}

export const useCategoryStore = defineStore('category', {
  state: () => ({
    meta: JSON.parse(localStorage.getItem('category_meta') || 'null') as CategoryMeta | null,
    loading: false,
    syncProgress: 0,
    syncStatus: '',
  }),

  actions: {
    async fetchAndSync() {
      if (this.loading) return;
      
      this.loading = true;
      this.syncProgress = 0;
      this.syncStatus = '正在获取题库...';
      
      try {
        const categories = await getCategories();
        
        this.syncStatus = '获取成功，正在解析题库...';
        
        let totalQuestions = 0;
        const topLevelNames: string[] = [];
        const categoryIds: number[] = [];
        
        let count = 0;
        for (const root of categories) {
          totalQuestions += root.total_question_count;
          topLevelNames.push(root.name);
          categoryIds.push(root.id);
          
          localStorage.setItem(`category_data_${root.id}`, JSON.stringify(root));
          
          count++;
          this.syncProgress = Math.round((count / categories.length) * 100);
          this.syncStatus = `正在解析并保存题库 (${this.syncProgress}%)...`;
        }
        
        const meta: CategoryMeta = {
          syncTime: Date.now(),
          totalQuestions,
          topLevelNames,
          categoryIds,
        };
        
        localStorage.setItem('category_meta', JSON.stringify(meta));
        this.meta = meta;
        this.syncStatus = '同步完成';
        
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error: any) {
        throw error;
      } finally {
        this.loading = false;
        this.syncProgress = 0;
        this.syncStatus = '';
      }
    },

    getCategoryData(id: number): Category | null {
      const data = localStorage.getItem(`category_data_${id}`);
      return data ? JSON.parse(data) : null;
    },

    findCategoryPath(id: number): Category[] {
      if (!this.meta) return [];
      
      const findInTree = (node: Category, targetId: number, path: Category[]): Category[] | null => {
        if (node.id === targetId) return [...path, node];
        if (node.children) {
          for (const child of node.children) {
            const found = findInTree(child, targetId, [...path, node]);
            if (found) return found;
          }
        }
        return null;
      };

      for (const rootId of this.meta.categoryIds) {
        const rootData = this.getCategoryData(rootId);
        if (rootData) {
          const path = findInTree(rootData, id, []);
          if (path) return path;
        }
      }
      return [];
    },

    updateCategoryCounts(categoryId: number, delta: number) {
      if (!this.meta) return;

      try {
        const findAndModify = (node: Category, targetId: number, d: number): boolean => {
          if (node.id === targetId) {
            node.completed_count = (Number(node.completed_count) || 0) + d;
            node.total_completed_count = (Number(node.total_completed_count) || 0) + d;
            return true;
          }
          if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
              if (findAndModify(child, targetId, d)) {
                node.total_completed_count = (Number(node.total_completed_count) || 0) + d;
                return true;
              }
            }
          }
          return false;
        };

        for (const rootId of this.meta.categoryIds) {
          const rootData = this.getCategoryData(rootId);
          if (rootData) {
            if (findAndModify(rootData, categoryId, delta)) {
              localStorage.setItem(`category_data_${rootId}`, JSON.stringify(rootData));
              return;
            }
          }
        }
      } catch (e) {
        console.error('Failed to update category counts in localStorage:', e);
      }
    }
  }
});
