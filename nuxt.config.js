/* eslint-disable nuxt/no-cjs-in-config */
const fr = require('./locales/fr.json')

export default {
  mode: 'universal',
  target: 'static',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
  },
  router: {
    base: process.env.NODE_ENV === 'production' ? process.env.pathname : '/',
  },
  plugins: [
    {
      src: '@/plugins/vuelayers.js',
      ssr: false,
    },
    {
      src: '@/plugins/ol-ext.js',
      ssr: false,
    },
    {
      src: '@/plugins/flatpickr.js',
      ssr: false,
    },
  ],
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/date-fns',
  ],
  modules: [
    '@nuxtjs/axios',
    '~/modules/vuelayers',
    'nuxt-vue-select',
    'nuxt-i18n',
    '@nuxtjs/svg-sprite',
  ],
  build: {
    transpile: ['vuelayers'],
  },
  svgSprite: {
    input: '~/styleguide/assets/icons/',
  },
  i18n: {
    locales: ['fr'],
    defaultLocale: 'fr',
    vueI18n: {
      fallbackLocale: 'fr',
      messages: {
        fr,
      },
    },
  },
}
