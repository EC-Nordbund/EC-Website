<template lang="pug">
v-btn.hexagon-shape(
  color='primary',
  variant='flat',
  rounded='0',
  :width='size_px',
  :height='size_px',
  :style='`transform: rotate(${rotate}deg);`'
)
  v-icon(:style='`transform: rotate(-${rotate}deg);`', :size='icon_size', :icon='icon')
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  /** SVG-Pfad aus `@mdi/js` (z. B. `mdiArrowRight`) — kein `mdi-*`-String mehr! */
  icon: {
    type: String,
    default: '',
  },
  rotate: {
    type: Number,
    default: 0,
  },
  size: {
    type: Number,
    default: 72,
  },
})

const size_px = computed(() => props.size + 'px')

const icon_size = computed(() => Math.floor(props.size * 0.45))
</script>
