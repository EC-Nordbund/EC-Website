<template lang="pug">
  v-form(v-if="(force || (!disabled && !countdown)) && !success")
    v-radio-group(v-model="data.geschlecht" required label="Geschlecht" @change="geschlechtEvent" :error-messages="geschlechtErrors")
      v-radio(value="m" label="Männlich")
      v-radio(value="w" label="Weiblich")
    v-text-field(v-model="data.vorname" required label="Vorname" counter="50" @change="vornameEvent" :error-messages="vornameErrors")
    v-text-field(v-model="data.nachname" required label="Nachname" counter="50" @change="nachnameEvent" :error-messages="nachnameErrors")
    ec-datepicker(v-model="data.gebDat" label="Geburtsdatum" required gebDat :max="new Date().toISOString().substr(0, 10)" min="1950-01-01" @change="gebDatEvent" :error-messages="gebDatErrors")
    v-alert(v-if="zuJung||zuAlt" type="warning" icon="mdi-information").secondary--text
      template(v-if="zuJung")
        p(v-if="minAlter!==-1").font-weight-medium.mb-2 Du bist jünger als das vorgesehene Mindesalter von {{minAlter}} Jahren für diese Veranstaltung.
        template(v-else-if="jahrgangMax!==2100")
          p.font-weight-medium.mb-1 Du bist noch zu jung!
          p.mb-2 Diese Veranstaltung ist für Teilnehmer der Jahrgänge {{jahrgangMin}} - {{jahrgangMax}}.
        p(v-else).font-weight-medium.mb-2 Du bist zu jung für diese Veranstaltung.

      template(v-if="zuAlt")
        p(v-if="maxAlter!==999").font-weight-medium.mb-2 Du bist älter als das vorgesehende Maximalealter von {{maxAlter}} Jahren für diese Veranstaltung.
        template(v-else-if="jahrgangMin!==1900")
          p.font-weight-medium.mb-1 Du bist zu alt!
          p.mb-2 Diese Veranstaltung ist für Teilnehmer der Jahrgänge {{jahrgangMin}} - {{jahrgangMax}}.
        p(v-else).font-weight-medium.mb-2 Du bist zu alt für diese Veranstaltung.

      p.font-italic.mb-1 Du kannst dich trotzdem anmelden.
      p.font-italic.mb-0
        | Wir behalten uns allerdings vor, dir den Platz zu verwehren. Wir melden uns bei dir.

    v-text-field(v-model="data.strasse" required label="Straße" counter="50" @change="strasseEvent" :error-messages="strasseErrors")
    ec-adresse(v-model="data.plzOrt" :errorMap="errorMap.plzOrt")
    v-text-field(label="E-Mail" type="email" required v-model="data.email" counter="50" @change="emailEvent" :error-messages="emailErrors")
    v-text-field(label="Telefon" type="telefon" required v-model="data.telefon" @input="telefonEvent" :error-messages="telefonErrors")
    v-checkbox(v-if="hatEssen" label="Ich möchte vegetarisches Essen" v-model="data.vegetarisch")
    v-textarea(v-if="hatEssen" label="Lebensmittelallergien" v-model="data.lebensmittelallergien" counter="250" @change="lebensmittelallergienEvent" :error-messages="lebensmittelallergienErrors")
    v-textarea(v-if="hatGesundheit" label="Gesundheitsinformationen" v-model="data.gesundheit" counter="250" @change="gesundheitEvent" :error-messages="gesundheitErrors")
    v-textarea(label="Bemerkungen" v-model="data.bemerkungen" counter="250" @change="bemerkungenEvent" :error-messages="bemerkungenErrors")
    div(v-if="hatErlaubnisse && under18")
      h3 Erlaubnisse
      p(class="pt-3") Mein
        span(v-if="data.geschlecht === 'w'") e Tochter
        span(v-else-if="data.geschlecht === 'm'")  Sohn
        span(v-else)  Kind
        |  darf...
      v-checkbox(dense class="mt-0" label="Bootfahren" v-model="data.bootfahren" v-if="hatErlaubnisBoot")
      v-checkbox(dense class="mt-0" label="Radfahren" v-model="data.fahrrad" v-if="hatErlaubnisFahrrad")
      v-checkbox(dense class="mt-0" label="Klettern" v-model="data.klettern" v-if="hatErlaubnisKlettern")
      v-checkbox(dense class="mt-0" label="Sich in Gruppen von mindestens 3 Personen entfernen" v-model="data.sichEntfernen" v-if="hatErlaubnisSichEntfernen")
      div
        v-radio-group(label="Schwimmen / Baden (unter Aufsicht)" v-model="data.schwimmen" class="mt-0" v-if="hatErlaubnisSchwimmen")
          v-radio(:value="0" class="ml-2" label="Nicht erlaubt")
          v-radio(:value="1" class="ml-2" label="Erlaubt - nicht Schwimmer")
          v-radio(:value="2" class="ml-2" label="Erlaubt - mittlmäßiger Schwimmer")
          v-radio(:value="3" class="ml-2" label="Erlaubt - guter Schwimmer")
    div(v-if="extraFields.length > 0")
      template(v-for="el in extraFields")
        v-autocomplete(v-if="el.type==='autocomplete'" :label="el.label" v-model="data.extra[el.name]" :items="el.items" :key="el.name")
        v-select(v-if="el.type==='select'" :label="el.label" v-model="data.extra[el.name]" :items="el.items" :key="el.name")
        v-text-field(v-if="el.type==='text'" :label="el.label" type="text" v-model="data.extra[el.name]" v-bind="el" :key="el.name")
        v-checkbox(v-if="el.type==='checkbox'" dense :label="el.label" v-model="data.extra[el.name]" v-bind="el" :key="el.name")
    v-checkbox(required v-model="data.datenschutz" @change="datenschutzEvent" :error-messages="datenschutzErrors")
      template(v-slot:label)
        p Ich nehme zur Kenntnis, dass meine eingegebenen Daten vorerst für&nbsp;
          strong 24 Stunden&nbsp;
          | zwischengespeichert werden und mir eine&nbsp;
          strong E-Mail zur Bestätigung und Vervollständigung meiner Anmeldung&nbsp;
          | zugeschickt wird.
    v-checkbox(required v-model="data.tnBedingungen" @change="tnBedingungenEvent" :error-messages="tnBedingungenErrors")
      template(v-slot:label)
        p Ich erkenne die&nbsp;
          a(href="/teilnahmebedingungen" target="_tn_bed" rel="noopener") Teilnahmebedingungen&nbsp;
          | für Freizeiten an und melde mich hiermit verbindlich an. (ggf. Einverständnis des Erziehungsberechtigten)
    v-checkbox(required v-model="data.freizeitLeitung" @change="freizeitLeitungEvent" :error-messages="freizeitLeitungErrors" v-if="hatFreizeitleitung")
      template(v-slot:label)
        p Ich versichere, dass mein Kind von mir angewiesen wurde, den Anordnungen der Freizeitleitung Folge zu leisten.
    v-checkbox(v-if="hatFahrgemeinschaft" v-model="data.fahrgemeinschaften")
      template(v-slot:label)
        p
          strong Optional:
          br
          | Ich erkläre mich bereit meine Anschrift zum Zweck der Bildung von Fahrgemeinschaften an die anderen Teilnehmer weitergegeben werden darf.
    
    v-row(no-gutters justify="end")
      v-btn(@click="submit" :disabled="!valid" color="primary" depressed tile).align-self-end Absenden
      //- v-btn(@click="submit") Absenden2

    v-alert(type="error" v-if="error")
      p Es sind folgende Fehler aufgetreten:
        template(v-for="e in typeof error === 'string' ? [error] : error") 
          br
          | {{e}}
  div(v-else-if="success")
    v-alert(type="success" tile) Daten erfolgreich übertragen.
    
    v-alert(type="warning" tile icon="mdi-information").secondary--text
      p.font-weight-bold Anmmeldung noch nicht fertig!
      p Wir haben dir eine E-Mail zum bestätigen deiner Anmeldung geschickt.

    v-row(no-gutters justify="end")
      v-btn(@click="reload()" tile depressed) Noch jemanden anmelden?
  div(v-else-if="disabled" class="anmeldung-disabled")
    slot(name="disabled")
      p Die Anmeldung ist gesperrt.
  div(v-else class="anmeldung-locked")
    slot(name="countdown")
      v-card
        h3(class="text-center") Die Anmeldung wird freigeschaltet in:
        ec-countdown(:target="startAt")
</template>
<script>
import {
  defineComponent,
  reactive,
  computed,
  watchEffect,
  toRefs,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import { useValidation, ruleLib } from '../plugins/validate'
import { useAlter } from '../plugins/alter'
import { post } from '~/helpers/fetch'
function useExtraFields(extraFields) {
  const extra = {}
  const extraRules = {}
  for (let i = 0; i < extraFields.length; i++) {
    const el = extraFields[i]
    extra[el.name] = ''
    if (el.required) {
      extraRules[el.name] = [
        (v) => (!v ? el.err || 'Du musst ein Element auswählen!' : true),
      ]
    }
  }
  return {
    extraData: extra,
    extraRules,
  }
}
function useData(extra) {
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
    gesundheit: '',
    klettern: false,
    bootfahren: false,
    schwimmen: 0,
    fahrrad: false,
    sichEntfernen: false,
    datenschutz: false,
    tnBedingungen: false,
    freizeitLeitung: false,
    fahrgemeinschaften: false,
    extra,
  })
  return { data }
}
function handleFreizeitleitung(data, props) {
  let oldHatFreizeitleitung = null
  watchEffect(() => {
    if (oldHatFreizeitleitung !== props.hatFreizeitleitung) {
      data.freizeitLeitung = !props.hatFreizeitleitung
      oldHatFreizeitleitung = props.hatFreizeitleitung
    }
  })
}
export default defineComponent({
  props: {
    hatEssen: Boolean,
    hatGesundheit: Boolean,
    hatErlaubnisBoot: Boolean,
    hatErlaubnisKlettern: Boolean,
    hatErlaubnisFahrrad: Boolean,
    hatErlaubnisSchwimmen: Boolean,
    hatErlaubnisSichEntfernen: Boolean,
    hatFahrgemeinschaft: Boolean,
    hatFreizeitleitung: Boolean,
    veranstaltungsBegin: {
      type: String,
      required: true,
    },
    minAlter: {
      type: Number,
      default: -1,
    },
    maxAlter: {
      type: Number,
      default: 999,
    },
    extraFields: {
      type: Array,
      default: () => [],
    },
    veranstaltungsID: {
      type: Number,
      required: true,
    },
    jahrgangMin: {
      type: Number,
      default: 1900,
    },
    jahrgangMax: {
      type: Number,
      default: 2100,
    },
    disabled: Boolean,
    startAt: String,
  },
  setup(props) {
    const hatErlaubnisse = computed(
      () =>
        props.hatErlaubnisBoot ||
        props.hatErlaubnisKlettern ||
        props.hatErlaubnisFahrrad ||
        props.hatErlaubnisSchwimmen ||
        props.hatErlaubnisSichEntfernen
    )
    const sending = ref(false)
    const success = ref(false)
    const error = ref(null) // as null | string[] | string)
    const { extraData, extraRules } = useExtraFields(props.extraFields)
    const { data } = useData(extraData)
    handleFreizeitleitung(data, props)
    const submit = async () => {
      sending.value = true
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
        gesundheit: data.gesundheit,
        klettern: data.klettern,
        bootfahren: data.bootfahren,
        schwimmen: data.schwimmen,
        fahrrad: data.fahrrad,
        sichEntfernen: data.sichEntfernen,
        fahrgemeinschaften: data.fahrgemeinschaften,
        extra: data.extra,
        datenschutz: data.datenschutz,
        freizeitLeitung: data.freizeitLeitung,
        tnBedingungen: data.tnBedingungen,
        fahrgemeinschaften: data.fahrgemeinschaften,
        alter: alterData.falschesAlter.value,
      }
      try {
        const ret = await post(
          '/api/anmeldung/tn/' + props.veranstaltungsID,
          submitData
        )
        if (ret.status !== 'OK') {
          error.value = ret.context
        } else {
          error.value = null
          success.value = true
        }
        // console.log('testANMELDUNG1', ret)
      } catch (e) {
        error.value = e
        // console.log('testANMELDUNG_FEHLER_2')
      }
      sending.value = false
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
        telefon: ruleLib.telefon,
        bemerkungen: ruleLib.textArea250,
        lebensmittelallergien: ruleLib.textArea250,
        gesundheit: ruleLib.textArea250,
        datenschutz: ruleLib.datenschutz,
        freizeitLeitung: ruleLib.checkboxRequired,
        tnBedingungen: ruleLib.tnBedingungen,
        extra: extraRules,
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
        'tnBedingungen',
        'freizeitLeitung',
        'lebensmittelallergien',
        'bemerkungen',
        'gesundheit',
      ]
    )
    const { alter, under18 } = useAlter(
      toRefs(data).gebDat,
      props.veranstaltungsBegin
    )
    const alterData = {
      under18,
      zuJung: computed(
        () =>
          alter.value < props.minAlter ||
          (data.gebDat &&
            parseInt(data.gebDat.split('-')[0]) > props.jahrgangMax)
      ),
      zuAlt: computed(
        () =>
          alter.value > props.maxAlter ||
          (data.gebDat &&
            parseInt(data.gebDat.split('-')[0]) < props.jahrgangMin)
      ),
      falschesAlter: computed(
        () => !(alterData.zuJung.value || alterData.zuAlt.value)
      ),
    }
    return {
      ...validation.rootMapper,
      ...alterData,
      ...validation,
      // disabled: props.disabled,
      // startAt: props.startAt,
      forceValidate: () => {
        Object.keys(validation.rootMapper).forEach((key) => {
          if (typeof validation.rootMapper[key] === 'function') {
            validation.rootMapper[key]()
          }
        })
      },
      data,
      submit,
      hatErlaubnisse,
      countdown: new Date().getTime() < new Date(props.startAt).getTime(),
      sending,
      success,
      error,
      force: !!useContext().query.value.anmeldung,
      reload: () => location.reload(),
    }
  },
})
</script>
