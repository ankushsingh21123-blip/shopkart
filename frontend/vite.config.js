import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/customers': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/products': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/wishlist': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/cart': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/orders': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
