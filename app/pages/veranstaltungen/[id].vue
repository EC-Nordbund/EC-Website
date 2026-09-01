<template lang="pug">
div(v-if='page')
  //- cover
  v-img.text-white(cover, 
    :src='page.featuredImage',
    height='420',
    gradient='180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.02) 32%, rgba(0,0,0,0.02) 48%, rgba(0,0,0,0.72) 96%'
  )
    v-container.d-flex.flex-column.justify-space-between(style='height: 100%')
      v-row.flex-grow-0(no-gutters, align='start', justify='space-between')
        //- go back to overview
        v-col(cols='2', sm='1')
          ec-hexa-button(
            to='/veranstaltungen',
            exact,
            :icon='mdiArrowLeft',
            :size='64',
            aria-label='Zurück zur Übersicht.'
          )

        v-spacer

        //- display indicators
        v-col.d-flex.flex-column(cols='auto')
          v-row.text-right(
            v-if='Object.values(page.warteliste ?? {}).some((e) => e)'
          )
            v-col
              v-chip.ml-auto.mb-1.elevation-8.font-weight-medium.text-white(
                color='warning',
                size='small',
                v-if='page.warteliste?.männlich'
              )
                v-icon.ml-n1.mr-1(size='small', :icon='mdiAlertCircle')
                | Für Männer nur noch Warteliste

              v-chip.ml-auto.mb-1.elevation-8.font-weight-medium.text-white(
                color='warning',
                size='small',
                v-if='page.warteliste?.weiblich'
              )
                v-icon.ml-n1.mr-1(size='small', :icon='mdiAlertCircle')
                | Für Frauen nur noch Warteliste

              v-chip.ml-auto.mb-1.elevation-8.font-weight-medium.text-white(
                color='warning',
                size='small',
                v-if='page.warteliste?.allgemein'
              )
                v-icon.ml-n1.mr-1(size='small', :icon='mdiAlertCircle')
                | Nur noch Warteliste

          //- JuLeiCa Fortbildung
          v-row(v-if='page.juleica', no-gutters)
            v-col
              v-img(cover, 
                max-height='160',
                max-width='160',
                width='auto',
                height='auto',
                :src='juLeiCaImg'
              )

      v-row.flex-grow-0.mb-n1(no-gutters, align='end')
        //- title
        v-col.order-last.order-md-0(cols='12', md='6')
          h1.d-block.d-md-inline-block.ec-gradient.py-3.py-sm-1.px-5.my-2.elevation-16.text-h5.text-sm-h4.font-weight-bold.text-truncate {{ page.title }}

        //- categories
        v-col.d-flex.justify-end.flex-wrap-reverse(cols='12', md='6')
          v-chip.mr-2.mb-1.font-weight-medium.text-secondary(
            color='offWhite',
            size='small',
            v-for='tag in page.tags',
            :key='tag'
          )
            //- KEIN TS im Pug-Template (Vite strippt as-Casts hier nicht)
            | {{ tagLabel(tag) }}

  //- hardfacts
  .ec-gradient.text-subtitle-1.font-weight-normal
    v-container
      v-row(no-gutters, justify='space-between', align='center')
        //- Datum
        .text-no-wrap(v-if='page.begin || page.ende')
          v-icon.mr-2(:icon='mdiCalendar')
          | Vom {{ page.begin?.split('T')[0]?.split("-").reverse().join(".") }} bis {{ page.ende?.split('T')[0]?.split("-").reverse().join(".") }}

        //- Ort
        .text-no-wrap(v-if='page.veranstaltungsort')
          v-icon.mr-2(:icon='mdiMapMarker')
          | {{ page.veranstaltungsort }}

        //- Mindest-Teilnehmerzahl
        .text-no-wrap(v-if='page.minTN')
          v-icon.mr-2(:icon='mdiAccountGroup')
          | Mind. {{ page.minTN }} Teilnehmer

  //- description
  v-container.description.pt-5
    ContentRenderer.nuxt-content(:value='page')

  //- bilder
  ec-image-container#gallerie.scroll-to-me(
    v-if='page.images',
    :class='"angle--both-left-" + (page.preise || hatKarte ? "left" : "right") + " clip-angle"',
    :images='page.images.map(v=>(typeof v === "object") ? v.image : v)'
  )

  //- preise
  .angle--both-right-left(v-if='page.preise && page.preise.length > 0', style='background: #f5f5f5')
    v-container.py-0#preise.scroll-to-me
      v-row(no-gutters, justify='center')
        v-col(cols='12', md='9')
          h2.mb-2.text-center Preise
          ec-preis-staffel(
            :preise='page.preise',
            fill-dot,
            dot-color='white',
            denseBreakpoint='xsOnly'
          )
          v-alert.mt-4.ec-gradient(v-if='page.anzahlung', type='info', color='primary', rounded='0')
            h3.text-h5 Anzahlung
            p.text-subtitle-1 Nach der Anmeldung bitten wir dich um eine Anzahlung von #[strong {{ page.anzahlung }} EUR].

  //- standort
  #ort.scroll-to-me(
    v-if='hatKarte',
    :class='"angle--both-right-right" + " clip-angle"'
  )
    ec-location(
      v-if='hatKarte',
      :zoom='12',
      :marker='[{ ...page, marker: [Number(page.lat), Number(page.long)], noMore: true }]',
      style='width: 100%; min-height: calc(400px + 3.492vw * 2); max-height: 100%; z-index: 0'
    )

  //- hinweis mindest-teilnehmerzahl
  v-container(v-if='page.minTN')
    v-alert.mt-4(
      type='info',
      color='hellBlau',
      density='compact',
      variant='outlined',
      :icon='mdiAccountGroup'
    )
      | Diese Veranstaltung findet ab einer Mindestteilnehmerzahl von #[strong {{ page.minTN }}] statt.

  //- anmeldung
  v-container#anmeldung.scroll-to-me(v-if='showAnmeldung')
    h2.mb-2.text-center Anmeldung
    ec-anmeldung(
      v-bind='page.anmeldung',
      :veranstaltungsBegin='page.begin ?? ""',
      :minAlter='page.minAlter',
      :maxAlter='page.maxAlter',
      :veranstaltungsID='page.veranstaltungsID ?? 0'
      :disabled='(page.begin ?? "") < (new Date().toISOString().split("T")[0] ?? "")'
    )
      template(#disabled)
        v-alert(
          type='info',
          color='hellGrau',
          density='compact',
          variant='outlined'
        ) Die Anmeldung zu dieser Veranstaltung ist deaktiviert.
      template(#countdown)
        v-row(justify='center')
          v-col(cols='12', sm='8', md='6', xl='6')
            v-card.ec-gradient
              v-card-title.text-body-1.text-md-h6.text-lg-h6.text-xl-h6.text-medium-emphasis.d-flex.justify-center.pb-2 Die Anmeldung wird freigeschaltet in:
              v-card-text
                //- startAt ist im toleranten Schema untypisiert (unknown), de facto ein ISO-String
                //- KEIN TS im Pug-Template (Vite strippt as-Casts hier nicht)
                ec-countdown(:target='anmeldungStartAt')
                  template(#digits='slotProp')
                    span.text-h4.font-weight-bold.text-white {{ slotProp.digits }}
                  template(#units='slotProp')
                    span.text-caption.text-uppercase {{ slotProp.unit }}
</template>
<script setup lang="ts">
import {
  mdiArrowLeft,
  mdiAlertCircle,
  mdiCalendar,
  mdiMapMarker,
  mdiAccountGroup,
} from '@mdi/js'
import juLeiCaImg from '~/assets/img/juLeiCa.png'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { data: page } = await useAsyncData(
  `veranstaltung-${id.value}`,
  async () => {
    const doc = await queryCollection('veranstaltung')
      .where('stem', '=', `veranstaltung/${id.value}`)
      .first()
    // slug-Kompatibilität: stem = Dateiname ohne Endung = alter Slug
    if (!doc) return null
    return {
      ...doc,
      slug: stemToSlug(doc.stem),
      featuredImage: assetUrl(doc.featuredImage),
      images: (doc.images ?? []).map((img: any) =>
        typeof img === 'string' ? assetUrl(img) : img,
      ),
    }
  },
)

const showAnmeldung = computed(() => {
  // Anmeldung ist vorhanden
  if (page.value?.anmeldung) {
    const anmeldung = page.value.anmeldung
    if (anmeldung.visible != undefined) {
      return anmeldung.visible
    }
    return true
  }
  return false
})

// Schema-typlos (unknown) — Cast gehört ins Script, nicht ins Pug-Template
const anmeldungStartAt = computed(
  () => page.value?.anmeldung?.startAt as string | undefined,
)

const formatDate = (d?: string) =>
  (d ?? '').split('T')[0]?.split('-').reverse().join('.') ?? ''

const metaTitle = computed(() =>
  page.value
    ? page.value.title +
      ` (${formatDate(page.value.begin)} - ${formatDate(page.value.ende)})`
    : undefined,
)

useHead(() => ({
  title: page.value?.title,
  link: [
    {
      rel: 'canonical',
      href: 'https://www.ec-nordbund.de/veranstaltungen/' + page.value?.slug,
    },
  ],
}))

useSeoMeta({
  description: () => page.value?.description,
  // Open Graph
  ogTitle: () => metaTitle.value,
  ogDescription: () => page.value?.description,
  ogImage: () => page.value?.featuredImage,
  // Twitter Card
  twitterTitle: () => metaTitle.value,
  twitterDescription: () => page.value?.description,
  twitterImage: () => page.value?.featuredImage,
})

// Alt: !(lat == 0 && long == 0); zusätzlich kaputte Werte ('54.782.670')
// abfangen, die als NaN Leaflet crashen würden
const hatKarte = computed(() => {
  const p = page.value
  if (!p) return false
  const lat = Number(p.lat)
  const long = Number(p.long)
  if (Number.isNaN(lat) || Number.isNaN(long)) return false
  return !(lat === 0 && long === 0)
})
</script>
<style scoped>
.description {
  min-height: 256px;
}

:deep(.foerdergelder-hinweis) {
  margin-top: 2em;
}
</style>
