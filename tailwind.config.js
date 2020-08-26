/*
 ** TailwindCSS Configuration File
 */

const styleguide = require('./styleguide/tailwind.config')

module.exports = {
  theme: styleguide.theme,
  variants: styleguide.variants,
  plugins: [],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js',
    ],
  },
  future: {
    removeDeprecatedGapUtilities: true,
  },
}
