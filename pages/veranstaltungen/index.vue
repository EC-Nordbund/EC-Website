<template lang="pug">
  v-container
    h1 Freizeiten & Events
    //- TODO: sortby by date (asc/desc), alphabetic (asc/desc) 
    //- TODO: filter by tags, age, date-range

    v-row(v-if="veranstaltungen")
      v-col(cols="12" sm="6" md="4")
        v-menu(
          :value="scopeMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290")
          template(v-slot:activator="{ on, attrs }")
            v-text-field(label="Zeitraum" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" :value="dateRangeText")
          v-card(tile)
            v-list
              v-list-item-group(mandatory :value="Object.values(Scope).indexOf(currentScope)")
                v-list-item(v-for="scope in Scope" v-if="scope !== Scope.CUSTOM" :key="scope" @click="saveScope(scope)")
                  v-list-item-title {{ scope }} 
                v-list-group(:value="false")
                  template(v-slot:activator)
                    v-list-item-content
                      v-list-item-title {{ Scope.CUSTOM }}
                  v-date-picker(v-model="customDateRange" range no-title scrollable @input="saveScope(Scope.CUSTOM)")

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
import { IContentDocument } from '@nuxt/content/types/content';
import {
  defineComponent,
  useAsync,
  useContext,
  computed,
  ref
} from '@nuxtjs/composition-api'
import { supportWebp } from '../../helpers/webp'


export default defineComponent({
  setup(_, ctx) {
    enum Scope {
      TODAY = "Heute",
      ALL = "Alle",
      FUTURE = "Zukünftige",
      PAST = "Vergangene",
      CUSTOM = "Benutzerdefiniert" };

    const scopeMenu = ref(false)
    const currentScope = ref(Scope.FUTURE)
    const customDateRange = ref([])

    const dateRangeText = computed(() => {
      if (currentScope.value === Scope.CUSTOM) {
        return customDateRange.value.join(" bis ")
      }

      return currentScope.value
    });

    const saveScope = (scope: Scope) => {
      if (scope == Scope.CUSTOM && customDateRange.value.length < 2) return; // wait for the second date
      scopeMenu.value = false
      currentScope.value = scope
    }

    const filter = (veranstaltung: IContentDocument) => {
      const today = new Date().toISOString().substring(0, 10);

      switch (currentScope.value) {
        case Scope.CUSTOM:
          return veranstaltung.begin > customDateRange.value[0] && veranstaltung.ende < customDateRange.value[1]

        case Scope.ALL:
          return true

        case Scope.TODAY:
          return veranstaltung.start <= today && veranstaltung.ende >= today

        case Scope.PAST:
          return veranstaltung.ende <= today

        case Scope.FUTURE:
        default:
          return veranstaltung.begin >= today
      }
    }

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

    const veranstaltungContent = useAsync(async () => {
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

    const veranstaltungen = computed(() =>{
      return veranstaltungContent.value?.filter(filter)
    })

    return {
      detailsMaxHeight,
      textWaitingQueue,
      veranstaltungen,
      supportWebp,
      currentScope,
      scopeMenu,
      customDateRange,
      dateRangeText,
      Scope,
      saveScope
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
    link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/veranstaltungen',
          hid: 'canonical',
        },
      ],
  },
})
</script>
