<template lang="pug">
  v-dialog(v-model="menu" :close-on-content-click="false" max-width="290" open-on-focus)
    template(v-slot:activator="{ on }")
      v-text-field(
        :value="germanDate"
        readonly
        v-bind="$attrs"
        v-on="on"
      )
    v-date-picker(
      ref="picker"
      :value="value"
      v-bind="$attrs"
      @change="changeDate"
    )
</template>
<script lang="js">
import {
  defineComponent,
  ref,
  computed,
  watch,
  toRefs,
} from '@nuxtjs/composition-api'

function handleGebDat(gebDat, menu) {
  let firstTime = true
  let watcher
  const picker = ref()

  function watchHandler() {
    if (watcher) {
      watcher()
      watcher = null
    }

    if (gebDat.value) {
      watcher = watch(menu, () => {
        if (menu.value && firstTime) {
          setTimeout(() => {
            picker.value.activePicker = 'YEAR'
          })
          firstTime = false
        }
      })
    }
  }

  watch(gebDat, watchHandler)
  watchHandler()

  return { picker }
}

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    gebDat: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const menu = ref(false)

    const picker = handleGebDat(toRefs(props).gebDat, menu)

    const changeDate = (date) => {
      emit('input', date)
    }

    const germanDate = computed(() => {
      return props.value.split('-').reverse().join('.')
    })

    return {
      menu,
      germanDate,
      changeDate,
      picker,
    }
  },
})
</script>
