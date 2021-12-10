module.exports = {
   mode: 'jit',
   content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
   darkMode: 'media',
   theme: {
      colors: {
         nav: {
            txt: 'var(--nav-txt)',
            'txt-lg': 'var(--nav-txt-lg)',
            'bg-lg': 'var(--nav-bg-lg)',
            'logo-bg': 'var(--nav-logo-bg)'
         },
         comp: {
            txt: 'var(--comp-txt)',
            'txt-active': 'var(--comp-txt-active)',
            bg: 'var(--comp-bg)',
            'bg-lg': 'var(--comp-bg-lg)'
         }
      },
      extend: {
         boxShadow: {
            active: '0 0 3px 1px #6fc8ff80',
            'active-hov': '0 0 6px 3px #6fc8ff80',
         },
         fontFamily: {
            'body': ['Nunito', 'sans-serif'],
            'title': ['Oleo Script', 'cursive'],
         },
         gridTemplateColumns: {
            'auto-1': 'var(--grid-auto-1)',
            'auto-2': 'var(--grid-auto-2)'
         },
         boxShadow: {
            'center': 'var(--shadow-center)'
         }
      }
   },
   variants: {
      extend: {}
   },
   plugins: []
}
