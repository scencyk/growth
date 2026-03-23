import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    port: 8080,
  },
  base: command === 'serve' ? '/' : '/klub-medyka-beta/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
}));
