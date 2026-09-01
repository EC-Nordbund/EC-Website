<template lang="pug">
v-container(v-if='page && orte')
  //- p {{ orte }}
  ContentRenderer.nuxt-content(:value='page')
  ec-location(
    :marker='orteMarker',
    style='width: 100%; height: 500px; z-index: 0;'
  )
  ul
    li(v-for='ort in orte')
      NuxtLink(:to="'/orte/' + ort.slug") {{ ort.title }}
</template>
<script setup lang="ts">
const { data: page } = await useAsyncData('orte-page', () =>
  queryCollection('orte').first(),
)

// stem = Dateiname ohne Endung = alter Slug; Templates nutzen weiter `slug`
const { data: orte } = await useAsyncData('orte-liste', async () => {
  const docs = await queryCollection('ort')
    .select('title', 'strasse', 'plz', 'ort', 'lat', 'long', 'stem')
    .order('stem', 'ASC')
    .all()
  return docs.map((d) => ({ ...d, slug: stemToSlug(d.stem) }))
})

useHead({
  title: 'EC-Kreise',
  link: [
    {
      rel: 'canonical',
      href: 'https://www.ec-nordbund.de/orte',
    },
  ],
})

useSeoMeta({
  description: 'Überblick über alle EC Standorte.',
  ogTitle: 'EC-Kreise',
  ogDescription: 'Überblick über alle EC Standorte.',
  twitterTitle: 'EC-Kreise',
  twitterDescription: 'Überblick über alle EC Standorte.',
})

const orteMarker = computed(() =>
  (orte.value ?? [])
    .map((v) => ({
      ...v,
      marker: [Number(v.lat), Number(v.long)] as [number, number],
      more: `/orte/${v.slug}`,
    }))
    // kaputte Koordinaten (z. B. '54.782.670') nicht an Leaflet geben
    .filter((v) => !Number.isNaN(v.marker[0]) && !Number.isNaN(v.marker[1])),
)
</script>
