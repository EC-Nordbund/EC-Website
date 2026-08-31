<template lang="pug">
ClientOnly
  LMap.overflow-hidden(
    v-if='ready',
    v-bind='$attrs',
    :zoom='zoom',
    :center='marker[0].marker',
    :use-global-leaflet='true',
    :options='mapOptions'
  )
    LTileLayer(
      url='https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png',
      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      :options='{ crossOrigin: true }'
    )
    LControlScale(position='topright', :metric='true')
    LMarker(v-for='m in marker', :key='m.title', :lat-lng='m.marker')
      LPopup(:options='{ keepInView: true, autoClose: false }')
        p
          b {{ m.title }}
          br
          | {{ m.strasse }}
          br
          | {{ m.plz }} {{ m.ort }}
          br(v-if='m.email')
          a(v-if='m.email', :href='`mailto:${m.email}`') {{ m.email }}
          br(v-if='!m.noMore')
          NuxtLink(v-if='!m.noMore', :to='m.more', style='cursor: pointer') mehr...
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { PropType } from 'vue'

interface MarkerItem {
  marker: [number, number]
  title?: string
  strasse?: string
  plz?: string | number
  ort?: string
  email?: string
  more?: string
  noMore?: boolean
}

// Style/Klassen der Aufrufer (height: 500px etc.) sollen wie im Alt-Stand
// direkt auf dem Karten-Container (LMap-Root) landen, nicht auf <ClientOnly>.
defineOptions({ inheritAttrs: false })

const props = defineProps({
  marker: {
    type: Array as PropType<MarkerItem[]>,
    required: true,
  },
  zoom: {
    type: Number,
    default: 7,
  },
  disableGestureHandling: {
    type: Boolean,
    default: false,
  },
})

/**
 * leaflet-gesture-handling@1.2.2 nutzt nur stabile Leaflet-APIs
 * (L.Handler.extend, L.Map.addInitHook/mergeOptions, L.DomEvent, L.DomUtil)
 * und ist damit mit Leaflet 1.9.4 nutzbar. Es erwartet ein globales `L` zum
 * Import-Zeitpunkt, daher: erst `window.L` setzen, dann Plugin importieren
 * (registriert den Handler via `L.Map.addInitHook('addHandler', 'gestureHandling', …)`).
 * `:use-global-leaflet='true'` sorgt dafür, dass vue-leaflet dieselbe
 * Leaflet-Instanz (window.L) verwendet, an der das Plugin hängt.
 */
const ready = ref(false)

onMounted(async () => {
  const leaflet = await import('leaflet')
  const L = (leaflet as { default?: unknown }).default ?? leaflet
  const g = globalThis as { L?: unknown }
  if (!g.L) {
    g.L = L
  }
  await import('leaflet-gesture-handling')
  await import('leaflet-gesture-handling/dist/leaflet-gesture-handling.css')
  ready.value = true
})

const mapOptions = computed(() => ({
  zoomSnap: 0.5,
  gestureHandling: !props.disableGestureHandling,
}))
</script>
<style scoped>
/* Workaround until https://github.com/elmarquis/Leaflet.GestureHandling/pull/59 is merged */
.leaflet-container:after {
  text-align: center;
}
</style>
