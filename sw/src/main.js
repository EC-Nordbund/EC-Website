import { supportsWebp } from './webP'

/**
 * @type {ServiceWorkerGlobalScope & WindowOrWorkerGlobalScope}
 */
const _self = self

const __CONFIG__ = {
  CACHE_NAME: 'CACHE_V3',
  OFFLINE_URL: '/empty.html',
}

/**
 *
 * @param {Request} request
 */
async function CACHE_FIRST(request, t = false) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  const network = await fetch(request)

  if (network.status === 200 && network.ok) {
    const cache = await caches.open(__CONFIG__.CACHE_NAME)
    await cache.put(request, network.clone())
  } else if (t) {
    throw '...'
  }

  return network
}

_self.addEventListener('install', (ev) => {
  ev.waitUntil(
    (async () => {
      const cache = await caches.open(__CONFIG__.CACHE_NAME)
      await cache.add(__CONFIG__.OFFLINE_URL)
    })()
  )
})

_self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    (async () => {
      const keys = await caches.keys()

      await Promise.all(
        keys.map(async (key) => {
          if (key === __CONFIG__.CACHE_NAME) {
            return true
          }
          return caches.delete(key)
        })
      )
    })()
  )
})

_self.addEventListener('message', (ev) => {
  if (ev.data && ev.data.msg === 'update-sw') {
    _self.skipWaiting()
    _self.clients.claim()
  }
})

_self.addEventListener('fetch', async (ev) => {
  if (ev.request.mode === 'navigate') {
    return
  }

  if (ev.request.url.endsWith('.jpg')) {
    ev.respondWith(
      (async () => {
        if (await supportsWebp()) {
          const webPRequest = new Request(
            ev.request.url.slice(0, ev.request.url.length - 4) + '.webp'
          )

          return CACHE_FIRST(webPRequest, true).catch(() =>
            CACHE_FIRST(ev.request)
          )
        } else {
          return CACHE_FIRST(ev.request)
        }
      })()
    )
  }

  const url = new URL(ev.request.url)

  if (url.pathname.includes('_nuxt')) {
    ev.respondWith(CACHE_FIRST(ev.request))
  }

  if (url.pathname.includes('_content')) {
    const network = fetch(request).catch(() => cache)
    const cache = caches.match(request).then((c) => c || network)

    ev.respondWith(Promise.race([network, cache]))
  }

  if (url.pathname.includes('.')) {
    ev.respondWith(CACHE_FIRST(ev.request))
  }
})
