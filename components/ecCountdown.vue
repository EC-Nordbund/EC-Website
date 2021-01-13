<template lang="pug">
  div(class="ec-countdown")
    //- days
    div(v-if="(days > 0 || keepZeros)" class="counter-days")
      slot(name="digits" :digits="formatDigits(days)")
        span(class="digits") {{formatDigits(days)}}

      slot(name="units" :unit="dayLabel" v-if="!hideUnits")
        span(class="unit") {{dayLabel}}

    //- hours
    div(v-if="(days > 0 || hours > 0 || keepZeros)" class="counter-hours")
      slot(name="digits" :digits="formatDigits(hours)")
        span(class="digits") {{formatDigits(hours)}}

      slot(name="units" :unit="hourLabel" v-if="!hideUnits")
        span(class="unit") {{hourLabel}}

    //- minute
    div(v-if="(days > 0 || hours > 0 || minutes > 0 || keepZeros)" class="counter-minutes")
      slot(name="digits" :digits="formatDigits(minutes)")
        span(class="digits") {{formatDigits(minutes)}}

      slot(name="units" :unit="minuteLabel" v-if="!hideUnits")
        span(class="unit") {{minuteLabel}}

    //- seconds
    div(class="counter-seconds")
      slot(name="digits" :digits="formatDigits(seconds)")
        span(class="digits") {{formatDigits(seconds)}}

      slot(name="units" :unit="secondLabel" v-if="!hideUnits")
        span(class="unit") {{secondLabel}}

</template>
<script>
import {
  defineComponent,
  computed,
  onMounted,
  onUnmounted,
  watchEffect,
  ref,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    target: String,
    keepZeros: {
      type: Boolean,
      default: false,
    },
    hideUnits: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const now = ref(null)
    now.value = new Date()
    const target = new Date(props.target)
    const diff = computed(() =>
      Math.trunc((target.getTime() - now.value.getTime()) / 1000)
    )
    const days = computed(() =>
      Math.max(Math.trunc(diff.value / 60 / 60 / 24), 0)
    )
    const hours = computed(() =>
      Math.max(Math.trunc(diff.value / 60 / 60) % 24, 0)
    )
    const minutes = computed(() =>
      Math.max(Math.trunc(diff.value / 60) % 60, 0)
    )
    const seconds = computed(() => Math.max(Math.trunc(diff.value) % 60, 0))

    const dayLabel = computed(() => (days.value !== 1 ? 'Tagen' : 'Tag'))
    const hourLabel = computed(() => (hours.value !== 1 ? 'Stunden' : 'Stunde'))
    const minuteLabel = computed(() =>
      minutes.value !== 1 ? 'Minuten' : 'Minute'
    )
    const secondLabel = computed(() =>
      seconds.value !== 1 ? 'Sekunden' : 'Sekunde'
    )

    const ended = computed(() => diff.value < 0)

    let inter = null

    onUnmounted(() => clearInterval(inter))
    onMounted(() => {
      if (!ended.value) {
        inter = setInterval(() => {
          now.value = new Date()
        }, 500)

        watchEffect(() => {
          if (ended.value) {
            window.location.reload()
          }
        })
      }
    })

    const formatDigits = (value) => {
      if (value.toString().length <= 1) {
        return '0' + value.toString()
      }
      return value.toString()
    }

    return {
      days,
      formatDigits,
      hours,
      minutes,
      seconds,
      dayLabel,
      hourLabel,
      minuteLabel,
      secondLabel,
    }
  },
})
</script>
<style lang="scss" scoped>
.ec-countdown {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  > div {
    padding: 0 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.digits {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 4px;
}

.unit {
  text-transform: uppercase;
  font-size: 12px;
}
</style>
