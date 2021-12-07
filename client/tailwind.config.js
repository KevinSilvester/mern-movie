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
            ['dark-grey-3']: '#1b1b20',
            ['grey-1']: '#3a3a3e',
            ['dark-blue-1']: '#123175',
         },
         boxShadow: {
            nav: '1px 2px 7px 2px hsl(0deg 0% 0% / 40%)'
         },
         fontFamily: {
            cursive: ['Knewave', 'cursive'],
         }
      }
   },
   variants: {
      extend: {}
   },
   plugins: []
}
