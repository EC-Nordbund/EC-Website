import { joinURL } from 'ufo'

/**
 * Content-Asset-Pfade ('blog/x.jpg') base-URL-sicher auflösen.
 * Alt (Nuxt 2) waren die Pfade relativ zur Seite — das funktionierte nur auf
 * Routen ohne Trailing-Slash und bricht z. B. auf /blog/ (→ /blog/blog/x.jpg).
 */
let cachedBase: string | undefined

function baseURL(): string {
  if (cachedBase) return cachedBase
  try {
    // funktioniert im Setup-/Render-Kontext …
    cachedBase = useRuntimeConfig().app.baseURL || '/'
  } catch {
    // … aber nicht nach einem await in useAsyncData-Factories (NUXT_E1001).
    // Dort: Build-Env als Fallback (baseURL ist pro Build konstant).
    cachedBase =
      (import.meta.server
        ? process.env.NUXT_APP_BASE_URL || process.env.EC_SET_BASE
        : undefined) || '/'
  }
  return cachedBase
}

export function assetUrl(path?: string | null): string {
  if (!path) return ''
  if (path.startsWith('/') || path.startsWith('http')) return path
  return joinURL(baseURL(), path)
}
