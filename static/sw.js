const __DEV__ = false


if (!__DEV__) {

  /**
   * @type {ServiceWorkerGlobalScope & WindowOrWorkerGlobalScope}
   */
  const _self = self

  const __CONFIG__ = {
    CACHE_NAME: 'CACHE_V4',
    OFFLINE_URL: '/empty.html',
  }

  _self.addEventListener('install', ev => {
    ev.waitUntil((async () => {
      const cache = await caches.open(__CONFIG__.CACHE_NAME)
      await cache.add(__CONFIG__.OFFLINE_URL)
    })())
  })
  _self.addEventListener('activate', ev => {
    ev.waitUntil(
      (async () => {
        const keys = await caches.keys();

        await Promise.all(
          keys.map(async (key) => {
            if (key === __CONFIG__.CACHE_NAME) {
              return true;
            }
            return caches.delete(key);
          })
        );
      })()
    );
  })
  _self.addEventListener('fetch', ev => {
    if (ev.request.url.includes('analytics')) {
      return
    }

    if (ev.request.url.includes('_content')) {
      return
      const network = fetch(ev.request)
      const cache = _self.caches.match(ev.request)

      ev.respondWith((async () => {
        const cachedResponse = await cache;

        if (cachedResponse) {
          ev.waitUntil((async () => {
            if (!await cache) {
              const networkRes = await network

              const c = await _self.caches.open(__CONFIG__.CACHE_NAME)
              await c.put(ev.request, networkRes)
              if ('isNewerVersion') {
                _self.clients.get(ev.clientId).then((c) => {
                  c.postMessage({
                    tag: 'newVersion',
                    url: ev.request
                  })
                })
              }
            }
          })())

          return cachedResponse
        }

        return network
      })())



      return
    }

    if ((ev.request.url.split('ec-nordbund.de')[1] || ev.request.url).includes('.')) {
      ev.respondWith((async () => {
        const cache = await caches.open(__CONFIG__.CACHE_NAME)
        const cacheRes = await cache.match(ev.request)

        if (cacheRes) {
          return cacheRes
        }

        const network = await fetch(ev.request)
        if (network.status === 200 || network.status === 304) {
          const clonedRes = network.clone()

          ev.waitUntil(cache.put(ev.request, clonedRes))
        }

        return network
      })())

      return
    }

    if (ev.request.mode === 'navigate') {
      ev.respondWith((async () => {
        try {
          return await fetch(ev.request)
        } catch (ex) {
          const cache = await caches.open(__CONFIG__.CACHE_NAME)
          const cacheRes = await cache.match(__CONFIG__.OFFLINE_URL)

          if (!cacheRes) {
            return new Response('Du bist Offline und ein Fehler ist aufgetreten wurde.')
          }

          return cacheRes
        }
      })())

      return
    }
  })
  _self.addEventListener("message", (ev) => {
    if (ev.data && ev.data.msg === "update-sw") {
      _self.skipWaiting();
    }
  });
} else {
  throw 'SERVICE WORKER DARF IN PRODUCTION NICHT AUF DEV SEIN!'
}
