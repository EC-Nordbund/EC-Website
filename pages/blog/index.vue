<template lang="pug">
ecBlogPage(:page="1" :key="1")
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  head() {
    return {
      title: 'Blog',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
        },
        // Open Graph
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Blog',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
        },
        // Twitter Card
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'Blog',
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content:
            'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/blog',
          hid: 'canonical',
        },
      ],
    }
  }
})
</script>
