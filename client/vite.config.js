import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost', 
      port: 5173
    }
  }
});
