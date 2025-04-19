<template lang="pug">
  v-timeline(:dense="dense")
    v-timeline-item(v-for="preis in myPreise" :key="preis.preis" small :fill-dot="fillDot" :color="preis.active ? 'primary' : dotColor") 
      span(slot="opposite") {{subtitle(preis)}}
      v-card(tile :class="{'elevation-5': preis.active}")
        v-card-title(class="ec-gradient white--text pb-2 pt-3" :class="{'font-weight-bold': preis.active}") {{preis.label}}
        v-card-text(class="py-3")
          p(class="text-center text-h4 font-weight-light mb-0" :class="{'font-weight-bold primary--text': preis.active}") {{preis.preis}} EUR
          p(class="hidden-sm-and-up text-right") {{subtitle(preis)}}
</template>
<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
// TODO: highlight current price
// TODO: display alerts when the next category is in a few days
export default defineComponent({
  props: {
    anzahlung: {
      type: [Number,  Boolean],
      default: 0
    },
    preise: {
      type: Array,
      default: [],
    },
    // choose from: `xsOny`, `smAndDown`, `smAndUp`, `mdAndDown`, ... , `xlOnly`
    denseBreakpoint: {
      type: String,
      required: true,
    },
    fillDot: {
      type: Boolean,
      default: false,
    },
    dotColor: {
      type: String,
      required: false,
    },
  },
  setup(props, ctx) {
    const dense = computed(
      // @ts-expect-error
      () => ctx.root.$vuetify.breakpoint[props.denseBreakpoint] || false
    )

    const subtitle = (preis: { begin: string; ende: string }) => {
      if (preis.begin) {
        return `ab dem ${preis.begin.split('T')[0].split('-').reverse().join('.')}`
      } else if (preis.ende) {
        return `bis zum ${preis.ende.split('T')[0].split('-').reverse().join('.')}`
      }
      return ''
    }

    const myPreise = computed(() => {
      let hadActive = false

      return props.preise.map((v: any, i) => {
        v.active = false
        const nowStr = new Date().toISOString().split('T')[0]

        if (hadActive) {
          return v
        } else {
          if ((v.begin && v.begin > nowStr) || (v.ende && v.ende < nowStr)) {
            return v
          }

          if (!v.begin && !v.ende) {
            const next: any = props.preise[i + 1]
            if (
              next &&
              ((next.begin && next.begin > nowStr) ||
                (next.ende && next.ende < nowStr))
            ) {
              return v
            }
          }

          hadActive = true

          v.active = true
          return v
        }
      })
    })

    return {
      dense,
      subtitle,
      myPreise,
    }
  },
})
</script>
