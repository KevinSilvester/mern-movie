import type { PluginOption } from 'vite'
import { resolve } from 'node:path'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react-swc'
import terminal from 'vite-plugin-terminal'

const dev = process.env.NODE_ENV === 'development'

const plugins: PluginOption[] = [
   react({ jsxImportSource: '@emotion/react' }),
   legacy({
      targets: ['defaults', 'not IE 11']
   }),
   splitVendorChunkPlugin()
]

if (dev) {
   plugins.push(terminal({ console: 'terminal', output: ['terminal', 'console'] }))
}

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
