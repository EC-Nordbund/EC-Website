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
                :src='kirkeImg',
                :width='128',
                :height='128'
              )
            v-col.px-sm-5
              h4.text-h6 Kirke Husberg
              p.subtitle-1 Teen- und Jugendreferent

              //- Telefon
              .d-flex.flex-row.align-center.mb-2
                v-btn(
                  fab,
                  x-small,
                  color='primary',
                  depressed,
                  href='tel:004943539988330'
                )
                  v-icon.ki-icon mdi-phone
                span.text-subtitle-2.font-weight-medium.pl-3
                  a.text-decoration-none(href='tel:004943539988330', title='Kirke Husberg anrufen')
                    | 04353 99 88 33 0

              //- E-Mail
              .d-flex.flex-row.align-center
                v-btn(
                  fab,
                  x-small,
                  color='primary',
                  depressed,
                  href='mailto:kirke.husberg@ec-nordbund.de'
                )
                  v-icon.ki-icon mdi-email
                span.text-subtitle-2.font-weight-medium.pl-3
                  a.text-decoration-none(
                    href='mailto:kirke.husberg@ec-nordbund.de',
                    title='Kirke Husberg eine E-Mail schreiben'
                  )
                    | kirke.husberg@ec-nordbund.de
      //- Thomas
      v-card.mb-4(tile, outlined)
        v-col.py-0(cols='12')
          v-row
            v-col.d-flex.flex-column.justify-center.align-center.ec-gradient.pa-3(cols='12', sm='auto')
              v-img.flex-grow-0.hexagon-shape(
                :src='tobiasImg',
                :width='128',
                :height='128'
              )
            v-col.px-sm-5
              h4.text-h6 Tobias Krahe
              p.subtitle-1 Teen- und Jugendreferent

              //- Telefon
              .d-flex.flex-row.align-center.mb-2
                v-btn(
                  fab,
                  x-small,
                  color='primary',
                  depressed,
                  href='tel:004915736763193'
                )
                  v-icon.ki-icon mdi-phone
                span.text-subtitle-2.font-weight-medium.pl-3
                  a.text-decoration-none(href='tel:004915736763193', title='Tobias Krahe anrufen')
                    | 01573 676 319 3

              //- E-Mail
              .d-flex.flex-row.align-center
                v-btn(
                  fab,
                  x-small,
                  color='primary',
                  depressed,
                  href='mailto:tobias.krahe@ec-nordbund.de'
                )
                  v-icon.ki-icon mdi-email
                span.text-subtitle-2.font-weight-medium.pl-3
                  a.text-decoration-none(
                    href='mailto:tobias.krahe@ec-nordbund.de',
                    title='Tobias Krahe eine E-Mail schreiben'
                  )
                    | tobias.krahe@ec-nordbund.de

      //-  Dortje
      v-card.mb-4(tile, outlined)
        v-col.py-0(cols='12')
          v-row
            v-col.d-flex.flex-column.justify-center.align-center.ec-gradient.pa-3(cols='12', sm='auto')
              v-img.flex-grow-0.hexagon-shape(
                :src='dortjeGaertnerImg',
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
                  href='mailto:dortje.gaertner@ec-nordbund.de'
                )
                  v-icon.ki-icon mdi-email
                span.text-subtitle-2.font-weight-medium.pl-3
                  a.text-decoration-none(
                    href='mailto:dortje.gaertner@ec-nordbund.de',
                    title='Dortje Gaertner eine E-Mail schreiben'
                  )
                    | dortje.gaertner@ec-nordbund.de

      //-  Jutta
      v-card(tile, outlined)
        v-col.py-0(cols='12')
          v-row
            v-col.d-flex.flex-column.justify-center.align-center.ec-gradient.pa-3(cols='12', sm='auto')
              v-img.flex-grow-0.hexagon-shape(
                :src='juttaNordsiekImg',
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
      ContentRenderer(:value='explanation')

    //- Downloads
    v-col.pb-0(cols='12', sm='10', md='8')
      h2.text-h5 Downloads
    v-col(cols='12', sm='10', md='8')
      v-list.py-0(color='#eee')
        v-list-item.px-1(
          v-for='file in data.files',
          :key='"file_" + file.filename',
          :href='`${file.filename}`',
          :title='file.title',
          :subtitle='file.description'
        )
          template(#prepend)
            v-icon(size='32') {{ { pdf: 'mdi-file-pdf-outline', docx: 'mdi-file-word', jpg: 'mdi-file-image', png: 'mdi-file-image' }[file.filename.split(".")[1].toLowerCase()] || 'mdi-file' }}
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
} from 'vue'
import kirkeImg from '~/assets/img/kirke.jpg'
import tobiasImg from '~/assets/img/tobias.jpg'
import dortjeGaertnerImg from '~/assets/img/dortje_gaertner.jpg'
import juttaNordsiekImg from '~/assets/img/Jutta-Nordsiek_1301x974[1].jpg'

export default defineComponent({
  async setup() {
    definePageMeta({ layout: 'minimal' })

    const { data: explanation } = await useAsyncData('kriesen-1', () =>
      queryContent('krisenintervention/explanation').findOne()
    )

    const { data: fileData } = await useAsyncData('kriesen-2', () =>
      queryContent('downloads').findOne()
    )

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

    useHead({
      title: 'Kinder- und Jugendschutz – gibt es einen Notfall?',
      meta: [
        {
          name: 'description',
          content:
            'Jugendschutz, Kindeswohl und Krisenintervention – hier findest du für alle Notfälle Ansprechpartner und weitere Informationen',
        },
        // Open Graph
        {
          property: 'og:title',
          content: 'Kinder- und Jugendschutz – gibt es einen Notfall?',
        },
        {
          property: 'og:description',
          content:
            'Jugendschutz, Kindeswohl und Krisenintervention – hier findest du für alle Notfälle Ansprechpartner und weitere Informationen',
        },
        // Twitter Card
        {
          name: 'twitter:title',
          content: 'Kinder- und Jugendschutz – gibt es einen Notfall?',
        },
        {
          name: 'twitter:description',
          content:
            'Jugendschutz, Kindeswohl und Krisenintervention – hier findest du für alle Notfälle Ansprechpartner und weitere Informationen',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/krisenintervention',
        },
      ],
    })

    return {
      explanation,
      data,
      kirkeImg,
      tobiasImg,
      dortjeGaertnerImg,
      juttaNordsiekImg,
    }
  },
})
</script>
<style lang="scss" scoped>
.ki-icon {
  padding: 3px;
}
</style>
