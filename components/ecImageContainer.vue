<template lang="pug">
  v-carousel(
    continuous
    cycle
    height="calc(400px + 3.492vw * 2)"
    show-arrows
    hide-delimiters
  )
    v-carousel-item(
      v-for="(img, i) in images"
      :key="i"
      class="secondary"
    )
      div(class="image-overlay")
        picture
          source(:srcset="img + '.webp'" type="image/webp")
          source(:srcset="img + '.jpg'" type="image/jpg")
          img(:src="img + '.jpg'" :alt="img" class="responsive-image")
</template>
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
<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  setup(_, ctx) {
    const height = computed(() => {
      if (ctx.root.$vuetify.breakpoint.xsOnly) {
        return 300
      }

      if (ctx.root.$vuetify.breakpoint.mdAndDown) {
        return 400
      }

      return 500
    })

    return { height }
  },
})
</script>
