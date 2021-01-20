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
  useContext,
  ref,
  computed,
} from '@nuxtjs/composition-api'
export default defineComponent({
  layout: 'minimal',
  setup(_, vueCtx) {
    const token = ref('')
    const ctx = useContext()
    const error = computed(() => ctx.query.value.error)

    return {
      token,
      error,
      verify: () => vueCtx.root.$router.push(`/anmeldung/token/${token.value}`),
    }
  },
  head() {
    return {
      meta: [{ hid: 'seo:index', property: 'robots', content: 'noindex' }],
    }
  },
})
</script>
