import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách Firebase SDK ra chunk riêng (nặng nhất ~400KB)
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/messaging'],
          // Tách Framer Motion (~120KB)
          motion: ['framer-motion'],
          // Vendor nhỏ
          vendor: ['react', 'react-dom', 'react-hot-toast', 'uuid'],
        },
      },
    },
  },
})
