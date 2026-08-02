<template lang="pug">
ecBlogPage(:page="1" :key="1")
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    useHead({
      title: 'Blog',
      meta: [
        {
          name: 'description',
          content:
            'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
        },
        // Open Graph
        {
          property: 'og:title',
          content: 'Blog',
        },
        {
          property: 'og:description',
          content:
            'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
        },
        // Twitter Card
        {
          name: 'twitter:title',
          content: 'Blog',
        },
        {
          name: 'twitter:description',
          content:
            'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/blog',
        },
      ],
    })
  }
})
</script>
