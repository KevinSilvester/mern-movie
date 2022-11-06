import type { VitePWAOptions, ManifestOptions } from 'vite-plugin-pwa'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import terminal from 'vite-plugin-terminal'
import { VitePWA } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'

const mode = process.env.NODE_ENV
const dev = mode === 'development'

const pwaOptions: Partial<VitePWAOptions> = {
   injectRegister: 'auto',
   workbox: {
      sourcemap: true
   },
   registerType: 'autoUpdate',
   mode: 'production',
   base: '/',
   manifest: {
      name: 'MoviDB',
      short_name: 'MoviDB',
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
      // enabled: process.env.SW_DEV === 'true',
      type: 'module',
      navigateFallback: 'index.html'
   }
}

const replaceOptions = { __DATE__: new Date().toISOString(), preventAssignment: true }
const claims = process.env.CLAIMS === 'true'
const reload = process.env.RELOAD_SW === 'true'
const selfDestroying = process.env.SW_DESTROY === 'true'

if (process.env.SW === 'true') {
   pwaOptions.srcDir = 'src'
   pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts'
   pwaOptions.strategies = 'injectManifest'
   ;(pwaOptions.manifest as Partial<ManifestOptions>).name = 'PWA Inject Manifest'
   ;(pwaOptions.manifest as Partial<ManifestOptions>).short_name = 'PWA Inject'
}

if (claims) pwaOptions.registerType = 'autoUpdate'

if (reload) {
   // @ts-expect-error just ignore
   replaceOptions.__RELOAD_SW__ = 'true'
}

if (selfDestroying) pwaOptions.selfDestroying = selfDestroying

export default defineConfig({
   plugins: [
      react(),
      legacy({
         targets: ['defaults', 'not IE 11']
      }),
      VitePWA(pwaOptions),
      // @ts-ignore
      replace(replaceOptions),
      splitVendorChunkPlugin(),
      // terminal({ console: 'terminal', output: ['terminal', 'console'] })
   ],
   build: {
      emptyOutDir: true,
      minify: 'terser'
   },
   resolve: {
      alias: {
         '@assets': resolve(__dirname, './src/assets'),
         '@comp': resolve(__dirname, './src/components'),
         '@hooks': resolve(__dirname, './src/hooks'),
         '@interface': resolve(__dirname, './src/interface'),
         '@layout': resolve(__dirname, './src/layout'),
         '@lib': resolve(__dirname, './src/lib'),
         '@pages': resolve(__dirname, './src/pages'),
         '@routes': resolve(__dirname, './src/routes'),
         '@scss': resolve(__dirname, './src/scss')
      }
   }
})
