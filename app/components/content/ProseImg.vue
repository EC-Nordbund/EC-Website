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
// Keine eigenen Styles: die img-Regeln (width/max-width 720px/Zentrierung)
// kommen aus markdown.scss über die .nuxt-content-Klasse des ContentRenderer
</script>
