export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
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
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      'nuxt-i18n',
      {
        locales: ['fr'],
        defaultLocale: 'fr',
        vueI18n: {
          fallbackLocale: 'fr',
          messages: {
            fr: {
              copyright: "© Ville d'Yverdon-les-Bains 2020",
              connexion: 'Connexion',
              introduction:
                "Espace public est le point d'accès à l'information sur les activités planifiées sur le territoire de votre commune. Vous y trouverez des informations sur divers événements qui auront lieu prochainement et qui pourront vous intéresser dans l'organisation de votre vie quotidienne.",
              ask:
                'Vous souhaitez demander une autorisation relative à un chantier, une manifestation ou des travaux de minime importance ?',
              askcta: 'Faire une demande',
            },
          },
        },
      },
    ],
  ],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
}
