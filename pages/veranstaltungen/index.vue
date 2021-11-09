<template lang="pug">
  v-container
    h1 Freizeiten & Events
    //- TODO: filter by age
    v-row(v-if="veranstaltungen")
      v-col(cols="12" sm="6" md="4")
        v-menu(
          v-model="scopeMenu"
          :close-on-content-click="false"
          offset-y
          min-width="290"
          attach)
          template(v-slot:activator="{ on, attrs }")
            v-text-field(label="Zeitraum" prepend-inner-icon="mdi-calendar-question" readonly v-bind="attrs" v-on="on" :value="scopeValueStr")

          v-card(tile)
            v-list
              v-list-item-group(mandatory :value="Object.values(Scope).indexOf(filterScope)")
                v-list-item(v-for="scope in Scope" v-if="scope !== Scope.CUSTOM" :key="scope" @click="closeScopeMenu(scope)")
                  v-list-item-icon
                    v-icon(v-if="scope===Scope.ALL") mdi-calendar-month
                    v-icon(v-else-if="scope===Scope.FUTURE") mdi-calendar-arrow-right
                    v-icon(v-else-if="scope===Scope.PAST") mdi-calendar-arrow-left
                    v-icon(v-else) mdi-calendar
                  v-list-item-content
                    v-list-item-title {{ scope }} ({{ filterResultAmount(scope, filterTags, filterKeyword) }})
                v-list-group(:value="false")
                  template(v-slot:activator)
                    v-list-item-icon
                      v-icon mdi-calendar-edit
                    v-list-item-content
                      v-list-item-title {{ Scope.CUSTOM }} ({{ filterResultAmount(Scope.CUSTOM, filterTags), filterKeyword }})

                  v-date-picker(v-model="customDateRange" range no-title scrollable @input="closeScopeMenu(Scope.CUSTOM)" :events="vDates" event-color="primary")

      v-col(cols="12" sm="6" md="4")
        v-select(
          v-model="filterTags"
          :items="vTags"
          label="Tags"
          prepend-inner-icon="mdi-tag"
          multiple)

      v-col(cols="12" sm="6" md="4")
        v-text-field(label="Stichtwort" prepend-inner-icon="mdi-magnify" :value="filterKeyword" @input="onKeywordTyping" clearable :suffix="filterKeyword ? `(${filterResultAmount(filterScope, filterTags, filterKeyword)})` :  undefined")

    v-row(v-if="veranstaltungen" justify="center")
      v-col(v-if="veranstaltungen.length < 1" cols="8")
        v-alert(type="info" dense prominent)
          h3 Keine Veranstaltungen gefunden.
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
  useStatic,
  useContext,
  computed,
  ref,
  watch
} from '@nuxtjs/composition-api'
import { supportWebp } from '../../helpers/webp'

export default defineComponent({
  setup(props, ctx) {
    enum Scope {
      TODAY = 'Heute',
      FUTURE = 'Zukünftige',
      PAST = 'Vergangene',
      ALL = 'Alle',
      CUSTOM = 'Benutzerdefiniert',
    }

    const keyword = ref('')
    const keywordDelayTimer = ref(null)
    const filterKeyword = ref('')

    const filterTags = ref([])

    const scopeMenu = ref(false)
    const filterScope = ref(Scope.FUTURE)
    const customDateRange = ref([])

    const scopeValueStr = computed(() => {
      let scope = filterScope.value

      // date range
      if (scope === Scope.CUSTOM) {
        scope = customDateRange.value
          .map((d: string) => new Date(d).toLocaleDateString())
          .join(' – ') + ` (${filterResultAmount(Scope.CUSTOM, filterTags.value, filterKeyword.value)})`
      }

      return `${scope} (${filterResultAmount(filterScope.value, filterTags.value, filterKeyword.value)})`
    })

    const onKeywordTyping = (str: string) => {
      clearTimeout(keywordDelayTimer.value)
      keywordDelayTimer.value = setTimeout(function() {
          filterKeyword.value = str          
      }, 333)
    }

    const closeScopeMenu = (scope: Scope) => {
      if (scope === Scope.CUSTOM && customDateRange.value.length < 2) return // wait for the second date
      filterScope.value = scope
      scopeMenu.value = false
    }

    function filterByScope(veranstaltung: any, scope?: Scope) {
      scope = scope || filterScope.value

      const today = new Date().toISOString().split('T')[0]

      switch(scope) {
        case Scope.CUSTOM:
          return veranstaltung.begin > customDateRange.value[0] &&
            veranstaltung.ende < customDateRange.value[1]

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

    function filterByTags(veranstaltung: any, tags?: string[]) {
      tags = tags || filterTags.value
      
      if (Array.isArray(veranstaltung.tags)) {
        // has tags to filter with
        if ((tags||[]).length > 0) {
          return veranstaltung.tags
            .filter((tag: string) => tags?.includes(tag)).length > 0
        }
      }

      return true
    }

    function filterByKeyword(veranstaltung: any, keyword?: string) {
      keyword = String(keyword || filterKeyword.value).toLowerCase()

      const searchIn = [
        veranstaltung.title,
        veranstaltung.description,
        ...(veranstaltung.tags||[])]

      // has keyword
      if (keyword.length > 0) {
        return searchIn.join(' ').toLowerCase().indexOf(keyword) != -1
      }

      return true
    }

    function filter(veranstaltung: any, scope?: Scope, tags?: string[], keyword?: string) {
      return filterByScope(veranstaltung, scope)
        && filterByTags(veranstaltung, tags)
        && filterByKeyword(veranstaltung, keyword);
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

    const vData = useStatic(
      async () => {
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
      },
      undefined,
      'vDataPage'
    )

    const filterResultAmount = (scope: Scope, tags: string[], keyword: string) => {
      const filtered = vData.value?.filter((v: any) => filter(v, scope, tags, keyword))

      return (filtered||[]).length
    }


    const vDates = computed(() => vData.value.map((v: any) => v.begin))
    const vTags = computed(() => {
      const tags = [...new Set(vData.value.flatMap((v: any) => v.tags))]
        .sort((a: any, b: any) =>  `${a}`.toLowerCase().localeCompare(`${b}`.toLowerCase()))

      return tags.map((tag: any) => {
        const results = filterResultAmount(filterScope.value, [tag], filterKeyword.value)

        return { value: tag, results, text: `${tag} (${results})`}
        }).filter((tag: any) => tag.results > 0)
    })

    const veranstaltungen = computed(() => vData.value?.filter((v: any) => filter(v)))

    return {
      detailsMaxHeight,
      textWaitingQueue,
      veranstaltungen,
      vDates,
      supportWebp,
      filterScope,
      scopeMenu,
      customDateRange,
      scopeValueStr,
      Scope,
      closeScopeMenu,
      filterResultAmount,
      vTags,
      filterTags,
      filterKeyword,
      keyword,
      onKeywordTyping
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
