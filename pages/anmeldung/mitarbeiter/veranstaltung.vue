<template lang="pug">
v-container.page-wrapper
  v-card
    v-card-title
      h1 Anmeldung für Veranstaltung - Mitarbeiter
    v-card-text
      v-alert(type='error', v-if='!valid')
        | Das angegebene Passwort ist nicht korrekt. Bitte überprüfe deine Eingabe!
      v-form
        v-text-field(
          label='Passwort',
          hint='Gebe das Passwort das du von deinem Veranstaltungsleiter erhalten hast.',
          v-model='password'
        )
        v-btn(@click='submit', variant='primary') Absenden
</template>
<script>
import { post } from '~/helpers/fetch'

export default {
  data: () => ({
    password: '',
    valid: true,
  }),
  created() {
    if (this.$route.query.notvalid !== undefined) {
      this.valid = false
    }
  },
  methods: {
    async submit() {
      // console.log('start submitt')
      const valid = (
        await post('/api/anmeldung/ma/checkToken', {
          token: this.password,
        })
      ).ok

      // console.log(valid)

      if (valid) {
        this.$router.push({
          path: `/anmeldung/mitarbeiter/${this.password}`,
        })
      } else {
        this.valid = false
      }
    },
  },
}
</script>
