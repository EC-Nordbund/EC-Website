/**
 * @nuxt/content 3 setzt den Quellordner in den stem ('blog/2020NeueWebsite').
 * Der alte Slug (und damit alle URLs) ist nur der Dateiname ohne Endung —
 * CamelCase/Umlaute bleiben erhalten.
 */
export function stemToSlug(stem: string): string {
  return stem.split('/').pop() ?? stem
}
