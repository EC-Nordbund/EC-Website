<template lang="pug">
v-timeline(:density="dense ? 'compact' : 'default'")
  v-timeline-item(
    v-for='preis in myPreise',
    :key='preis.preis',
    size='small',
    :fill-dot='fillDot',
    :dot-color="preis.active ? 'primary' : dotColor"
  )
    template(#opposite)
      span {{ subtitle(preis) }}
    v-card(rounded='0', :class="{ 'elevation-5': preis.active }")
      v-card-title.ec-gradient.text-white.pb-2.pt-3(:class="{ 'font-weight-bold': preis.active }") {{ preis.label }}
      v-card-text.py-3
        p.text-center.text-h4.font-weight-light.mb-0(:class="{ 'font-weight-bold text-primary': preis.active }") {{ preis.preis }} EUR
        p.d-sm-none.text-right {{ subtitle(preis) }}
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, shallowRef } from 'vue'
import type { PropType, Ref } from 'vue'
import { useDisplay } from 'vuetify'

interface Preis {
  label?: string
  preis?: number | string
  begin?: string
  ende?: string
}

// TODO: display alerts when the next category is in a few days
export default defineComponent({
  props: {
    // ungenutzt (wie im Alt-Stand), gehört aber zum Prop-Vertrag der Aufrufer
    anzahlung: {
      type: [Number, Boolean],
      default: 0,
    },
    preise: {
      type: Array as PropType<Preis[]>,
      default: () => [],
    },
    // choose from: `xsOnly`, `smAndDown`, `smAndUp`, `mdAndDown`, ... , `xlOnly`
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
      default: undefined,
    },
  },
  setup(props) {
    const display = useDisplay()

    // Alt: ctx.root.$vuetify.breakpoint[denseBreakpoint]. In Vuetify 4 heißen
    // die alten `*Only`-Keys schlicht `xs`/`sm`/…/`xl` — Prop-Vertrag bleibt.
    // SSR-Gate: beim Prerender ist die Breite 0 (xs wäre true) und Vuetify 4
    // rendert bei density=compact den opposite-Slot GAR NICHT ins DOM — die
    // "ab dem …"-Angaben fehlten dann im statischen HTML (Alt hatte sie immer
    // im DOM und versteckte sie nur per CSS). Daher erst nach mount dense.
    const isMounted = shallowRef(false)
    onMounted(() => {
      isMounted.value = true
    })
    const dense = computed(() => {
      if (!isMounted.value) return false
      const key = props.denseBreakpoint.replace(/Only$/, '')
      const flag = (display as unknown as Record<string, Ref<boolean> | undefined>)[key]
      return flag?.value || false
    })

    const subtitle = (preis: Preis) => {
      if (preis.begin) {
        return `ab dem ${preis.begin.split('T')[0]!.split('-').reverse().join('.')}`
      } else if (preis.ende) {
        return `bis zum ${preis.ende.split('T')[0]!.split('-').reverse().join('.')}`
      }
      return ''
    }

    // Alt-Code mutierte die Prop-Objekte (v.active = …) — jetzt Kopien.
    const myPreise = computed(() => {
      let hadActive = false
      const nowStr = new Date().toISOString().split('T')[0]!

      return props.preise.map((v, i) => {
        if (hadActive) {
          return { ...v, active: false }
        }

        if ((v.begin && v.begin > nowStr) || (v.ende && v.ende < nowStr)) {
          return { ...v, active: false }
        }

        if (!v.begin && !v.ende) {
          const next = props.preise[i + 1]
          if (
            next &&
            ((next.begin && next.begin > nowStr) ||
              (next.ende && next.ende < nowStr))
          ) {
            return { ...v, active: false }
          }
        }

        hadActive = true
        return { ...v, active: true }
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
