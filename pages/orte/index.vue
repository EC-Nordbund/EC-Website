<template lang="pug">
  v-container
    //- p {{ orte }}
    ContentRenderer(:value="page")
    ec-location(:marker="orte.map(v=>({...v, marker: [v.lat, v.long], more: `/orte/${v.slug}`}))" style="width: 100%; height: 500px; z-index: 0;")
    ul
      li(v-for="ort in orte")
        NuxtLink(:to="'/orte/' + ort.slug") {{ort.title}}
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  async setup() {
    const { data: page } = await useAsyncData(
      'orte-page',
      () => queryContent('orte').findOne()
    )

    const { data: orte } = await useAsyncData(
      'orte-list',
      async () => {
        const raw = await queryContent('ort')
          .only(['title', 'strasse', 'plz', 'ort', 'lat', 'long', '_path'])
          .find()
        return raw.map(v => ({ ...v, slug: v._path.split('/').pop() }))
      }
    )

    useHead({
      title: 'EC-Kreise',
      meta: [
        {
          name: 'description',
          content: 'Überblick über alle EC Standorte.',
        },
        // Open Graph
        { property: 'og:title', content: 'EC-Kreise' },
        {
          property: 'og:description',
          content: 'Überblick über alle EC Standorte.',
        },
        // Twitter Card
        { name: 'twitter:title', content: 'EC-Kreise' },
        {
          name: 'twitter:description',
          content: 'Überblick über alle EC Standorte.',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/orte',
        },
      ],
    })

    return { orte, page }
  },
})
</script>
