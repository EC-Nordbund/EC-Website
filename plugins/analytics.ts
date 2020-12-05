// @ts-ignore
import { create } from 'ackee-tracker/src/scripts/main'
import { defineNuxtPlugin } from '@nuxtjs/composition-api'

export default defineNuxtPlugin((context) => {
  if (navigator.doNotTrack != '1') {
    const ackee = create(
      {
        server: 'https://analytics.ec-nordbund.de',
        domainId: '7e04b501-fc99-417a-b65a-3fd7e412050c',
      },
      {
        ignoreLocalhost: true,
        detailed: true,
      }
    )

    // @ts-expect-error
    context.app.router.afterEach(() => ackee.record())
  }
})
