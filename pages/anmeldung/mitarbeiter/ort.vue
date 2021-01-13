<template lang="pug">
  v-container
    v-card
      v-card-title
        h1 Anmeldung für Mitarbeiter im Ortsverband
      v-card-text
        v-form
          v-radio-group(v-model="data.geschlecht" required @change="geschlechtEvent" :error-messages="geschlechtErrors")
            v-radio(value="m" label="Männlich")
            v-radio(value="w" label="Weiblich")
          v-text-field(v-model="data.vorname" required label="Vorname" counter="50" @change="vornameEvent" :error-messages="vornameErrors")
          v-text-field(v-model="data.nachname" required label="Nachname" counter="50" @change="nachnameEvent" :error-messages="nachnameErrors")
          ec-datepicker(v-model="data.gebDat" label="Geburtsdatum" required gebDat :max="new Date().toISOString().substr(0, 10)" min="1950-01-01" @change="gebDatEvent" :error-messages="gebDatErrors")
          v-text-field(v-model="data.strasse" required label="Straße" counter="50" @change="strasseEvent" :error-messages="strasseErrors")
          ec-adresse(v-model="data.plzOrt" :errorMap="errorMap.plzOrt")
          v-text-field(label="E-Mail" type="email" required v-model="data.email" counter="50" @change="emailEvent" :error-messages="emailErrors")
          v-select(:items="ecKreise" v-model="data.ecKreis" required item-text="bezeichnung" item-value="ecKreisID" label="EC-Kreis / Ortsverband" @change="ecKreisEvent" :error-messages="ecKreisErrors")
          v-checkbox(required v-model="data.datenschutz" @change="datenschutzEvent" :error-messages="datenschutzErrors")
            template(v-slot:label)
              p Ich nehme zur Kenntnis, dass meine eingegebenen Daten vorerst für &nbsp;
                strong 24 Stunden&nbsp;
                | zwischengespeichert werden und mir eine&nbsp;
                strong E-Mail zur Bestätigung und Vervollständigung meiner Anmeldung&nbsp;
                | zugeschickt wird. Die Daten werden anschließend dem Veranwortlichen in meinem EC-Kreis vorgelegt und verifiziert.
                | Anschließend erhalte ich erneut eine E-Mail. Dieser Vorgang kann einige Tage aber normalerweise nicht mehr als 2 Wochen dauern.
          v-checkbox(required label="Ich bestätige, dass ich ein Mitarbeiter in einem EC-Kreis bin." v-model="data.isMA" @change="isMAEvent" :error-messages="isMAErrors")
        v-card-actions
          v-spacer
          v-btn(@click="submit" :disabled="!valid") Absenden
</template>
<script>
import { defineComponent, ref, reactive } from '@nuxtjs/composition-api'
import { ruleLib, useValidation } from '../../../plugins/validate'
import { post } from '~/helpers/fetch'
export default defineComponent({
  setup() {
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
      ecKreis: -1,
      datenschutz: false,
      isMA: false,
    })
    const ecKreise = ref([])
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
        ecKreis: data.ecKreis,
      }
      post('/api/anmeldung/ort', submitData)
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
        ecKreis: ruleLib.ecKreis,
        isMA: ruleLib.isMA,
      },
      [
        'vorname',
        'nachname',
        'geschlecht',
        'gebDat',
        'strasse',
        'email',
        'datenschutz',
        'ecKreis',
        'isMA',
      ]
    )
    return {
      ...validation,
      ...validation.rootMapper,
      data,
      ecKreise,
      submit,
    }
  },
})
</script>
