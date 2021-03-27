<template lang="pug">
div(style='display: grid; grid-template-columns: 1fr 5fr; grid-gap: 10px')
  v-autocomplete(
    required,
    label='PLZ',
    :items='plzs',
    @input='plzChange',
    :value='localState.plz',
    :loading='!plzs',
    @change='plzEvent',
    :error-messages='plzErrors'
  )
  v-select(
    required,
    label='Ort',
    :disabled='!localState.plz',
    :items='orte',
    :value='localState.ort',
    @input='ortChange',
    @change='ortEvent',
    :error-messages='ortErrors'
  )
</template>
<script>
import {
  defineComponent,
  reactive,
  ref,
  watchEffect,
  onMounted,
} from '@nuxtjs/composition-api'
import { mapper } from '../plugins/validate'
import { get } from '~/helpers/fetch'

export default defineComponent({
  props: {
    value: {
      type: Object,
      required: true,
    },
    errorMap: {
      type: Object,
      required: true,
    },
  },
  setup(props, ctx) {
    const orte = ref([])
    const plzs = ref([])

    onMounted(() =>
      get('https://plz.ec-nordbund.de/plz.json').then((d) => (plzs.value = d))
    )

    const localState = reactive({
      plz: '',
      ort: '',
    })

    watchEffect(() => {
      localState.plz = props.value.plz
      localState.ort = props.value.ort
    })

    const ortChange = (ort) => {
      localState.ort = ort

      ctx.emit('input', localState)
    }

    const plzChange = async (plz) => {
      localState.plz = plz
      localState.ort = ''
      ctx.emit('input', localState)

      const orteForPLZ = await get(`https://plz.ec-nordbund.de/${plz}.json`)

      if (orteForPLZ.length === 1) {
        orte.value = orteForPLZ
        localState.ort = orteForPLZ[0]
        errorData.ortEvent()
      } else {
        orte.value = orteForPLZ
      }
      ctx.emit('input', localState)
    }

    const errorData = mapper(localState, props.errorMap, ['plz', 'ort'])

    return {
      plzs,
      orte,
      ortChange,
      plzChange,
      localState,
      ...errorData,
    }
  },
})
</script>
