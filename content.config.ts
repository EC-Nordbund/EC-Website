import { defineContentConfig, defineCollection, z } from '@nuxt/content'

/**
 * WICHTIG: Die Schemas sind bewusst TOLERANT (Alt-Daten sind schmutzig:
 * plz mal Zahl mal " 6500 ", lat/long teils Strings, published teils mit
 * ungültigen Sekunden wie 2024-11-05T23:19:78). Frontmatter-Datumswerte
 * bleiben in @nuxt/content 3 Strings (YAML-1.2-Core-Schema) — ISO-sortierbar.
 * Kein Umbau des Content-Repos: Koersion statt Datenbereinigung.
 */

const looseString = z.coerce.string()
// NaN-sicher: Number('abc')/Number(undefined) => NaN würde als unquoted
// Literal in die SQLite-Dump-INSERTs geschrieben ("no such column: NaN")
// und JEDE Query zum Absturz bringen — daher auf undefined abbilden.
const looseNumber = z.preprocess((v) => {
  if (v === undefined || v === null || v === '') return undefined
  const n = Number(v)
  return Number.isNaN(n) ? undefined : n
}, z.number().optional())

const blog = defineCollection({
  type: 'page',
  source: 'blog/*.md',
  schema: z
    .object({
      title: looseString.optional(),
      published: looseString.optional(),
      description: looseString.optional(),
      featuredImage: looseString.optional(),
      tags: z.array(z.string()).optional(),
    })
    .passthrough(),
})

const veranstaltung = defineCollection({
  type: 'page',
  source: 'veranstaltung/*.md',
  schema: z
    .object({
      veranstaltungsID: looseNumber.optional(),
      title: looseString.optional(),
      begin: looseString.optional(),
      ende: looseString.optional(),
      description: looseString.optional(),
      featuredImage: looseString.optional(),
      images: z.array(z.string()).optional(),
      veranstaltungsort: looseString.optional(),
      strasse: looseString.optional(),
      plz: looseString.optional(),
      ort: looseString.optional(),
      // Als String-Spalte: Alt-Daten enthalten kaputte Werte wie
      // '54.782.670' — als number-Spalte landet NaN unquoted im SQL-Dump
      lat: looseString.optional(),
      long: looseString.optional(),
      // Umlaut-Keys (allgemein/männlich/weiblich) → offenes Record
      warteliste: z.record(z.string(), z.any()).optional(),
      // WICHTIG: z.any()-Spalten werden von @nuxt/content mit String()
      // serialisiert ('[object Object]') — strukturierte Felder MÜSSEN
      // als z.array/z.record typisiert sein, damit sie JSON-Spalten werden.
      juleica: z.preprocess(
        (v) => v === true || v === 'true',
        z.boolean()
      ).optional(),
      tags: z.array(z.string()).optional(),
      preise: z.array(z.record(z.string(), z.any())).optional(),
      anzahlung: looseNumber.optional(),
      minAlter: looseNumber.optional(),
      maxAlter: looseNumber.optional(),
      minTN: looseNumber.optional(),
      anmeldung: z.record(z.string(), z.any()).optional(),
    })
    .passthrough(),
})

const ort = defineCollection({
  type: 'page',
  source: 'ort/*.md',
  schema: z
    .object({
      title: looseString.optional(),
      strasse: looseString.optional(),
      plz: looseString.optional(),
      ort: looseString.optional(),
      // Als String-Spalte: Alt-Daten enthalten kaputte Werte wie
      // '54.782.670' — als number-Spalte landet NaN unquoted im SQL-Dump
      lat: looseString.optional(),
      long: looseString.optional(),
      personen: z.array(z.record(z.string(), z.any())).optional(),
      veranstaltungen: z.array(z.record(z.string(), z.any())).optional(),
    })
    .passthrough(),
})

const datenschutz = defineCollection({
  type: 'page',
  source: 'datenschutz/*.md',
})

const krisenintervention = defineCollection({
  type: 'page',
  source: 'krisenintervention/*.md',
})

const impressum = defineCollection({
  type: 'page',
  source: 'impressum.md',
})

const teilnahmebedingungen = defineCollection({
  type: 'page',
  source: 'teilnahmebedingungen.md',
})

const orte = defineCollection({
  type: 'page',
  source: 'orte.md',
})

const downloads = defineCollection({
  type: 'data',
  source: 'downloads.yml',
  schema: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      files: z.array(z.record(z.string(), z.any())).optional(),
      folders: z.record(z.string(), z.any()).optional(),
    })
    .passthrough(),
})

// NICHT aufgenommen (bewusst, kein Glob trifft sie): api/**, packages.json,
// old-news-slugs.json, startseite.yml, pages/**, anmeldephase.yml
export default defineContentConfig({
  collections: {
    blog,
    veranstaltung,
    ort,
    datenschutz,
    krisenintervention,
    impressum,
    teilnahmebedingungen,
    orte,
    downloads,
  },
})
