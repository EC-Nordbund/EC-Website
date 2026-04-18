<template lang="pug">
.d-flex.flex-column.justify-center.align-center.fill-height
  v-container
    v-row.justify-center
      v-col(cols=12, sm='10')
        //- v-card
        //-   v-card-title
        h1
          //- v-card-text
        v-alert(type='error', v-if='error')
          p {{ error }}
            br
            | Bitte probiere es erneut! - Bei weiteren Problemen melde uns diese bitte. Antworte dafür einfach auf die Bestätigungsmail.
        p Bitte gebe den Verifizierungscode ein. Du kannst aber auch einfach den Link aus der E-Mail verwenden.
        v-text-field(label='Verifizierungscode', v-model='token')
        //- v-card-actions
        //- v-spacer
        v-btn(@click='verify') Verifizieren
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
} from 'vue'
export default defineComponent({
  setup() {
    definePageMeta({ layout: 'minimal' })

    const token = ref('')
    const route = useRoute()
    const router = useRouter()
    const error = computed(() => route.query.error)

    useHead({
      meta: [{ property: 'robots', content: 'noindex' }],
    })

    return {
      token,
      error,
      verify: () => router.push(`/anmeldung/token/${token.value}`),
    }
  },
})
</script>
