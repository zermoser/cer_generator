import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/cer_generator/',
  server: {
    open: true,
    port: 3003
  }
});
