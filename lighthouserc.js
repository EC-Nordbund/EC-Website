module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/datenschutz',
        'http://localhost:3000/blog/',
        'http://localhost:3000/veranstaltungen/',
      ],
      startServerCommand: 'yarn start',
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://lh.ec-nordbund.de',
      // token: 'Your *build token* goes here', // could also use LHCI_TOKEN variable instead
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        // 'categories:performance': ['error', { minScore: 0.6 }],
        // 'categories:accessibility': ['error', { minScore: 0.90 }],
        // 'categories:pwa': ['error', { minScore: 0 }],
        // 'categories:seo': ['error', { minScore: 0.92 }],
        // 'categories:best-practices': ['error', { minScore: 1 }],
        /**
         * User Farbschema geht sonst nicht
         * https://web.dev/color-contrast/?utm_source=lighthouse&utm_medium=cli
         */
        'color-contrast': 'off',
        // Geht in CI nicht
        'redirects-http': 'off',
        'uses-http2': 'off',
        // Zu viel unsed JS + CSS
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        // Sollte bald wieder rein
        'uses-optimized-images': 'warn',
        'content-width': 'warn',
        'non-composited-animations': 'warn',
        // Probleme in CI
        'canonical': 'off',
        // TODO: Missing Losung shouldbe fixed until Feb. 2022
        'errors-in-console': new Date().getTime() < Date.UTC(2022, 2, 1) ? 'off' : 'error',
        'csp-xss': new Date().getTime() < Date.UTC(2022, 2, 1) ? 'off' : 'error'
      },
    },
  },
}
