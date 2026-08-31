<template lang="pug">
//- Wie im Alt-Stand rendert die Fehlerseite im normalen Seitenrahmen
//- (das alte error-Layout referenzierte 'empty', fiel damit auf default zurück)
NuxtLayout(name='default')
  v-container
    h1(v-if='error?.statusCode === 404') {{ pageNotFound }}
    h1(v-else) {{ otherError }}
    nuxt-link(to='/') Home page
</template>

<script setup lang="ts">
// Ersetzt layouts/error.vue (das dort referenzierte Layout 'empty' existierte nie)
const error = useError()

const pageNotFound = '404 Not Found'
const otherError = 'An error occurred'

useHead({
  title: computed(() =>
    error.value && 'statusCode' in error.value && error.value.statusCode === 404
      ? pageNotFound
      : otherError
  ),
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
