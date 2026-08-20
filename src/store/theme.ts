import { defineStore } from 'pinia';
import { darkTheme } from 'naive-ui';
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  }),
  getters: {
    theme(): BuiltInGlobalTheme | null {
      return this.isDark ? darkTheme : null;
    },
  },
  actions: {
    setTheme(isDark: boolean) {
      this.isDark = isDark;
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    },
    toggleTheme() {
      this.setTheme(!this.isDark);
    },
  },
});
