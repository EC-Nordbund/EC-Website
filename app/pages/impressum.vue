<template lang="pug">
v-container(class="text-center" v-if="page")
  v-row
    v-col
      ContentRenderer(:value="page")
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('impressum', () =>
  queryCollection('impressum').first(),
)

useHead({
  title: 'Impressum',
  link: [
    {
      rel: 'canonical',
      href: 'https://www.ec-nordbund.de/impressum',
    },
  ],
})

useSeoMeta({
  description: 'Unser Impressum: Wer ist für diese Seite verantwortlich?',
  // Open Graph
  ogTitle: 'Impressum',
  ogDescription: 'Unser Impressum: Wer ist für diese Seite verantwortlich?',
  // Twitter Card
  twitterTitle: 'Impressum',
  twitterDescription: 'Unser Impressum: Wer ist für diese Seite verantwortlich?',
})
</script>
