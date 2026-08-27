<template>
  <v-app>
    <v-container class="text-center mt-16">
      <h1 v-if="error.statusCode === 404">404 - Seite nicht gefunden</h1>
      <h1 v-else>Ein Fehler ist aufgetreten</h1>
      <p class="mt-4">
        <v-btn color="primary" to="/" @click="handleError">Zur Startseite</v-btn>
      </p>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

useHead({
  title: props.error.statusCode === 404 ? '404 - Seite nicht gefunden' : 'Fehler',
})

const handleError = () => clearError({ redirect: '/' })
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
