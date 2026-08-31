<template lang="pug">
ecBlogPage(:page="1" :key="1")
</template>
<script setup lang="ts">
const description =
  'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.'

useSeoMeta({
  title: 'Blog',
  description,
  // Open Graph
  ogTitle: 'Blog',
  ogDescription: description,
  // Twitter Card
  twitterTitle: 'Blog',
  twitterDescription: description,
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://www.ec-nordbund.de/blog',
    },
  ],
})
</script>
