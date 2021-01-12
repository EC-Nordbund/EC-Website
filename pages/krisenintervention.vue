<template lang="pug">
  v-container
    v-row(justify="center")
      v-col(cols="12" sm="10" md="8")
        h1 Kinder- und Jugendschutz
        h4.text-subtitle-1 Jugendschutz, Kindeswohl und Krisenintervention – Diese Seite bietet erste Hilfe für alle Notfälle.

    //- Ansprechpartner
    v-row(justify="center")
      v-col(cols="12" sm="10" md="8").pb-0
        h2.text-h5 Ansprechpartner
      v-col(cols="12" sm="10" md="8")

        //- Thomas
        v-card(tile outlined).mb-4
          v-col(cols="12").py-0
            v-row
              v-col(cols="12" sm="auto").d-flex.flex-column.justify-center.align-center.ec-gradient.pa-3
                v-img.flex-grow-0.hexagon-shape(
                  :src='require("~/assets/img/thomas_seeger.jpg")',
                  :width='128',
                  :height='128')
              v-col.px-sm-5
                h4.text-h6 Thomas Seeger
                p.subtitle-1 Jugendreferent

                //- Telefon
                .d-flex.flex-row.align-center.mb-2
                  v-btn(fab x-small color="primary" depressed href="tel:004945322805703")
                    v-icon mdi-phone
                  span.text-subtitle-2.font-weight-medium.pl-3
                    a(href="tel:004945322805703" title="Thomas Seeger anrufen").text-decoration-none
                      | 04532 280 57 03

                //- E-Mail
                .d-flex.flex-row.align-center
                  v-btn(fab x-small color="primary" depressed href="mailto:referent@ec-nordbund.de")
                    v-icon mdi-email
                  span.text-subtitle-2.font-weight-medium.pl-3
                    a(href="mailto:referent@ec-nordbund.de" title="Thomas Seeger eine E-Mail schreiben").text-decoration-none
                      | referent@ec-nordbund.de

        //-  Dortje
        v-card(tile outlined).mb-4
          v-col(cols="12").py-0
            v-row
              v-col(cols="12" sm="auto").d-flex.flex-column.justify-center.align-center.ec-gradient.pa-3
                v-img.flex-grow-0.hexagon-shape(
                  :src='require("~/assets/img/dortje_gaertner.jpg")',
                  :width='128',
                  :height='128')
              v-col.px-sm-5
                h4.text-h6 Dortje Gaertner
                p.subtitle-1 Kinder- und Jungschararbeit

                //- Telefon
                .d-flex.flex-row.align-center.mb-2
                  v-btn(fab x-small color="primary" depressed href="tel:???")
                    v-icon mdi-phone
                  span.text-subtitle-2.font-weight-medium.pl-3
                    a(href="tel:00494122489036" title="Dortje Gaertner anrufen").text-decoration-none
                      | 04122 48 90 36 

                //- E-Mail
                .d-flex.flex-row.align-center
                  v-btn(fab x-small color="primary" depressed href="mailto:kinder-referent@ec-nordbund.de")
                    v-icon mdi-email
                  span.text-subtitle-2.font-weight-medium.pl-3
                    a(href="mailto:kinder-referent@ec-nordbund.de" title="Dortje Gaertner eine E-Mail schreiben").text-decoration-none
                      | kinder-referent@ec-nordbund.de

        //-  Jutta
        v-card(tile outlined)
          v-col(cols="12").py-0
            v-row
              v-col(cols="12" sm="auto").d-flex.flex-column.justify-center.align-center.ec-gradient.pa-3
                v-img.flex-grow-0.hexagon-shape(
                  :src='require("~/assets/img/Jutta-Nordsiek_1301x974[1].jpg")',
                  :width='128',
                  :height='128')
              v-col.px-sm-5
                h4.text-h6 Jutta Nordsiek
                p.subtitle-1 Seelsorge und Beratungsstelle des VG

                //- Telefon
                .d-flex.flex-row.align-center.mb-2
                  v-btn(fab x-small color="primary" depressed href="tel:???")
                    v-icon mdi-phone
                  span.text-subtitle-2.font-weight-medium.pl-3
                    a(href="tel:004941224048694" title="Jutta Nordsiek anrufen").text-decoration-none
                      | 04122 404 86 94

                //- E-Mail
                .d-flex.flex-row.align-center
                  v-btn(fab x-small color="primary" depressed href="mailto:jutta.nordsiek@vg-sh.de")
                    v-icon mdi-email
                  span.text-subtitle-2.font-weight-medium.pl-3
                    a(href="mailto:jutta.nordsiek@vg-sh.de" title="Jutta Nordsiek eine E-Mail schreiben").text-decoration-none
                      | jutta.nordsiek@vg-sh.de

      //- Explanation
      v-col(cols="12" sm="10" md="8")
        nuxt-content(:document="explanation")

      //- Downloads
      v-col(cols="12" sm="10" md="8").pb-0
        h2.text-h5 Downloads
      v-col(cols="12" sm="10" md="8")
        v-list(color="#eee").py-0
          v-list-item(v-for="file in data.files" :key="'file_' + file.filename"  :href="`${file.filename}`").px-1
            v-list-item-avatar
              v-icon(size="32") {{ {pdf: mdiFilePdfOutline,docx: mdiFileWord,jpg: mdiFileImage,png: mdiFileImage}[file.filename.split('.')[1].toLowerCase()] || mdiFile }}
            v-list-item-content
              v-list-item-title {{file.title}}
              v-list-item-subtitle {{file.description}}
</template>
<script lang="ts">
import {
  defineComponent,
  useContext,
  useAsync,
  computed,
} from '@nuxtjs/composition-api'
import { mdiFilePdfOutline, mdiFileWord, mdiFileImage, mdiFile } from '@mdi/js'

export default defineComponent({
  layout: 'minimal',
  setup() {
    const { $content } = useContext()

    const explanation = useAsync(() =>
      $content('krisenintervention/explanation').fetch<any>()
    )

    const fileData = useAsync(() => $content('downloads').fetch<any>())

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
      data,
      mdiFilePdfOutline,
      mdiFileWord,
      mdiFileImage,
      mdiFile,
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
  },
})
</script>
<style lang="scss" scoped>
.hexagon-shape {
  clip-path: polygon(50% 100%, 5% 75%, 5% 25%, 50% 0%, 95% 25%, 95% 75%);
}
</style>
