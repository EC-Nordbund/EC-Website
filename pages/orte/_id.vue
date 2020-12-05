<template lang="pug">
  v-container
    ec-location(:marker="[{...page, marker: [page.lat, page.long], noMore: true}]" style="width: 100%; height: 500px; z-index: 0;")
    nuxt-content(:document="page")
</template>
<script>
export default {
  async asyncData({ $content, params, redirect, route }) {
    try {
      const page = await $content('ort', params.id).fetch()

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
          content: 'Alles über den Standort.',
        },
        // Open Graph
        { hid: 'og:title', property: 'og:title', content: this.page.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Alles über den Standort.',
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
          content: 'Alles über den Standort.',
        },
      ],
    }
  },
}
</script>
