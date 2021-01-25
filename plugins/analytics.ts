/* eslint-disable no-console */
import { Plugin } from '@nuxt/types'
// @ts-expect-error no import types (pending PR DefinitelyTyped/DefinitelyTyped #50817)
import { attributes, create } from 'ackee-tracker'
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals'

const __URL__ = 'https://analytics.ec-nordbund.de'
const __DOMAIN_ID__ = '7e04b501-fc99-417a-b65a-3fd7e412050c'
const __WEB_VITALS_EVENT_ID__ = '2851d51a-0085-4405-8c41-1805cd7dd390'
const __BOUNCE_EVENT_ID__ = '6a328551-2338-4b62-8b48-a99343baeab6'

const webVitals: [
  string,
  (cb: (metric: { value: number }) => void) => void
][] = [
  ['CLS', getCLS],
  ['FCP', getFCP],
  ['FID', getFID],
  ['LCP', getLCP],
  ['TTFB', getTTFB],
]

const plugin: Plugin = (ctx) => {
  // eslint-disable-next-line eqeqeq
  const DO_TRACKING = navigator.doNotTrack != '1'

  if (!DO_TRACKING) {
    return
  }
  const tracker = create(__URL__, {
    ignoreLocalhost: true,
    detailed: true,
    ignoreOwnVisits: false,
  })

  let stop: () => void

  const attrs = attributes(true)

  console.log('[TRACKING]', 'Daten die wir erhalten', attrs)

  stop = tracker.record(__DOMAIN_ID__).stop

  const bounced = true
  let bouncedId = ''
  const noBounce = () => {
    console.log(
      '[TRACKING]',
      'NO-BOUNCE tracked',
      'Du hast auf dieser Seite navigiert und sie nicht direkt verlassen.'
    )
    tracker.updateAction(bouncedId, { key: 'bounced', value: 0.000001 })
  }

  tracker.action(
    __BOUNCE_EVENT_ID__,
    {
      key: 'bounced',
      value: 100,
    },
    (eventId: string) => {
      bouncedId = eventId
      if (!bounced) {
        noBounce()
      }
    }
  )
  let first = true
  // @ts-expect-error app is not typed
  ctx.app.router.afterEach(() => {
    if (first) {
      first = false
      return
    }
    console.log('tracking afterEach')
    stop()
    stop = tracker.record(__DOMAIN_ID__).stop

    if (bounced) {
      noBounce()
    }
  })

  // Add web-vitals
  webVitals.forEach(([key, getter]) => {
    getter((metric) => {
      tracker.action(__WEB_VITALS_EVENT_ID__, {
        key,
        value: metric.value,
      })
      console.log('[WEB-VITALS-TRACKING]', key, metric.value)
    })
  })
}

export default plugin
