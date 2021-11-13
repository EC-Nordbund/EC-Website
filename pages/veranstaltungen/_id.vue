<template lang="pug">
div
  //- cover
  v-img.white--text(
    :src='supportWebp() ? page.featuredImage.split(".")[0] + ".webp" : page.featuredImage',
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
                :src='require("~/assets/img/juLeiCa.png")'
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
            | {{ tag }}

  //- hardfacts
  .ec-gradient.text-subtitle-1.font-weight-normal
    v-container
      v-row(no-gutters, justify='space-between', align='center')
        //- Datum
        .text-no-wrap(v-if='page.begin || page.ende')
          v-icon.mr-2 mdi-calendar
          | Vom {{ page.begin.split("-").reverse().join(".") }} bis {{ page.ende.split("-").reverse().join(".") }}
        
        //- Ort
        .text-no-wrap(v-if='page.veranstaltungsort')
          v-icon.mr-2 mdi-map-marker
          | {{ page.veranstaltungsort }}


  //- description
  v-container.description.pt-5
    nuxt-content(:document='page')

  //- bilder
  ec-image-container(
    v-if='page.images',
    :class='"angle--both-left-" + (page.preise || !(page.lat == 0 && page.long == 0) ? "left" : "right") + " clip-angle"',
    :images='page.images'
  )

  //- preise
  .angle--both-right-left(v-if='page.preise', style='background: #f5f5f5')
    v-container(py-0)
      v-row(no-gutters, justify='center')
        v-col(cols='12', md='9')
          h2.mb-2.text-center Preisstaffelung
          ec-preis-staffel(
            :preise='page.preise',
            :anzahlung='page.anzahlung',
            fill-dot,
            dot-color='white',
            denseBreakpoint='xsOnly'
          )

  //- standort
  div(
    v-if='!(page.lat == 0 && page.long == 0)',
    :class='"angle--both-right-right" + " clip-angle"'
  )
    ec-location(
      v-if='!(page.lat == 0 && page.long == 0)',
      :zoom='12',
      :marker='[{ ...page, marker: [page.lat, page.long], noMore: true }]',
      style='width: 100%; min-height: calc(400px + 3.492vw * 2); max-height: 100%; z-index: 0'
    )

  //- anmeldung
  v-container(v-if='page.anmeldung')
    h2#anmeldung.mb-2.text-center Anmeldung
    ec-anmeldung(
      v-bind='page.anmeldung',
      :veranstaltungsBegin='page.begin',
      :minAlter='page.minAlter',
      :maxAlter='page.maxAlter',
      :veranstaltungsID='page.veranstaltungsID'
    )
      v-alert(
        slot='disabled',
        type='info',
        color='hellGrau',
        dense,
        text,
        outlined
      ) Die Anmeldung zu dieser Veranstaltung ist deaktiviert.
      v-row(slot='countdown', justify='center')
        v-col(cols='12', sm='8', md='6', xl='6')
          v-card.ec-gradient
            v-card-title.text-body-1.text-md-h6.text-lg-h6.text-xl-h6.text--secondary.justify-center.pb-2 Die Anmeldung wird freigeschaltet in:
            v-card-text
              ec-countdown(:target='page.anmeldung.startAt')
                template(v-slot:digits='slotProp')
                  span.text-h4.font-weight-bold.white--text(slot='digits') {{ slotProp.digits }}
                template(v-slot:units='slotProp')
                  span.text-caption.text-uppercase(slot='units') {{ slotProp.unit }}
</template>
<script>
import { supportWebp } from '../../helpers/webp'

export default {
  setup() {
    return {
      supportWebp,
    }
  },
  async asyncData({ $content, params, redirect, route }) {
    try {
      const page = await $content('veranstaltung', params.id).fetch()

      return { page }
    } catch (e) {
      redirect('/404', { path: route.path })
    }
  },
  head() {
    return {
      title: this.page.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.page.description,
        },
        // Open Graph
        {
          hid: 'og:title',
          property: 'og:title',
          content:
            this.page.title +
            ` (${this.page.begin
              .split('-')
              .reverse()
              .join('.')} - ${this.page.ende.split('-').reverse().join('.')})`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.page.description,
        },
        // Twitter Card
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content:
            this.page.title +
            ` (${this.page.begin
              .split('-')
              .reverse()
              .join('.')} - ${this.page.ende.split('-').reverse().join('.')})`,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.page.description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.page.featuredImage,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.page.featuredImage,
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/veranstaltungen/' + this.page.slug,
          hid: 'canonical',
        },
      ],
    }
  },
}
</script>
<style scoped>
.description {
  min-height: 256px;
}

::v-deep .foerdergelder-hinweis {
  margin-top: 2em;
}
</style>