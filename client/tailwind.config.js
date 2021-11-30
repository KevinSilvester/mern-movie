const mode = process.env.NODE_ENV
const dev = mode === 'development'

module.exports = {
   mode: 'jit',
   purge: ['./src/**/*.{html,js,jsx}'],
   darkMode: false, // or 'media' or 'class'
   theme: {
      extend: {}
   },
   variants: {
      extend: {}
   },
   plugins: []
}
