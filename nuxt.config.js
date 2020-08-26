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
  css: [],
  plugins: [
    {
      src: '@/plugins/vuelayers.js',
      ssr: false,
    },
  ],
  components: true,
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/tailwindcss'],
  modules: [
    '~/modules/vueLayers',
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
              events: 'Trouver un evenement, chantier, construction …',
            },
          },
        },
      },
    ],
  ],
  build: {},
}
