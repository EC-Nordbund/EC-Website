/**
 * Altersbereiche laut Blogpost "Unsere Altersbereiche" (2026-09-01):
 * vier Altersgruppen plus die bereichsübergreifenden Seminare.
 *
 * Die Reihenfolge hier bestimmt die Reihenfolge der Badges und Chips —
 * die Schlüssel müssen zu den Feldnamen im CMS (public/admin/config.yml)
 * und zu den Dateinamen unter assets/img/altersbereiche/ passen.
 */
export const ALTERSBEREICHE = [
  { key: 'kids', label: 'Kids' },
  { key: 'teens', label: 'Teens' },
  { key: 'jugend', label: 'Jugend' },
  { key: 'je', label: 'Junge Erwachsene' },
  { key: 'seminare', label: 'Seminare' }
] as const

export type AltersbereichKey = (typeof ALTERSBEREICHE)[number]['key']

export function altersbereichLabel(key: unknown): string {
  return (
    ALTERSBEREICHE.find((b) => b.key === key)?.label ?? String(key ?? '')
  )
}

/**
 * Die im CMS aktivierten Bereiche einer Veranstaltung, in fester Reihenfolge.
 * Unbekannte Schlüssel aus dem Frontmatter werden ignoriert — so kippt die
 * Seite nicht, wenn im CMS mal ein Feld umbenannt wird.
 */
export function aktiveAltersbereiche(
  altersbereiche: unknown
): { key: AltersbereichKey; label: string }[] {
  const werte = (altersbereiche ?? {}) as Record<string, unknown>
  return ALTERSBEREICHE.filter((b) => werte[b.key] === true).map((b) => ({
    key: b.key,
    label: b.label
  }))
}
