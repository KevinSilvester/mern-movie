import { resolve } from 'node:path'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react-swc'
import type { PluginOption } from 'vite'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'
import terminal from 'vite-plugin-terminal'

const dev = process.env.NODE_ENV === 'development'

const pwaOptions: Partial<VitePWAOptions> = {
   base: '/',
   srcDir: 'src',
   injectRegister: 'auto',
   strategies: 'injectManifest',
   filename: 'sw.ts',
   registerType: 'autoUpdate',
   manifestFilename: 'manifest.json',
   manifest: {
      name: 'MovieDB',
      short_name: 'MovieDB',
      start_url: '/',
      lang: 'en',
      theme_color: '#0b1723',
      background_color: '#FFFFFF',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
         { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
         { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
         { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
      ]
   },
   devOptions: {
      enabled: true,
      type: 'module',
      navigateFallback: 'index.html'
   }
}

const plugins: PluginOption[] = [
   react({ jsxImportSource: '@emotion/react' }),
   legacy({
      targets: ['defaults', 'not IE 11']
   }),
   VitePWA(pwaOptions),
   splitVendorChunkPlugin()
]

// if (dev) {
//    plugins.push(terminal({ console: 'terminal', output: ['terminal', 'console'] }))
// }

export default defineConfig({
   plugins,
   build: {
      emptyOutDir: true,
      minify: 'terser'
   },
   resolve: {
      alias: {
         '@assets': resolve(__dirname, './src/assets'),
         '@comp': resolve(__dirname, './src/components'),
         '@hooks': resolve(__dirname, './src/hooks'),
         '@lib': resolve(__dirname, './src/lib'),
         '@pages': resolve(__dirname, './src/pages'),
         '@routes': resolve(__dirname, './src/routes'),
         '@scss': resolve(__dirname, './src/scss')
      }
   }
})
