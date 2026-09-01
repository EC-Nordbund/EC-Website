<template lang="pug">
div
  nuxt-loading-indicator(color='#92c355')
  nuxt-layout
    nuxt-page
</template>

<script setup lang="ts">
// Ersatz für die alte titleTemplate-Funktion in nuxt.config.js:
// mit Seitentitel "<titel> | EC-Nordbund", ohne Titel Fallback "EC-Nordbund"
useHead({
  titleTemplate: (chunk?: string | null) =>
    chunk ? `${chunk} | EC-Nordbund` : 'EC-Nordbund',
})
</script>
