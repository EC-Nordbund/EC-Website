<template lang="pug">
  v-dialog(
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  )
    template( v-slot:activator="{ on, attrs }")
      v-text-field(
        v-model="formatedDate"
        readonly
        v-bind="{ max: maxDate, min: minDate, ...attrs, ...$attrs }"
        v-on="on"
        clearable
        @click:clear="clear"
      )
    v-date-picker(
      v-model="date"
      :active-picker.sync="activePicker"
      no-title
      @input="menu = false"
    )
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  Ref,
  watchEffect,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    isBirthdayPicker: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input'],
  setup: (props, { emit }) => {
    const menu = ref(false)
    const date: Ref<string> = ref('')
    const activePicker = ref()

    const formatedDate = computed(() => formatDate(date.value))

    const maxDate = computed(() => {
      if (props.isBirthdayPicker) {
        // today
        return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      }

      return undefined
    })

    const minDate = computed(() =>
      props.isBirthdayPicker ? '1950-01-01' : undefined
    )

    watchEffect(() => {
      if (menu.value && props.isBirthdayPicker) {
        setTimeout(() => (activePicker.value = 'YEAR'))
      }
    })

    watchEffect(function () {
      return emit('input', date.value)
    })

    function formatDate(date: string) {
      if (!date) return ''

      return date.split('-').reverse().join('.')
    }

    function parseDate(date: string) {
      if (!date) return null

      return date.split('.').reverse().join('-')
    }

    function clear() {
      menu.value = true
      date.value = ''
    }

    return {
      menu,
      date,
      formatedDate,
      parseDate,
      maxDate,
      minDate,
      activePicker,
      clear
    }
  },
})
</script>