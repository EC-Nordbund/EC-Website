<template lang="pug">
div(style='display: grid; grid-template-columns: 1fr 5fr; grid-gap: 10px')
  v-autocomplete(
    required,
    label='PLZ',
    :items='plzs',
    :model-value='localState.plz',
    :loading='!plzs',
    @update:model-value='plzChange',
    :error-messages='plzErrors'
  )
  v-select(
    required,
    label='Ort',
    :disabled='!localState.plz',
    :items='orte',
    :model-value='localState.ort',
    @update:model-value='ortChange',
    :error-messages='ortErrors'
  )
</template>
<script setup>
import { reactive, ref, watchEffect, onMounted } from 'vue'
import { mapper } from '~/composables/validate'
import { get } from '~/helpers/fetch'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  errorMap: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const orte = ref([])
const plzs = ref([])

onMounted(() =>
  get('https://plz.ec-nordbund.de/plz.json').then((d) => (plzs.value = d)),
)

const localState = reactive({
  plz: '',
  ort: '',
})

watchEffect(() => {
  localState.plz = props.modelValue.plz
  localState.ort = props.modelValue.ort
})

const { plzEvent, plzErrors, ortEvent, ortErrors } = mapper(
  localState,
  props.errorMap,
  ['plz', 'ort'],
)

// Kopie emittieren statt des reaktiven localState-Objekts selbst
// (Vue-2-Code emittete die Referenz; Ergebnis ist identisch, da nach jeder
// Mutation erneut emittiert wird)
const emitState = () => emit('update:modelValue', { ...localState })

const ortChange = (ort) => {
  localState.ort = ort
  ortEvent()

  emitState()
}

const plzChange = async (plz) => {
  localState.plz = plz
  localState.ort = ''
  plzEvent()
  emitState()

  const orteForPLZ = await get(`https://plz.ec-nordbund.de/${plz}.json`)

  if (orteForPLZ.length === 1) {
    orte.value = orteForPLZ
    localState.ort = orteForPLZ[0]
    ortEvent()
  } else {
    orte.value = orteForPLZ
  }
  emitState()
}
</script>
