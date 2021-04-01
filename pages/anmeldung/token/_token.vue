<template lang="pug">
v-container.fill-height
  v-row(no-gutters, justify='center')
    v-col(cols='12')
      v-row
        v-col
          h1.text-center.py-4 {{ title }}
          v-progress-linear.hidden-sm-and-down(
            :value='loadingStep2 ? 33 : 66',
            height='12',
            striped
          )
      v-row.px-4.px-sm-0
        //- 1. Schritt
        v-col(cols='12', md='4')
          v-card#first-step(color='success', tile, flat)
            .collapsable-square.collapsed-sm-and-down
              .collapsable-square__sizer
              .collapsable-square__content
                .d-flex.flex-column.justify-space-between.fill-height
                  div
                    v-card-title.pb-4.pt-2.pt-md-4
                      h5.text-h5.font-weight-black 1. Schritt

                    v-card-subtitle.pt-1.pb-2.pb-md-1 Anmeldedaten abgeschickt

                  .absolute-flex-centered
                    v-avatar(
                      :max-height='avatarMaxSize',
                      :max-width='avatarMaxSize',
                      :size='avatarSize',
                      color='rgba(255,255,255,0.16)'
                    )
                      v-icon(color='white', :size='iconSize') mdi-check

        //- 2. Schritt
        v-col(cols='12', sm='6', md='4')
          v-card#second-step(
            :loading='loadingStep2',
            tile,
            :color='statusColor',
            :flat='!loadingStep2',
            :outlined='loadingStep2',
            loader-height='6'
          )
            .collapsable-square(:class='{ "collapsed-xs-only": loadingStep2 }')
              .collapsable-square__sizer
              .collapsable-square__content
                .d-flex.flex-column.justify-space-between.fill-height
                  div
                    v-card-title.py-4
                      h5.text-h5.font-weight-black 2. Schritt

                    v-card-subtitle.py-1
                      | {{ statusText }}

                  .absolute-flex-centered
                    v-avatar(
                      v-if='!loadingStep2',
                      :max-height='avatarMaxSize',
                      :max-width='avatarMaxSize',
                      :size='avatarSize',
                      color='rgba(255,255,255,0.16)'
                    )
                      .text-h3.font-weight-bold.white--text(
                        v-if='isOnWarteliste'
                      ) {{ wList }}
                      v-icon(v-else, color='white', size='96') {{ isOnWarteliste.value ? 'mdi-clipboard-list' : 'mdi-check-all' }}

                  v-card-text.text-body-1.font-weight-medium(
                    v-if='!loadingStep2 && (anmeldeID || isOnWarteliste)'
                  )
                    .text-caption.text-left(v-if='anmeldeID') Dein Anmelde-Code:
                      pre.text-body-2.text-center.anmelde-id(
                        @click='copy2clip(anmeldeID)'
                      ) {{ anmeldeID }}
                    .text-center(v-else-if='isOnWarteliste') Dein Wartelistenplatz

        //- 3. Schritt
        v-col(cols='12', sm='6', md='4')
          v-card#third-step.fill-height(
            tile,
            outlined,
            disabled,
            :loading='loadingStep3'
          )
            template(slot='progress')
              v-progress-linear(
                indeterminate,
                height='6',
                :color='statusColor'
              )
            v-responsive(aspect-ratio='4')
              v-card-title.pb-3.pt-4.justify-center
                h5.text-h5.font-weight-black 3. Schritt

              v-card-subtitle.text-center.pt-1
                | So geht es nun weiter...

            v-responsive(aspect-ratio='2')
              .d-flex.flex-column.justify-space-around.align-center.fill-height
                template(v-if='!loadingStep2 && !loadingStep3')
                  template(v-if='type === 1')
                    //- successful
                    v-row(v-if='isSuccessful', no-gutters, align='center')
                      v-col(cols='3', align='center')
                        v-avatar(size='42', color='success')
                          v-icon(size='24', color='white') mdi-email
                      v-col.text-body-2(cols='9') Du erhälst von uns eine schriftliche Teilnahmebestätigung per Post.

                      v-col(cols='3', align='center')
                        v-avatar(size='42', color='success')
                          v-icon(size='24', color='white') mdi-handshake
                      v-col.text-body-2(cols='9') Du überweist ggf. die nötige Anzahlung

                    //- warteliste
                    v-row(
                      v-else-if='isOnWarteliste',
                      no-gutters,
                      align='center'
                    )
                      v-col(cols='3', align='center')
                        v-avatar(size='42', color='warning')
                          v-icon(size='24', color='white') mdi-bell
                      v-col.text-body-2(cols='9') Wir melden uns bei dir, wenn durch Nachrücken auf den Wartelistenplätzen die Möglichkeit besteht, dass du doch noch an der gewählten Veranstaltung teilnehmen kannst.

                    //- error
                    v-row(v-else, no-gutters, align='center')
                      v-col(cols='3', align='center')
                        v-avatar(size='42', color='error')
                          v-icon(size='24', color='white') mdi-bell
                      v-col.text-body-2(cols='9') Bitte teile uns das mit. Antworte dafür einfach auf die Bestätigungsmail und füge zusätzlich folgenden Text ein:
                        pre {{ myStatus }}
                        br
                        | Wir wissen dadurch dann was zu tun ist.
                  template(v-if='type !== 1')
                    //- successful
                    v-row(v-if='isSuccessful', no-gutters, align='center')
                      v-col(cols='3', align='center')
                        v-avatar(size='42', color='success')
                          v-icon(size='24', color='white') mdi-email
                      v-col.text-body-2(cols='9') Du erhälst von uns - wenn benötigt - in den nächsten 5 min einen Antrag auf ein erweiteres Führungszeugnis.

                      //- v-col(cols='3', align='center')
                      //-   v-avatar(size='42', color='success')
                      //-     v-icon(size='24', color='white') mdi-handshake
                      //- v-col.text-body-2(cols='9') Du überweist ggf. die nötige Anzahlung

                    //- error
                    v-row(v-else, no-gutters, align='center')
                      v-col(cols='3', align='center')
                        v-avatar(size='42', color='error')
                          v-icon(size='24', color='white') mdi-bell
                      v-col.text-body-2(cols='9') Bitte teile uns das mit. Antworte dafür einfach auf die Bestätigungsmail und füge zusätzlich folgenden Text ein:
                        pre {{ myStatus }}
                        br
                        | Wir wissen dadurch dann was zu tun ist.
            v-responsive(aspect-ratio='4')
</template>
<script lang="ts">
import {
  defineComponent,
  useContext,
  ref,
  computed
} from '@nuxtjs/composition-api'
import { post } from '~/helpers/fetch'
import copy from '~/helpers/copy'
export default defineComponent({
  layout: 'minimal',
  setup(_, ctx) {
    const token = useContext().params.value.token
    const loaded = ref(false)
    const loadingStep2 = ref(true)
    const loadingStep3 = ref(false)
    const anmeldeID = ref(null as null | string)
    const wList = ref(0)
    const type = ref(1)

    const isMobile = computed(() => ctx.root.$vuetify.breakpoint.smAndDown)
    const isSuccessful = computed(() => wList.value === 0)
    const isOnWarteliste = computed(() => wList.value > 0)

    const title = computed(() => {
      if (loadingStep2.value) {
        return 'Du hast es gleich geschafft!'
      }

      if (isOnWarteliste.value) {
        return 'Du bist auf der Warteliste...'
      }

      if (isSuccessful.value) {
        return 'Du bist angemeldet!'
      }

      return 'Oops: Da hat etwas nicht geklappt!'
    })

    const statusText = computed(() => {
      if (loadingStep2.value) {
        return 'Anmeldung wird bestätigt...'
      }

      if (isOnWarteliste.value) {
        return 'Veranstaltung bereits voll!'
      }

      if (isSuccessful.value) {
        return 'Anmeldung bestätigt'
      }

      return 'Es ist ein Fehler aufgetreten'
    })

    const statusColor = computed(() => {
      if (loadingStep2.value) {
        return undefined
      }

      if (isOnWarteliste.value) {
        return 'warning'
      }

      if (isSuccessful.value) {
        return 'success'
      }

      return 'error'
    })

    const avatarSize = computed(() => (isMobile.value ? 160 : 128))

    const avatarMaxSize = computed(() =>
      ctx.root.$vuetify.breakpoint.xsOnly
        ? 'calc(100vw * .75)'
        : 'calc(100vw * .2)'
    )

    const iconSize = computed(() => (isMobile.value ? 48 : 96))

    const myStatus = ref(null as any)

    if (process.browser) {
      (async () => {
        const res = await post<{
          status: 'OK' | 'ERROR'
          context: string
          anmeldeID?: string
          wList?: number
          type?: number
        }>('/api/confirm/' + token, {})

        myStatus.value = res

        if (res.status === 'OK') {
          loaded.value = true
          loadingStep3.value = true
          loadingStep2.value = false

          setTimeout(() => (loadingStep3.value = false), 1000)

          if (res.wList && res.wList < 0) {
            ctx.root.$router.push(
              '/anmeldung/token?error=Fehler beim Senden an API. Bitte kontaktiere uns unter app@ec-nordbund.de.'
            )
            return
          }

          if (res.type) {
            type.value = res.type
          }

          if (res.wList) {
            wList.value = res.wList
          }
          if (res.anmeldeID) {
            anmeldeID.value = res.anmeldeID
          }
        } else {
          ctx.root.$router.push('/anmeldung/token?error=' + res.context)
        }
      })()
    }

    // console.log(`isOnWarteliste ${isOnWarteliste}`)

    return {
      token,
      loadingStep2,
      loadingStep3,
      title,
      avatarSize,
      avatarMaxSize,
      iconSize,
      statusText,
      statusColor,
      isSuccessful,
      isOnWarteliste,
      anmeldeID,
      wList,
      myStatus,
      copy2clip: copy,
      type,
    }
  },
  head() {
    return {
      title: 'Anmelde-Bestätigung',
      meta: [{ hid: 'seo:index', property: 'robots', content: 'noindex' }],
    }
  },
})
</script>
<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_variables';

.anmelde-id {
  padding: 2px 4px;
  background: #ccc;

  &:hover {
    background: #aaa;
  }
}

.collapsable-square {
  display: flex;
  position: relative;
  overflow: hidden;
  max-width: 100%;

  & > .collapsable-square__sizer {
    flex: 1 0 0px;
    transition: padding-bottom 0.2s cubic-bezier(0.25, 0.8, 0.5, 1);
    padding-bottom: 100%;

    ~ .collapsable-square__content {
      flex: 1 0 0px;
      max-width: 100%;
      margin-left: -100%;
    }
  }

  & > .collapsable-square__content {
    .v-card__title {
      justify-content: center;
    }

    .absolute-flex-centered {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 48px;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .v-card__subtitle {
      text-align: center;
    }
  }

  &.collapsed-xs-only,
  &.collapsed-sm-and-down,
  &.collapsed {
    > .collapsable-square__sizer {
      padding-bottom: 0;
    }

    & > .collapsable-square__content {
      .v-card__title {
        justify-content: start;
      }

      .absolute-flex-centered {
        justify-content: end;
        top: 0;
        right: -72px;

        .v-avatar {
          justify-content: start;

          .v-icon {
            margin-left: 24px;
          }
        }
      }

      .v-card__subtitle {
        text-align: left;
      }
    }
  }

  &.collapsed-xs-only {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      > .collapsable-square__sizer {
        padding-bottom: 100%;
      }

      > .collapsable-square__content {
        .v-card__title {
          justify-content: center;
        }

        .absolute-flex-centered {
          justify-content: center;
          top: 48px;
          right: 0;

          .v-avatar {
            justify-content: center;

            .v-icon {
              margin-left: 0;
            }
          }
        }

        .v-card__subtitle {
          text-align: center;
        }
      }
    }
  }

  &.collapsed-sm-and-down {
    @media #{map-get($display-breakpoints, 'md-and-up')} {
      > .collapsable-square__sizer {
        padding-bottom: 100%;
      }

      > .collapsable-square__content {
        .v-card__title {
          justify-content: center;
        }

        .absolute-flex-centered {
          justify-content: center;
          top: 48px;
          right: 0;

          .v-avatar {
            justify-content: center;

            .v-icon {
              margin-left: 0;
            }
          }
        }

        .v-card__subtitle {
          text-align: center;
        }
      }
    }
  }
}
</style>
