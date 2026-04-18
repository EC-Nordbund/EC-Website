# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for EC-Nordbund (German Christian youth organization) at www.ec-nordbund.de. Built with **Nuxt 2** (static site generation), **Vue 2** with Composition API, **Vuetify 2**, and **TypeScript**. Templates use **Pug** syntax.

## Commands

```bash
yarn dev          # Dev server at localhost:3000
yarn build        # Production build
yarn generate     # Static site generation (creates dist/)
yarn lint:js      # ESLint
yarn lint:style   # Stylelint
yarn lint         # Both linters
```

## Architecture

### Content Management

Content lives in the `cms-content/` git submodule (from EC-Nordbund/EC-Website-Content). After cloning, run `git submodule update --init` to populate it. The `@nuxt/content` module reads Markdown from `cms-content/content/` with collections for `blog`, `veranstaltung`, `datenschutz`, `downloads`, and `impressum`.

Content fetching pattern used throughout pages:
```js
const page = useStatic(async () => {
  return $content('collection', id).fetch()
}, dependency, cacheKey)
```

Rendered via `<nuxt-content :document="page">`.

### Routing (pages/)

- `/` — Homepage
- `/blog/`, `/blog/_id.vue` — Blog with pagination (10 posts/page)
- `/veranstaltungen/`, `/veranstaltungen/_id.vue` — Events
- `/anmeldung/` — Registration forms (token-based)
- `/downloads/_.vue` — Catch-all for downloads
- `/orte/` — Locations with Leaflet maps

### Components

All prefixed with `ec` (e.g., `ecHexaButton`, `ecBlogPage`, `ecCountdown`). Use `defineComponent` + `setup()` from `@nuxtjs/composition-api`.

### External APIs

- `https://api.ec-nordbund.de/nuxt` — Main API (registrations, data). Accessed via `helpers/fetch.ts`.
- `https://losungen.ec-nordbund.de` — Daily Bible verse service
- Analytics via custom Ackee instance (client-only, respects DoNotTrack)

### Key Helpers

- `helpers/fetch.ts` — GET/POST wrapper with SSR support
- `plugins/validate.ts` — Form validation composable (`useValidation()`)
- `plugins/alter.ts` — Age calculation (`useAlter()`)
- `helpers/useCurrentTime.ts` — Reactive clock

### Styling

- Vuetify theming with custom color palette (defined in `nuxt.config.js`)
- Global SCSS in `assets/styles/global.scss`
- Vuetify SCSS variables in `assets/styles/variables-vuetify.scss`
- Custom fonts: Montserrat, Goldney (in `assets/fonts/`)
- Icons: MDI via `@mdi/js` (SVG, tree-shakeable)

### Disabled Nuxt Features

Store (Vuex), middleware, fetch, and validate are explicitly disabled in `nuxt.config.js`. No Vuex — state is local via Composition API refs/computed.

## Deployment

CI runs on push, daily schedule, and `repository_dispatch` (triggered by content repo changes).

- `main` branch → `www.ec-nordbund.de`
- Other branches → `dev.ec-nordbund.de/<branch>/`
- Content preview → `preview.ec-nordbund.de/<branch>/`

Static files from the content submodule (`blog`, `veranstaltungen`, `download`, `old`) are symlinked into `dist/` during CI build.

## Code Style

- Prettier: single quotes, 2-space indent
- ESLint: `@nuxtjs/eslint-config-typescript` + Prettier integration
- EditorConfig: 2 spaces, UTF-8, LF line endings
