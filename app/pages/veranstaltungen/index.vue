<template lang="pug">
v-container
  h1 Freizeiten & Events
  //- TODO: filter by age
  v-row(v-if="veranstaltungen")
    v-col(cols="12" sm="6" md="4")
      v-menu(
        v-model="scopeMenu"
        :close-on-content-click="false"
        min-width="290"
        attach)
        template(#activator="{ props: activatorProps }")
          v-text-field(label="Zeitraum" :prepend-inner-icon="mdiCalendarQuestion" readonly v-bind="activatorProps" :model-value="scopeValueStr")

        v-card(rounded="0")
          v-list
            v-list-item(v-for="scope in scopeItems" :key="scope" :active="scope === filterScope" @click="closeScopeMenu(scope)")
              template(#prepend='')
                v-icon(v-if="scope===Scope.ALL" :icon="mdiCalendarMonth")
                v-icon(v-else-if="scope===Scope.FUTURE" :icon="mdiCalendarArrowRight")
                v-icon(v-else-if="scope===Scope.PAST" :icon="mdiCalendarArrowLeft")
                v-icon(v-else='' :icon="mdiCalendar")
              v-list-item-title {{ scope }} ({{ filterResultAmount(scope, filterTags, filterKeyword) }})
            v-list-group
              template(#activator="{ props: groupProps }")
                v-list-item(v-bind="groupProps")
                  template(#prepend='')
                    v-icon(:icon="mdiCalendarEdit")
                  v-list-item-title {{ Scope.CUSTOM }} ({{ filterResultAmount(Scope.CUSTOM, filterTags), filterKeyword }})

              v-date-picker(:model-value="pickerDates" multiple="range" hide-header @update:model-value="onPickerUpdate")

    v-col(cols="12" sm="6" md="4")
      v-select(
        v-model="filterTags"
        :items="vTags"
        label="Tags"
        :prepend-inner-icon="mdiTag"
        multiple)

    v-col(cols="12" sm="6" md="4")
      v-text-field(label="Stichtwort" :prepend-inner-icon="mdiMagnify" :model-value="filterKeyword" @update:model-value="onKeywordTyping" clearable :suffix="filterKeyword ? `(${filterResultAmount(filterScope, filterTags, filterKeyword)})` :  undefined")

  v-row(v-if="veranstaltungen" justify="center")
    v-col(v-if="veranstaltungen.length < 1" cols="8")
      v-alert(type="info" density="compact" prominent)
        h2.text-medium-emphasis Keine Veranstaltungen gefunden.
    v-col(v-for="item in veranstaltungen" cols="12" sm="6" md="12" :key="item.slug")
      v-card(variant="outlined" rounded="0" hover class="overflow-hidden" color="offWhite" :to="`/veranstaltungen/${item.slug}`")
        v-row(no-gutters)
          v-col(cols="12" md="6" lg="4")
            ec-image-item(:image="item.featuredImage" :title="item.title ?? ''" :subTitle="`Vom ${item.begin?.split('T')[0]?.split('-').reverse().join('.')} bis ${item.ende?.split('T')[0]?.split('-').reverse().join('.')}`")

          //- white-area (bottom/right part)
          v-col(cols="12" md="6" lg="8" class="d-flex flex-column justify-space-between" :style="detailsMaxHeight")
            v-card-text(class="full-heigth overflow-hidden pb-0")
              //- labels
              v-row(no-gutters)
                //- categories
                v-col(cols="12" lg="8" class="d-flex flex-wrap justify-md-end justify-lg-start mt-n1 mb-1")
                  //- TODO: colored tags
                  v-chip(color="primary" class="ml-2 mb-1 font-weight-medium" variant="outlined" size="small" v-for="tag in item.tags" :key="tag")
                    //- KEIN TS im Pug-Template (Vite strippt as-Casts hier nicht)
                    | {{ tagLabel(tag) }}
                  //- Alt-Stand 1:1: juleica ist bewusst NICHT im select() — der
                  //- Chip erschien auch alt nie (das Tag deckt ihn inhaltlich ab)
                  v-chip(color="primary" class="ml-2 mb-1 font-weight-medium" variant="outlined" size="small" v-if="'juleica' in item && item.juleica")
                    | JuLeiCa-Fortbildung

                //- indicator
                v-col(cols="12" lg="4" class="d-flex flex-wrap justify-md-end mb-1 ml-n2")
                    v-chip(color="hellBlau" variant="flat" class="ml-2 mb-1 font-weight-medium text-white" size="small" v-if="item.minTN")
                      v-icon(size="small" class="ml-n1 mr-1" :icon="mdiAccountGroup")
                      | Mind. {{ item.minTN }} Teilnehmer
                    template(v-for="wl in Object.keys(item.warteliste ?? {})" :key="'wl-' + wl")
                      v-chip(color="warning" variant="flat" class="ml-2 mb-1 font-weight-medium text-white" size="small" v-if="item.warteliste?.[wl]")
                        v-icon(size="small" class="ml-n1 mr-1 " :icon="mdiAlertCircle")
                        | {{textWaitingQueue(wl)}}

              //- description
              v-row
                v-col(cols="12") {{item.description}}

            //- actions/buttons
            v-card-actions(class="pa-4")
              v-spacer
              //- tag=div statt :to — die Karte selbst ist der Link; ein <a> im
              //- <a> wird vom HTML-Parser umgebaut und bricht die Hydration
              ec-hexa-button(tag="div" :icon="mdiArrowRight")
  p(v-else='') Loading...
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import {
  mdiAccountGroup,
  mdiAlertCircle,
  mdiArrowRight,
  mdiCalendar,
  mdiCalendarArrowLeft,
  mdiCalendarArrowRight,
  mdiCalendarEdit,
  mdiCalendarMonth,
  mdiCalendarQuestion,
  mdiMagnify,
  mdiTag,
} from '@mdi/js'

enum Scope {
  TODAY = 'Heute',
  FUTURE = 'Zukünftige',
  PAST = 'Vergangene',
  ALL = 'Alle',
  CUSTOM = 'Benutzerdefiniert',
}

// Robuste Iterationsbasis statt v-for über das Enum-Objekt + v-if (Vue-3-Konflikt)
const scopeItems = Object.values(Scope).filter(
  (scope) => scope !== Scope.CUSTOM,
)

const keywordDelayTimer = ref<ReturnType<typeof setTimeout> | undefined>(
  undefined,
)
const filterKeyword = ref('')

const filterTags = ref<string[]>([])

const scopeMenu = ref(false)
const filterScope = ref(Scope.FUTURE)
// [start, ende] als ISO-Strings (YYYY-MM-DD) — wie im Alt-Code
const customDateRange = ref<string[]>([])
// Vuetify-4-Datepicker arbeitet mit Date-Objekten (multiple="range" liefert
// alle Tage des Bereichs) — interne Konvertierung Date[] ↔ ISO-Randdaten
const pickerDates = ref<Date[]>([])

const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`

const onPickerUpdate = (dates: unknown) => {
  const arr = (Array.isArray(dates) ? dates : [dates]).filter(
    (d): d is Date => d instanceof Date,
  )
  pickerDates.value = arr

  const isoSorted = arr.map(toIsoDate).sort()
  customDateRange.value =
    isoSorted.length > 1
      ? [isoSorted[0]!, isoSorted[isoSorted.length - 1]!]
      : isoSorted

  closeScopeMenu(Scope.CUSTOM)
}

const scopeValueStr = computed(() => {
  let scope: string = filterScope.value

  // date range
  if (scope === Scope.CUSTOM) {
    scope =
      customDateRange.value
        .map((d: string) => new Date(d).toLocaleDateString())
        .join(' – ') +
      ` (${filterResultAmount(Scope.CUSTOM, filterTags.value, filterKeyword.value)})`
  }

  return `${scope} (${filterResultAmount(filterScope.value, filterTags.value, filterKeyword.value)})`
})

const onKeywordTyping = (str: string) => {
  clearTimeout(keywordDelayTimer.value)
  keywordDelayTimer.value = setTimeout(function () {
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

  const today = new Date().toISOString().split('T')[0] ?? ''

  switch (scope) {
    case Scope.CUSTOM:
      return (
        veranstaltung.begin > (customDateRange.value[0] ?? '') &&
        veranstaltung.ende < (customDateRange.value[1] ?? '')
      )

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

  // has tags to filter with
  if ((tags || []).length > 0) {
    if (Array.isArray(veranstaltung.tags)) {
      return (
        veranstaltung.tags.filter((tag: string) => tags?.includes(tag)).length >
        0
      )
    }

    return false
  }

  return true
}

function filterByKeyword(veranstaltung: any, keyword?: string) {
  keyword = String(keyword || filterKeyword.value).toLowerCase()

  const searchIn = [
    veranstaltung.title,
    veranstaltung.description,
    ...(veranstaltung.tags || []),
  ]

  // has keyword
  if (keyword.length > 0) {
    return searchIn.join(' ').toLowerCase().includes(keyword)
  }

  return true
}

function filter(
  veranstaltung: any,
  scope?: Scope,
  tags?: string[],
  keyword?: string,
) {
  return (
    filterByScope(veranstaltung, scope) &&
    filterByTags(veranstaltung, tags) &&
    filterByKeyword(veranstaltung, keyword)
  )
}

const { name: breakpointName } = useDisplay()

const detailsMaxHeight = computed(() => {
  switch (breakpointName.value) {
    case 'xs':
    case 'sm':
      return ''
    default:
      return 'max-height: 300px;'
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

// Alt: useStatic(..., undefined, 'vDataPage') — kein Param, Key bleibt 'vDataPage'
const { data: vData } = await useAsyncData('vDataPage', async () => {
  const veranstaltungen = await queryCollection('veranstaltung')
    .select(
      'stem',
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
      'minTN',
    )
    .order('begin', 'ASC')
    .all()

  // stem = Dateiname ohne Endung = alter Slug; Templates nutzen weiter `slug`
  return veranstaltungen.map((d) => ({
    ...d,
    slug: stemToSlug(d.stem),
    featuredImage: assetUrl(d.featuredImage),
  }))
})

const filterResultAmount = (scope: Scope, tags: string[], keyword?: string) => {
  const filtered = vData.value?.filter((v: any) =>
    filter(v, scope, tags, keyword),
  )

  return (filtered || []).length
}

const vTags = computed(() => {
  const tags = [...new Set(vData.value?.flatMap((v: any) => v.tags || []))].sort(
    (a: any, b: any) => `${a}`.toLowerCase().localeCompare(`${b}`.toLowerCase()),
  )

  return tags
    .map((tag: any) => {
      const results = filterResultAmount(
        filterScope.value,
        [tag],
        filterKeyword.value,
      )

      return { value: tag, results, title: `${tag} (${results})` }
    })
    .filter((tag: any) => tag.results > 0)
})

const veranstaltungen = computed(() =>
  vData.value?.filter((v: any) => filter(v)),
)

useHead({
  title: 'Veranstaltungen',
  link: [
    {
      rel: 'canonical',
      href: 'https://www.ec-nordbund.de/veranstaltungen',
    },
  ],
})

useSeoMeta({
  description: 'Liste aller Veranstaltungen des EC-Nordbundes.',
  // Open Graph
  ogTitle: 'Veranstaltungen',
  ogDescription: 'Liste aller Veranstaltungen des EC-Nordbundes.',
  // Twitter Card
  twitterTitle: 'Veranstaltungen',
  twitterDescription: 'Liste aller Veranstaltungen des EC-Nordbundes..',
})
</script>
