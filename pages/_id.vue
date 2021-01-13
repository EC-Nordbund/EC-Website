<template lang="pug">
v-container
  | WENN DU DAS LIEST IST WAS SCHIEFGEGANGEN...
</template>
<script>
export default {
  async asyncData({ $content, params, redirect, route }) {
    if (params.id.toLowerCase() === 'karlsminde') {
      redirect('/orte/karlsminde')
      return
    }

    const { slugs } = await $content('old-news-slugs').fetch()
    // console.log(slugs)

    if (slugs.includes(params.id)) {
      redirect('/blog/' + params.id)
    } else {
      redirect('/404', { path: route.path })
    }
  },
}
</script>
