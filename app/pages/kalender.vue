<template lang="pug">
v-container
  h1.mb-1 Kalender
  p.text-medium-emphasis.mb-4
    | Alle Freizeiten und Veranstaltungen auf einen Blick — ab
    |  {{ fensterText }}. Jeder Eintrag führt zur Veranstaltung.

  //- Kopfleiste: Jahr, Altersbereiche, Abo
  v-sheet.mb-6.pa-3(rounded, border)
    .d-flex.flex-wrap.align-center.ga-4
      v-btn-toggle(
        v-model="jahr"
        mandatory
        density="comfortable"
        variant="outlined"
        divided)
        v-btn(v-for="j in jahre" :key="j" :value="j") {{ j }}

      v-divider(vertical)

      .d-flex.flex-wrap.align-center.ga-2
        span.text-caption.text-medium-emphasis.mr-1 Altersbereich:
        v-chip(
          v-for="b in ALTERSBEREICHE"
          :key="b.key"
          size="small"
          :variant="bereichAktiv(b.key) ? 'flat' : 'outlined'"
          :color="b.color"
          :class="bereichAktiv(b.key) ? b.textClass : ''"
          @click="bereichUmschalten(b.key)") {{ b.label }}
        v-btn(
          v-if="filter.length"
          size="small"
          variant="text"
          @click="filter = []") zurücksetzen

      v-spacer

      v-btn(
        :href="ABO_URL"
        size="small"
        variant="tonal"
        color="primary"
        :prepend-icon="mdiCalendarPlus") Kalender abonnieren
      v-btn(
        href="/kalender.ics"
        size="small"
        variant="text"
        :prepend-icon="mdiDownload"
        download) .ics

  v-alert(v-if="!monate.length" type="info" variant="tonal")
    | Für {{ jahr }} sind zurzeit keine Termine eingetragen
    span(v-if="filter.length")  — jedenfalls keine in den gewählten Altersbereichen
    | .

  v-row
    v-col(v-for="m in monate" :key="m.schluessel" cols="12" md="6" lg="4")
      v-card.h-100(border :elevation="0")
        v-card-title.d-flex.align-center.justify-space-between
          span {{ m.name }}
          v-chip(v-if="m.termine.length" size="x-small" variant="tonal") {{ m.termine.length }}

        v-card-text.pt-0
          //- Monatsraster: Wochentage, dann je Woche die Tageszahlen und
          //- darunter die Balken der laufenden Veranstaltungen.
          .kal-gitter
            .kal-kopf
              .kal-wt(v-for="wt in WOCHENTAGE" :key="wt") {{ wt }}

            .kal-woche(v-for="(w, i) in m.wochen" :key="i")
              .kal-tage
                .kal-tag(
                  v-for="t in w.tage"
                  :key="t.iso"
                  :class="{ 'kal-tag--fremd': !t.imMonat, 'kal-tag--heute': t.heute }")
                  span.kal-zahl {{ t.tag }}
                  //- Anmeldestart: ein Punkt am Tag, Klick zeigt, wofür.
                  button.kal-anmeldung(
                    v-if="t.anmeldungen.length"
                    type="button"
                    :title="`Anmeldestart: ${t.anmeldungen.map((a) => a.titel).join(', ')}`"
                    @click="anmeldeTag = t") {{ t.anmeldungen.length }}

              .kal-spur(v-for="(spur, si) in w.spuren" :key="si")
                .kal-balken(
                  v-for="seg in spur"
                  :key="seg.termin.slug + si"
                  :style="{ gridColumn: `${seg.start} / span ${seg.span}`, background: seg.termin.farbe }"
                  :class="{ 'kal-balken--offen-links': !seg.beginntHier, 'kal-balken--offen-rechts': !seg.endetHier, 'kal-balken--hell': seg.termin.hellerText }")
                  NuxtLink.kal-balken-link(
                    :to="`/veranstaltungen/${seg.termin.slug}`"
                    :title="`${seg.termin.titel} · ${seg.termin.zeitraum}`") {{ seg.beginntHier ? seg.termin.titel : '…' }}

          //- Dieselben Termine als Liste: im Raster ist der Balken oft zu kurz
          //- für den Titel, und das genaue Datum soll man ablesen können, ohne
          //- Kästchen zu zählen.
          v-divider.my-3(v-if="m.termine.length")
          v-list.py-0(v-if="m.termine.length" density="compact" bg-color="transparent")
            v-list-item.px-0(
              v-for="t in m.termine"
              :key="t.slug"
              :to="`/veranstaltungen/${t.slug}`")
              template(#prepend)
                .kal-punkt(:style="{ background: t.farbe }")
              v-list-item-title.text-wrap
                strong {{ t.zeitraum }}
                |  {{ t.titel }}
              v-list-item-subtitle.text-wrap
                span(v-if="t.ort") {{ t.ort }}
                span(v-if="t.ort && t.bereichNamen")  ·
                span(v-if="t.bereichNamen")  {{ t.bereichNamen }}
              v-list-item-subtitle.text-wrap(v-if="t.anmeldestartText")
                | Anmeldung ab {{ t.anmeldestartText }}

  //- Welche Anmeldungen an einem Tag aufgehen
  v-dialog(:model-value="!!anmeldeTag" max-width="520" @update:model-value="anmeldeTag = null")
    v-card(v-if="anmeldeTag")
      v-card-title.text-wrap Anmeldestart am {{ anmeldeTag.langDatum }}
      v-card-text
        p.text-medium-emphasis.mb-2(v-if="anmeldeTag.anmeldungen[0]")
          | Ab {{ anmeldeTag.anmeldungen[0].anmeldestartText }} sind diese
          |  Veranstaltungen zur Anmeldung geöffnet:
        v-list(density="compact")
          v-list-item(
            v-for="a in anmeldeTag.anmeldungen"
            :key="a.slug"
            :to="`/veranstaltungen/${a.slug}`")
            template(#prepend)
              .kal-punkt(:style="{ background: a.farbe }")
            v-list-item-title.text-wrap {{ a.titel }}
            v-list-item-subtitle {{ a.zeitraum }}
      v-card-actions
        v-spacer
        v-btn(variant="text" @click="anmeldeTag = null") Schließen
</template>

<script setup lang="ts">
import { mdiCalendarPlus, mdiDownload } from '@mdi/js'

/**
 * Jahreskalender aller Veranstaltungen: /kalender
 *
 * Bewusst (noch) nicht im Menü verlinkt — die Seite muss deshalb in
 * nuxt.config.ts unter `prerender:routes` stehen, sonst findet der Crawler sie
 * beim `generate` nicht und sie fehlt in der Ausgabe.
 *
 * Zwei Darstellungen desselben Monats, weil beide etwas können, was die andere
 * nicht kann: das Raster zeigt Überschneidungen und freie Wochen, die Liste
 * darunter das genaue Datum und den vollen Titel. Im Raster ist ein Balken über
 * drei Tage zu schmal für „EC-Kids-Camp I 2027".
 */
const { data: rohdaten } = await useAsyncData('kalenderTermine', async () => {
  const veranstaltungen = await queryCollection('veranstaltung')
    .select(
      'stem',
      'title',
      'begin',
      'ende',
      'veranstaltungsort',
      'ort',
      'altersbereiche',
      'anmeldung',
    )
    .order('begin', 'ASC')
    .all()

  // stem = Dateiname ohne Endung = alter Slug; die Detailseite liegt darunter.
  return veranstaltungen.map((d) => ({ ...d, slug: stemToSlug(d.stem) }))
})

interface Termin {
  slug: string
  titel: string
  von: Date
  bis: Date
  /** '10.–24.07.2027' bzw. '14.05.2027' */
  zeitraum: string
  ort: string
  bereiche: readonly AltersbereichKey[]
  bereichNamen: string
  farbe: string
  hellerText: boolean
  anmeldestart: Date | null
  anmeldestartText: string
}

const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONATSNAMEN = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

const ABO_URL = 'webcal://www.ec-nordbund.de/kalender.ics'

/** Ohne Altersbereich: neutrales EC-Grün statt einer der vier Bereichsfarben. */
const NEUTRAL = '#5c7c1a'

const heute = new Date()
const heuteIso = iso(heute)

/**
 * Fenster: ab dem Ersten des Vormonats. Was gerade zu Ende gegangen ist, soll
 * noch auffindbar sein — alles davor gehört ins Archiv, nicht in einen
 * Kalender.
 */
const fensterStart = new Date(heute.getFullYear(), heute.getMonth() - 1, 1)

const fensterText = computed(
  () => `${MONATSNAMEN[fensterStart.getMonth()]} ${fensterStart.getFullYear()}`,
)

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

/** 'YYYY-MM-DD' (auch mit Zeitanteil) als lokales Datum um 00:00. */
function alsDatum(v: unknown): Date | null {
  const s = String(v ?? '').slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null

  const [j, m, t] = s.split('-').map(Number)
  const d = new Date(j!, m! - 1, t!)
  return Number.isNaN(d.getTime()) ? null : d
}

/** '10.–24.07.2027', '28.12.2026–03.01.2027', '14.05.2027' */
function zeitraumText(von: Date, bis: Date): string {
  const tag = (d: Date) => String(d.getDate()).padStart(2, '0')
  const monat = (d: Date) => String(d.getMonth() + 1).padStart(2, '0')

  if (iso(von) === iso(bis)) return `${tag(von)}.${monat(von)}.${von.getFullYear()}`
  if (von.getFullYear() !== bis.getFullYear()) {
    return `${tag(von)}.${monat(von)}.${von.getFullYear()}–${tag(bis)}.${monat(bis)}.${bis.getFullYear()}`
  }
  if (von.getMonth() !== bis.getMonth()) {
    return `${tag(von)}.${monat(von)}.–${tag(bis)}.${monat(bis)}.${bis.getFullYear()}`
  }
  return `${tag(von)}.–${tag(bis)}.${monat(bis)}.${bis.getFullYear()}`
}

const zeitFormat = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const langFormat = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const termine = computed<Termin[]>(() => {
  const liste: Termin[] = []

  for (const d of rohdaten.value ?? []) {
    const von = alsDatum(d.begin)
    if (!von) continue

    const bis = alsDatum(d.ende) ?? von
    // Alles, was vor dem Fenster endet, fällt raus.
    if (bis < fensterStart) continue

    const bereiche = aktiveAltersbereiche(d.altersbereiche)
    const anmeldung = (d.anmeldung ?? {}) as Record<string, unknown>
    const startRoh = String(anmeldung.startAt ?? '').trim()
    const anmeldestart = startRoh ? new Date(startRoh) : null
    const gueltig = anmeldestart && !Number.isNaN(anmeldestart.getTime())

    liste.push({
      slug: d.slug,
      titel: String(d.title ?? '').trim() || d.slug,
      von,
      bis,
      zeitraum: zeitraumText(von, bis),
      ort: String(d.veranstaltungsort ?? d.ort ?? '').trim(),
      bereiche: bereiche.map((b) => b.key),
      bereichNamen: bereiche.map((b) => b.label).join(', '),
      farbe: bereiche[0]?.color ?? NEUTRAL,
      // Teens-Violett ist so hell, dass weiße Schrift darauf nicht mehr lesbar
      // ist — dieselbe Entscheidung wie bei den Chips (utils/altersbereiche).
      hellerText: bereiche[0]?.textClass === 'text-dunkelGrau',
      anmeldestart: gueltig ? anmeldestart : null,
      anmeldestartText: gueltig ? `${zeitFormat.format(anmeldestart!)} Uhr` : '',
    })
  }

  return liste
})

/* ------------------------------------------------------------------ Filter */

const filter = ref<AltersbereichKey[]>([])

function bereichAktiv(key: AltersbereichKey) {
  return filter.value.includes(key)
}

function bereichUmschalten(key: AltersbereichKey) {
  filter.value = bereichAktiv(key)
    ? filter.value.filter((k) => k !== key)
    : [...filter.value, key]
}

/**
 * Ist ein Filter gesetzt, fallen Veranstaltungen ohne Altersbereich heraus:
 * „Kids" zu wählen und trotzdem das Mitarbeiterwochenende zu sehen, wäre
 * verwirrender als eine kurze Liste.
 */
const gefiltert = computed(() =>
  filter.value.length
    ? termine.value.filter((t) => t.bereiche.some((b) => filter.value.includes(b)))
    : termine.value,
)

/* -------------------------------------------------------------------- Jahr */

const jahre = computed(() => {
  const menge = new Set<number>()
  for (const t of termine.value) {
    for (let j = t.von.getFullYear(); j <= t.bis.getFullYear(); j++) {
      if (j >= fensterStart.getFullYear()) menge.add(j)
    }
  }
  menge.add(heute.getFullYear())
  return [...menge].sort((a, b) => a - b)
})

const jahr = ref(heute.getFullYear())

/* ------------------------------------------------------------------ Raster */

interface Tag {
  iso: string
  tag: number
  imMonat: boolean
  heute: boolean
  langDatum: string
  anmeldungen: Termin[]
}

interface Segment {
  termin: Termin
  start: number
  span: number
  beginntHier: boolean
  endetHier: boolean
}

/** Montag der Woche, in der `d` liegt. */
function montag(d: Date): Date {
  const m = new Date(d)
  m.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return m
}

function tageDazwischen(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

const monate = computed(() => {
  const ergebnis: {
    schluessel: string
    name: string
    wochen: { tage: Tag[]; spuren: Segment[][] }[]
    termine: Termin[]
  }[] = []

  const j = jahr.value
  // Im laufenden Jahr erst ab dem Fenstermonat, in späteren Jahren ab Januar.
  const ersterMonat = j === fensterStart.getFullYear() ? fensterStart.getMonth() : 0

  for (let m = ersterMonat; m < 12; m++) {
    const monatsStart = new Date(j, m, 1)
    const monatsEnde = new Date(j, m + 1, 0)

    const imMonat = gefiltert.value
      .filter((t) => t.von <= monatsEnde && t.bis >= monatsStart)
      .sort((a, b) => a.von.getTime() - b.von.getTime())

    const anmeldungenAmTag = new Map<string, Termin[]>()
    for (const t of gefiltert.value) {
      if (!t.anmeldestart) continue
      const schluessel = iso(t.anmeldestart)
      if (!schluessel.startsWith(`${j}-${String(m + 1).padStart(2, '0')}`)) continue
      anmeldungenAmTag.set(schluessel, [
        ...(anmeldungenAmTag.get(schluessel) ?? []),
        t,
      ])
    }

    // Monate ohne Termine und ohne Anmeldestart wegzulassen, würde Lücken in
    // die Jahresübersicht reißen — sie bleiben drin, nur leer.
    const wochen: { tage: Tag[]; spuren: Segment[][] }[] = []
    const ersterTag = montag(monatsStart)

    for (
      let w = new Date(ersterTag);
      w <= monatsEnde;
      w.setDate(w.getDate() + 7)
    ) {
      const wochenStart = new Date(w)
      const wochenEnde = new Date(w)
      wochenEnde.setDate(wochenEnde.getDate() + 6)

      const tage: Tag[] = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(wochenStart)
        d.setDate(wochenStart.getDate() + i)
        const schluessel = iso(d)
        tage.push({
          iso: schluessel,
          tag: d.getDate(),
          imMonat: d.getMonth() === m,
          heute: schluessel === heuteIso,
          langDatum: langFormat.format(d),
          anmeldungen: d.getMonth() === m ? (anmeldungenAmTag.get(schluessel) ?? []) : [],
        })
      }

      // Balken der Woche auf möglichst wenige Spuren verteilen.
      const spuren: Segment[][] = []
      for (const t of imMonat) {
        if (t.bis < wochenStart || t.von > wochenEnde) continue

        const start = Math.max(0, tageDazwischen(wochenStart, t.von)) + 1
        const ende = Math.min(6, tageDazwischen(wochenStart, t.bis)) + 1
        const segment: Segment = {
          termin: t,
          start,
          span: ende - start + 1,
          beginntHier: t.von >= wochenStart,
          endetHier: t.bis <= wochenEnde,
        }

        const frei = spuren.find((spur) =>
          spur.every(
            (s) =>
              s.start + s.span - 1 < segment.start ||
              s.start > segment.start + segment.span - 1,
          ),
        )
        if (frei) frei.push(segment)
        else spuren.push([segment])
      }

      wochen.push({ tage, spuren })
    }

    ergebnis.push({
      schluessel: `${j}-${m}`,
      name: `${MONATSNAMEN[m]} ${j}`,
      wochen,
      termine: imMonat,
    })
  }

  return ergebnis
})

const anmeldeTag = ref<Tag | null>(null)

useHead({ title: 'Kalender' })
</script>

<style scoped>
.kal-gitter {
  font-size: 0.78rem;
  line-height: 1.2;
}

.kal-kopf,
.kal-tage,
.kal-spur {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 2px;
}

.kal-wt {
  text-align: center;
  font-weight: 600;
  opacity: 0.6;
  padding-bottom: 2px;
}

.kal-woche {
  margin-bottom: 4px;
}

.kal-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 1.4rem;
  border-radius: 4px;
  background: rgba(127, 127, 127, 0.08);
}

.kal-tag--fremd {
  opacity: 0.35;
}

/* Heute: die einzige Stelle, an der Farbe etwas über den Tag selbst sagt. */
.kal-tag--heute {
  outline: 2px solid rgb(var(--v-theme-primary));
  font-weight: 700;
}

.kal-zahl {
  font-variant-numeric: tabular-nums;
}

.kal-anmeldung {
  font-size: 0.6rem;
  line-height: 1;
  min-width: 1rem;
  padding: 1px 3px;
  border-radius: 999px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  cursor: pointer;
}

.kal-spur {
  margin-top: 2px;
}

.kal-balken {
  border-radius: 4px;
  overflow: hidden;
  min-width: 0;
}

/* Läuft der Termin über den Wochenrand hinaus, bleibt die Kante offen —
   sonst sieht eine zweiwöchige Freizeit aus wie zwei kurze. */
.kal-balken--offen-links {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.kal-balken--offen-rechts {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.kal-balken-link {
  display: block;
  padding: 1px 4px;
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.7rem;
}

.kal-balken--hell .kal-balken-link {
  color: #2f2f2f;
}

.kal-balken-link:hover {
  text-decoration: underline;
}

.kal-punkt {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
  flex: 0 0 auto;
}
</style>
