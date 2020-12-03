/* eslint-disable nuxt/no-cjs-in-config */
const fr = require('./locales/fr.json')

export default {
  mode: 'universal',
  target: 'static',
  head: {
    title: 'Espace Public',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          "Espace public est le point d'accès à l'information sur les activités planifiées sur le territoire de votre commune. Vous y trouverez des informations sur divers événements qui auront lieu prochainement et qui pourront vous intéresser dans l'organisation de votre vie quotidienne.",
      },
    ],
  },
  router: {
    base:
      process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_PATH : '/',
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
    {
      src: '@/plugins/vue-js-modal.js',
      ssr: false,
    },
  ],
  components: true,
  buildModules: [
    '@nuxtjs/dotenv',
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
    transpile: ['vuelayers', '/@fullcalendar.*/'],
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
