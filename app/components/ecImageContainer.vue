<template lang="pug">
v-carousel(
  continuous,
  cycle,
  height='calc(400px + 3.492vw * 2)',
  show-arrows,
  hide-delimiters
)
  v-carousel-item.bg-secondary(v-for='(img, i) in images', :key='i')
    .image-overlay
      picture
        source(:srcset="trimImgExt(img) + '.webp'", type='image/webp')
        source(:srcset="trimImgExt(img) + '.jpg'", type='image/jpg')
        img.responsive-image(:src="trimImgExt(img) + '.jpg'", :alt='img')
</template>
<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  images: {
    type: Array as PropType<string[]>,
    required: true,
  },
})

const trimImgExt = (path: string) => path.replace(/\.(webp|jpg)$/, '')
</script>
<style lang="scss" scoped>
// TODO: if sloped -> adjust prev & next btn

.image-overlay:after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.32) 0%,
    rgba(0, 0, 0, 0.02) 16%,
    rgba(0, 0, 0, 0.02) 72%,
    rgba(0, 0, 0, 0.72) 100%
  );
}

.responsive-image {
  object-fit: cover;
  min-width: 100%;
  min-height: 100%;
  max-height: 600px;
}
</style>
