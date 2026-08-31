/**
 * Alt-Daten: Tags sind meist Strings, vereinzelt Objekte der Form { tag }.
 * Als Util statt Template-Cast — TS-Syntax in Pug-Templates crasht Vite.
 */
export function tagLabel(tag: unknown): string {
  if (tag && typeof tag === 'object') {
    return String((tag as { tag?: string }).tag ?? '')
  }
  return String(tag ?? '')
}
