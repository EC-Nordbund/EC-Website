import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const SITE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : 'https://www.ec-nordbund.de/'

const contentDir = fileURLToPath(new URL('./content', import.meta.url))

/**
 * Dateinamen ohne .md-Endung (= alte @nuxt/content-v1-Slugs bzw. neue stems).
 */
function contentStems(subDir: string): string[] {
  return readdirSync(join(contentDir, subDir))
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

const vuetifyThemeColors = {
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

  vgRot: '#c30a1e',
  vgBlau: '#0f3d8c',

  // Standard colors
  accent: '#583a70', // lila
  secondary: '#282925', // dunkelGrau
  info: '#70b6d4', // hellBlau
  warning: '#ffd633', // gelb
  error: '#ea4c60', // koralle
  success: '#92c355', // grün (primary)

  // Gradient (alt: 'gradient-left'/'gradient-right' → camelCase, CSS-Var: --v-theme-gradientLeft)
  gradientLeft: '#a3cf4b',
  gradientRight: '#5da635',

  // Social
  facebook: '#1877f2',
  instagram: '#c32aa3',
  youtube: '#f00',
}

export default defineNuxtConfig({
  compatibilityDate: '2026-08-31',

  modules: [
    'vuetify-nuxt-module',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/leaflet',
  ],

  app: {
    baseURL: process.env.EC_SET_BASE ?? '/',

    head: {
      titleTemplate: '%s | EC-Nordbund',
      htmlAttrs: {
        lang: 'de',
      },
      meta: [
        {
          name: 'google-site-verification',
          content: 'vSmp7129Uj6Kdz8krkwXDruN7HNXYYeCRfGJgBQuCKI',
        },
        // Open Graph
        { property: 'og:site_name', content: 'EC-Nordbund' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:image', content: `${SITE_URL}card.png` },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: SITE_URL },
        { name: 'twitter:title', content: 'EC-Nordbund' },
        { name: 'twitter:image', content: `${SITE_URL}card.png` },
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

  css: [
    '@fontsource/montserrat/latin-400.css',
    '@fontsource/montserrat/latin-500.css',
    '@fontsource/montserrat/latin-600.css',
    '@fontsource/montserrat/latin-700.css',
    '~/assets/styles/global.scss',
  ],

  runtimeConfig: {
    public: {
      EC_BASE: process.env.EC_SET_BASE ?? '/',
    },
  },

  vuetify: {
    moduleOptions: {
      // Sass-Konfiguration (ersetzt customVariables/variables-vuetify.scss):
      // $color-pack, $body-font-family und die MD2-Typografie-Klassen.
      // Pfad relativ zum srcDir (app/).
      styles: { configFile: 'assets/styles/settings.scss' },
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        variations: false,
        themes: {
          light: {
            colors: vuetifyThemeColors,
          },
        },
      },
      icons: {
        defaultSet: 'mdi-svg',
      },
      // Alt-Setup registrierte alle Vuetify-Direktiven global (v-ripple, v-scroll in Verwendung)
      directives: true,
      // vuetify-nuxt-module lädt die Vuetify-Locale-Messages anhand des Namens
      localeMessages: ['de'],
      locale: {
        locale: 'de',
        fallback: 'de',
      },
    },
  },

  site: {
    url: 'https://www.ec-nordbund.de',
  },

  sitemap: {
    exclude: ['/anmeldung/**', '/404', '/blog/all', '/empty', '/orte', '/admin'],
    sources: ['/api/__sitemap__/urls'],
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  hooks: {
    'prerender:routes'(ctx) {
      // fs-basiert (unabhängig von @nuxt/content-Interna):
      // stems = Dateinamen ohne .md = alte Slugs (CamelCase/Umlaute bleiben erhalten)
      const blogStems = contentStems('blog')

      for (const stem of blogStems) {
        ctx.routes.add(`/blog/${stem}`)
      }

      // Blog-Pagination: /blog/1 .. /blog/ceil(n/10)
      for (let i = 1; i <= Math.ceil(blogStems.length / 10); i++) {
        ctx.routes.add(`/blog/${i}`)
      }

      for (const stem of contentStems('veranstaltung')) {
        ctx.routes.add(`/veranstaltungen/${stem}`)
      }

      for (const stem of contentStems('ort')) {
        ctx.routes.add(`/orte/${stem}`)
      }

      // Statische Seiten explizit (Crawler-unabhängig)
      for (const route of [
        '/blog',
        '/veranstaltungen',
        '/orte',
        '/orte/karlsminde',
        '/datenschutz',
        '/downloads',
        '/impressum',
        '/teilnahmebedingungen',
        '/krisenintervention',
        '/shop',
        '/404',
      ]) {
        ctx.routes.add(route)
      }
    },
  },
})
