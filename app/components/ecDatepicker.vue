<template lang="pug">
v-dialog(v-model='menu', transition='scale-transition', width='auto')
  template(#activator='{ props: activatorProps }')
    v-text-field(
      :model-value='formatedDate',
      readonly,
      v-bind='{ ...activatorProps, ...$attrs }',
      clearable,
      @click:clear='clear'
    )
  v-date-picker(
    :model-value='date',
    v-model:view-mode='viewMode',
    :min='minDate',
    :max='maxDate',
    hide-header,
    @update:model-value='select'
  )
</template>
<script lang="ts">
// Benannter Export neben <script setup>: wird auch von Formular-Seiten importiert
export function formatDate(date: string | null | undefined) {
  if (!date) return ''

  return date.split('-').reverse().join('.')
}
</script>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  isBirthdayPicker: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const menu = ref(false)
const viewMode = ref<'month' | 'months' | 'year'>('month')

// Nach außen ist das Model ein ISO-String (YYYY-MM-DD), der Vuetify-4-Picker
// arbeitet intern mit Date-Objekten.
const date = computed(() => {
  if (!props.modelValue) return null

  const [year, month, day] = props.modelValue.split('-').map(Number)
  return new Date(year!, month! - 1, day!)
})

const formatedDate = computed(() => formatDate(props.modelValue))

function toISO(value: Date): string {
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const day = `${value.getDate()}`.padStart(2, '0')
  return `${value.getFullYear()}-${month}-${day}`
}

const maxDate = computed(() => {
  if (props.isBirthdayPicker) {
    // today
    return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10)
  }

  return undefined
})

const minDate = computed(() =>
  props.isBirthdayPicker ? '1950-01-01' : undefined,
)

watch(menu, (open) => {
  if (open) {
    // Birthday-Modus startet in der Jahresansicht
    viewMode.value = props.isBirthdayPicker ? 'year' : 'month'
  }
})

function select(value: unknown) {
  if (value instanceof Date) {
    emit('update:modelValue', toISO(value))
  }
  menu.value = false
}

function clear() {
  menu.value = true
  emit('update:modelValue', '')
}
</script>
