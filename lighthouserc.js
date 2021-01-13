module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/datenschutz', 'http://localhost:3000/blog/', 'http://localhost:3000/veranstaltungen/'],
      startServerCommand: 'yarn start'
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://lh.ec-nordbund.de',
      // token: 'Your *build token* goes here', // could also use LHCI_TOKEN variable instead
    },
    assert: {
      preset: 'lighthouse:recommended',
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.70 }],
        "categories:accessibility": ["error", { "minScore": 0.98 }],
        "categories:pwa": ["error", { "minScore": 0.89 }],
        "categories:seo": ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 1 }],
        /**
         * User Farbschema geht sonst nicht
         * https://web.dev/color-contrast/?utm_source=lighthouse&utm_medium=cli
         */
        "color-contrast": "off",
        // Geht in CI nicht
        "redirects-http": "off",
        "uses-http2": "off",
        // Zu viel unsed JS + CSS
        "unused-css-rules": "warn",
        "unused-javascript": "warn",
        // Sollte bald wieder rein
        "uses-optimized-images": "warn",
        "content-width": "warn"
      }
    },
  }
}
