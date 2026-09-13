<template lang="pug">
v-container(fluid)
  h1.mb-1 Kalender
  p.text-medium-emphasis.mb-4
    | Alle Freizeiten und Veranstaltungen am Stück — ab {{ fensterText }}.
    |  Jeder Balken führt zur Veranstaltung.

  //- Kopfleiste: Legende und Filter in einem, dazu das Abo
  v-sheet.mb-4.pa-3(rounded, border)
    .d-flex.flex-wrap.align-center.ga-4
      .d-flex.flex-wrap.align-center.ga-2
        v-chip(
          v-for="b in ALTERSBEREICHE"
          :key="b.key"
          size="small"
          :variant="bereichAktiv(b.key) ? 'flat' : 'outlined'"
          :color="b.color"
          :class="bereichAktiv(b.key) ? b.textClass : ''"
          @click="bereichUmschalten(b.key)") {{ b.label }}
        v-chip(size="small" variant="outlined" :color="KORALLE" disabled) JuLeiCa
        v-chip(size="small" variant="outlined" :color="NEUTRAL" disabled) ohne Altersbereich
        v-btn(
          v-if="filter.length"
          size="small"
          variant="text"
          @click="filter = []") alle zeigen

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

  v-alert.mb-4(v-if="!gefiltert.length" type="info" variant="tonal")
    | Zurzeit sind keine Termine eingetragen
    span(v-if="filter.length")  — jedenfalls keine in den gewählten Altersbereichen
    | .

  //- --------------------------------------------------------- Jahresplaner
  //- Alle Jahre untereinander, ohne Umschalter: eine Freizeit über den
  //- Jahreswechsel soll man nicht auf zwei Ansichten zusammensuchen müssen.
  v-card(v-if="gefiltert.length" border :elevation="0")
    .jp-scroll
      .jp
        template(v-for="block in jahresbloecke" :key="block.jahr")
          //- Tageszahlen, je Jahr einmal wiederholt
          .jp-kopf
            .jp-monatsname.jp-kopf-ecke {{ block.jahr }}
            .jp-tagzahl(v-for="t in 31" :key="t") {{ t }}

          .jp-monat(
            v-for="m in block.monate"
            :key="m.schluessel"
            :style="{ '--spuren': Math.max(m.spurenAnzahl, 1) }")
            .jp-monatsname {{ m.kurz }}

            //- Hintergrund: ein Feld je Tag, Wochenenden abgesetzt
            .jp-tag(
              v-for="t in m.tage"
              :key="t.nr"
              :style="{ gridColumn: t.nr + 1 }"
              :class="{ 'jp-tag--frei': t.wochenende, 'jp-tag--leer': !t.gibtEs, 'jp-tag--heute': t.heute }")
              span.jp-wt(v-if="t.gibtEs") {{ t.wt }}
              button.jp-anmeldung(
                v-if="t.anmeldungen.length"
                type="button"
                :title="`Anmeldestart: ${t.anmeldungen.map((a) => a.titel).join(', ')}`"
                @click="anmeldeTag = t") {{ t.anmeldungen.length }}

            //- Die Balken, Spur für Spur
            NuxtLink.jp-balken(
              v-for="seg in m.segmente"
              :key="seg.termin.slug"
              :to="`/veranstaltungen/${seg.termin.slug}`"
              :title="seg.tooltip"
              :style="{ gridColumn: `${seg.von + 1} / span ${seg.span}`, gridRow: seg.spur + 2, background: seg.termin.farbe }"
              :class="{ 'jp-balken--offen-links': !seg.beginntHier, 'jp-balken--offen-rechts': !seg.endetHier, 'jp-balken--hell': seg.termin.hellerText }")
              span.jp-balken-text(v-if="seg.beschriftung") {{ seg.beschriftung }}


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
              .jp-punkt(:style="{ background: a.farbe }")
            v-list-item-title.text-wrap {{ a.titel }}
            v-list-item-subtitle {{ a.zeitraum }}
      v-card-actions
        v-spacer
        v-btn(variant="text" @click="anmeldeTag = null") Schließen
</template>

<script setup lang="ts">
import { mdiCalendarPlus, mdiDownload } from '@mdi/js'

/**
 * Jahresplaner: /kalender
 *
 * Aufbau wie der gedruckte EC-Wandkalender (download/FlyerundProspekte), nur
 * um 90 Grad gedreht: dort stehen die Monate als Spalten und die Balken
 * senkrecht, was den Titel auf die Seite kippt. Hier sind die Monate Zeilen
 * und die Tage Spalten — die Balken laufen waagerecht, ihre Beschriftung ist
 * ohne Kopfdrehen lesbar.
 *
 * Alle Jahre laufen durch, ohne Umschalter, beginnend im Vormonat.
 *
 * Das genaue Datum steht im Balken selbst („03.–13. EC-Kids-Camp I 2027")
 * und in jedem Fall vollständig im Tooltip. Beschriftung bleibt immer
 * innerhalb des Balkens: Text, der danebensteht, laesst einen Termin laenger
 * aussehen, als er ist.
 *
 * Bewusst (noch) nicht im Menü verlinkt. Die Seite muss deshalb in
 * nuxt.config.ts unter `prerender:routes` stehen, sonst findet der Crawler sie
 * beim `generate` nicht.
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
      'juleica',
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

const WOCHENTAGE = ['S', 'M', 'D', 'M', 'D', 'F', 'S']

const ABO_URL = 'webcal://www.ec-nordbund.de/kalender.ics'

/** Ohne Altersbereich und ohne JuLeiCa: neutrales EC-Grün. */
const NEUTRAL = '#5c7c1a'

/**
 * Koralle, die Farbe des JuLeiCa-Sechsecks — dieselbe wie beim Badge in der
 * Veranstaltungsliste. Grün stünde hier neben den Altersbereichen und läse
 * sich wie eine weitere Zielgruppe.
 */
const KORALLE = '#ea4c60'

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
      farbe: bereiche[0]?.color ?? (d.juleica === true ? KORALLE : NEUTRAL),
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

/* ------------------------------------------------------------ Jahresplaner */

interface Tag {
  nr: number
  gibtEs: boolean
  wochenende: boolean
  heute: boolean
  wt: string
  langDatum: string
  anmeldungen: Termin[]
}

interface Segment {
  termin: Termin
  /** Erster Tag im Monat, 1–31. */
  von: number
  span: number
  spur: number
  beginntHier: boolean
  endetHier: boolean
  /**
   * Text im Balken. Bleibt immer INNERHALB des Balkens -- Beschriftung, die
   * daneben steht, wandert bei schmalen Spalten über fremde Tage und laesst
   * einen Termin laenger aussehen, als er ist. Was nicht hineinpasst, steht im
   * Tooltip.
   */
  beschriftung: string
  tooltip: string
}

/**
 * Letzter Monat des Planers: zwölf Monate ab dem Fenstermonat, aber nicht
 * weiter als bis zur spätesten Veranstaltung.
 *
 * Die Obergrenze hält das Blatt beieinander — im Content stehen vereinzelt
 * Termine zwei Jahre im Voraus, und dafür dann zwölf leere Monatszeilen zu
 * zeichnen, macht den Planer nur länger, nicht nützlicher.
 */
const letzterMonat = computed(() => {
  let spaetester = new Date(fensterStart)
  for (const t of gefiltert.value) if (t.bis > spaetester) spaetester = t.bis

  const grenze = new Date(fensterStart)
  grenze.setMonth(grenze.getMonth() + 11)

  const ende = spaetester < grenze ? spaetester : grenze
  return new Date(ende.getFullYear(), ende.getMonth(), 1)
})

const jahresbloecke = computed(() => {
  const bloecke: {
    jahr: number
    monate: ReturnType<typeof baueMonat>[]
  }[] = []

  const zeiger = new Date(fensterStart)
  const schluss = letzterMonat.value

  while (zeiger <= schluss) {
    const j = zeiger.getFullYear()
    const m = zeiger.getMonth()

    let block = bloecke.find((b) => b.jahr === j)
    if (!block) {
      block = { jahr: j, monate: [] }
      bloecke.push(block)
    }
    block.monate.push(baueMonat(j, m))

    zeiger.setMonth(zeiger.getMonth() + 1)
  }

  return bloecke
})

function baueMonat(j: number, m: number) {
  const laenge = new Date(j, m + 1, 0).getDate()
  const monatsStart = new Date(j, m, 1)
  const monatsEnde = new Date(j, m, laenge)

  const anmeldungenAmTag = new Map<number, Termin[]>()
  for (const t of gefiltert.value) {
    if (!t.anmeldestart) continue
    if (t.anmeldestart.getFullYear() !== j || t.anmeldestart.getMonth() !== m) {
      continue
    }
    const tagNr = t.anmeldestart.getDate()
    anmeldungenAmTag.set(tagNr, [...(anmeldungenAmTag.get(tagNr) ?? []), t])
  }

  const tage: Tag[] = []
  for (let nr = 1; nr <= 31; nr++) {
    const gibtEs = nr <= laenge
    const d = gibtEs ? new Date(j, m, nr) : null
    tage.push({
      nr,
      gibtEs,
      wochenende: !!d && (d.getDay() === 0 || d.getDay() === 6),
      heute: !!d && iso(d) === heuteIso,
      wt: d ? WOCHENTAGE[d.getDay()]! : '',
      langDatum: d ? langFormat.format(d) : '',
      anmeldungen: anmeldungenAmTag.get(nr) ?? [],
    })
  }

  // Balken auf möglichst wenige Spuren verteilen: erste Spur, in der nichts
  // überlappt. Wie im gedruckten Kalender, wo parallele Freizeiten
  // nebeneinanderstehen.
  const laufende = gefiltert.value
    .filter((t) => t.von <= monatsEnde && t.bis >= monatsStart)
    .sort(
      (a, b) =>
        a.von.getTime() - b.von.getTime() ||
        b.bis.getTime() - b.von.getTime() - (a.bis.getTime() - a.von.getTime()),
    )

  const spuren: Segment[][] = []
  const segmente: Segment[] = []

  for (const t of laufende) {
    const von = t.von < monatsStart ? 1 : t.von.getDate()
    const bis = t.bis > monatsEnde ? laenge : t.bis.getDate()
    const span = bis - von + 1

    const spurNr = spuren.findIndex((spur) =>
      spur.every((s) => s.von + s.span - 1 < von || s.von > bis),
    )

    // Beschriftung im Balken: ab fünf Tagen mit Datum davor, ab drei nur der
    // Titel, darunter steht sie daneben.
    const datumKurz = von === bis ? `${von}.` : `${von}.–${bis}.`
    const beschriftung =
      span >= 5 ? `${datumKurz} ${t.titel}` : span >= 2 ? t.titel : ''

    const segment: Segment = {
      termin: t,
      von,
      span,
      spur: spurNr === -1 ? spuren.length : spurNr,
      beginntHier: t.von >= monatsStart,
      endetHier: t.bis <= monatsEnde,
      beschriftung,
      tooltip: [t.zeitraum, t.titel, t.ort, t.bereichNamen]
        .filter(Boolean)
        .join(' · '),
    }

    if (spurNr === -1) spuren.push([segment])
    else spuren[spurNr]!.push(segment)
    segmente.push(segment)
  }

  return {
    schluessel: `${j}-${m}`,
    jahr: j,
    name: `${MONATSNAMEN[m]} ${j}`,
    kurz: MONATSNAMEN[m]!.slice(0, 3),
    tage,
    segmente,
    spurenAnzahl: spuren.length,
  }
}

const anmeldeTag = ref<Tag | null>(null)

useHead({ title: 'Kalender' })
</script>

<style scoped>
/* Auf schmalen Geräten passen 31 Tagesspalten nicht — dann wird das Band
   waagerecht gescrollt. Weniger Spalten zu zeigen hieße, den Planer
   aufzugeben. */
.jp-scroll {
  overflow-x: auto;
  padding: 12px;
}

.jp {
  min-width: 760px;
  font-size: 0.72rem;
}

.jp-kopf,
.jp-monat {
  display: grid;
  grid-template-columns: 3.2rem repeat(31, minmax(0, 1fr));
  gap: 2px;
}

.jp-kopf {
  margin: 10px 0 4px;
}

.jp-kopf:first-child {
  margin-top: 0;
}

.jp-monat {
  grid-template-rows: 1.25rem repeat(var(--spuren, 1), 1.15rem);
  margin-bottom: 3px;
}

/* Monats- und Jahresbeschriftung in der normalen Textfarbe: Gruen steht in
   diesem Planer fuer Inhalte (Balken, Wochenenden) und soll nicht nebenbei
   auch die Beschriftung einfaerben. */
.jp-monatsname {
  grid-column: 1;
  grid-row: 1 / -1;
  display: flex;
  align-items: center;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.jp-kopf-ecke {
  font-size: 0.9rem;
  opacity: 0.75;
}

.jp-tagzahl {
  text-align: center;
  font-variant-numeric: tabular-nums;
  opacity: 0.55;
  font-size: 0.62rem;
}

/* Die Tagesfelder liegen hinter den Balken und reichen über alle Spuren —
   so bleibt die Wochenendspalte auch unter einem Balken sichtbar. */
.jp-tag {
  grid-row: 1 / -1;
  border-radius: 3px;
  background: rgba(127, 127, 127, 0.07);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
  padding-top: 1px;
  min-height: 1.25rem;
}

/* Wochenenden abgesetzt — daran liest man im gedruckten Kalender ab, ob eine
   Freizeit über ein Wochenende geht. */
.jp-tag--frei {
  background: rgba(var(--v-theme-primary), 0.16);
}

.jp-tag--leer {
  background: none;
}

.jp-tag--heute {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: -1px;
}

.jp-wt {
  font-size: 0.55rem;
  opacity: 0.5;
  line-height: 1;
}

.jp-anmeldung {
  position: absolute;
  margin-top: 0.9rem;
  font-size: 0.55rem;
  line-height: 1;
  min-width: 0.85rem;
  padding: 1px 3px;
  border-radius: 999px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  cursor: pointer;
  z-index: 3;
}

.jp-balken {
  position: relative;
  z-index: 2;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  align-items: center;
  min-width: 0;
  text-decoration: none;
  color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
}

.jp-balken--hell {
  color: #2f2f2f;
}

/* Läuft der Termin über den Monatsrand hinaus, bleibt die Kante offen —
   sonst sähe eine Freizeit über den Jahreswechsel aus wie zwei kurze. */
.jp-balken--offen-links {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.jp-balken--offen-rechts {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* min-width: 0 an beiden Ebenen ist der Punkt, an dem es sonst bricht: ein
   Flex-Kind waechst sonst auf seine Textbreite und schiebt den Titel ueber den
   Balkenrand hinaus. */
.jp-balken-text {
  min-width: 0;
  max-width: 100%;
  padding: 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.66rem;
  font-weight: 500;
}

.jp-balken:hover {
  filter: brightness(1.08);
}

.jp-punkt {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
  flex: 0 0 auto;
}
</style>
