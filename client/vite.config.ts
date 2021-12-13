import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'

export default defineConfig({
   plugins: [
      react(),
   ],
   build: {
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
         '@interface': path.resolve(__dirname, './src/interface'),
         '@layout': path.resolve(__dirname, './src/layout'),
         '@pages': path.resolve(__dirname, './src/pages'),
         '@routes': path.resolve(__dirname, './src/routes'),
         '@store': path.resolve(__dirname, './src/store'),
         '@utils': path.resolve(__dirname, './src/utils'),
         '~': path.resolve(__dirname, './public'),
      }
   }
})
