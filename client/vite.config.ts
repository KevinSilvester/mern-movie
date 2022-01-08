import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
   plugins: [
      react(),
      legacy({
         targets: ['ie >= 11']
      }),
   ],
   build: {
	   emptyOutDir: true,
	   target: 'es2016',
      sourcemap: 'inline',
      manifest: true,
   },
   resolve: {
      alias: {
         '@assets': resolve(__dirname, './src/assets'),
         '@comp': resolve(__dirname, './src/components'),
         '@interface': resolve(__dirname, './src/interface'),
         '@layout': resolve(__dirname, './src/layout'),
         '@lib': resolve(__dirname, './src/lib'),
         '@pages': resolve(__dirname, './src/pages'),
         '@routes': resolve(__dirname, './src/routes'),
         '@scss': resolve(__dirname, './src/scss'),
         '@store': resolve(__dirname, './src/store'),
      }
   },
})