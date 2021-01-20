import de from 'vuetify/es5/locale/de'
import icons from 'vuetify/es5/services/icons/presets/mdi-svg'
import { getIconInjector } from 'vuetify-icon-injector'

const createSitemapRoutes = async () => {
  const routes = []
  const { $content } = require('@nuxt/content')

  const posts = await $content('blog').fetch()

  for (const post of posts) {
    // routes.push(`blog/${post.slug}`);
    routes.push({
      url: `blog/${post.slug}`,
      lastmod: post.slug.startsWith('20') ? post.updatedAt : '2020-01-01',
    })
  }

  const veranstaltungen = await $content('veranstaltung').fetch()

  for (const veranstaltung of veranstaltungen) {
    routes.push({
      url: `veranstaltungen/${veranstaltung.slug}`,
      lastmod: veranstaltung.updatedAt,
    })
  }

  return routes
}

const URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : 'https://www.ec-nordbund.de/'

const vuetifyTheme = {
  primary: '#92c355',
  dunkelGrau: '#282925',
  neonOrange: '#fac189',
  offWihte: '#f8f5f4',
  lila: '#583a70',
  dunkelRot: '#903557',
  dunkelGruen: '#1f5533',
  ocker: '#bc946d',
  koralle: '#ea4c60',
  hellBlau: '#70b6d4',
  hellGrau: '#5d5d5c',
  ecOrange: '#ea571d',
  dunkelBlau: '#445d9d',
  gelb: '#ffd633',
  flieder: '#9184be',

  up: '#4eb3d8',
  out: '#fac189',
  with: '#9c8aa8',
  in: '#92c355',

  // Standard colors
  accent: '#583a70', // lila
  secondary: '#282925', // dunkelGrau
  info: '#70b6d4', // hellBlau
  warning: '#ffd633', // gelb
  error: '#ea4c60', // koralle
  success: '#92c355', // grün (primary)

  // Gradient
  'gradient-left': '#a3cf4b',
  'gradient-right': '#5da635',

  // Social
  facebook: '#1877f2',
  instagram: '#c32aa3',
  youtube: '#f00',
}

/**
 * @type {import('@nuxt/types').NuxtConfig}
 */
export default {
  target: 'server',
  modern: true,

  components: true,

  loading: { color: '#92c355', failedColor: '#ea4c60' },

  features: {
    deprecations: false,
    fetch: false,
    store: false,
    middleware: false,
    validate: false,
  },
  fetch: {
    client: false,
    server: false,
  },

  content: {
    markdown: {
      prism: {
        theme: false,
      },
    },
    editor: '../../node_modules/nuxt-content-editor/editor.vue',
  },

  head: {
    titleTemplate: (chunk) => {
      if (chunk) {
        return `${chunk} | EC-Nordbund`
      }

      return 'EC-Nordbund'
    },
    htmlAttrs: {
      lang: 'de',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'google-site-verification',
        content: 'vSmp7129Uj6Kdz8krkwXDruN7HNXYYeCRfGJgBQuCKI',
      },
      {
        name: 'msvalidate.01',
        content: '9B2EEA71D47D41B62AA711DC11FCD3D0',
      },
      // Open Graph
      { hid: 'og:site_name', property: 'og:site_name', content: 'EC-Nordbund' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: URL,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `${URL}card.png`,
      },
      // Twitter Card
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twitter:site',
        name: 'twitter:url',
        content: URL,
      },
      { hid: 'twitter:title', name: 'twitter:title', content: 'EC-Nordbund' },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: `${URL}card.png`,
      },
      {
        hid: 'twitter:image:alt',
        name: 'twitter:image:alt',
        content: 'Seite des EC-Nordbundes',
      },
      {
        name: 'theme-color',
        content: '#92c355',
      },
    ],

    link: [
      { rel: 'icon', href: '/favicon_512.png', hid: 'favicon' },
      { rel: 'manifest', href: '/manifest.webmanifest' },
      { rel: 'apple-touch-icon', href: '/apple-icon.png' },
    ],
  },

  sitemap: {
    hostname: 'https://www.ec-nordbund.de',
    exclude: [
      '/empty',
      '/anmeldung/**',
      '/blog/all',
      '/orte',
      '/404',
      '/admin',
    ],
    gzip: true,
    routes: createSitemapRoutes,
    // cacheTime: 10000000000,
    cacheTime: -1,
  },

  css: ['~/assets/styles/global.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/analytics.ts', mode: 'client' },
    { src: '~/plugins/swUpdate.ts', mode: 'client' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/composition-api',
    '@nuxt/typescript-build',
    // '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
  ],
  // '@nuxtjs/pwa',
  modules: ['@nuxt/content', 'vue2-leaflet-nuxt', '@nuxtjs/sitemap'],
  vuetify: {
    customVariables: ['~/assets/styles/variables-vuetify.scss'],
    theme: {
      disable: false,
      options: {
        customProperties: true,
        minifyTheme: (css) =>
          process.env.NODE_ENV === 'production'
            ? css.replace(/[\r\n|\r|\n]/g, '')
            : css,
        variations: false,
      },
      default: false,
      dark: false,
      themes: {
        dark: vuetifyTheme,
        light: vuetifyTheme,
      },
    },
    icons: {
      values: icons,
      iconfont: 'mdiSvg',
    },
    lang: {
      current: 'de',
      locales: { de },
    },
    preset: undefined,
    defaultAssets: false,
  },

  build: {
    transpile: ['leaflet', 'Vue2Leaflet'],
    loaders: {
      vue: {
        compilerOptions: {
          modules: [
            getIconInjector(
              {},
              {
                'ec-hexa-button': ['icon'],
              }
            ),
          ],
        },
      },
    },
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }

      if (ctx.isClient) {
        // Optimierungen auf Chunk level
        config.optimization = {
          splitChunks: {
            // Minimize init load.
            maxAsyncRequests: 30,
            maxInitialRequests: 30,

            cacheGroups: {
              // Handle aller anderen Module.
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
              },
            },
          },
          concatenateModules: false,
        }

        config.stats = 'verbose'
      }
    },
    // Es sollte getestet werden ob true oder false hier besser ist. (default: false)
    extractCSS: true,
  },
  serverMiddleware: {
    '/api': '~/api',
  },
  render: {
    bundleRenderer: {
      shouldPreload: () => false,
    },
  },
}
