<template lang="pug">
v-container.page-wrapper
  v-form(@submit='submit', autocomplete='off', v-if='!success')
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
    template(v-if='!ort')
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
    v-alert(type='error', v-if='error')
      p Es sind folgende Fehler aufgetreten:
        template(v-for='e in typeof error === "string" ? [error] : error') 
          br
          | {{ e }}
  div(v-if='success')
    v-alert(type='success', tile) Daten erfolgreich übertragen.

    v-alert.secondary--text(type='warning', tile, icon='mdi-information')
      p.font-weight-bold Anmmeldung noch nicht fertig!
      p Wir haben dir eine E-Mail zum bestätigen deiner Anmeldung geschickt.
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from '@nuxtjs/composition-api'
import { ruleLib, useValidation } from '../../../plugins/validate'
import { post } from '~/helpers/fetch'

export default defineComponent({
  setup(_props, ctx) {
    const success = ref(false)
    const error = ref<false | string | string[]>(false)
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
    const submit = async () => {
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
      try {
        const ret = await post<{
          status: 'OK' | 'ERROR'
          context: string | string[]
        }>('/api/anmeldung/ma/veranstaltung', submitData)
        if (ret.status !== 'OK') {
          error.value = ret.context
        } else {
          error.value = false
          success.value = true
        }
      } catch (e) {
        error.value = e
      }
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

    const ort = ref(false)

    ;(async () => {
      if (process.server) {
        return
      }

      const valid = (
        await post<{ ok: boolean; ort: boolean }>(
          '/api/anmeldung/ma/checkToken',
          {
            token: ctx.parent?.$route.params.token,
          }
        ).then((v) => {
          ort.value = v.ort
          return v
        })
      ).ok

      if (!valid) {
        ctx.parent?.$router.push(
          '/anmeldung/mitarbeiter/veranstaltung?notvalid=1'
        )
      }
    })()

    return {
      ...validation.rootMapper,
      ...validation,
      data,
      submit,
      success,
      error,
      ort,
    }
  },
})
</script>
