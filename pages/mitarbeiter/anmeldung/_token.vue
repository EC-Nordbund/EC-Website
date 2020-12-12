<template lang="pug">
v-container.page-wrapper
  v-form(@submit='submit', autocomplete='off')
    v-radio-group(
      v-model='data.geschlecht',
      required,
      @change='geschlechtEvent',
      :error-messages='geschlechtErrors'
    )
      v-radio(value='m', label='Männlich')
      v-radio(value='w', label='Weiblich')
    v-text-field(
      v-model='data.vorname',
      required,
      label='Vorname',
      counter='50',
      @change='vornameEvent',
      :error-messages='vornameErrors'
    )
    v-text-field(
      v-model='data.nachname',
      required,
      label='Nachname',
      counter='50',
      @change='nachnameEvent',
      :error-messages='nachnameErrors'
    )
    ec-datepicker(
      v-model='data.gebDat',
      label='Geburtsdatum',
      required,
      gebDat,
      :max='new Date().toISOString().substr(0, 10)',
      min='1950-01-01',
      @change='gebDatEvent',
      :error-messages='gebDatErrors'
    )
    v-text-field(
      v-model='data.strasse',
      required,
      label='Straße',
      counter='50',
      @change='strasseEvent',
      :error-messages='strasseErrors'
    )
    ec-adresse(v-model='data.plzOrt', :errorMap='errorMap.plzOrt')
    v-text-field(
      label='E-Mail',
      type='email',
      required,
      v-model='data.email',
      counter='50',
      @change='emailEvent',
      :error-messages='emailErrors'
    )
    v-text-field(
      label='Telefon',
      type='telefon',
      required,
      v-model='data.telefon',
      @input='telefonEvent',
      :error-messages='telefonErrors'
    )
    v-checkbox(
      label='Ich möchte vegetarisches Essen',
      v-model='data.vegetarisch'
    )
    v-textarea(
      label='Lebensmittelallergien',
      v-model='data.lebensmittelallergien',
      counter='250',
      @change='lebensmittelallergienEvent',
      :error-messages='lebensmittelallergienErrors'
    )
    v-textarea(
      label='Bemerkungen',
      v-model='data.bemerkungen',
      counter='250',
      @change='bemerkungenEvent',
      :error-messages='bemerkungenErrors'
    )
    v-checkbox(
      required,
      v-model='data.datenschutz',
      @change='datenschutzEvent',
      :error-messages='datenschutzErrors'
    )
      template(v-slot:label)
        p Ich nehme zur Kenntnis, dass meine eingegebenen Daten vorerst für &nbsp;
          strong 24 Stunden&nbsp;
          | zwischengespeichert werden und mir eine&nbsp;
          strong E-Mail zur Bestätigung und Vervollständigung meiner Anmeldung&nbsp;
          | zugeschickt wird.
  v-row(no-gutters, justify='end')
    v-btn.align-self-end(
      @click='submit',
      :disabled='!valid',
      color='primary',
      depressed,
      tile
    ) Absenden
</template>
<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api'
import { post } from '~/helpers/fetch'
import { ruleLib, useValidation } from '../../../plugins/validate'

export default defineComponent({
  setup(_props, ctx) {
    const data = reactive({
      vorname: '',
      nachname: '',
      gebDat: '',
      geschlecht: '',
      strasse: '',
      plzOrt: {
        plz: '',
        ort: '',
      },
      email: '',
      telefon: '',
      vegetarisch: false,
      lebensmittelallergien: '',
      bemerkungen: '',
      datenschutz: false,
    })
    const submit = () => {
      const submitData = {
        vorname: data.vorname,
        nachname: data.nachname,
        gebDat: data.gebDat,
        geschlecht: data.geschlecht,
        strasse: data.strasse,
        plz: data.plzOrt.plz,
        ort: data.plzOrt.ort,
        email: data.email,
        telefon: data.telefon,
        vegetarisch: data.vegetarisch,
        lebensmittelallergien: data.lebensmittelallergien,
        bemerkungen: data.bemerkungen,
        token: ctx.parent?.$route.params.token,
      }
      post('/api/anmeldung/ma/veranstaltung', submitData)
    }
    const validation = useValidation(
      data,
      {
        vorname: ruleLib.vorname,
        nachname: ruleLib.nachname,
        geschlecht: ruleLib.geschlecht,
        gebDat: ruleLib.gebDat,
        strasse: ruleLib.strasse,
        plzOrt: {
          plz: ruleLib.plz,
          ort: ruleLib.ort,
        },
        email: ruleLib.email,
        datenschutz: ruleLib.datenschutz,
        telefon: ruleLib.telefon,
        lebensmittelallergien: ruleLib.textArea250,
        bemerkungen: ruleLib.textArea250,
      },
      [
        'vorname',
        'nachname',
        'geschlecht',
        'gebDat',
        'strasse',
        'email',
        'datenschutz',
        'telefon',
        'lebensmittelallergien',
        'bemerkungen',
      ]
    )
    return {
      ...validation.rootMapper,
      ...validation,
      data,
      submit,
    }
  },
})
</script>
