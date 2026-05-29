import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Englishflow1/',
  build: {
    outDir: 'docs',
  },
});
