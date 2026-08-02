<template lang="pug">
  v-container(class="text-center" v-if="page")
    v-row
      v-col
        ContentRenderer(:value="page")
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  async setup() {
    const { data: page } = await useAsyncData('impressum', () =>
      queryContent('impressum').findOne()
    )

    useHead({
      title: 'Impressum',
      meta: [
        {
          name: 'description',
          content: 'Unser Impressum: Wer ist für diese Seite verantwortlich?',
        },
        // Open Graph
        { property: 'og:title', content: 'Impressum' },
        {
          property: 'og:description',
          content: 'Unser Impressum: Wer ist für diese Seite verantwortlich?',
        },
        // Twitter Card
        { name: 'twitter:title', content: 'Impressum' },
        {
          name: 'twitter:description',
          content: 'Unser Impressum: Wer ist für diese Seite verantwortlich?',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/impressum',
        },
      ],
    })

    return { page }
  },
})
</script>
