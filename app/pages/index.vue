<template lang="pug">
.section-wrapper(v-if='pages')
  div
    v-img.hero-image.bg-secondary.align-end.angle--bottom-right(cover, 
      :src='hero_image',
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
            v-card.hero-panel.px-3.ec-gradient.text-center.pt-4.pb-8(rounded='0')
              span.text-h6.pb-5.text-white(v-if='isCountdownFuture') Die Anmeldephase beginnt in
              span.text-h6.pb-5.text-white(v-else) Die Anmeldephase hat begonnen!
              ec-countdown(:target='pages.countdown.date', keep-zeros)
                template(#digits='slotProp')
                  span.text-h4.font-weight-bold.text-white {{ slotProp.digits }}
                template(#units='slotProp')
                  span.text-caption.text-uppercase.text-white {{ slotProp.unit }}

    v-container.mt-n2.py-0
      v-row(justify='center')
        v-col(cols='12', md='9')
          //- Hinweis zur Anmeldephase
          //- v-alert.mt-3.mb-1(type='info', tile, dense, text, outlined, v-if='isCountdownFuture')
          //-  span.subtitle-2.secondary--text Die Anmeldephase beginnt anders als Angekündigt erst am #[strong Sonntag 01.12. um 15 Uhr]!
          //- Hinweis zu Preisen
          //- v-alert.mt-3.mb-1(type='warning', tile, dense, outlined, text, v-if='isCountdownFuture')
          //-   span.subtitle-2.secondary--text Beachte, dass die angegeben Preise sich durch in Aussicht gestellte Fördergelder noch zum positiven verändern könnnen.

    v-container.mb-4
      .d-flex.flex-row.justify-space-between.align-end
        h2#aktuelles Aktuelles
        v-btn(
          variant='text',
          rounded='0',
          size='large',
          to='/blog/',
          aria-label='Mehr Beiträge anzeigen'
        )
          span.d-none.d-sm-inline Mehr Beiträge
          v-icon.ml-1.mr-n1(:icon='mdiArrowRight')
      v-row.mb-4
        v-col(
          cols='12',
          sm='6',
          md='4',
          v-for='item in pages.recentPosts',
          :key='item.slug'
        )
          v-card(rounded='0', hover, variant='outlined', :to='`/blog/${item.slug}`')
            ec-image-item(
              :image='item.featuredImage',
              :title='item.title ?? ""',
              :subTitle='`Vom ${item.published?.split("T")[0]?.split("-").reverse().join(".")}`'
            )
      .d-flex.flex-row.justify-space-between.align-end
        h2(id='nächste-veranstaltungen') Nächste Veranstaltungen
        v-btn(
          variant='text',
          rounded='0',
          size='large',
          to='/veranstaltungen/',
          aria-label='Mehr Veranstaltungen anzeigen'
        )
          span.d-none.d-sm-inline Mehr Veranstaltungen
          v-icon.ml-1.mr-n1(:icon='mdiArrowRight')
      v-row.mb-4
        v-col(
          cols='12',
          sm='6',
          md='4',
          v-for='item in pages.upcomingEvents',
          :key='item.slug'
        )
          v-card(
            rounded='0',
            hover,
            variant='outlined',
            :to='`/veranstaltungen/${item.slug}`'
          )
            ec-image-item(
              :image='item.featuredImage',
              :title='item.title ?? ""',
              :subTitle='`Vom ${item.begin?.substring(0, 10).split("-").reverse().join(".")} bis ${item.ende?.substring(0, 10).split("-").reverse().join(".")}`'
            )
  .angle--both-left-right(style='background: #f5f5f5')
    v-container
      h2(id='über-uns') Über uns
      p
        | EC steht für „Entschieden für Christus“ und das sind wir. Der EC-Nordbund ist der nördlichste deutsche Landesverband dieser weltweiten Bewegung.
      p
        | Die weltweite EC-Bewegung entstand am Ende des 19. Jahrhunderts in den USA und hat heute ca. 2.000.000 Mitglieder, die in etwa 50 Staaten aktiv sind.
      p
        | Seit 1904 engagieren wir uns als EC-Nordbund in der christlichen Kinder- und Jugendarbeit in Schleswig-Holstein und Hamburg.
        | In wöchentlichen Gruppenstunden und durch überregionale Freizeiten, Workshops und Seminare werden dabei zurzeit weit über 1.500 Jugendliche erreicht.
      p
        | Im EC glauben wir, dass Gott jeden Menschen so sehr liebt, dass er uns durch seinen Sohn Jesus Christus eine Überlebensperspektive anbietet.
        | Also eine Perspektive, die über unser irdisches Lebensende hinausreicht. Das ermöglicht uns, in großer Freiheit, angstfrei und liebevoll unser Leben schon jetzt zu gestalten.
        | Deshalb möchten wir dieses große Geschenk auch mit anderen Menschen teilen. Wir wollen gemeinsam lernen, mit christlichen Werten zu leben und damit einladend für andere zu sein.
      p
        | Wir sind eine Mitmachbewegung und setzten stark auf die Beteiligung von Jugendlichen.
        | Unter dem Motto „von Jugendlichen für Jugendliche“ vereinen sich allein im Nordbund mehr als 400 ehrenamtliche Mitarbeitende, die von lediglich drei hauptamtlichen unterstützt werden.
      v-row
        v-col.person(align='center', @click='mail("kirke.husberg@ec-nordbund.de")')
          v-img.hexagon-shape(cover, :src='kirkeImg', :width='128', :height='128')
            .hexa-image-overlay(v-ripple)
          .text-h6 Kirke Husberg
          | Jugendreferentin
        v-col.person(align='center', @click='mail("tobias.krahe@ec-nordbund.de")')
          v-img.hexagon-shape(cover, :src='tobiasImg', :width='128', :height='128')
            .hexa-image-overlay(v-ripple)
          .text-h6 Tobias Krahe
          | Jugendreferent
        v-col.person(
          align='center',
          @click='mail("dortje.gaertner@ec-nordbund.de")'
        )
          v-img.hexagon-shape(cover, :src='dortjeImg', :width='128', :height='128')
            .hexa-image-overlay(v-ripple)
          .text-h6 Dortje Gaertner
          | Kinder- und Jungschararbeit
p(v-else) Loading...
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { mdiArrowRight } from '@mdi/js'
import { useCurrentTime } from '~/composables/current-time'
import kirkeImg from '~/assets/img/kirke.jpg'
import tobiasImg from '~/assets/img/tobias.jpg'
import dortjeImg from '~/assets/img/dortje_gaertner.jpg'

// Alt: useStatic(..., undefined, 'homeData') — gleicher Key, kein Param.
const { data: pagesLoading } = await useAsyncData('homeData', async () => {
  const todayStr = new Date().toISOString().substring(0, 10)

  // stem = Dateiname ohne Endung = alter Slug; Templates nutzen weiter `slug`
  const upcomingEvents = (
    await queryCollection('veranstaltung')
      .select('stem', 'title', 'begin', 'ende', 'featuredImage', 'tags')
      .where('ende', '>=', todayStr)
      .order('begin', 'ASC')
      .limit(3)
      .all()
  ).map((d) => ({
    ...d,
    slug: stemToSlug(d.stem),
    featuredImage: assetUrl(d.featuredImage),
  }))

  const recentPosts = (
    await queryCollection('blog')
      .select('title', 'tags', 'description', 'featuredImage', 'stem', 'published')
      .order('published', 'DESC')
      .limit(3)
      .all()
  ).map((d) => ({
    ...d,
    slug: stemToSlug(d.stem),
    featuredImage: assetUrl(d.featuredImage),
  }))

  // Hartkodierung 1:1 (wird zur Generate-Zeit eingebacken, täglicher CI-Rebuild)
  const countdown = {
    date: '2026-09-20T13:00:00Z',
    show: true,
  }

  return { upcomingEvents, recentPosts, countdown }
})

const pages = computed(() =>
  pagesLoading.value
    ? pagesLoading.value
    : {
        upcomingEvents: [],
        recentPosts: [],
        countdown: { date: undefined, show: false },
      },
)

const { currentTime } = useCurrentTime()

const isCountdownFuture = computed(() => {
  const { countdown } = pages.value

  return new Date(countdown.date as string) > currentTime.value || false
})

// Hero-Random NUR clientseitig (gegen Hydration-Mismatch):
// Start deterministisch mit hero.1.jpg, Zufallsbild erst in onMounted.
const hero_image = ref('hero.1.jpg')
onMounted(() => {
  const hero_id = Math.floor(Math.random() * 3) + 1
  hero_image.value = `hero.${hero_id}.jpg`
})

const mail = (m: string) => (location.href = `mailto:${m}`)

const description =
  'Die EC-Arbeit in Deutschland hat den Auftrag, junge Menschen zu Jüngern zu machen und sie zu prägenden Persönlichkeiten heranzubilden, durch die wiederum Menschen ihrer Generation zu Jüngern werden. Der EC-Nordbund ist einer der 18 Landesverbänden des Deutschen EC-Verbandes. Im EC-Nordbund sind alle EC-Kinder- und Jugendarbeiten aus Schleswig-Holstein und Hamburg vereint. EC bedeutet: „Entschieden für Christus“ und markiert die Aurichtung auf Jesus in allen unseren Aktivitäten.'

useHead({
  title: 'Startseite',
  link: [{ rel: 'canonical', href: 'https://www.ec-nordbund.de' }],
})

useSeoMeta({
  description,
  ogTitle: 'EC-Nordbund',
  ogDescription: description,
  twitterTitle: 'EC-Nordbund!',
  twitterDescription: description,
})
</script>
<style lang="scss" scoped>
@use 'sass:map';
@use 'vuetify/settings' as v;

.hero-image {
  height: calc(100vh + 3.492vw - 96px);

  @media #{map.get(v.$display-breakpoints, 'md-and-up')} {
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
    box-shadow:
      0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      0px 1px 5px 0px rgba(0, 0, 0, 0.12),
      0 11px 15px -7px rgba(0, 0, 0, 0.2),
      0 24px 38px 3px rgba(0, 0, 0, 0.14),
      0 9px 46px 8px rgba(0, 0, 0, 0.12) !important;
  }
}

.hexa-image-overlay {
  height: 128px;
  background: rgb(var(--v-theme-primary));
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.3s;
}

.person {
  cursor: pointer;

  // transition: background-color .3s;
  &:hover {
    // background-color: rgb(var(--v-theme-primary));

    & .hexa-image-overlay {
      opacity: 0.7;
    }
  }
}
</style>
