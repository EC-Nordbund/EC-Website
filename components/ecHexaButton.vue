<template lang="pug">
  v-btn(v-bind="$attrs" color="primary" class="hexagon-shape" depressed tile :width="size_px" :height="size_px" :style="`transform: rotate(${rotate}deg);`")
    v-icon(:style="`transform: rotate(-${rotate}deg);`" :size="icon_size") {{icon}}
</template>
<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
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
  },
  setup(props) {
    const size_px = computed(() => props.size + 'px')

    const icon_size = computed(() => Math.floor(props.size * 0.45))

    return { size_px, icon_size }
  },
})
</script>
