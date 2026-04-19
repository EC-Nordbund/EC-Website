<template lang="pug">
div
  //- cover
  v-img.text-white(
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
            icon='mdi-arrow-left',
            :size='64',
            aria-label='Zurück zur Übersicht.'
          )

        v-spacer

        //- display indicators
        v-col.d-flex.flex-column(cols='auto')
          v-row.text-right(
            v-if='Object.values(page.warteliste).some((e) => e)'
          )
            v-col
              v-chip.ml-auto.mb-1.elevation-8.font-weight-medium(
                color='warning',
                text-color='white',
                small,
                v-if='page.warteliste.männlich'
              )
                v-icon.ml-n1.mr-1(small) mdi-alert-circle
                | Für Männer nur noch Warteliste

              v-chip.ml-auto.mb-1.elevation-8.font-weight-medium(
                color='warning',
                text-color='white',
                small,
                v-if='page.warteliste.weiblich'
              )
                v-icon.ml-n1.mr-1(small) mdi-alert-circle
                | Für Frauen nur noch Warteliste

              v-chip.ml-auto.mb-1.elevation-8.font-weight-medium(
                color='warning',
                text-color='white',
                small,
                v-if='page.warteliste.allgemein'
              )
                v-icon.ml-n1.mr-1(small) mdi-alert-circle
                | Nur noch Warteliste

          //- JuLeiCa Fortbildung
          v-row(v-if='page.juleica', no-gutters)
            v-col
              v-img(
                max-height='160',
                max-width='160',
                width='auto',
                height='auto',
                :src='juleicaImg'
              )

      v-row.flex-grow-0.mb-n1(no-gutters, align='end')
        //- title
        v-col.order-last.order-md-0(cols='12', md='6')
          h1.d-block.d-md-inline-block.ec-gradient.py-3.py-sm-1.px-5.my-2.elevation-16.text-h5.text-sm-h4.font-weight-bold.text-truncate {{ page.title }}

        //- categories
        v-col.d-flex.justify-end.flex-wrap-reverse(cols='12', md='6')
          v-chip.mr-2.mb-1.font-weight-medium(
            color='offWhite',
            text-color='secondary',
            small,
            v-for='tag in page.tags',
            :key='tag'
          )
            | {{ (typeof tag === 'object') ? tag.tag : tag }}

  //- hardfacts
  .ec-gradient.text-subtitle-1.font-weight-normal
    v-container
      v-row(no-gutters, justify='space-between', align='center')
        //- Datum
        .text-no-wrap(v-if='page.begin || page.ende')
          v-icon.mr-2 mdi-calendar
          | Vom {{ page.begin.split('T')[0].split("-").reverse().join(".") }} bis {{ page.ende.split('T')[0].split("-").reverse().join(".") }}

        //- Ort
        .text-no-wrap(v-if='page.veranstaltungsort')
          v-icon.mr-2 mdi-map-marker
          | {{ page.veranstaltungsort }}

        //- Mindest-Teilnehmerzahl
        .text-no-wrap(v-if='page.minTN')
          v-icon.mr-2 mdi-account-group
          | Mind. {{ page.minTN }} Teilnehmer

  //- description
  v-container.description.pt-5
    ContentRenderer(:value='page')

  //- bilder
  ec-image-container#gallerie.scroll-to-me(
    v-if='page.images',
    :class='"angle--both-left-" + (page.preise || !(page.lat == 0 && page.long == 0) ? "left" : "right") + " clip-angle"',
    :images='page.images.map(v=>(typeof v === "object") ? v.image : v)'
  )

  //- preise
  .angle--both-right-left(v-if='page.preise && page.preise.length > 0', style='background: #f5f5f5')
    v-container(py-0)#preise.scroll-to-me
      v-row(no-gutters, justify='center')
        v-col(cols='12', md='9')
          h2.mb-2.text-center Preise
          ec-preis-staffel(
            :preise='page.preise',
            fill-dot,
            dot-color='white',
            denseBreakpoint='xsOnly'
          )
          v-alert.mt-4.ec-gradient(v-if='page.anzahlung', type='info', color="primary" tile)
            h3.text-h5 Anzahlung
            p.text-subtitle-1 Nach der Anmeldung bitten wir dich um eine Anzahlung von #[strong {{ page.anzahlung }} EUR].

  //- standort
  #ort.scroll-to-me(
    v-if='!(page.lat == 0 && page.long == 0)',
    :class='"angle--both-right-right" + " clip-angle"'
  )
    ec-location(
      v-if='!(page.lat == 0 && page.long == 0)',
      :zoom='12',
      :marker='[{ ...page, marker: [page.lat, page.long], noMore: true }]',
      style='width: 100%; min-height: calc(400px + 3.492vw * 2); max-height: 100%; z-index: 0'
    )

  //- hinweis mindest-teilnehmerzahl
  v-container(v-if='page.minTN')
    v-alert.mt-4(
      type='info',
      color='hellBlau',
      dense,
      outlined,
      icon='mdi-account-group'
    )
      | Diese Veranstaltung findet ab einer Mindestteilnehmerzahl von #[strong {{ page.minTN }}] statt.

  //- anmeldung
  v-container#anmeldung.scroll-to-me(v-if='showAnmeldung')
    h2.mb-2.text-center Anmeldung
    ec-anmeldung(
      v-bind='page.anmeldung',
      :veranstaltungsBegin='page.begin',
      :minAlter='page.minAlter',
      :maxAlter='page.maxAlter',
      :veranstaltungsID='page.veranstaltungsID'
      :disabled='page.begin < (new Date().toISOString().split("T")[0])'
    )
      template(v-slot:disabled)
        v-alert(
          type='info',
          color='hell-grau',
          density='compact',
          variant='outlined'
        ) Die Anmeldung zu dieser Veranstaltung ist deaktiviert.
      template(v-slot:countdown)
        v-row(justify='center')
          v-col(cols='12', sm='8', md='6', xl='6')
            v-card.ec-gradient
              v-card-title.text-body-1.text-md-h6.text-lg-h6.text-xl-h6.text-secondary.justify-center.pb-2 Die Anmeldung wird freigeschaltet in:
              v-card-text
                ec-countdown(:target='page.anmeldung.startAt')
                  template(v-slot:digits='slotProp')
                    span.text-h4.font-weight-bold.text-white {{ slotProp.digits }}
                  template(v-slot:units='slotProp')
                    span.text-caption.text-uppercase {{ slotProp.unit }}
</template>
<script>
import { defineComponent, computed } from 'vue'
import juleicaImg from '~/assets/img/juLeiCa.png'

export default defineComponent({
  async setup() {
    const route = useRoute()

    const { data: page } = await useAsyncData(
      `veranstaltung-${route.params.id}`,
      () => queryContent(`veranstaltung/${route.params.id}`).findOne()
    )


    const showAnmeldung = computed(() => {
      // Anmeldung ist vorhanden
      if (page.value.anmeldung) {
        const anmeldung = page.value.anmeldung
        if (anmeldung.visible != undefined) {
          return anmeldung.visible
        }
        return true
      }
      return false
    })

    useSeoMeta({
      title: () => page.value?.title,
      description: () => page.value?.description,
      ogTitle: () =>
        page.value?.title +
        ` (${page.value?.begin?.split('T')[0]
          ?.split('-')
          ?.reverse()
          ?.join('.')} - ${page.value?.ende?.split('T')[0]?.split('-')?.reverse()?.join('.')})`,
      ogDescription: () => page.value?.description,
      ogImage: () => page.value?.featuredImage,
      twitterTitle: () =>
        page.value?.title +
        ` (${page.value?.begin?.split('T')[0]
          ?.split('-')
          ?.reverse()
          ?.join('.')} - ${page.value?.ende?.split('T')[0]?.split('-')?.reverse()?.join('.')})`,
      twitterDescription: () => page.value?.description,
      twitterImage: () => page.value?.featuredImage,
    })

    useHead({
      link: [
        {
          rel: 'canonical',
          href: () => 'https://www.ec-nordbund.de/veranstaltungen/' + page.value?._path?.split('/').pop(),
        },
      ],
    })

    return {
      page,
      showAnmeldung,
      juleicaImg,
    }
  },
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
