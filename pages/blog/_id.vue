<template lang="pug">
v-container(v-if="page")
  nuxt-content(:document='page')
</template>
<script>
import { defineComponent, useStatic, useContext, useRoute, computed } from '@nuxtjs/composition-api'
export default defineComponent({
  setup() {
    const { $content } = useContext()
    const route = useRoute()

    const page = useStatic(id => {
      return $content('blog', id).fetch()
    }, computed(() => route.value.params.id), 'blog-post')

    return { page }
  },
  head() {
    return {
      title: this.page.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.page.description,
        },
        // Open Graph
        { hid: 'og:title', property: 'og:title', content: this.page.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.page.description,
        },
        // Twitter Card
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.page.title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.page.description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.page.featuredImage,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.page.featuredImage,
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/blog/' + this.page.slug,
          hid: 'canonical',
        },
      ],
    }
  },
})
</script>
