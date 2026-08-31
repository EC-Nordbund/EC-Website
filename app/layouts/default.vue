<template lang="pug">
v-app
  header.sticky-header
    v-toolbar(flat, color='rgba(0, 0, 0, 0.04)', height='40')
      v-container
        v-row(align='center')
          v-btn.ml-n5.ml-md-n3.mr-n1.hover-facebook(
            icon,
            variant='text',
            href='https://www.facebook.com/ECNordbund/',
            target='_blank',
            rel='noopener',
            aria-label='Facebook'
          )
            v-icon(:icon='mdiFacebook')
          v-btn.mx-n1.hover-instagram(
            icon,
            variant='text',
            href='https://www.instagram.com/ec_nordbund/',
            target='_blank',
            rel='noopener',
            aria-label='Instagram'
          )
            v-icon(:icon='mdiInstagram')
          v-btn.mx-n1.hover-youtube(
            icon,
            variant='text',
            href='https://www.youtube.com/channel/UC0kn9I7w4sCwl7IJ6ZOTF0w',
            target='_blank',
            rel='noopener',
            aria-label='YouTube'
          )
            v-icon(:icon='mdiYoutube')
          v-spacer
          v-col.hidden-xs-only(
            sm='6',
            md='7',
            xl='9',
            align-self='center',
            v-if='losungen && losungen.Losungstext'
          )
            ec-marquee(
              :length='marqueeContentLength',
              color='rgba(0,0,0,0.06)'
            )
              .text-body-2.text-medium-emphasis
                //- Losung
                | Losung:&nbsp;
                span(v-html='losung')
                |
                | —&nbsp;
                a.font-italic.pr-6.text-caption.text-hellGrau(
                  :href='`https://www.bibelserver.com/LUT/${losungen.Losungsvers}`',
                  target='_blank',
                  rel='noopener',
                  v-html='losungen.Losungsvers'
                )

                //- Lehrtext
                | Lehrtext:&nbsp;
                span(v-html='lehrtext')
                |
                | —&nbsp;
                a.font-italic.pr-6.text-caption.text-hellGrau(
                  :href='`https://www.bibelserver.com/LUT/${losungen.Lehrtextvers}`',
                  target='_blank',
                  rel='noopener',
                  v-html='losungen.Lehrtextvers'
                )

                //- Copyright
                span.text-caption (
                  a.no-underline.text-hellGrau.pr-2(
                    href='https://www.ebu.de/startseite/',
                    target='_blank',
                    rel='noopener'
                  )
                    | © Evangelische Brüder-Unität – Herrnhuter Brüdergemeine
                  |
                  | —&nbsp;
                  a.no-underline.text-hellGrau.pl-2(
                    href='https://www.losungen.de',
                    target='_blank',
                    rel='noopener'
                  )
                    | Weitere Informationen zu den Losungen findest du&nbsp;
                    span.text-decoration-underline hier
                    | .
                  | )
          v-spacer
          v-col(cols='auto')
            v-btn(
              style='float: right; text-transform: none',
              to='/krisenintervention/',
              color='error',
              variant='flat',
              :size='mdAndUp ? "small" : "x-small"',
              :class='"overflow-hidden krisenbutton" + (mdAndUp ? "-extended" : "")',
              aria-label='Kinder und Jugendschutz'
            )
              v-icon.ml-n1.mr-n1(size='small', :icon='mdiAlarmLight')
              span.pl-2.text-subtitle-2.font-weight-medium(
                style='text-transform: none',
                v-show='mdAndUp'
              ) Kinder- und Jugendschutz
    //- Vuetify 4: v-app-bar ist fix im Layout-System verankert – hier bewusst
    //- v-toolbar, damit die Leiste Teil des sticky-Headers bleibt (Verhalten 1:1).
    v-toolbar(color='white')
      v-container
        v-row
          v-col.d-flex.align-center.px-0(sm='12')
            NuxtLink.d-flex.align-center.mr-auto.no-underline(
              to='/',
              aria-label='Zur Startseite'
            )
              ec-logo(size='42px', alt='EC')
              span.text-primary(style='display: block; font-size: 2em; font-weight: bold') Nordbund

            //- 1. Blog
            v-btn.hidden-sm-and-down.mr-2(
              rounded='0',
              variant='text',
              to='/blog/',
              color='primary',
              :active='navActive("/blog")'
            )
              span.text-subtitle-1.text-capitalize.font-weight-medium Blog

            //- 2. Veranstaltung
            v-btn.hidden-sm-and-down.mr-2(
              rounded='0',
              variant='text',
              to='/veranstaltungen/',
              color='primary',
              :active='navActive("/veranstaltungen")'
            )
              span.text-subtitle-1.text-capitalize.font-weight-medium Veranstaltungen

            //- 3. Downloads
            v-btn.hidden-sm-and-down.mr-2(
              rounded='0',
              variant='text',
              to='/downloads/',
              color='primary',
              :active='navActive("/downloads")'
            )
              span.text-subtitle-1.text-capitalize.font-weight-medium Downloads

            //- 4. Shop
            v-btn.hidden-sm-and-down.mr-2(
              rounded='0',
              variant='text',
              to='/shop/',
              color='primary',
              :active='navActive("/shop")'
            )
              span.text-subtitle-1.text-capitalize.font-weight-medium Shop

            //- 5. Ort / Karlsminde
            v-btn.hidden-sm-and-down.mr-2(
              rounded='0',
              variant='text',
              to='/orte/karlsminde/',
              color='primary',
              :active='navActive("/orte/karlsminde")'
            )
              span.text-subtitle-1.text-capitalize.font-weight-medium Karlsminde

            v-app-bar-nav-icon.hidden-md-and-up(
              @click.stop='drawer = !drawer',
              aria-label='Menü'
            )
    v-btn.back-to-top--btn.hexagon-shape(
      v-scroll='onScroll',
      v-show='btt',
      @click='goTo(0)',
      color='accent'
    )
      v-icon(size='28', :icon='mdiChevronUp')
  v-navigation-drawer(location='end', temporary, v-model='drawer')
    v-list(nav)

      v-list-item(link, to='/blog/', :prepend-icon='mdiPostOutline')
        v-list-item-title Blog

      v-list-item(link, to='/veranstaltungen/', :prepend-icon='mdiCalendar')
        v-list-item-title Veranstaltungen

      v-list-item(link, to='/downloads/', :prepend-icon='mdiCloudDownload')
        v-list-item-title Downloads

      v-list-item(link, to='/shop/', :prepend-icon='mdiBasket')
        v-list-item-title Shop

      v-list-item(link, to='/orte/karlsminde/', :prepend-icon='mdiHome')
        v-list-item-title Karlsminde

  v-main
    slot
  footer.bg-secondary.text-white.angle--top-left
    v-container
      v-row(justify='space-between')
        v-col.px-4(md='6')
          h2 Spenden
          v-list.bg-transparent.px-0
            v-list-item.ml-n4(
              @click='copy2clip("Sparkasse Südholstein", "Bank")'
            )
              v-list-item-title Sparkasse Südholstein
              v-list-item-subtitle Bank
              template(#append)
                v-icon(size='small', title='Bank kopieren', :icon='mdiContentCopy')
            v-list-item.ml-n4(
              @click='copy2clip("DE47 2305 1030 0510 8336 43", "IBAN")'
            )
              v-list-item-title DE47 2305 1030 0510 8336 43
              v-list-item-subtitle IBAN
              template(#append)
                v-icon(size='small', title='IBAN kopieren', :icon='mdiContentCopy')
            v-list-item.ml-n4(@click='copy2clip("NOLADE21SHO", "BIC")')
              v-list-item-title NOLADE21SHO
              v-list-item-subtitle BIC
              template(#append)
                v-icon(size='small', title='BIC kopieren', :icon='mdiContentCopy')
        v-col.links.px-4(md='6')
          h2 Links
          v-list.bg-transparent.px-0.text-white
            v-list-item.ml-n4(to='/', exact)
              v-list-item-title
                | Startseite
            v-list-item.ml-n4(to='/downloads/')
              v-list-item-title
                | Downloads
            v-list-item.ml-n4(to='/teilnahmebedingungen/')
              v-list-item-title
                | Teilnahmebedingungen
            v-list-item.ml-n4(to='/datenschutz')
              v-list-item-title
                | Datenschutz
            v-list-item.ml-n4(to='/impressum')
              v-list-item-title
                | Impressum

      v-row.pt-1
        v-col.text-center © by EC-Nordbund
  v-snackbar(v-model='copySnackbar', :timeout='2500')
    | {{ copyMessage }}
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDisplay, useGoTo } from 'vuetify'
import {
  mdiFacebook,
  mdiInstagram,
  mdiYoutube,
  mdiAlarmLight,
  mdiChevronUp,
  mdiPostOutline,
  mdiCalendar,
  mdiCloudDownload,
  mdiBasket,
  mdiHome,
  mdiContentCopy,
} from '@mdi/js'

import copy from '~/helpers/copy'
import { get } from '~/helpers/fetch'

interface Losungen {
  Losungstext: string
  Losungsvers: string
  Lehrtext: string
  Lehrtextvers: string
}

const drawer = ref(false)
const btt = ref(false)

// vue-router 4 wertet Geschwister-Routen (/blog/ vs. /blog/[id]) nicht mehr
// als aktiv — Nav-Hervorhebung wie im Alt-Stand daher per Pfad-Präfix
const route = useRoute()
const navActive = (prefix: string) => route.path.startsWith(prefix)

const { mdAndUp } = useDisplay()
const goTo = useGoTo()

// could be optimized
const losungen = ref<Losungen | null>(null)

onMounted(() => {
  const RIC =
    'requestIdleCallback' in window
      ? requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 5000)

  RIC(() => {
    const n = new Date()
    const today = `${n.getFullYear()}-${
      n.getMonth() + 1 < 10 ? '0' + (n.getMonth() + 1) : n.getMonth() + 1
    }-${n.getDate() < 10 ? '0' + n.getDate() : n.getDate()}`

    get<Losungen>(`https://losungen.ec-nordbund.de/${today}.json`).then(
      (v) => (losungen.value = v),
    )
  })
})

const losung = computed(
  () =>
    losungen.value &&
    losungen.value.Losungstext.split('/')
      .join('<b><i>')
      .split(':<b><i>')
      .join(':</i></b>')
      .split('#')
      .map((v, i) => {
        if (i === 0) {
          return v
        }

        if (i % 2 === 0) {
          return '</i>' + v
        } else {
          return '<i>' + v
        }
      })
      .join(''),
)
const lehrtext = computed(
  () =>
    losungen.value &&
    losungen.value.Lehrtext.split('/')
      .join('<i>')
      .split(':<i>')
      .join(':</i>')
      .split('#')
      .map((v, i) => {
        if (i === 0) {
          return v
        }

        if (i % 2 === 0) {
          return '</i>' + v
        } else {
          return '<i>' + v
        }
      })
      .join(''),
)
const marqueeContentLength = computed(
  () =>
    (losungen.value &&
      losungen.value.Losungstext.length +
        losungen.value.Losungsvers.length +
        losungen.value.Lehrtext.length +
        losungen.value.Lehrtextvers.length +
        140) ||
    // 0 nur solange die Losungen noch nicht geladen sind (Marquee ist dann per v-if ausgeblendet)
    0,
)

function onScroll(e: Event) {
  if (typeof window === 'undefined') return
  const top =
    window.pageYOffset || (e.target as HTMLElement)?.scrollTop || 0
  btt.value = top > 128
}

const copySnackbar = ref(false)
const copyMessage = ref('')

function copy2clip(text: string, label: string) {
  copy(text)
  copyMessage.value = `${label} in die Zwischenablage kopiert`
  copySnackbar.value = true
}
</script>

<style lang="scss">
@use 'sass:math';

.sticky-header {
  position: sticky;
  top: -40px;
  z-index: 5;
}
.no-underline {
  text-decoration: none;
}
.hover-facebook:hover {
  color: rgb(var(--v-theme-facebook)) !important;
  fill: rgb(var(--v-theme-facebook));
}
.hover-instagram:hover {
  color: rgb(var(--v-theme-instagram)) !important;
  fill: rgb(var(--v-theme-instagram));
}
.hover-youtube:hover {
  color: rgb(var(--v-theme-youtube)) !important;
  fill: rgb(var(--v-theme-youtube));
}
.links .v-list-item {
  min-height: 32px;

  .v-list-item__content {
    padding: 8px 0;
  }
}

.back-to-top--btn {
  border-radius: 50% !important;
  height: 56px !important;
  width: 56px;
  min-width: 0 !important;
  padding: 0 !important;
  bottom: 16px;
  right: 16px;
  position: fixed !important;
  opacity: 0.95 !important;
  box-shadow:
    0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14),
    0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important;

  &.hexagon-shape {
    border-radius: 0 !important;
  }

  &:hover {
    opacity: 1 !important;
  }
}

.krisenbutton {
  padding: 0 !important;
  width: 32px;
  height: 32px !important;
  min-height: 0;
  min-width: 0 !important;
  border-radius: 50%;
  font-size: 0.625rem;

  &-extended {
    border-radius: 14px !important;
    height: 28px !important;
    padding: 0 #{math.div(28, 2.25)}px !important;
    font-size: 0.75rem !important;
  }
}
</style>

<style scoped lang="scss">
footer :deep(*) {
  color: #fff !important;
}
footer :deep(.v-list-item:hover) {
  background: rgba(1, 1, 1, 0.2);
}
footer :deep(.v-list-item-title),
footer :deep(.v-list-item-subtitle) {
  user-select: text;
}
</style>
