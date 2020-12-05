<template lang="pug">
  v-container
    nuxt-content(:document="page")
</template>
<script>
export default {
  async asyncData({ $content, params, redirect, route }) {
    try {
      const page = await $content('blog', params.id).fetch()

      return { page }
    } catch (e) {
      redirect('/404', { path: route.path })
    }
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
    }
  },
}
</script>
