<template lang="pug">
  v-container
    nuxt-content(v-for="page in posts" :document="page")
</template>
<script>
export default {
  async asyncData({ $content }) {
    const posts = await $content('blog').sortBy('published', 'desc').fetch()

    return { posts }
  },
  data() {
    return {
      posts: [],
    }
  },
}
</script>
