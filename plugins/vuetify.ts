import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { de } from 'vuetify/locale'

const colors = {
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

  secondary: '#282925',
  accent: '#583a70',
  info: '#70b6d4',
  warning: '#ffd633',
  error: '#ea4c60',
  success: '#92c355',

  'gradient-left': '#a3cf4b',
  'gradient-right': '#5da635',

  facebook: '#1877f2',
  instagram: '#c32aa3',
  youtube: '#f00',
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: { colors },
        dark: { colors },
      },
    },
    icons: {
      defaultSet: 'mdi',
    },
    locale: {
      locale: 'de',
      messages: { de },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
