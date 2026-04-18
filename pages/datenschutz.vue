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
          ContentRenderer(:value='pages.website')
        v-tab-item(title='Veranstaltungs Teilnehmer')
          ContentRenderer(:value='pages.teilnehmer')
        v-tab-item(title='Veranstaltungs Mitarbeiter')
          ContentRenderer(:value='pages.mitarbeiter')
        v-tab-item(title='EC-Mitglieder + EC-Mitarbeiter')
          ContentRenderer(:value='pages.mitglieder')
  v-row
    v-col
      ContentRenderer(:value='pages.kontakt')
v-container(v-else)
  p Lade Inhalt...
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
} from 'vue'

export default defineComponent({
  async setup() {
    const tab = ref(0)

    const { data: pages } = await useAsyncData('datenschutz', async () => {
      const [
        kontakt,
        mitarbeiter,
        mitglieder,
        teilnehmer,
        website,
      ] = await Promise.all([
        queryContent('datenschutz/kontakt').findOne(),
        queryContent('datenschutz/mitarbeiter').findOne(),
        queryContent('datenschutz/mitglieder').findOne(),
        queryContent('datenschutz/teilnehmer').findOne(),
        queryContent('datenschutz/website').findOne(),
      ])

      return {
        kontakt,
        mitarbeiter,
        mitglieder,
        teilnehmer,
        website,
      }
    })

    useHead({
      title: 'Datenschutz',
      meta: [
        {
          name: 'description',
          content: 'Unsere Datenschutzerklärung für alle Personengruppen.',
        },
        // Open Graph
        { property: 'og:title', content: 'Datenschutz' },
        {
          property: 'og:description',
          content: 'Unsere Datenschutzerklärung für alle Personengruppen.',
        },
        // Twitter Card
        { name: 'twitter:title', content: 'Datenschutz' },
        {
          name: 'twitter:description',
          content: 'Unsere Datenschutzerklärung für alle Personengruppen.',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/datenschutz',
        },
      ],
    })

    return {
      tab,
      pages,
    }
  },
})
</script>
