/**
 * Altersbereiche laut Blogbeitrag "Unsere Altersbereiche" (2026-09-01):
 * die vier Altersgruppen. Seminare ist bewusst KEIN Bereich — Seminare
 * laufen bereichsübergreifend und sind über den Tag "Seminar" abgedeckt.
 *
 * Die Reihenfolge hier bestimmt die Reihenfolge der Badges und Chips; die
 * Schlüssel müssen zu den Feldnamen im CMS (public/admin/config.yml) und zu
 * den Dateinamen unter assets/img/altersbereiche/ passen.
 *
 * `color` ist die Logofarbe des Bereichs. Vier Werte, die so auch schon in
 * vuetifyThemeColors stehen (lila / with / vgRot) bzw. neu sind (Jugend).
 * `textClass` ist der Vordergrund für den gefüllten Chip — weiß, außer beim
 * hellen Teens-Violett (dort 4.6:1 statt 3.2:1).
 */
export const ALTERSBEREICHE = [
  { key: 'kids', label: 'Kids', color: '#583a70', textClass: 'text-white' },
  {
    key: 'teens',
    label: 'Teens',
    color: '#9c8aa8',
    textClass: 'text-dunkelGrau'
  },
  { key: 'jugend', label: 'Jugend', color: '#216c77', textClass: 'text-white' },
  {
    key: 'je',
    label: 'Junge Erwachsene',
    color: '#c30a1e',
    textClass: 'text-white'
  }
] as const

export type Altersbereich = (typeof ALTERSBEREICHE)[number]
export type AltersbereichKey = Altersbereich['key']

export function altersbereichLabel(key: unknown): string {
  return ALTERSBEREICHE.find((b) => b.key === key)?.label ?? String(key ?? '')
}

/**
 * Die im CMS aktivierten Bereiche einer Veranstaltung, in fester Reihenfolge.
 * Unbekannte Schlüssel aus dem Frontmatter werden ignoriert — so kippt die
 * Seite nicht, wenn im CMS mal ein Feld umbenannt wird.
 */
export function aktiveAltersbereiche(
  altersbereiche: unknown
): readonly Altersbereich[] {
  const werte = (altersbereiche ?? {}) as Record<string, unknown>
  return ALTERSBEREICHE.filter((b) => werte[b.key] === true)
}
