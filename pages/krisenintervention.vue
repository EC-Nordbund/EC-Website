<template lang="pug">
v-container
  v-row(justify='center')
    v-col(cols='12', sm='10', md='8')
      h1 Kinder- und Jugendschutz
      h4.text-subtitle-1 Jugendschutz, Kindeswohl und Krisenintervention – Diese Seite bietet erste Hilfe für alle Notfälle.

  //- Ansprechpartner
  v-row(justify='center')
    v-col.pb-0(cols='12', sm='10', md='8')
      h2.text-h5 Ansprechpartner
    v-col(cols='12', sm='10', md='8')
      //- Thomas
      v-card.mb-4(tile, outlined)
        v-col.py-0(cols='12')
          v-row
            v-col.d-flex.flex-column.justify-center.align-center.ec-gradient.pa-3(cols='12', sm='auto')
              v-img.flex-grow-0.hexagon-shape(
                :src='require("~/assets/img/thomas_seeger.jpg")',
                :width='128',
                :height='128'
              )
            v-col.px-sm-5
              h4.text-h6 Thomas Seeger
              p.subtitle-1 Teen- und Jugendreferent

              //- Telefon
              .d-flex.flex-row.align-center.mb-2
                v-btn(
                  fab,
                  x-small,
                  color='primary',
                  depressed,
                  href='tel:004945322805703'
                )
                  v-icon.ki-icon mdi-phone
                span.text-subtitle-2.font-weight-medium.pl-3
                  a.text-decoration-none(href='tel:004945322805703', title='Thomas Seeger anrufen')
                    | 04532 280 57 03

              //- E-Mail
              .d-flex.flex-row.align-center
                v-btn(
                  fab,
                  x-small,
                  color='primary',
                  depressed,
                  href='mailto:referent@ec-nordbund.de'
                )
                  v-icon.ki-icon mdi-email
                span.text-subtitle-2.font-weight-medium.pl-3
                  a.text-decoration-none(
                    href='mailto:referent@ec-nordbund.de',
                    title='Thomas Seeger eine E-Mail schreiben'
                  )
                    | referent@ec-nordbund.de

      //-  Dortje
      v-card.mb-4(tile, outlined)
        v-col.py-0(cols='12')
          v-row
            v-col.d-flex.flex-column.justify-center.align-center.ec-gradient.pa-3(cols='12', sm='auto')
              v-img.flex-grow-0.hexagon-shape(
                :src='require("~/assets/img/dortje_gaertner.jpg")',
                :width='128',
                :height='128'
              )
            v-col.px-sm-5
              h4.text-h6 Dortje Gaertner
              p.subtitle-1 Kinder- und Jungscharreferentin

              //- Telefon
              .d-flex.flex-row.align-center.mb-2
                v-btn(fab, x-small, color='primary', depressed, href='tel:???')
                  v-icon.ki-icon mdi-phone
                span.text-subtitle-2.font-weight-medium.pl-3
                  a.text-decoration-none(href='tel:00494122489036', title='Dortje Gaertner anrufen')
                    | 04122 48 90 36

              //- E-Mail
              .d-flex.flex-row.align-center
                v-btn(
                  fab,
                  x-small,
                  color='primary',
                  depressed,
                  href='mailto:kinder-referent@ec-nordbund.de'
                )
                  v-icon.ki-icon mdi-email
                span.text-subtitle-2.font-weight-medium.pl-3
                  a.text-decoration-none(
                    href='mailto:kinder-referent@ec-nordbund.de',
                    title='Dortje Gaertner eine E-Mail schreiben'
                  )
                    | kinder-referent@ec-nordbund.de

      //-  Jutta
      v-card(tile, outlined)
        v-col.py-0(cols='12')
          v-row
            v-col.d-flex.flex-column.justify-center.align-center.ec-gradient.pa-3(cols='12', sm='auto')
              v-img.flex-grow-0.hexagon-shape(
                :src='require("~/assets/img/Jutta-Nordsiek_1301x974[1].jpg")',
                :width='128',
                :height='128'
              )
            v-col.px-sm-5
              h4.text-h6 Jutta Nordsiek
              p.subtitle-1 Seelsorge und Beratungsstelle des VG

              //- Telefon
              .d-flex.flex-row.align-center.mb-2
                v-btn(fab, x-small, color='primary', depressed, href='tel:???')
                  v-icon.ki-icon mdi-phone
                span.text-subtitle-2.font-weight-medium.pl-3
                  a.text-decoration-none(href='tel:004941224048694', title='Jutta Nordsiek anrufen')
                    | 04122 404 86 94

              //- E-Mail
              .d-flex.flex-row.align-center
                v-btn(
                  fab,
                  x-small,
                  color='primary',
                  depressed,
                  href='mailto:jutta.nordsiek@vg-sh.de'
                )
                  v-icon.ki-icon mdi-email
                span.text-subtitle-2.font-weight-medium.pl-3
                  a.text-decoration-none(
                    href='mailto:jutta.nordsiek@vg-sh.de',
                    title='Jutta Nordsiek eine E-Mail schreiben'
                  )
                    | jutta.nordsiek@vg-sh.de

    //- Explanation
    v-col(cols='12', sm='10', md='8')
      nuxt-content(:document='explanation')

    //- Downloads
    v-col.pb-0(cols='12', sm='10', md='8')
      h2.text-h5 Downloads
    v-col(cols='12', sm='10', md='8')
      v-list.py-0(color='#eee')
        v-list-item.px-1(
          v-for='file in data.files',
          :key='"file_" + file.filename',
          :href='`${file.filename}`'
        )
          v-list-item-avatar
            v-icon(size='32') {{ { pdf: 'mdi-file-pdf-outline', docx: 'mdi-file-word', jpg: 'mdi-file-image', png: 'mdi-file-image' }[file.filename.split(".")[1].toLowerCase()] || 'mdi-file' }}
          v-list-item-content
            v-list-item-title {{ file.title }}
            v-list-item-subtitle {{ file.description }}
</template>
<script lang="ts">
import {
  defineComponent,
  useContext,
  useStatic,
  computed,
} from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'minimal',
  setup() {
    const { $content } = useContext()

    const explanation = useStatic(() =>
      $content('krisenintervention/explanation').fetch<any>()
    , undefined, 'kriesen-1')

    const fileData = useStatic(() => $content('downloads').fetch<any>(), undefined, 'kriesen-2')

    const data = computed(() => {
      if (fileData.value === null) {
        return { files: [], folders: [] }
      } else {
        return (
          fileData.value.folders?.Krisenintervention || {
            files: [],
            folders: [],
          }
        )
      }
    })

    return {
      explanation,
      data
    }
  },

  head: {
    title: 'Kinder- und Jugendschutz – gibt es einen Notfall?',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content:
          'Jugendschutz, Kindeswohl und Krisenintervention – hier findest du für alle Notfälle Ansprechpartner und weitere Informationen',
      },
      // Open Graph
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Kinder- und Jugendschutz – gibt es einen Notfall?',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Jugendschutz, Kindeswohl und Krisenintervention – hier findest du für alle Notfälle Ansprechpartner und weitere Informationen',
      },
      // Twitter Card
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Kinder- und Jugendschutz – gibt es einen Notfall?',
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          'Jugendschutz, Kindeswohl und Krisenintervention – hier findest du für alle Notfälle Ansprechpartner und weitere Informationen',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://www.ec-nordbund.de/krisenintervention',
        hid: 'canonical',
      },
    ],
  },
})
</script>
<style lang="scss" scoped>
.ki-icon {
  padding: 3px;
}
</style>
