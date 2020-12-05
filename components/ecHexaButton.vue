<template lang="pug">
  v-btn(v-bind="$attrs" color="primary" class="ec-gradient" depressed tile :width="size_px" :height="size_px" :style="`transform: rotate(${rotate}deg);`")
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
      default: 72
    }
  },
  setup(props) {
    const size_px = computed(() => props.size + 'px')

    const icon_size = computed(() => Math.floor(props.size*.45))

    return { size_px, icon_size }
  }
})
</script>
<style scoped>
.ec-gradient {
  clip-path: polygon(50% 100%, 5% 75%, 5% 25%, 50% 0%, 95% 25%, 95% 75%);
}
</style>
