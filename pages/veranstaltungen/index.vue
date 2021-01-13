<template lang="pug">
  v-container
    h1 Freizeiten & Events
    //- TODO: sortby by date (asc/desc), alphabetic (asc/desc) 
    //- TODO: filter by tags, age, date-range
    v-row(v-if="veranstaltungen")
      v-col(v-for="item in veranstaltungen" cols="12" sm="6" md="12" :key="item.slug")
        v-card(outlined tile hover class="overflow-hidden" color="offWhite" :to="`/veranstaltungen/${item.slug}`")
          v-row(no-gutters)
            v-col(cols="12" md="6" lg="4" class="hellGrau")
              ec-image-item(:image="item.featuredImage.split('.')[0] + (supportWebp() ? '.webp' : '.jpg')" :title="item.title" :subTitle="`Vom ${item.begin.split('-').reverse().join('.')} bis ${item.ende.split('-').reverse().join('.')}`" class="hellGrau")

            //- white-area (bottom/right part)
            v-col(cols="12" md="6" lg="8" class="d-flex flex-column justify-space-between" :style="detailsMaxHeight")
              v-card-text(class="full-heigth overflow-hidden pb-0")
                //- labels
                v-row(no-gutters)
                  //- categories
                  v-col(cols="12" lg="8" class="d-flex flex-wrap justify-md-end justify-lg-start mt-n1 mb-1")
                    //- TODO: colored tags
                    v-chip(color="secondary" text-color="primary" class="ml-2 mb-1 font-weight-medium" outlined small v-for="tag in item.tags" :key="tag")
                      | {{ tag }}
                    v-chip(color="secondary" text-color="primary" class="ml-2 mb-1 font-weight-medium" outlined small v-if="item.juleica")
                      | JuLeiCa-Fortbildung

                  //- indicator
                  v-col(cols="12" lg="4" class="d-flex flex-wrap justify-md-end mb-1 ml-n2")
                      v-chip(color="warning" text-color="white" class="ml-2 mb-1 font-weight-medium" small v-for="wl in Object.keys(item.warteliste)" v-if="item.warteliste[wl]" :key="'wl-' + wl")
                        v-icon(small class="ml-n1 mr-1 ") mdi-alert-circle
                        | {{textWaitingQueue(wl)}}

                //- description
                v-row
                  v-col(cols="12") {{item.description}}

              //- actions/buttons
              v-card-actions(class="pa-4")
                v-spacer
                ec-hexa-button(:to="`/veranstaltungen/${item.slug}`" icon="mdi-arrow-right" :aria-label="`Zur Veranstaltung: ${item.title}`")
    p(v-else) Loading...
</template>
<script lang="ts">
import {
  defineComponent,
  useAsync,
  useContext,
  computed,
} from '@nuxtjs/composition-api'
import { supportWebp } from '../../helpers/webp'

export default defineComponent({
  setup(props, ctx) {
    const detailsMaxHeight = computed(() => {
      switch (ctx.root.$vuetify.breakpoint.name) {
        case 'md':
        case 'lg':
        case 'xl':
          return 'max-height: 300px;'
        default:
          return ''
      }
    })

    const textWaitingQueue = (wl: 'männlich' | 'weiblich' | any) => {
      switch (wl) {
        case 'männlich':
          return 'Für Männer nur noch Warteliste'
        case 'weiblich':
          return 'Für Frauen nur noch Warteliste'
        default:
          return 'Nur noch Warteliste'
      }
    }

    const { $content } = useContext()

    const veranstaltungen = useAsync(async () => {
      const veranstaltungen = await $content('veranstaltung')
        .only([
          'slug',
          'title',
          'begin',
          'ende',
          'veranstaltungsort',
          'description',
          'minAlter',
          'maxAlter',
          'featuredImage',
          'warteliste',
          'tags',
        ])
        .sortBy('begin')
        .fetch()

      return veranstaltungen
    })

    return {
      detailsMaxHeight,
      textWaitingQueue,
      veranstaltungen,
      supportWebp,
    }
  },
  head: {
    title: 'Veranstaltungen',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Liste aller Veranstaltungen des EC-Nordbundes.',
      },
      // Open Graph
      { hid: 'og:title', property: 'og:title', content: 'Veranstaltungen' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Liste aller Veranstaltungen des EC-Nordbundes.',
      },
      // Twitter Card
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Veranstaltungen',
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Liste aller Veranstaltungen des EC-Nordbundes..',
      },
    ],
  },
})
</script>
