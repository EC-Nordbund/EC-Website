<template lang="pug">
v-container(v-if="page")
  ContentRenderer.nuxt-content(:value="page")
</template>

<script setup lang="ts">
// Alt-Code hatte KEINEN v-if-Guard im Template — laut Guide bekommt die
// Seite einen (useAsyncData kann initial null liefern).
const { data: page } = await useAsyncData('TN-Bedingungen', () =>
  queryCollection('teilnahmebedingungen').first(),
)

useHead({
  title: 'Teilnahmebedingungen',
  link: [
    {
      rel: 'canonical',
      href: 'https://www.ec-nordbund.de/teilnahmebedingungen',
    },
  ],
})

useSeoMeta({
  description:
    'Unsere Teilnahmebedingungen. Welche Rechte hast du? Welche Rechte hat der EC?',
  // Open Graph
  ogTitle: 'Teilnahmebedingungen',
  ogDescription:
    'Unsere Teilnahmebedingungen. Welche Rechte hast du? Welche Rechte hat der EC?',
  // Twitter Card
  twitterTitle: 'Teilnahmebedingungen',
  twitterDescription:
    'Unsere Teilnahmebedingungen. Welche Rechte hast du? Welche Rechte hat der EC?',
})
</script>
