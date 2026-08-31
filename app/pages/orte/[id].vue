<template lang="pug">
v-container(v-if='page')
  ec-location(
    :marker='[{ ...page, marker: [Number(page.lat), Number(page.long)], noMore: true }]',
    style='width: 100%; height: 500px; z-index: 0;'
  )
  ContentRenderer.nuxt-content(:value='page')
</template>
<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

// stem = Dateiname ohne Endung = alter Slug
const { data: page } = await useAsyncData(`orte-${id}`, () =>
  queryCollection('ort').where('stem', '=', `ort/${id}`).first(),
)

if (!page.value) {
  // Alt: redirect('/404', { path: route.path }) — jetzt echter 404-Fehler
  throw createError({ statusCode: 404, fatal: true })
}

useHead({
  title: () => page.value?.title ?? '',
  link: [
    {
      rel: 'canonical',
      href: 'https://www.ec-nordbund.de/orte/' + id,
    },
  ],
})

useSeoMeta({
  description: 'Alles über den Standort.',
  ogTitle: () => page.value?.title ?? '',
  ogDescription: 'Alles über den Standort.',
  twitterTitle: () => page.value?.title ?? '',
  twitterDescription: 'Alles über den Standort.',
})
</script>
