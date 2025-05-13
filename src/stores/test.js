import { defineStore } from 'pinia'

export const useTestStore = defineStore('test', {
  state: () => ({
    isDark: false
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light')
    }
  }
}) 