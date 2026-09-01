<template lang="pug">
.marquee.text-no-wrap(:style="{ 'background-color': color }")
  span(:style="{ animationDuration: `${length * 0.15 || 15}s` }")
    slot
</template>
<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: 'none',
  },
  length: {
    type: Number,
    required: true,
  },
})
</script>
<style scoped lang="scss">
.marquee {
  margin: 0 auto;
  overflow: hidden;
  border-radius: 12px;
  padding: 2px 6px;
  > span {
    display: inline-block;
    padding-left: 100%;
    animation: marquee linear infinite;
    // Alt: var(--v-secondary-lighten1). Vuetify 4 generiert mit
    // `variations: false` keine lighten-Varianten mehr — fester Wert,
    // entspricht dem alten Rendering (secondary #282925, lighten1).
    color: #3e3f39;
    will-change: transform;
    // Hold animation for 2s at start (while loading)
    animation-delay: 2s;
  }
  &:hover > span {
    animation-play-state: paused;
  }
}
@keyframes marquee {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
}
</style>
