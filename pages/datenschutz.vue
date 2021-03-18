<template lang="pug">
//- main
v-container(v-if='pages')
  v-row
    v-col
      h1 Datenschutz
  v-row
    v-col
      v-tabs(v-model='tab')
        v-tab Website
        v-tab Veranstaltungs Teilnehmer
        v-tab Veranstaltungs Mitarbeiter
        v-tab EC-Mitglieder + EC-Mitarbeiter
      v-tabs-items(v-model='tab')
        v-tab-item(title='Website')
          nuxt-content(:document='pages.website')
        v-tab-item(title='Veranstaltungs Teilnehmer')
          nuxt-content(:document='pages.teilnehmer')
        v-tab-item(title='Veranstaltungs Mitarbeiter')
          nuxt-content(:document='pages.mitarbeiter')
        v-tab-item(title='EC-Mitglieder + EC-Mitarbeiter')
          nuxt-content(:document='pages.mitglieder')
  v-row
    v-col
      nuxt-content(:document='pages.kontakt')
v-container(v-else)
  p Lade Inhalt...
</template>
<script lang="ts">
import {
  defineComponent,
  useStatic,
  useMeta,
  ref,
  useContext,
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const tab = ref(0)
    const { $content } = useContext()

    const pages = useStatic(async () => {
      const [
        kontakt,
        mitarbeiter,
        mitglieder,
        teilnehmer,
        website,
      ] = await Promise.all([
        $content('datenschutz/kontakt').fetch(),
        $content('datenschutz/mitarbeiter').fetch(),
        $content('datenschutz/mitglieder').fetch(),
        $content('datenschutz/teilnehmer').fetch(),
        $content('datenschutz/website').fetch(),
      ])

      return {
        kontakt,
        mitarbeiter,
        mitglieder,
        teilnehmer,
        website,
      }
    }, undefined, 'datenschutz')

    return {
      tab,
      pages,
    }
  },
  head: {
    title: 'Datenschutz',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Unsere Datenschutzerklärung für alle Personengruppen.',
      },
      // Open Graph
      { hid: 'og:title', property: 'og:title', content: 'Datenschutz' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Unsere Datenschutzerklärung für alle Personengruppen.',
      },
      // Twitter Card
      { hid: 'twitter:title', name: 'twitter:title', content: 'Datenschutz' },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Unsere Datenschutzerklärung für alle Personengruppen.',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://www.ec-nordbund.de/datenschutz',
        hid: 'canonical',
      },
    ],
  },
})
</script>
