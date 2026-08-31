import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Dynamische Sitemap-URLs (fs-basiert, unabhängig von @nuxt/content-Interna).
 * Gleiche Logik wie die alte createSitemapRoutes() in nuxt.config.js:
 * Blog-Posts, Blog-Pagination (10/Seite), Veranstaltungen.
 * lastmod: `published` (blog) bzw. `begin` (veranstaltung) aus dem Frontmatter,
 * wo vorhanden — `updatedAt` existiert in @nuxt/content 3 nicht mehr.
 */

function resolveContentDir(): string {
  for (const candidate of [
    join(process.cwd(), 'content'),
    join(process.cwd(), 'cms-content', 'content'),
  ]) {
    if (existsSync(candidate)) {
      return candidate
    }
  }

  throw new Error('content-Verzeichnis nicht gefunden (Symlink content -> cms-content/content fehlt?)')
}

function mdStems(dir: string): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

/** Extrahiert ein Datum (YYYY-MM-DD) aus einem Frontmatter-Feld, tolerant. */
function frontmatterDate(file: string, field: string): string | undefined {
  try {
    const src = readFileSync(file, 'utf-8')
    const match = src.match(
      new RegExp(`^${field}:\\s*['"]?(\\d{4}-\\d{2}-\\d{2})`, 'm')
    )
    return match?.[1]
  } catch {
    return undefined
  }
}

export default defineSitemapEventHandler(() => {
  const contentDir = resolveContentDir()

  const urls: { loc: string; lastmod?: string }[] = []

  const blogDir = join(contentDir, 'blog')
  const blogStems = mdStems(blogDir)

  for (const stem of blogStems) {
    const lastmod = frontmatterDate(join(blogDir, `${stem}.md`), 'published')
    urls.push({ loc: `/blog/${stem}`, ...(lastmod ? { lastmod } : {}) })
  }

  // Blog-Pagination: /blog/1 .. /blog/ceil(n/10)
  for (let i = 1; i <= Math.ceil(blogStems.length / 10); i++) {
    urls.push({ loc: `/blog/${i}` })
  }

  const veranstaltungDir = join(contentDir, 'veranstaltung')

  for (const stem of mdStems(veranstaltungDir)) {
    const lastmod = frontmatterDate(
      join(veranstaltungDir, `${stem}.md`),
      'begin'
    )
    urls.push({ loc: `/veranstaltungen/${stem}`, ...(lastmod ? { lastmod } : {}) })
  }

  return urls
})
