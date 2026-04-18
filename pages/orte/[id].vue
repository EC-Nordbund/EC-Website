<template lang="pug">
  v-container
    ec-location(:marker="[{...page, marker: [page.lat, page.long], noMore: true}]" style="width: 100%; height: 500px; z-index: 0;")
    ContentRenderer(:value="page")
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  async setup() {
    const route = useRoute()

    const { data: page } = await useAsyncData(
      `ort-${route.params.id}`,
      () => queryContent(`ort/${route.params.id}`).findOne()
    )

    if (!page.value) {
      await navigateTo('/404', { redirectCode: 301 })
    }

    useSeoMeta({
      title: () => page.value?.title,
      description: 'Alles über den Standort.',
      ogTitle: () => page.value?.title,
      ogDescription: 'Alles über den Standort.',
      twitterTitle: () => page.value?.title,
      twitterDescription: 'Alles über den Standort.',
    })

    useHead({
      link: [
        {
          rel: 'canonical',
          href: () => 'https://www.ec-nordbund.de/orte/' + page.value?._path?.split('/').pop(),
        },
      ],
    })

    return { page }
  },
})
</script>
