<template lang="pug">
img(:src='resolvedSrc', :alt='alt', :width='width', :height='height')
</template>

<script setup lang="ts">
/**
 * Überschreibt das Standard-ProseImg von @nuxt/content: Bild-Pfade in den
 * Markdown-Bodies sind relativ ('blog/x.jpg') und brechen auf Routen mit
 * Trailing-Slash (/blog/… → /blog/blog/x.jpg) — assetUrl löst sie gegen
 * die baseURL auf.
 */
const props = defineProps<{
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
}>()

const resolvedSrc = computed(() => assetUrl(props.src))
</script>

<style scoped>
img {
  max-width: 100%;
}
</style>
