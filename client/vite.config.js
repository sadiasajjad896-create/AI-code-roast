// Vite config.
// The dev proxy forwards /api/* to the Express server, so the client can use
// relative URLs and you avoid CORS issues during development.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
