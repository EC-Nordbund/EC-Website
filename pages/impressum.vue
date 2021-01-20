<template lang="pug">
  v-container(class="text-center" v-if="page")
    v-row
      v-col
        nuxt-content(:document="page")
</template>

<script lang="ts">
import { defineComponent, useAsync, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $content } = useContext()

    const page = useAsync(() => $content('impressum').fetch())

    return { page }
  },
  head: {
    title: 'Impressum',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Unser Impressum: Wer ist für diese Seite verantwortlich?',
      },
      // Open Graph
      { hid: 'og:title', property: 'og:title', content: 'Impressum' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Unser Impressum: Wer ist für diese Seite verantwortlich?',
      },
      // Twitter Card
      { hid: 'twitter:title', name: 'twitter:title', content: 'Impressum' },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Unser Impressum: Wer ist für diese Seite verantwortlich?',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://www.ec-nordbund.de/impressum',
        hid: 'canonical',
      },
    ],
  },
})
</script>
