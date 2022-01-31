const forms = require('@tailwindcss/forms')

const hsl = variable => ({ opacityValue }) => {
   if (!opacityValue) 
      return `hsl(var(${variable}))`
   return `hsl(var(${variable}) / ${opacityValue})`
}

module.exports = {
   mode: 'jit',
   content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
   darkMode: 'class',
   theme: {
      extend: {
         colors: {
            custom: {
               slate: {
                  50: hsl('--slate-50'),
                  100: hsl('--slate-100'),
                  200: hsl('--slate-200'),
                  300: hsl('--slate-300'),
                  400: hsl('--slate-400'),
               },
               blue: {
                  100: hsl('--blue-100'),
                  200: hsl('--blue-200'),
               },
               navy: {
                  100: hsl('--navy-100'),
                  200: hsl('--navy-200'),
                  300: hsl('--navy-300'),
                  400: hsl('--navy-400'),
                  500: hsl('--navy-500'),
                  600: hsl('--navy-600'),
                  700: hsl('--navy-700'),
               },
               white: {
                  100: hsl('--white-100'),
                  200: hsl('--white-200')
               },
               grey: {
                  100: hsl('--grey-100'),
                  200: hsl('--grey-200')
               }
            },
         },
         fontFamily: {
            body: ['Nunito', 'sans-serif'],
            title: ['Oleo Script', 'cursive']
         },
         gridTemplateColumns: {
            'auto-1': 'var(--grid-auto-1)',
            'auto-2': 'var(--grid-auto-2)'
         },
         boxShadow: {
            'sm-blue': '0px 1px 2px 1px hsl(var(--navy-600) / 0.05)',
            'md-img': '0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color), 0 -1px 11px -3px var(--tw-shadow-color)',
            'button': '0 0 6px 2px var(--tw-shadow-color)',
            error: `0 0 2px 1px rgb(239 68 68)`
         },
         backgroundImage: {
            'blue-navy': 'linear-gradient(180deg, hsl(var(--navy-500) / 0.5) 0%, hsl(var(--navy-500) / 0.85) 73%)'
         }
      }
   },
   variants: {
      extend: {}
   },
   plugins: [forms]
}
