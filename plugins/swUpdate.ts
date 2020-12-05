import { defineNuxtPlugin } from '@nuxtjs/composition-api'

export default defineNuxtPlugin((ctx) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
  }

  onUpdate((doUpdate) => {
    if (
      ctx.isDev ||
      window.confirm(
        'Eine neue Version ist verfügbar willst du sie laden? - Es dauert keine 5 Sekunden :D'
      )
    ) {
      doUpdate()
    }
  })

  async function onUpdate(updateReadyCB: (doUpdate: () => void) => void) {
    if (!navigator.serviceWorker) {
      return
    }

    if (!navigator.serviceWorker.controller) {
      return
    }

    navigator.serviceWorker.addEventListener('controllerchange', (ev) => {
      location.reload()
    })

    const updateFactory = (sw: ServiceWorker) => () =>
      sw.postMessage({ msg: 'update-sw' })

    const registration = (await navigator.serviceWorker.getRegistration())!

    if (registration.waiting) {
      updateReadyCB(updateFactory(registration.waiting))
      return
    }

    if (registration.installing) {
      updateReadyCB(updateFactory(registration.installing))
      return
    }

    registration.addEventListener('updatefound', (ev) => {
      const sw = registration.installing

      if (!sw) {
        return
      }

      sw.addEventListener('statechange', (ev) => {
        if (sw.state === 'installed') {
          updateReadyCB(updateFactory(sw))
        }
      })
    })
  }
})
