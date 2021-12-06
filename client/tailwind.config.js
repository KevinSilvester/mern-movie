const mode = process.env.NODE_ENV
const dev = mode === 'development'

module.exports = {
   mode: 'jit',
   purge: ['./src/**/*.{html,js,jsx,ts,tsx}'],
   darkMode: false, // or 'media' or 'class'
   theme: {
      extend: {
         colors: {
            ['dark-grey-1']: '#29292e',
            ['dark-grey-2']: '#36363c',
         }
      }
   },
   variants: {
      extend: {}
   },
   plugins: []
}
