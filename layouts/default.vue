<template lang="pug">
v-app
  header.sticky-header
    v-toolbar(density='compact', flat, color='rgba(0, 0, 0, 0.04)', height='40')
      v-container
        v-row(align='center')
          v-btn.ml-n5.ml-md-n3.mr-n1.hover-facebook(
            icon,
            size='small',
            href='https://www.facebook.com/ECNordbund/',
            target='_blank',
            rel='noopener',
            aria-label='Facebook'
          )
            v-icon mdi-facebook
          v-btn.mx-n1.hover-instagram(
            icon,
            size='small',
            href='https://www.instagram.com/ec_nordbund/',
            target='_blank',
            rel='noopener',
            aria-label='Instagram'
          )
            v-icon mdi-instagram
          v-btn.mx-n1.hover-youtube(
            icon,
            size='small',
            href='https://www.youtube.com/channel/UC0kn9I7w4sCwl7IJ6ZOTF0w',
            target='_blank',
            rel='noopener',
            aria-label='YouTube'
          )
            v-icon mdi-youtube
          v-spacer
          v-col.hidden-xs(
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
              .text-body-2.text-secondary
                //- Losung
                | Losung:&nbsp;
                span(v-html='losung')
                |
                | —&nbsp;
                a.font-italic.pr-6.text-caption.text-hell-grau(
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
                a.font-italic.pr-6.text-caption.text-hell-grau(
                  :href='`https://www.bibelserver.com/LUT/${losungen.Lehrtextvers}`',
                  target='_blank',
                  rel='noopener',
                  v-html='losungen.Lehrtextvers'
                )

                //- Copyright
                span.text-caption (
                  a.no-underline.text-hell-grau.pr-2(
                    href='https://www.ebu.de/startseite/',
                    target='_blank',
                    rel='noopener'
                  )
                    | © Evangelische Brüder-Unität – Herrnhuter Brüdergemeine
                  |
                  | —&nbsp;
                  a.no-underline.text-hell-grau.pl-2(
                    href='https://www.losungen.de',
                    target='_blank',
                    rel='noopener'
                  )
                    | Weitere Informationen zu den Losungen findest du&nbsp;
                    span.text-decoration-underline hier
                    | .
                  | )
          v-spacer
          v-col(cols='1')
            v-btn(
              style='float: right; text-transform: none',
              to='/krisenintervention/',
              color='error',
              variant='flat',
              :size='smAndDown ? "x-small" : "small"',
              :class='"overflow-hidden krisenbutton" + (mdAndUp ? "-extended" : "")',
              aria-label='Kinder und Jugendschutz'
            )
              v-icon.ml-n1.mr-n1(size='small') mdi-alarm-light
              span.pl-2.text-subtitle-2.font-weight-medium(
                style='text-transform: none',
                v-show='mdAndUp'
              ) Kinder- und Jugendschutz
    v-app-bar(color='white')
      v-container
        v-row
          v-col.d-flex.align-center.px-0(sm='12')
            NuxtLink.d-flex.align-center.mr-auto.no-underline(
              to='/',
              aria-label='Zur Startseite'
            )
              ec-logo(size='42px', alt='EC')
              span(style='display: block; font-size: 2em; font-weight: bold') Nordbund

            //- 1. Blog
            v-btn.hidden-sm-and-down.mr-2(
              variant='text',
              to='/blog/',
              color='primary',
              rounded='0'
            )
              span.text-subtitle-1.text-capitalize.font-weight-medium Blog

            //- 2. Veranstaltung
            v-btn.hidden-sm-and-down.mr-2(
              variant='text',
              to='/veranstaltungen/',
              color='primary',
              rounded='0'
            )
              span.text-subtitle-1.text-capitalize.font-weight-medium Veranstaltungen

            //- 3. Downloads
            v-btn.hidden-sm-and-down.mr-2(
              variant='text',
              to='/downloads/',
              color='primary',
              rounded='0'
            )
              span.text-subtitle-1.text-capitalize.font-weight-medium Downloads

            //- 4. Shop
            v-btn.hidden-sm-and-down.mr-2(
              variant='text',
              to='/shop/',
              color='primary',
              rounded='0'
            )
              span.text-subtitle-1.text-capitalize.font-weight-medium Shop

            //- 5. Ort / Karlsminde
            v-btn.hidden-sm-and-down.mr-2(
              variant='text',
              to='/orte/karlsminde/',
              color='primary',
              rounded='0'
            )
              span.text-subtitle-1.text-capitalize.font-weight-medium Karlsminde

            v-app-bar-nav-icon.hidden-md-and-up(
              @click.stop='drawer = !drawer',
              aria-label='Menü'
            )
    v-btn.back-to-top--btn.hexagon-shape(
      v-show='btt',
      @click='goToTop',
      color='accent'
    )
      v-icon(size='28') mdi-chevron-up
  v-navigation-drawer(location='right', temporary, v-model='drawer')
    v-list(nav)
      v-list-item(to='/blog/', prepend-icon='mdi-post-outline', title='Blog')
      v-list-item(to='/veranstaltungen/', prepend-icon='mdi-calendar', title='Veranstaltungen')
      v-list-item(to='/downloads/', prepend-icon='mdi-cloud-download', title='Downloads')
      v-list-item(to='/shop/', prepend-icon='mdi-basket', title='Shop')
      v-list-item(to='/orte/karlsminde/', prepend-icon='mdi-home', title='Karlsminde')

  v-main
    slot
  footer.bg-secondary.text-white.angle--top-left
    v-container
      v-row(justify='space-between')
        v-col.px-4(md='6')
          h2 Spenden
          v-list(bg-color='transparent', class='px-0')
            v-list-item.ml-n4(@click='copy2clip("Sparkasse Südholstein")', title='Sparkasse Südholstein', subtitle='Bank')
            v-list-item.ml-n4(
              @click='copy2clip("DE47 2305 1030 0510 8336 43")',
              title='DE47 2305 1030 0510 8336 43',
              subtitle='IBAN'
            )
            v-list-item.ml-n4(@click='copy2clip("NOLADE21SHO")', title='NOLADE21SHO', subtitle='BIC')
        v-col.links.px-4(md='6')
          h2 Links
          v-list(bg-color='transparent', class='px-0 text-white')
            v-list-item.ml-n4(to='/', title='Startseite')
            v-list-item.ml-n4(to='/downloads/', title='Downloads')
            v-list-item.ml-n4(to='/teilnahmebedingungen/', title='Teilnahmebedingungen')
            v-list-item.ml-n4(to='/datenschutz', title='Datenschutz')
            v-list-item.ml-n4(to='/impressum', title='Impressum')

      v-row.pt-1
        v-col.text-center © by EC-Nordbund
</template>
<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useDisplay, useGoTo } from 'vuetify'

import copy from '~/helpers/copy'
import { get } from '~/helpers/fetch'

export default defineComponent({
  setup() {
    const drawer = ref(false)
    const btt = ref(false)
    const route = useRoute()
    const { smAndDown, mdAndUp } = useDisplay()
    const goTo = useGoTo()

    const losungen = ref(null)

    onMounted(() => {
      const RIC = ('requestIdleCallback' in window) ? requestIdleCallback : (cb) => setTimeout(cb, 5000)

      RIC(() => {
        const n = new Date()
        const today = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`

        get(`https://losungen.ec-nordbund.de/${today}.json`).then(
          (v) => (losungen.value = v)
        )
      })
    })

    const isStartPage = computed(() => route.path === '/')

    const losung = computed(
      () =>
        losungen.value &&
        losungen.value.Losungstext
          .split('/')
          .join('<b><i>')
          .split(':<b><i>')
          .join(':</i></b>')
          .split('#')
          .map((v, i) => {
            if (i === 0) return v
            if (i % 2 === 0) return '</i>' + v
            return '<i>' + v
          })
          .join('')
    )
    const lehrtext = computed(
      () =>
        losungen.value &&
        losungen.value.Lehrtext
          .split('/')
          .join('<i>')
          .split(':<i>')
          .join(':</i>')
          .split('#')
          .map((v, i) => {
            if (i === 0) return v
            if (i % 2 === 0) return '</i>' + v
            return '<i>' + v
          })
          .join('')
    )
    const marqueeContentLength = computed(
      () =>
        losungen.value &&
        losungen.value.Losungstext.length +
          losungen.value.Losungsvers.length +
          losungen.value.Lehrtext.length +
          losungen.value.Lehrtextvers.length +
          140
    )

    function onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      btt.value = top > 128
    }

    function goToTop() {
      goTo(0)
    }

    return {
      losungen,
      btt,
      onScroll,
      losung,
      lehrtext,
      marqueeContentLength,
      drawer,
      copy2clip: copy,
      isStartPage,
      smAndDown,
      mdAndUp,
      goToTop,
    }
  },
})
</script>

<style lang="scss">
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
}
.hover-instagram:hover {
  color: rgb(var(--v-theme-instagram)) !important;
}
.hover-youtube:hover {
  color: rgb(var(--v-theme-youtube)) !important;
}
.links .v-list-item {
  min-height: 32px;
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
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important;

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
</style>
