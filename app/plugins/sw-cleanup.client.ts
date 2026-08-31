/**
 * Aufräum-Plugin: Die alte Nuxt-2-Seite hat (zeitweise) einen Service Worker
 * registriert. Damit Bestandsnutzer nicht auf einer veralteten, vom SW
 * gecachten Version hängen bleiben, werden alle noch vorhandenen
 * Registrierungen still deregistriert.
 */
export default defineNuxtPlugin(() => {
  try {
    if (!('serviceWorker' in navigator)) {
      return
    }

    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {})
        })
      })
      .catch(() => {})
  } catch {
    // still und fehlertolerant: Cleanup darf die Seite nie beeinträchtigen
  }
})
