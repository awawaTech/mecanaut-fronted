import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Esto añade automáticamente este import al inicio de cada archivo .scss
   
      }
    }
  },
  optimizeDeps: {
    exclude: ['@vue/compiler-sfc']
  }
})
