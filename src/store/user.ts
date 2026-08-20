import { defineStore } from 'pinia';
import type { User } from '../api/types';

interface UserState {
  user: User | null;
  token: string;
}

export const useUserStore = defineStore('user', {
  state: (): UserState & { showLoginModal: boolean } => ({
    user: JSON.parse(localStorage.getItem('user_info') || 'null'),
    token: localStorage.getItem('access_token') || '',
    showLoginModal: false,
  }),
  getters: {
    isAdmin(): boolean {
      return this.user?.role === 'admin';
    },
    isLoggedIn(): boolean {
      return !!this.token && !!this.user;
    },
  },
  actions: {
    checkAuth(): boolean {
      if (!this.isLoggedIn) {
        this.showLoginModal = true;
        return false;
      }
      return true;
    },
    setUser(user: User) {
      this.user = user;
      localStorage.setItem('user_info', JSON.stringify(user));
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('access_token', token);
      this.clearCategoryData();
    },
    clearCategoryData() {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('category')) {
          localStorage.removeItem(key);
        }
      });
    },
    logout() {
      this.user = null;
      this.token = '';
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      this.clearCategoryData();
    },
  },
});
