<template lang="pug">
.section-wrapper(v-if='pages')
  div
    v-img.hero-image.secondary.align-end.angle--bottom-right(
      src='hero-image.jpg',
      min-height='400px',
      height='60vh',
      width='auto',
      min-width='100%',
      gradient='180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.02) 16%, rgba(0,0,0,0.02) 80%, rgba(0,0,0,0.48) 100%'
    )
      v-container.countdown.pb-0.pb-md-1.pb-lg-2.pb-xl-4(
        v-if='((pages || {}).countdown || {}).show'
      )
        v-row(justify='center', no-gutters)
          v-col(cols='12', md='7')
            v-card.hero-panel.px-3.ec-gradient.text-center.pt-4.pb-8(tile)
              span.text-h6.pb-5.white--text(v-if='isCountdownFuture') Die Anmeldephase beginnt in
              span.text-h6.pb-5.white--text(v-else) Die Anmeldephase hat begonnen!
              ec-countdown(:target='pages.countdown.date', keep-zeros)
                template(v-slot:digits='slotProp')
                  span.text-h4.font-weight-bold.white--text(slot='digits') {{ slotProp.digits }}
                template(v-slot:units='slotProp')
                  span.text-caption.text-uppercase.white--text(slot='units') {{ slotProp.unit }}

    v-container.mt-n2.py-0
      v-row(justify='center')
        v-col(cols='12', md='9')
          //- Hinweis zur Anmeldephase
          v-alert.mt-3.mb-1(type='info', tile, dense, text, outlined, v-if='isCountdownFuture')
            span.subtitle-2.secondary--text Die Anmeldephase beginnt am #[strong Sonntag 05.11. um 15 Uhr]!
          //- Hinweis zu Preisen
          //- v-alert.mt-3.mb-1(type='warning', tile, dense, outlined, text, v-if='isCountdownFuture')
          //-   span.subtitle-2.secondary--text Beachte, dass die angegeben Preise sich durch in Aussicht gestellte Fördergelder noch zum positiven verändern könnnen.

    v-container.mb-4
      .d-flex.flex-row.justify-space-between.align-end
        h2#aktuelles Aktuelles
        v-btn(
          text,
          depressed,
          tile,
          large,
          to='/blog/',
          aria-label='Mehr Beiträge anzeigen'
        )
          span.hidden-xs-only Mehr Beiträge
          v-icon.ml-1.mr-n1 mdi-arrow-right
      v-row.mb-4
        v-col(
          cols='12',
          sm='6',
          md='4',
          v-for='item in pages.recentPosts',
          :key='item.slug'
        )
          v-card(tile, hover, outlined, :to='`/blog/${item.slug}`')
            ec-image-item(
              :image='item.featuredImage',
              :title='item.title',
              :subTitle='`Vom ${item.published.split("T")[0].split("-").reverse().join(".")}`'
            )
      .d-flex.flex-row.justify-space-between.align-end
        h2(id='nächste-veranstaltungen') Nächste Veranstaltungen
        v-btn(
          text,
          depressed,
          tile,
          large,
          to='/veranstaltungen/',
          aria-label='Mehr Veranstaltungen anzeigen'
        )
          span.hidden-xs-only Mehr Veranstaltungen
          v-icon.ml-1.mr-n1 mdi-arrow-right
      v-row.mb-4
        v-col(
          cols='12',
          sm='6',
          md='4',
          v-for='item in pages.upcomingEvents',
          :key='item.slug'
        )
          v-card(tile, hover, outlined, :to='`/veranstaltungen/${item.slug}`')
            ec-image-item(
              :image='item.featuredImage',
              :title='item.title',
              :subTitle='`Vom ${item.begin.substring(0, 10).split("-").reverse().join(".")} bis ${item.ende.substring(0, 10).split("-").reverse().join(".")}`'
            )
  .angle--both-left-right(style='background: #f5f5f5')
    v-container
      h2(id='über-uns') Über uns
      //- p 
        | Der EC-Nordbund ist einer von 18 Landesverbänden des Deutschen EC-Verbandes.
        | EC bedeutet: „Entschieden für Christus“ und markiert die grundsätzlich evangelische Ausrichtung aller Aktivitäten.
        | Im EC-Nordbund sind alle EC-Kinder- und Jugendarbeiten aus Schleswig-Holstein und Hamburg.
      p
        | Die EC-Arbeit in Deutschland hat den Auftrag,
        | junge Menschen zu Jüngern zu machen
        | und sie zu prägenden Persönlichkeiten heranzubilden,
        | durch die wiederum Menschen ihrer Generation
        | zu Jüngern werden.
      p
        | Der EC-Nordbund ist einer der 18 Landesverbänden des Deutschen EC-Verbandes. Im EC-Nordbund sind alle EC-Kinder- und Jugendarbeiten aus Schleswig-Holstein und Hamburg vereint.
      p
        | EC bedeutet: „Entschieden für Christus“ und markiert die Aurichtung auf Jesus in allen unseren Aktivitäten.
      p
        | Der EC-Nordbund arbeitet eng mit dem Verband der Gemeinschaften in der Evangelischen Kirche in Schleswig-Holstein e.V. (kurz VG) zusammen. Wir betreiben gemeinsam das Erholungs- und Bildungszentrum Wittensee (kurz EBZ) und unser Ferienlager in Karlsminde (bei Eckernförde).
      p
        | Der EC-Nordbund basiert als Gemeinnütziger Verein auf Ehrenamt wir haben nur 2 Hauptamtliche Mitarbeiter.
      v-row
        v-col.person(align='center', @click='mail("referent@ec-nordbund.de")')
          v-img.hexagon-shape(
            :src='require("~/assets/img/thomas_seeger.jpg")',
            :width='128',
            :height='128'
          )
            .hexa-image-overlay(v-ripple)
          .text-h6 Thomas Seeger
          | Jugendreferent
        v-col.person(
          align='center',
          @click='mail("kinder-referent@ec-nordbund.de")'
        )
          v-img.hexagon-shape(
            :src='require("~/assets/img/dortje_gaertner.jpg")',
            :width='128',
            :height='128'
          )
            .hexa-image-overlay(v-ripple)
          .text-h6 Dortje Gaertner
          | Kinder- und Jungschararbeit
p(v-else) Loading...
</template>
<script>
import {
  defineComponent,
  useContext,
  useStatic,
  computed,
} from '@nuxtjs/composition-api'
import { useCurrentTime } from '~/helpers/current-time'
export default defineComponent({
  setup() {
    const { $content } = useContext()

    const pages_loading = useStatic(async () => {
      const todayStr = new Date().toISOString().substring(0, 10);

      const upcomingEvents = await $content('veranstaltung')
        .only(['slug', 'title', 'begin', 'ende', 'featuredImage', 'tags'])
        .where({ 'ende': { $gte: new Date() } })
        .sortBy('begin')
        .limit(3)
        .fetch()

      const recentPosts = await $content('blog')
        .only([
          'title',
          'tags',
          'description',
          'featuredImage',
          'slug',
          'published',
        ])
        .sortBy('published', 'desc')
        .limit(3)
        .fetch()

        const countdown = {
          date: '2024-12-01T14:00:00Z',
          show: true
        }

        return { upcomingEvents, recentPosts, countdown }
    }, undefined, 'homeData')

    const pages = computed(() =>
      pages_loading.value
        ? pages_loading.value
        : {
            upcomingEvents: [],
            recentPosts: [],
            countdown: { date: undefined, show: false },
          }
    )

    const { currentTime } = useCurrentTime()

    const isCountdownFuture = computed(() => {
      const { countdown } = pages.value

      return new Date(countdown.date) > currentTime.value || false
    })

    return {
      pages,
      mail: (m) => (location.href = `mailto:${m}`),
      isCountdownFuture,
    }
  },
  head: {
    title: 'Startseite',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content:
          'Die EC-Arbeit in Deutschland hat den Auftrag, junge Menschen zu Jüngern zu machen und sie zu prägenden Persönlichkeiten heranzubilden, durch die wiederum Menschen ihrer Generation zu Jüngern werden. Der EC-Nordbund ist einer der 18 Landesverbänden des Deutschen EC-Verbandes. Im EC-Nordbund sind alle EC-Kinder- und Jugendarbeiten aus Schleswig-Holstein und Hamburg vereint. EC bedeutet: „Entschieden für Christus“ und markiert die Aurichtung auf Jesus in allen unseren Aktivitäten.',
      },
      // Open Graph
      { hid: 'og:title', property: 'og:title', content: 'EC-Nordbund' },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Die EC-Arbeit in Deutschland hat den Auftrag, junge Menschen zu Jüngern zu machen und sie zu prägenden Persönlichkeiten heranzubilden, durch die wiederum Menschen ihrer Generation zu Jüngern werden. Der EC-Nordbund ist einer der 18 Landesverbänden des Deutschen EC-Verbandes. Im EC-Nordbund sind alle EC-Kinder- und Jugendarbeiten aus Schleswig-Holstein und Hamburg vereint. EC bedeutet: „Entschieden für Christus“ und markiert die Aurichtung auf Jesus in allen unseren Aktivitäten.',
      },
      // Twitter Card
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'EC-Nordbund!',
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          'Die EC-Arbeit in Deutschland hat den Auftrag, junge Menschen zu Jüngern zu machen und sie zu prägenden Persönlichkeiten heranzubilden, durch die wiederum Menschen ihrer Generation zu Jüngern werden. Der EC-Nordbund ist einer der 18 Landesverbänden des Deutschen EC-Verbandes. Im EC-Nordbund sind alle EC-Kinder- und Jugendarbeiten aus Schleswig-Holstein und Hamburg vereint. EC bedeutet: „Entschieden für Christus“ und markiert die Aurichtung auf Jesus in allen unseren Aktivitäten.',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://www.ec-nordbund.de',
        hid: 'canonical',
      }
    ],
  },
})
</script>
<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_variables';

.hero-image {
  height: calc(100vh + 3.492vw - 96px);

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    height: 400px;
  }
}

.section-wrapper > div:last-child {
  &.angle--bottom-left,
  &.angle--bottom-right,
  &.angle--both-right-right,
  &.angle--both-left-right,
  &.angle--both-right-left,
  &.angle--both-left-left {
    margin-bottom: -3.492vw;
  }
}

.countdown {
  margin-bottom: -3.493vw;

  .hero-panel.v-sheet {
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12),
      0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14),
      0 9px 46px 8px rgba(0, 0, 0, 0.12) !important;
  }
}

.hexa-image-overlay {
  height: 128px;
  background: var(--v-primary-base);
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.3s;
}

.person {
  cursor: pointer;

  // transition: background-color .3s;
  &:hover {
    // background-color: var(--v-primary-base);

    & .hexa-image-overlay {
      opacity: 0.7;
    }
  }
}
</style>
