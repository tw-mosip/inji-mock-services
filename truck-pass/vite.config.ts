import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    // Change the output directory
    outDir: 'dist', // default is 'dist'
    emptyOutDir: true, // cleans folder before build
  },
  assetsInclude: [
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.svg',
  ],
  server: {
    port: 5000
  }
})