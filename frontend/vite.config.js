import { defineConfig } from 'vite';

export default defineConfig({
  base: "/~le223nd/webbteknik-6/to-do-app/",
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, 'to-do/api/'),
      }
    },
  }
});