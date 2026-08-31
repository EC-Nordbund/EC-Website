import { defineContentConfig, defineCollection, z } from '@nuxt/content'

/**
 * WICHTIG: Die Schemas sind bewusst TOLERANT (Alt-Daten sind schmutzig:
 * plz mal Zahl mal " 6500 ", lat/long teils Strings, published teils mit
 * ungültigen Sekunden wie 2024-11-05T23:19:78). Frontmatter-Datumswerte
 * bleiben in @nuxt/content 3 Strings (YAML-1.2-Core-Schema) — ISO-sortierbar.
 * Kein Umbau des Content-Repos: Koersion statt Datenbereinigung.
 */

const looseString = z.coerce.string()
const looseNumber = z.coerce.number()

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
      lat: looseNumber.optional(),
      long: looseNumber.optional(),
      // Umlaut-Keys (allgemein/männlich/weiblich) → offenes Record
      warteliste: z.record(z.string(), z.any()).optional(),
      juleica: z.any().optional(),
      tags: z.array(z.string()).optional(),
      preise: z.any().optional(),
      anzahlung: z.any().optional(),
      minAlter: looseNumber.optional(),
      maxAlter: looseNumber.optional(),
      minTN: looseNumber.optional(),
      anmeldung: z.any().optional(),
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
      lat: looseNumber.optional(),
      long: looseNumber.optional(),
      personen: z.any().optional(),
      veranstaltungen: z.any().optional(),
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
      files: z.any().optional(),
      folders: z.any().optional(),
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
