import { queryCollection } from '@nuxt/content/server'

/**
 * Kalender-Abo aller Veranstaltungen: https://www.ec-nordbund.de/kalender.ics
 *
 * Liegt hier und nicht in der API, weil das CMS die Quelle der Veranstaltungen
 * ist -- die Tabelle `veranstaltungen` folgt ihm nur per Sync. Nur hier ist
 * ausserdem der Slug bekannt, über den die Website ihre Detailseiten
 * adressiert; aus der Datenbank heraus liesse sich kein Link auf die einzelne
 * Veranstaltung bilden.
 *
 * Die Route wird beim `generate` vorgerendert (nuxt.config.ts, prerender:routes)
 * und liegt danach als statische Datei in `.output/public`. Sie ist damit so
 * aktuell wie der letzte Build -- und der laeuft bei jeder Content-Aenderung,
 * also genau dann, wenn sich eine Veranstaltung geaendert hat.
 */

interface Termin {
  uid: string
  titel: string
  /** Erster Tag, 'YYYY-MM-DD'. */
  beginn: string
  /** Letzter Tag einschliesslich, 'YYYY-MM-DD'. */
  ende?: string | null
  ort?: string | null
  beschreibung?: string | null
  url?: string | null
}

/**
 * Maskiert einen TEXT-Wert (RFC 5545, 3.3.11). Backslash zuerst, sonst
 * verdoppelt der Aufruf die gerade eingefuegten Fluchtzeichen wieder.
 */
function text(v: string): string {
  return v
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/**
 * Faltet eine Zeile auf 75 Oktette (RFC 5545, 3.1).
 *
 * Gezaehlt wird in Oktetten, nicht in Zeichen: "ü" belegt in UTF-8 zwei, und
 * der Content steckt voller Umlaute. Wer nach Zeichen schneidet, erzeugt zu
 * lange Zeilen -- und wer mitten in einer Mehrbyte-Sequenz trennt, zerlegt das
 * Zeichen.
 */
function falte(zeile: string): string {
  const grenze = 75
  let rest = zeile
  const zeilen: string[] = []
  let erste = true

  for (;;) {
    const max = erste ? grenze : grenze - 1 // Folgezeilen beginnen mit Leerzeichen
    let oktette = 0
    let schnitt = rest.length

    for (let i = 0; i < rest.length; i++) {
      // codePointAt: Zeichen ausserhalb der BMP bestehen aus zwei
      // UTF-16-Einheiten und duerfen nicht geteilt werden.
      const cp = rest.codePointAt(i)!
      const doppelt = cp > 0xffff
      const bytes = cp <= 0x7f ? 1 : cp <= 0x7ff ? 2 : cp <= 0xffff ? 3 : 4

      if (oktette + bytes > max) {
        schnitt = i
        break
      }
      oktette += bytes
      if (doppelt) i++
    }

    if (schnitt >= rest.length) {
      zeilen.push((erste ? '' : ' ') + rest)
      break
    }
    zeilen.push((erste ? '' : ' ') + rest.slice(0, schnitt))
    rest = rest.slice(schnitt)
    erste = false
  }

  return zeilen.join('\r\n')
}

/** 'YYYY-MM-DD' (oder ISO-Zeitstempel) -> 'YYYYMMDD' */
function datum(v: string): string {
  return v.slice(0, 10).replace(/-/g, '')
}

/**
 * Einen Tag weiterzaehlen.
 *
 * DTEND ist bei ganztaegigen Terminen AUSSCHLIESSLICH (RFC 5545, 3.6.1): eine
 * Freizeit bis einschliesslich 24.07. endet im Kalender am 25.07. Ohne das
 * fehlt ueberall der letzte Freizeittag.
 *
 * Gerechnet wird in UTC, damit die Sommerzeit nicht hineinredet.
 */
function tagDanach(v: string): string {
  const d = new Date(`${v.slice(0, 10)}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

function zeitstempel(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** 'YYYY-MM-DD' aus einem Frontmatter-Wert, der auch ein Zeitstempel sein kann. */
function alsDatum(v: unknown): string | null {
  if (!v) return null
  const s = String(v).trim()
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : null
}

function baueOrt(d: Record<string, unknown>): string | null {
  const teile: string[] = []
  const name = String(d.veranstaltungsort ?? '').trim()
  const strasse = String(d.strasse ?? '').trim()
  const plz = String(d.plz ?? '').trim()
  const ort = String(d.ort ?? '').trim()

  if (name) teile.push(name)
  const adresse = [strasse, [plz, ort].filter(Boolean).join(' ')].filter(Boolean)
  // Wenn der Ortsname schon alles ist, was es gibt, nicht doppelt anhaengen.
  if (adresse.length && adresse.join(', ') !== name) teile.push(adresse.join(', '))

  return teile.length ? teile.join(', ') : null
}

function baueBeschreibung(d: Record<string, unknown>): string | null {
  const zeilen: string[] = []
  const text = String(d.description ?? '').trim()
  if (text) zeilen.push(text)

  const min = d.minAlter
  const max = d.maxAlter
  if (min != null || max != null) {
    zeilen.push(
      min != null && max != null
        ? `Für Teilnehmende von ${min} bis ${max} Jahren.`
        : min != null
          ? `Ab ${min} Jahren.`
          : `Bis ${max} Jahre.`
    )
  }
  return zeilen.length ? zeilen.join('\n\n') : null
}

export default defineEventHandler(async (event) => {
  const docs = await queryCollection(event, 'veranstaltung')
    .order('begin', 'ASC')
    .all()

  const basis = 'https://www.ec-nordbund.de'
  const termine: Termin[] = []

  for (const d of docs as unknown as Record<string, unknown>[]) {
    const beginn = alsDatum(d.begin)
    // Ohne Beginn laesst sich kein Termin bilden. Im Altbestand gibt es
    // Dateien mit fehlendem oder kaputtem Datum (dokumentiert in DEV-SETUP:
    // jugendfreizeit_2026.md) -- die wuerden sonst die ganze Datei
    // unbrauchbar machen.
    if (!beginn) continue

    // stem ist 'veranstaltung/<slug>'; die Detailseite liegt unter
    // /veranstaltungen/<slug>.
    const slug = String(d.stem ?? '').split('/').pop() ?? ''
    const titel = String(d.title ?? '').trim() || slug

    termine.push({
      // Stabil ueber die Lebensdauer: aendert sich ein Datum, erkennt der
      // Kalender denselben Termin wieder, statt einen zweiten anzulegen.
      uid: `veranstaltung-${slug}@ec-nordbund.de`,
      titel,
      beginn,
      ende: alsDatum(d.ende),
      ort: baueOrt(d),
      beschreibung: baueBeschreibung(d),
      url: slug ? `${basis}/veranstaltungen/${slug}` : `${basis}/veranstaltungen`
    })
  }

  const jetzt = zeitstempel(new Date())
  const zeilen: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EC-Nordbund//Veranstaltungen//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:EC-Nordbund: Veranstaltungen',
    'X-WR-TIMEZONE:Europe/Berlin',
    'X-WR-CALDESC:Freizeiten und Veranstaltungen des EC-Nordbund',
    // REFRESH-INTERVAL versteht der Grossteil, X-PUBLISHED-TTL Outlook.
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H'
  ]

  for (const t of termine) {
    zeilen.push('BEGIN:VEVENT')
    zeilen.push(`UID:${text(t.uid)}`)
    zeilen.push(`DTSTAMP:${jetzt}`)
    zeilen.push(`DTSTART;VALUE=DATE:${datum(t.beginn)}`)
    zeilen.push(`DTEND;VALUE=DATE:${tagDanach(t.ende ?? t.beginn)}`)
    zeilen.push(`SUMMARY:${text(t.titel)}`)
    if (t.ort) zeilen.push(`LOCATION:${text(t.ort)}`)
    if (t.beschreibung) zeilen.push(`DESCRIPTION:${text(t.beschreibung)}`)
    if (t.url) zeilen.push(`URL:${text(t.url)}`)
    // Freizeiten blockieren im Kalender des Abonnenten nichts.
    zeilen.push('TRANSP:TRANSPARENT')
    zeilen.push('END:VEVENT')
  }
  zeilen.push('END:VCALENDAR')

  setHeader(event, 'Content-Type', 'text/calendar; charset=utf-8')
  setHeader(event, 'Content-Disposition', 'inline; filename="ec-nordbund.ics"')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  // CRLF ist vorgeschrieben (RFC 5545); manche Kalender lesen eine Datei mit
  // reinen LF gar nicht erst ein.
  return zeilen.map(falte).join('\r\n') + '\r\n'
})
