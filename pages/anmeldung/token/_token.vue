<template lang="pug">
v-container.fill-height
  v-row(no-gutters, justify='center')
    v-col(cols='12')
      v-row
        v-col
          h1.text-center.py-4 {{ title }}
          v-progress-linear.hidden-sm-and-down(
            :value='progress',
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
            :loading='state == State.CONFIRMING',
            tile,
            :color='statusColor',
            :flat='hasResponse',
            :outlined='!hasResponse',
            loader-height='6'
          )
            .collapsable-square(:class='{ "collapsed-xs-only": state != State.INITIAL }')
              .collapsable-square__sizer
              .collapsable-square__content
                .d-flex.flex-column.justify-space-between.fill-height
                  div
                    v-card-title.py-4
                      h5.text-h5.font-weight-black 2. Schritt

                    v-card-subtitle.py-1
                      | {{ statusText }}

                  .absolute-flex-centered
                    v-btn(v-if='state == State.INITIAL' color="primary" rounded @click='confirmAction' depressed large :class='{"pulsing-animation": state == State.INITIAL}')
                      .text-button.font-weight-bold Bestätigen
                    v-avatar(
                      v-else-if='state != State.CONFIRMING',
                      :max-height='avatarMaxSize',
                      :max-width='avatarMaxSize',
                      :size='avatarSize',
                      color='rgba(255,255,255,0.16)'
                    )
                      .text-h3.font-weight-bold.white--text(
                        v-if='state == State.ON_WAITINGLIST'
                      ) {{ wList }}
                      v-icon(v-else, color='white', size='96') {{ state == State.ON_WAITINGLIST ? 'mdi-clipboard-list' : 'mdi-check-all' }}

                  v-card-text.text-body-1.font-weight-medium(
                    v-if='hasResponse && anmeldeID'
                  )
                    .text-caption.text-left(v-if='state == State.SUCCESSFUL && anmeldeID') Dein Anmelde-Code:
                      pre.text-body-2.text-center.anmelde-id(
                        @click='copy2clip(anmeldeID)'
                      ) {{ anmeldeID }}
                    .text-center(v-else-if='state == State.ON_WAITINGLIST') Dein Wartelistenplatz

        //- 3. Schritt
        v-col(cols='12', sm='6', md='4')
          v-card#third-step.fill-height(
            tile,
            outlined,
            disabled,
            :loading='false'
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
                template(v-if='hasResponse')
                  //- Normale Veranstalungs-Anmeldung
                  template(v-if='!isFührungszeugnis')
                    //- successful
                    v-row(v-if='state == State.SUCCESSFUL || state == State.ALREADY_SUCCESSFUL', no-gutters, align='center')
                      v-col(cols='3', align='center')
                        v-avatar(size='42', color='success')
                          v-icon(size='24', color='white') mdi-email
                      v-col.text-body-2(cols='9') Du erhälst von uns innerhalb von 4 Wochen eine Buchungsbestätigung per Mail.

                      v-col(cols='3', align='center')
                        v-avatar(size='42', color='success')
                          v-icon(size='24', color='white') mdi-handshake
                      v-col.text-body-2(cols='9') Du überweist ggf. die nötige Anzahlung

                    //- warteliste
                    v-row(
                      v-else-if='state == State.ON_WAITINGLIST',
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
                  //- Führungszeugnis bestätigung
                  template(v-else)
                    //- successful
                    v-row(v-if='state == State.SUCCESSFUL', no-gutters, align='center')
                      v-col(cols='3', align='center')
                        v-avatar(size='42', color='success')
                          v-icon(size='24', color='white') mdi-email
                      v-col.text-body-2(cols='9') Du erhältst von uns - wenn benötigt - in den nächsten 5 Min einen Antrag auf ein erweiteres Führungszeugnis.

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
                        | Wir wissen dadurch dann, was zu tun ist.
            v-responsive(aspect-ratio='4')
</template>
<script lang="ts">
import { defineComponent, useContext, ref, computed } from "@nuxtjs/composition-api";
import { post } from "~/helpers/fetch";
import copy from "~/helpers/copy";

enum State {
  // initialer zustand
  INITIAL,
  // sobald nutzer anmeldung bestätigt hat
  CONFIRMING,
  // wenn API mit Wartelistenplatz antwortet
  ON_WAITINGLIST,
  // wenn API erfolgreiche Anmeldung zurück gibt.
  SUCCESSFUL,
  // wenn die Anmeldung bereit schon bestätigt wurde
  ALREADY_SUCCESSFUL
}

export default defineComponent({
  layout: "minimal",
  setup(_, ctx) {
    const token = useContext().params.value.token;
    const state = ref(State.INITIAL);
    const anmeldeID = ref(null as null | string);
    const wartelistenPlatz = ref(0);

    const isFührungszeugnis = ref(false)
    const isMobile = computed(() => ctx.root.$vuetify.breakpoint.smAndDown);
    const isSuccessful = computed(() => wartelistenPlatz.value === 0);
    const hasResponse = computed(() => state.value == State.ON_WAITINGLIST || state.value == State.SUCCESSFUL || state.value == State.ALREADY_SUCCESSFUL)

    const title = computed(() => {
      switch (state.value) {
        case State.INITIAL:
        case State.CONFIRMING:
          return "Du hast es gleich geschafft!";
        case State.ON_WAITINGLIST:
          return "Du bist auf der Warteliste...";
        case State.SUCCESSFUL:
          return "Du bist angemeldet!";
        case State.ALREADY_SUCCESSFUL:
          return "Du bist bereits angemeldet!";
        default:
          return "Oops: Da hat etwas nicht geklappt!";
      }
    });

    const statusText = computed(() => {
      switch (state.value) {
        case State.INITIAL:
          return "Klicke hier um deine Anmeldung zu bestätigen:";
        case State.CONFIRMING:
          return "Anmeldung wird bestätigt...";
        case State.ON_WAITINGLIST:
          return "Veranstaltung bereits voll!";
        case State.SUCCESSFUL:
        case State.ALREADY_SUCCESSFUL:
          return "Anmeldung bestätigt";
        default:
          return "Es ist ein Fehler aufgetreten";
      }
    });

    const statusColor = computed(() => {
      switch (state.value) {
        case State.INITIAL:
        case State.CONFIRMING:
          return undefined;
        case State.ON_WAITINGLIST:
          return "warning";
        case State.SUCCESSFUL:
        case State.ALREADY_SUCCESSFUL:
          return "success";
        default:
          return "error";
      }
    });

    const progress = computed(() => {
      switch (state.value) {
        case State.CONFIRMING:
          return 44;
        case State.ON_WAITINGLIST:
        case State.SUCCESSFUL:
        case State.ALREADY_SUCCESSFUL:
          return 66;
        case State.INITIAL:
        default:
          return 33
      }
    })

    const avatarSize = computed(() => (isMobile.value ? 160 : 128));

    const avatarMaxSize = computed(() =>
      ctx.root.$vuetify.breakpoint.xsOnly ? "calc(100vw * .75)" : "calc(100vw * .2)"
    );

    const iconSize = computed(() => (isMobile.value ? 48 : 96));

    const myStatus = ref(null as any);

    const confirmAction = async () => {
      state.value = State.CONFIRMING

      if (process.browser) {
        const res = await post<{
          status: "OK" | "ERROR";
          context: string;
          anmeldeID?: string;
          wList?: number;
          type?: number;
        }>("/confirm/" + token, {});

        myStatus.value = res;

        if (res.status === "OK") {

          if (res.wList && res.wList < 0) {
            ctx.root.$router.push(
              "/anmeldung/token?error=Fehler beim Senden an API. Bitte kontaktiere uns unter app@ec-nordbund.de."
            );
            return;
          }

          // Token für Führungszeugnis
          if (res.type && res.type != 1) {
            isFührungszeugnis.value = true
          }

          // setze Wartlistenplatz
          if (res.wList) {
            wartelistenPlatz.value = res.wList;
          }

          // setze AnmeldeID
          if (res.anmeldeID) {
            anmeldeID.value = res.anmeldeID;
          }

          // mit delay zum nächsten state
          setTimeout(() => {
            if (wartelistenPlatz.value > 0) {
              state.value = State.ON_WAITINGLIST
            } else {
              state.value = State.SUCCESSFUL
            }
          }, 1000);

        } else {
          console.log(res)
          setTimeout(() => {
            // behandle bereits bestätigte anmeldunge nicht als Fehler
            if (res.context == "Anmeldung bereits bestätigt.") {
              state.value = State.ALREADY_SUCCESSFUL
            } else {
              ctx.root.$router.push("/anmeldung/token?error=" + res.context);
            }
          }, 333)
        }
      }
    };

    // console.log(`isOnWarteliste ${isOnWarteliste}`)

    return {
      token,
      confirmAction,
      state,
      State,
      hasResponse,
      progress,
      title,
      avatarSize,
      avatarMaxSize,
      iconSize,
      statusText,
      statusColor,
      isSuccessful,
      anmeldeID,
      wartelistenPlatz,
      myStatus,
      copy2clip: copy,
    };
  },
  head() {
    return {
      title: "Anmelde-Bestätigung",
      meta: [{ hid: "seo:index", property: "robots", content: "noindex" }],
    };
  },
});
</script>
<style lang="scss" scoped>
@import "~vuetify/src/styles/settings/_variables";

.anmelde-id {
  padding: 2px 4px;
  background: #ccc;

  &:hover {
    background: #aaa;
  }
}

.pulsing-animation {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
  }

  100% {
    box-shadow: 0 0 0 1em rgba(0, 0, 0, 0);
  }
}

.collapsable-square {
  display: flex;
  position: relative;
  overflow: hidden;
  max-width: 100%;

  &>.collapsable-square__sizer {
    flex: 1 0 0px;
    transition: padding-bottom 0.2s cubic-bezier(0.25, 0.8, 0.5, 1);
    padding-bottom: 100%;

    ~.collapsable-square__content {
      flex: 1 0 0px;
      max-width: 100%;
      margin-left: -100%;
    }
  }

  &>.collapsable-square__content {
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
    >.collapsable-square__sizer {
      padding-bottom: 0;
    }

    &>.collapsable-square__content {
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
      >.collapsable-square__sizer {
        padding-bottom: 100%;
      }

      >.collapsable-square__content {
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
      >.collapsable-square__sizer {
        padding-bottom: 100%;
      }

      >.collapsable-square__content {
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
