<template lang="pug">
  v-img(:src="image" height="300" class="white--text align-end" gradient="180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.02) 16%, rgba(0,0,0,0.02) 64%, rgba(0,0,0,0.64) 92%")
    //- title
    div(class="ec-gradient")
      v-card-title(class="d-block pt-2 font-weight-bold text-truncate") {{title.slice(0, 42)}}
      v-card-subtitle(class="pb-2 secondary--text") {{subTitle}}
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
  },
})
</script>
