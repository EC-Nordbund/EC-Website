<template lang="pug">
  ecBlogPage(:page="pageNum" v-if="isPagination")
  v-container(v-else-if="page")
    nuxt-content(:document='page')
</template>
<script>
import { defineComponent, useStatic, useContext, useRoute, computed } from '@nuxtjs/composition-api'
export default defineComponent({
  setup() {
    const { $content } = useContext()
    const route = useRoute()

    const id = computed(() => route.value.params.id)
    const pageNum = computed(() => parseInt(id.value))
    const isPagination = computed(() => /^\d+$/.test(id.value))

    const page = useStatic(id => {
      if(isPagination.value) return null

      return $content('blog', id).fetch()
    }, id, 'blog-post')

    

    return { page, isPost: isPagination, pageNum }
  },
  head() {
    if(this.isPost) {
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
    } else {
      return {
        title: "Blog | Seite " + this.pageNum,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
          },
          // Open Graph
          { hid: 'og:title', property: 'og:title', content: 'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.', },
          {
            hid: 'og:description',
            property: 'og:description',
            content: 'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
          },
          // Twitter Card
          {
            hid: 'twitter:title',
            name: 'twitter:title',
            content: 'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
          },
          {
            hid: 'twitter:description',
            name: 'twitter:description',
            content: 'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
          }
        ],
        link: [
          {
            rel: 'canonical',
            href: 'https://www.ec-nordbund.de/blog/' + this.pageNum,
            hid: 'canonical',
          },
        ],
      }
    }
  },
})
</script>
