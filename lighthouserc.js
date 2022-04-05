module.exports = {
  ci: {
    collect: {
      url: [
        'https://lighthouse.ec-nordbund.de/',
        'https://lighthouse.ec-nordbund.de/datenschutz/',
        'https://lighthouse.ec-nordbund.de/blog/',
        'https://lighthouse.ec-nordbund.de/veranstaltungen/',
      ]
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://lh.ec-nordbund.de',
      // token: 'Your *build token* goes here', // could also use LHCI_TOKEN variable instead
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['error', { minScore: 0.3 }],
        'categories:accessibility': ['error', { minScore: 0.98 }],
        'categories:seo': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'csp-xss': 'warn',
        /**
         * User Farbschema geht sonst nicht
         * https://web.dev/color-contrast/?utm_source=lighthouse&utm_medium=cli
         */
        'color-contrast': 'off',
        // Zu viel unsed JS + CSS
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        // Sollte bald wieder rein
        'uses-optimized-images': 'warn',
        'content-width': 'warn',
        'non-composited-animations': 'warn'
      },
    },
  },
}
