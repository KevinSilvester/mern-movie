const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const dev = process.env.NODE_ENV === 'development'

const config = {
   plugins: [tailwindcss(), autoprefixer(), !dev && cssnano({ preset: 'default' })]
}

module.exports = config
