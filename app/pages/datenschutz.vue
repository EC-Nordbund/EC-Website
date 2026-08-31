<template lang="pug">
//- main
v-container(v-if='pages')
  v-row
    v-col
      h1 Datenschutz
  v-row
    v-col
      v-tabs(v-model='tab')
        v-tab(:value='0') Website
        v-tab(:value='1') Veranstaltungs Teilnehmer
        v-tab(:value='2') Veranstaltungs Mitarbeiter
        v-tab(:value='3') EC-Mitglieder + EC-Mitarbeiter
      v-tabs-window(v-model='tab')
        v-tabs-window-item(:value='0', title='Website')
          ContentRenderer.nuxt-content(:value='pages.website')
        v-tabs-window-item(:value='1', title='Veranstaltungs Teilnehmer')
          ContentRenderer.nuxt-content(:value='pages.teilnehmer')
        v-tabs-window-item(:value='2', title='Veranstaltungs Mitarbeiter')
          ContentRenderer.nuxt-content(:value='pages.mitarbeiter')
        v-tabs-window-item(:value='3', title='EC-Mitglieder + EC-Mitarbeiter')
          ContentRenderer.nuxt-content(:value='pages.mitglieder')
  v-row
    v-col
      ContentRenderer.nuxt-content(:value='pages.kontakt')
v-container(v-else)
  p Lade Inhalt...
</template>
<script setup lang="ts">
const tab = ref(0)

const { data: pages } = await useAsyncData('datenschutz', async () => {
  const docs = await queryCollection('datenschutz').all()

  // stem = Dateiname ohne Endung; je nach @nuxt/content-Version mit oder
  // ohne Quellverzeichnis-Präfix ('kontakt' vs. 'datenschutz/kontakt') —
  // tolerant auf beide Formen matchen.
  const byStem = (stem: string) =>
    docs.find((d) => d.stem === stem || d.stem === `datenschutz/${stem}`) ??
    null

  return {
    kontakt: byStem('kontakt'),
    mitarbeiter: byStem('mitarbeiter'),
    mitglieder: byStem('mitglieder'),
    teilnehmer: byStem('teilnehmer'),
    website: byStem('website'),
  }
})

useHead({
  title: 'Datenschutz',
  link: [
    {
      rel: 'canonical',
      href: 'https://www.ec-nordbund.de/datenschutz',
    },
  ],
})

useSeoMeta({
  description: 'Unsere Datenschutzerklärung für alle Personengruppen.',
  // Open Graph
  ogTitle: 'Datenschutz',
  ogDescription: 'Unsere Datenschutzerklärung für alle Personengruppen.',
  // Twitter Card
  twitterTitle: 'Datenschutz',
  twitterDescription: 'Unsere Datenschutzerklärung für alle Personengruppen.',
})
</script>
