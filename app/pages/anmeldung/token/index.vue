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
<script setup lang="ts">
import { computed, ref } from 'vue'

definePageMeta({ layout: 'minimal' })
useSeoMeta({ robots: 'noindex' })

const route = useRoute()
const router = useRouter()

const token = ref('')
const error = computed(() => route.query.error)

const verify = () => router.push(`/anmeldung/token/${token.value}`)
</script>
