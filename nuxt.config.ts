import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const vuetifyTheme = {
  primary: '#92c355',
  'dunkel-grau': '#282925',
  'neon-orange': '#fac189',
  'off-white': '#f8f5f4',
  lila: '#583a70',
  'dunkel-rot': '#903557',
  'dunkel-gruen': '#1f5533',
  ocker: '#bc946d',
  koralle: '#ea4c60',
  'hell-blau': '#70b6d4',
  'hell-grau': '#5d5d5c',
  'ec-orange': '#ea571d',
  'dunkel-blau': '#445d9d',
  gelb: '#ffd633',
  flieder: '#9184be',

  up: '#4eb3d8',
  out: '#fac189',
  with: '#9c8aa8',
  in: '#92c355',

  'vg-rot': '#c30a1e',
  'vg-blau': '#0f3d8c',

  // Standard colors
  secondary: '#282925',
  accent: '#583a70',
  info: '#70b6d4',
  warning: '#ffd633',
  error: '#ea4c60',
  success: '#92c355',

  // Gradient
  'gradient-left': '#a3cf4b',
  'gradient-right': '#5da635',

  // Social
  facebook: '#1877f2',
  instagram: '#c32aa3',
  youtube: '#f00',
}

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-01-01',

  components: true,

  app: {
    baseURL: process.env.EC_SET_BASE ?? '/',
    head: {
      titleTemplate: '%s | EC-Nordbund',
      htmlAttrs: { lang: 'de' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'google-site-verification',
          content: 'vSmp7129Uj6Kdz8krkwXDruN7HNXYYeCRfGJgBQuCKI',
        },
        { property: 'og:site_name', content: 'EC-Nordbund' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://www.ec-nordbund.de/' },
        { property: 'og:image', content: 'https://www.ec-nordbund.de/card.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://www.ec-nordbund.de/' },
        { name: 'twitter:title', content: 'EC-Nordbund' },
        { name: 'twitter:image', content: 'https://www.ec-nordbund.de/card.png' },
        { name: 'twitter:image:alt', content: 'Seite des EC-Nordbundes' },
        { name: 'theme-color', content: '#92c355' },
      ],
      link: [
        { rel: 'icon', href: 'favicon_512.png' },
        { rel: 'manifest', href: 'manifest.webmanifest' },
        { rel: 'apple-touch-icon', href: 'apple-icon.png' },
        { rel: 'preconnect', href: 'https://losungen.ec-nordbund.de' },
        { rel: 'preconnect', href: 'https://api.ec-nordbund.de' },
      ],
    },
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/sitemap',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins!.push(vuetify({ autoImport: true }))
      })
    },
  ],

  content: {
    // Content loaded from ./content/ junction → cms-content/content/
  },

  site: {
    url: 'https://www.ec-nordbund.de',
  },

  sitemap: {
    exclude: [
      '/empty',
      '/anmeldung/**',
      '/blog/all',
      '/orte',
      '/404',
      '/admin',
    ],
  },

  css: [
    '@fontsource/montserrat/latin.css',
    '~/assets/styles/global.scss',
    'vuetify/styles',
  ],

  build: {
    transpile: ['vuetify'],
  },

  runtimeConfig: {
    public: {
      EC_BASE: process.env.EC_SET_BASE ?? '/',
    },
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      failOnError: false,
    },
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/variables-vuetify.scss" as *;',
        },
      },
    },
  },
})
