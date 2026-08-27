<template lang="pug">
  ecBlogPage(:page="pageNum" v-if="isPagination")
  v-container(v-else-if="page")
    ContentRenderer(:value='page')
</template>
<script>
import { defineComponent, computed } from 'vue'
export default defineComponent({
  async setup() {
    const route = useRoute()

    const id = computed(() => route.params.id)
    const pageNum = computed(() => parseInt(id.value))
    const isPagination = computed(() => /^\d+$/.test(id.value))

    const { data: page } = await useAsyncData('blog-post', () => {
      if (isPagination.value) return Promise.resolve(null)

      return queryContent(`blog/${id.value}`).findOne()
    })

    useSeoMeta({
      title: () => {
        if (!isPagination.value && page.value) {
          return page.value.title
        }
        return 'Blog | Seite ' + pageNum.value
      },
      description: () => {
        if (!isPagination.value && page.value) {
          return page.value.description
        }
        return 'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.'
      },
      ogTitle: () => {
        if (!isPagination.value && page.value) {
          return page.value.title
        }
        return 'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.'
      },
      ogDescription: () => {
        if (!isPagination.value && page.value) {
          return page.value.description
        }
        return 'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.'
      },
      ogImage: () => {
        if (!isPagination.value && page.value) {
          return page.value.featuredImage
        }
        return undefined
      },
      twitterTitle: () => {
        if (!isPagination.value && page.value) {
          return page.value.title
        }
        return 'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.'
      },
      twitterDescription: () => {
        if (!isPagination.value && page.value) {
          return page.value.description
        }
        return 'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.'
      },
      twitterImage: () => {
        if (!isPagination.value && page.value) {
          return page.value.featuredImage
        }
        return undefined
      },
    })

    useHead({
      link: [
        {
          rel: 'canonical',
          href: computed(() => {
            if (!isPagination.value && page.value) {
              return 'https://www.ec-nordbund.de/blog/' + page.value._path?.split('/').pop()
            }
            return 'https://www.ec-nordbund.de/blog/' + pageNum.value
          }),
        },
      ],
    })

    return { page, isPagination, pageNum }
  },
})
</script>
