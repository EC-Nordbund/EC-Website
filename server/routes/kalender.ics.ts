import { queryCollection } from '@nuxt/content/server'
import { aktiveAltersbereiche } from '../../app/utils/altersbereiche'

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
  /** Dieselben Angaben als HTML -- Outlook rendert das (X-ALT-DESC). */
  html?: string | null
  url?: string | null
  /** Absolute URL des Titelbilds. */
  bild?: string | null
  /** 'lat;long' fuer GEO, nur bei plausiblen Werten. */
  geo?: string | null
  kategorien?: string[]
  /** Anmeldestart als eigener, kurzer Termin. */
  anmeldestart?: Date | null
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

/**
 * Kaputte Koordinaten gibt es im Altbestand ('54.782.670', siehe
 * content.config.ts). GEO mit Unsinn drin laesst Apple den Termin ohne Karte
 * anzeigen -- oder die Datei ganz ablehnen. Deshalb streng pruefen.
 */
function baueGeo(d: Record<string, unknown>): string | null {
  const lat = Number(String(d.lat ?? '').trim())
  const lon = Number(String(d.long ?? '').trim())

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null
  if (lat === 0 && lon === 0) return null

  return `${lat.toFixed(6)};${lon.toFixed(6)}`
}

/** 'veranstaltungen/AF/AF4.jpg' -> absolute URL. */
function baueBild(d: Record<string, unknown>, basis: string): string | null {
  const pfad = String(d.featuredImage ?? '').trim()
  if (!pfad) return null
  if (pfad.startsWith('http')) return pfad

  // Die Bilder unter images[] stehen im CMS ohne Endung; featuredImage hat
  // sie, aber verlassen kann man sich darauf nicht.
  const mitEndung = /\.(jpe?g|png|webp|gif)$/i.test(pfad) ? pfad : `${pfad}.jpg`
  return `${basis}/${mitEndung.replace(/^\/+/, '')}`
}

function bildTyp(url: string): string {
  if (/\.png$/i.test(url)) return 'image/png'
  if (/\.webp$/i.test(url)) return 'image/webp'
  if (/\.gif$/i.test(url)) return 'image/gif'
  return 'image/jpeg'
}

/** 'YYYY-MM-DD' -> '30.11.2020' */
function deutsch(v: string): string {
  return v.slice(0, 10).split('-').reverse().join('.')
}

function euro(v: unknown): string {
  const n = Number(v)
  if (!Number.isFinite(n)) return ''
  return Number.isInteger(n) ? `${n} €` : `${n.toFixed(2).replace('.', ',')} €`
}

/**
 * Preisstaffel als eine Zeile: "Frühbucher 105 € (bis 30.11.2020) · Normal
 * 116 € · Last-Minute 128 € (ab 16.08.2021)".
 */
function bauePreise(d: Record<string, unknown>): string | null {
  const liste = Array.isArray(d.preise) ? d.preise : []
  const teile: string[] = []

  for (const eintrag of liste as Record<string, unknown>[]) {
    const betrag = euro(eintrag.preis)
    if (!betrag) continue

    const label = String(eintrag.label ?? '').trim()
    const von = alsDatum(eintrag.begin)
    const bis = alsDatum(eintrag.ende)
    const zeitraum = bis
      ? ` (bis ${deutsch(bis)})`
      : von
        ? ` (ab ${deutsch(von)})`
        : ''

    teile.push(`${label ? `${label} ` : ''}${betrag}${zeitraum}`)
  }

  return teile.length ? teile.join(' · ') : null
}

/** Altersangabe, entweder als Alter oder als Jahrgang. */
function baueAlter(d: Record<string, unknown>): string | null {
  const min = d.minAlter
  const max = d.maxAlter
  if (min != null || max != null) {
    if (min != null && max != null) {
      return `Für Teilnehmende von ${min} bis ${max} Jahren.`
    }
    return min != null ? `Ab ${min} Jahren.` : `Bis ${max} Jahre.`
  }

  const anmeldung = (d.anmeldung ?? {}) as Record<string, unknown>
  const jgMin = anmeldung.jahrgangMin
  const jgMax = anmeldung.jahrgangMax
  if (jgMin != null && jgMax != null) {
    return `Für die Jahrgänge ${jgMin} bis ${jgMax}.`
  }
  if (jgMin != null) return `Für Jahrgang ${jgMin} und jünger.`
  if (jgMax != null) return `Für Jahrgang ${jgMax} und älter.`

  return null
}

/** Wortlaut wie auf der Detailseite (app/pages/veranstaltungen/[id].vue). */
function baueWarteliste(d: Record<string, unknown>): string | null {
  const wl = (d.warteliste ?? {}) as Record<string, unknown>
  const hinweise: string[] = []

  if (wl.allgemein) hinweise.push('Nur noch Warteliste')
  if (wl['männlich']) hinweise.push('Für Männer nur noch Warteliste')
  if (wl['weiblich']) hinweise.push('Für Frauen nur noch Warteliste')

  return hinweise.length ? hinweise.join(' · ') : null
}

function anmeldeZeitpunkt(d: Record<string, unknown>): Date | null {
  const anmeldung = (d.anmeldung ?? {}) as Record<string, unknown>
  const roh = String(anmeldung.startAt ?? '').trim()
  if (!roh) return null

  const zeit = new Date(roh)
  return Number.isNaN(zeit.getTime()) ? null : zeit
}

/** '08.11.2020, 15:00 Uhr' -- die Zeit in deutscher Ortszeit. */
function deutscheZeit(d: Date): string {
  const formatiert = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
  return `${formatiert} Uhr`
}

/**
 * Die Angaben, die sonst nur auf der Detailseite stehen: Alter, Preise,
 * Anmeldung, Warteliste, Juleica, Ort, Links.
 *
 * Als Fliesstext mit Zeilenumbruechen, weil DESCRIPTION reiner Text ist --
 * jedes Kalenderprogramm zeigt ihn ungestylt an. Die formatierte Fassung
 * liefert baueHtml() daneben.
 */
function baueAbsaetze(
  d: Record<string, unknown>,
  extra: { url: string }
): string[] {
  const absaetze: string[] = []
  const einleitung = String(d.description ?? '').trim()
  if (einleitung) absaetze.push(einleitung)

  const fakten: string[] = []
  const alter = baueAlter(d)
  if (alter) fakten.push(alter)

  const bereiche = aktiveAltersbereiche(d.altersbereiche)
  if (bereiche.length) {
    fakten.push(
      `Altersbereich: ${bereiche.map((b) => b.label).join(', ')}`
    )
  }

  const preise = bauePreise(d)
  if (preise) fakten.push(`Preis: ${preise}`)

  const anzahlung = euro(d.anzahlung)
  if (anzahlung) fakten.push(`Anzahlung: ${anzahlung}`)

  const start = anmeldeZeitpunkt(d)
  const anmeldung = (d.anmeldung ?? {}) as Record<string, unknown>
  if (anmeldung.disabled === true) {
    fakten.push('Anmeldung zurzeit geschlossen.')
  } else if (start) {
    fakten.push(`Anmeldung ab ${deutscheZeit(start)}`)
  }

  const warteliste = baueWarteliste(d)
  if (warteliste) fakten.push(warteliste)

  if (d.juleica === true) fakten.push('Zählt für die JuLeiCa-Fortbildung.')
  // Der Ort steht in LOCATION und wird von jedem Kalender angezeigt -- ihn
  // hier zu wiederholen, macht die Beschreibung nur laenger.

  if (fakten.length) absaetze.push(fakten.join('\n'))

  // Nur der Link zur Seite, nicht zum Bild: das Bild haengt als IMAGE und
  // ATTACH am Termin und steht in der HTML-Fassung fuer Outlook -- eine nackte
  // .jpg-URL im Fliesstext waere fuer die Lesenden nur Rauschen.
  // Immer der letzte Absatz; die HTML-Fassung ersetzt ihn durch einen Link.
  absaetze.push(`Alle Infos und Anmeldung: ${extra.url}`)

  return absaetze
}

/** Fuer X-ALT-DESC: Outlook rendert das inklusive Bild. */
function html(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function baueHtml(extra: {
  url: string
  bild: string | null
  titel: string
  absaetze: string[]
}): string {
  const zeilen: string[] = ['<html><body>']

  if (extra.bild) {
    zeilen.push(
      `<p><img src="${html(extra.bild)}" alt="${html(extra.titel)}" style="max-width:100%;height:auto" /></p>`
    )
  }

  // Dieselben Absaetze wie im Klartext, damit beide Fassungen nicht
  // auseinanderlaufen -- ohne den letzten: die nackte URL wird hier zum Link.
  for (const absatz of extra.absaetze.slice(0, -1)) {
    zeilen.push(`<p>${html(absatz).replace(/\n/g, '<br />')}</p>`)
  }

  zeilen.push(
    `<p><a href="${html(extra.url)}">Alle Infos und Anmeldung auf ec-nordbund.de</a></p>`
  )
  zeilen.push('</body></html>')
  return zeilen.join('')
}

function baueKategorien(d: Record<string, unknown>): string[] {
  const kategorien = new Set<string>()

  for (const tag of Array.isArray(d.tags) ? d.tags : []) {
    const s = String(tag).trim()
    if (s) kategorien.add(s)
  }
  for (const bereich of aktiveAltersbereiche(d.altersbereiche)) {
    kategorien.add(bereich.label)
  }
  if (d.juleica === true) kategorien.add('JuLeiCa')

  return [...kategorien]
}

export default defineEventHandler(async (event) => {
  const docs = await queryCollection(event, 'veranstaltung')
    .order('begin', 'ASC')
    .all()

  const basis = 'https://www.ec-nordbund.de'
  const termine: Termin[] = []

  /**
   * Zeitfenster: das laufende und das vergangene Kalenderjahr, dazu alles,
   * was noch kommt. Ohne das landen ueber hundert Termine ab 2021 im Kalender
   * jedes Abonnenten -- die letzte Freizeit soll man aber noch finden.
   *
   * Gerechnet wird beim `generate`, der Feed ist also so aktuell wie der
   * letzte Build. Der laeuft bei jeder Content-Aenderung; zum Jahreswechsel
   * verschiebt sich das Fenster mit dem naechsten Build.
   */
  const grenze = `${new Date().getUTCFullYear() - 1}-01-01`

  for (const d of docs as unknown as Record<string, unknown>[]) {
    const beginn = alsDatum(d.begin)
    // Ohne Beginn laesst sich kein Termin bilden. Im Altbestand gibt es
    // Dateien mit fehlendem oder kaputtem Datum (dokumentiert in DEV-SETUP:
    // jugendfreizeit_2026.md) -- die wuerden sonst die ganze Datei
    // unbrauchbar machen.
    if (!beginn) continue

    const ende = alsDatum(d.ende)
    if ((ende ?? beginn) < grenze) continue

    // stem ist 'veranstaltung/<slug>'; die Detailseite liegt unter
    // /veranstaltungen/<slug>.
    const slug = String(d.stem ?? '').split('/').pop() ?? ''
    const titel = String(d.title ?? '').trim() || slug
    const url = slug
      ? `${basis}/veranstaltungen/${slug}`
      : `${basis}/veranstaltungen`
    const ort = baueOrt(d)
    const bild = baueBild(d, basis)
    const absaetze = baueAbsaetze(d, { url })
    const beschreibung = absaetze.join('\n\n')

    termine.push({
      // Stabil ueber die Lebensdauer: aendert sich ein Datum, erkennt der
      // Kalender denselben Termin wieder, statt einen zweiten anzulegen.
      uid: `veranstaltung-${slug}@ec-nordbund.de`,
      titel,
      beginn,
      ende,
      ort,
      beschreibung,
      html: baueHtml({ url, bild, titel, absaetze }),
      url,
      bild,
      geo: baueGeo(d),
      kategorien: baueKategorien(d),
      // Nur kuenftige Anmeldestarts. Ein Termin "Anmeldestart" von vor einem
      // Jahr hilft niemandem mehr -- den Zeitpunkt nicht zu verpassen, ist der
      // einzige Zweck dieser Eintraege. Der Stichtag ist die Bauzeit.
      anmeldestart:
        (d.anmeldung as Record<string, unknown>)?.disabled === true
          ? null
          : (() => {
              const zeit = anmeldeZeitpunkt(d)
              return zeit && zeit.getTime() > Date.now() ? zeit : null
            })()
    })
  }

  const jetzt = zeitstempel(new Date())
  const zeilen: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EC-Nordbund//Veranstaltungen//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    // NAME/DESCRIPTION sind die standardisierten Fassungen (RFC 7986), die
    // X-WR-Varianten versteht der Bestand an aelteren Clients.
    'NAME:EC-Nordbund: Veranstaltungen',
    'X-WR-CALNAME:EC-Nordbund: Veranstaltungen',
    'DESCRIPTION:Freizeiten und Veranstaltungen des EC-Nordbund',
    'X-WR-CALDESC:Freizeiten und Veranstaltungen des EC-Nordbund',
    'X-WR-TIMEZONE:Europe/Berlin',
    'COLOR:yellowgreen',
    `SOURCE;VALUE=URI:${basis}/kalender.ics`,
    `IMAGE;VALUE=URI;DISPLAY=BADGE;FMTTYPE=image/png:${basis}/favicon_512.png`,
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
    if (t.geo) zeilen.push(`GEO:${t.geo}`)
    if (t.beschreibung) zeilen.push(`DESCRIPTION:${text(t.beschreibung)}`)
    // Outlook zeigt diese Fassung statt DESCRIPTION -- mit Bild und Links.
    // Alle anderen ignorieren die Eigenschaft.
    if (t.html) {
      zeilen.push(`X-ALT-DESC;FMTTYPE=text/html:${text(t.html)}`)
    }
    if (t.url) zeilen.push(`URL:${text(t.url)}`)
    if (t.kategorien?.length) {
      zeilen.push(`CATEGORIES:${t.kategorien.map(text).join(',')}`)
    }
    if (t.bild) {
      // Zwei Wege zum selben Bild: IMAGE ist das Richtige (RFC 7986), ATTACH
      // das, was aeltere Clients kennen. Google und Apple zeigen beides nicht
      // im Termin an -- dort hilft nur der Link in der Beschreibung.
      zeilen.push(
        `IMAGE;VALUE=URI;DISPLAY=BADGE;FMTTYPE=${bildTyp(t.bild)}:${text(t.bild)}`
      )
      zeilen.push(
        `ATTACH;FMTTYPE=${bildTyp(t.bild)};VALUE=URI:${text(t.bild)}`
      )
    }
    zeilen.push('CONTACT:EC-Nordbund\\, info@ec-nordbund.de')
    zeilen.push('STATUS:CONFIRMED')
    // Freizeiten blockieren im Kalender des Abonnenten nichts.
    zeilen.push('TRANSP:TRANSPARENT')
    zeilen.push('END:VEVENT')

    if (!t.anmeldestart) continue

    /**
     * Der Anmeldestart als eigener, kurzer Termin: wer ihn nicht verpassen
     * will, braucht ihn zur Uhrzeit im Kalender und nicht als Satz in der
     * Beschreibung einer Freizeit, die ein halbes Jahr spaeter liegt.
     *
     * Fester Zeitpunkt in UTC (Z), damit keine VTIMEZONE-Definition noetig
     * ist -- das Frontmatter liefert startAt bereits in UTC.
     */
    const bis = new Date(t.anmeldestart.getTime() + 15 * 60 * 1000)
    zeilen.push('BEGIN:VEVENT')
    zeilen.push(`UID:${text(t.uid.replace('@', '-anmeldung@'))}`)
    zeilen.push(`DTSTAMP:${jetzt}`)
    zeilen.push(`DTSTART:${zeitstempel(t.anmeldestart)}`)
    zeilen.push(`DTEND:${zeitstempel(bis)}`)
    zeilen.push(`SUMMARY:${text(`Anmeldestart: ${t.titel}`)}`)
    zeilen.push(
      `DESCRIPTION:${text(
        `Ab jetzt ist die Anmeldung für „${t.titel}“ geöffnet.\n\n${t.url}`
      )}`
    )
    if (t.url) zeilen.push(`URL:${text(t.url)}`)
    zeilen.push('CATEGORIES:Anmeldestart')
    zeilen.push('STATUS:CONFIRMED')
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
