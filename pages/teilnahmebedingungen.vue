<template lang="pug">
  v-container
    ContentRenderer(:value="page")
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  async setup() {
    const { data: page } = await useAsyncData('TN-Bedingungen', () =>
      queryContent('teilnahmebedingungen').findOne()
    )

    useHead({
      title: 'Teilnahmebedingungen',
      meta: [
        {
          name: 'description',
          content:
            'Unsere Teilnahmebedingungen. Welche Rechte hast du? Welche Rechte hat der EC?',
        },
        // Open Graph
        {
          property: 'og:title',
          content: 'Teilnahmebedingungen',
        },
        {
          property: 'og:description',
          content:
            'Unsere Teilnahmebedingungen. Welche Rechte hast du? Welche Rechte hat der EC?',
        },
        // Twitter Card
        {
          name: 'twitter:title',
          content: 'Teilnahmebedingungen',
        },
        {
          name: 'twitter:description',
          content:
            'Unsere Teilnahmebedingungen. Welche Rechte hast du? Welche Rechte hat der EC?',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/teilnahmebedingungen',
        },
      ],
    })

    return { page }
  },
})
</script>
