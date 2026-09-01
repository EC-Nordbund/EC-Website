<template lang="pug">
v-container(fluid).px-0
  ec-spreadshirt-shop(shopName="nordbund", shopUrl="https://nordbund.myspreadshop.de")
</template>

<script setup lang="ts">
useHead({
  title: 'EC-Shop',
  link: [
    {
      rel: 'canonical',
      href: 'https://www.ec-nordbund.de/shop',
    },
  ],
})

useSeoMeta({
  description: 'Der offizielle Shop des EC-Nordbundes.',
  // Open Graph
  ogTitle: 'EC-Shop',
  ogDescription: 'Der offizielle Shop des EC-Nordbundes.',
  // Twitter Card
  twitterTitle: 'EC-Shop',
  twitterDescription: 'Der offizielle Shop des EC-Nordbundes.',
})
</script>
