<template lang="pug">
v-carousel(
  continuous,
  cycle,
  height='calc(400px + 3.492vw * 2)',
  show-arrows,
  hide-delimiters
)
  //- eager: sonst prerendert Vuetify 4 die Bilder nicht ins statische HTML
  //- (Alt-SSG enthielt das erste Galeriebild; SEO/no-JS)
  v-carousel-item.bg-secondary(eager, v-for='(img, i) in images', :key='i')
    .image-overlay
      picture
        //- Bei <picture> faellt der Browser NICHT von selbst auf <img>
        //- zurueck, wenn die gewaehlte <source> 404t. Schlaegt das webp
        //- fehl, nehmen wir die source deshalb raus und laden das Original.
        source(
          v-if='!webpFehlt[i]',
          :srcset='webpQuelle(img)',
          type='image/webp'
        )
        img.responsive-image(
          :ref='(el) => merkeBild(i, el)',
          :src='originalQuelle(img)',
          :alt='img',
          @error='webpFehlt[i] = true'
        )
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import type { PropType } from 'vue'

defineProps({
  images: {
    type: Array as PropType<string[]>,
    required: true,
  },
})

// Galeriepfade kommen in zwei Formen aus dem CMS: mit Endung
// ('veranstaltungen/bild.jpeg') und ohne (Alt-Konvention, 'TC/TC2').
// compress.mjs legt zu jedem Bild ein .webp gleichen Stamms.
const BILD_ENDUNG = /\.(webp|jpe?g|png)$/i

const webpQuelle = (pfad: string) => pfad.replace(BILD_ENDUNG, '') + '.webp'

// Ohne Endung ist per Alt-Konvention .jpg die Originaldatei. Vorher wurde
// hier IMMER '.jpg' angehaengt, nachdem nur '.webp' und '.jpg' abgeschnitten
// wurden — aus 'bild.jpeg' wurde so 'bild.jpeg.jpg' und die Galerie blieb leer.
const originalQuelle = (pfad: string) =>
  BILD_ENDUNG.test(pfad) ? pfad : pfad + '.jpg'

const webpFehlt = reactive<boolean[]>([])

// @error allein reicht nicht: das prerenderte HTML laedt die Bilder, bevor
// Vue hydriert — ein Fehler davor geht verloren. Deshalb beim Mounten
// nachsehen, ob ein Bild schon fertig und trotzdem leer ist.
const bildEl: (HTMLImageElement | null)[] = []
const merkeBild = (i: number, el: unknown) => {
  bildEl[i] = (el as HTMLImageElement | null) ?? null
}
onMounted(() => {
  bildEl.forEach((el, i) => {
    if (el && el.complete && el.naturalWidth === 0) webpFehlt[i] = true
  })
})
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
