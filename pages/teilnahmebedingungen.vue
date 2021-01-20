<template lang="pug">
  v-container
    nuxt-content(:document="page")
</template>

<script>
import { defineComponent, useContext, useAsync } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $content } = useContext()

    const page = useAsync(async () => {
      const page = await $content('teilnahmebedingungen').fetch()

      return page
    })

    return { page }
  },

  head: {
    title: 'Teilnahmebedingungen',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content:
          'Unsere Teilnahmebedingungen. Welche Rechte hast du? Welche Rechte hat der EC?',
      },
      // Open Graph
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Teilnahmebedingungen',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Unsere Teilnahmebedingungen. Welche Rechte hast du? Welche Rechte hat der EC?',
      },
      // Twitter Card
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Teilnahmebedingungen',
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          'Unsere Teilnahmebedingungen. Welche Rechte hast du? Welche Rechte hat der EC?',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://www.ec-nordbund.de/teilnahmebedingungen',
        hid: 'canonical',
      },
    ],
  },
})
</script>
