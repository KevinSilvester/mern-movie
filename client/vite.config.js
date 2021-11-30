import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import alias from '@rollup/plugin-alias'
import path from 'path'

const ROOT_DIR = path.resolve(__dirname)

export default defineConfig({
   plugins: [
      react(),
      // alias({
      //    entries: [
      //       { find: 'public', replacement: path.resolve(ROOT_DIR, 'public') },
      //       { find: 'src',    replacement: path.resolve(ROOT_DIR, 'src') },
      //       { find: 'js',     replacement: path.resolve(ROOT_DIR, 'src/js') },
      //       { find: 'css',    replacement: path.resolve(ROOT_DIR, 'src/css') },
      //    ]
      // })
   ],
   root: './src',
   build: {
      outDir: '../dist',
      target: 'es2015',
      sourcemap: 'hidden',
      manifest: true,
   },
   publicDir: '../public'
})
