<template lang="pug">
   client-only
      l-map(:zoom="zoom" :center="marker[0].marker" gestureHandling :options="mapOptions")
        l-tile-layer(:email="`app@ec-nordbund.de`" url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png" attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors')
        l-control-scale(position="topright" metric)
        l-marker(v-for="m in marker" :lat-lng="m.marker" :key="m.title")
          l-popup(:options="{keepInView:true,autoClose:false}")
            p
              b {{m.title}}
              br
              | {{m.strasse}}
              br
              | {{m.plz}} {{m.ort}}
              br(v-if="m.email")
              a(v-if="m.email" :href="`mailto:${m.email}`") {{m.email}}
              br(v-if="!m.noMore")
              nuxt-link(v-if="!m.noMore" :to="m.more" style="cursor: pointer") mehr...
</template>
<script>
import { defineComponent, onMounted } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    marker: {
      type: Array,
      required: true,
    },
    zoom: {
      type: Number,
      default: 7,
    },
  },
  setup() {
    const mapOptions = {
      zoomSnap: 0.5,
      gestureHandling: true,
    }

    // add leaflet gesture handler
    onMounted(() => {
      const L = require('leaflet')
      require('leaflet/dist/leaflet.css')

      globalThis.L = L
      const { GestureHandling } = require('leaflet-gesture-handling')
      require('leaflet-gesture-handling/dist/leaflet-gesture-handling.css')

      L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)
    })

    return { mapOptions }
  },
})
</script>
