import { defineNuxtConfig } from '@nuxt/bridge'
import fr from './locales/fr.json'

export default defineNuxtConfig({
  target: 'static',
  ssr: false,
  bridge: false,
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
    link: [
      {
        rel: 'manifest',
        type: 'application/manifest+json',
        href: 'manifest.json',
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
    },
    {
      src: '@/plugins/ol-ext.js',
    },
    {
      src: '@/plugins/flatpickr.js',
    },
    {
      src: '@/plugins/vue-js-modal.js',
    },
    {
      src: '@/plugins/floating-vue.js',
    },
    {
      src: '@/plugins/msw.js',
      mode: 'client',
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
    '@nuxtjs/pwa',
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
  pwa: {
    manifest: {
      name: 'Geocity',
      lang: 'fr',
      description: 'Geocity PWA',
      display: 'fullscreen',
      prefer_related_applications: false,
      theme_color: '#008c6f',
    },
    icon: {
      fileName: 'logo-pwa.png',
      sizes: [512],
    },
  },
})
