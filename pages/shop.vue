<template lang="pug">
v-container(fluid).px-0
  ec-spreadshirt-shop(shopName="nordbund", shopUrl="https://nordbund.myspreadshop.de")
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    useHead({
      title: 'EC-Shop',
      meta: [
        {
          name: 'description',
          content: 'Der offizielle Shop des EC-Nordbundes.',
        },
        // Open Graph
        { property: 'og:title', content: 'EC-Shop' },
        {
          property: 'og:description',
          content: 'Der offizielle Shop des EC-Nordbundes.',
        },
        // Twitter Card
        { name: 'twitter:title', content: 'EC-Shop' },
        {
          name: 'twitter:description',
          content: 'Der offizielle Shop des EC-Nordbundes.',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/shop',
        },
      ],
    })
  },
})
</script>
