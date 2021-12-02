import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
   plugins: [react()],
   build: {
      target: 'es6',
      sourcemap: 'hidden',
      manifest: true
   },
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
         '@api': path.resolve(__dirname, './src/api'),
         '@assets': path.resolve(__dirname, './src/assets'),
         '@comp': path.resolve(__dirname, './src/components'),
         '@css': path.resolve(__dirname, './src/css'),
         '@pages': path.resolve(__dirname, './src/pages'),
         '@routes': path.resolve(__dirname, './src/routes'),
         '~': path.resolve(__dirname, './public'),
      }
   }
})
