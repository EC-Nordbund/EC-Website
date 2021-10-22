<template lang="pug">
v-container(fluid).px-0
  ec-spreadshirt-shop(shopName="nordbund")
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {},
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


<style>
</style>