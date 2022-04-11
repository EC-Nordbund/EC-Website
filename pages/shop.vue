<template lang="pug">
  iframe(src="https://shop.ec-nordbund.de/" style="width: 100%; border: none; margin: 0; padding: 0" :style="{height}")
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from '@vue/composition-api'

export default defineComponent({
  setup() {
    let height = ref(`calc(100vh - 600px)`)

    onMounted(() => {
      height.value = `calc(100vh - ${document.getElementsByTagName('footer')[0].offsetHeight + document.getElementsByTagName('header')[0].offsetHeight + 10}px)`
      document.body.parentElement!.style.overflow = 'hidden'
    })

    onBeforeUnmount(() => {
      document.body.parentElement!.style.overflow = null as any
    })

    return { height }
  },
   head: {
    title: 'EC-Shop',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Der offizielle Shop des EC-Nordbundes.',
      },
      // Open Graph
      { hid: 'og:title', property: 'og:title', content: 'EC-Shop' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Der offizielle Shop des EC-Nordbundes.',
      },
      // Twitter Card
      { hid: 'twitter:title', name: 'twitter:title', content: 'EC-Shop' },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Der offizielle Shop des EC-Nordbundes.',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://www.ec-nordbund.de/shop',
        hid: 'canonical',
      },
    ],
  },
})
</script>