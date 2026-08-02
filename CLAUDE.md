# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for EC-Nordbund (German Christian youth organization) at www.ec-nordbund.de. Built with **Nuxt 3** (static site generation via Nitro), **Vue 3** with Composition API, **Vuetify 3**, and **TypeScript**. Templates use **Pug** syntax. Build tool is **Vite**.

## Commands

```bash
yarn dev          # Dev server at localhost:3000
yarn build        # Production build
yarn generate     # Static site generation (creates .output/public/)
yarn preview      # Preview generated site
yarn lint         # ESLint
```

## Architecture

### Content Management

Content lives in the `cms-content/` git submodule (from EC-Nordbund/EC-Website-Content). After cloning, run `git submodule update --init` to populate it. The `@nuxt/content` v2 module reads Markdown from `cms-content/content/` with collections for `blog`, `veranstaltung`, `datenschutz`, `downloads`, and `impressum`.

Content fetching pattern used throughout pages:
```ts
const { data: page } = await useAsyncData('key', () =>
  queryContent('collection', id).findOne()
)
```

Rendered via `<ContentRenderer :value="page">`.

### Routing (pages/)

- `/` — Homepage
- `/blog/`, `/blog/[id].vue` — Blog with pagination (10 posts/page)
- `/veranstaltungen/`, `/veranstaltungen/[id].vue` — Events
- `/anmeldung/` — Registration forms (token-based)
- `/downloads/[...slug].vue` — Catch-all for downloads
- `/orte/` — Locations with Leaflet maps

### Components

All prefixed with `ec` (e.g., `ecHexaButton`, `ecBlogPage`, `ecCountdown`). Use `defineComponent` + `setup()` from `vue`. Vuetify breakpoints accessed via `useDisplay()` from `vuetify`.

### External APIs

- `https://api.ec-nordbund.de/nuxt` — Main API (registrations, data). Accessed via `helpers/fetch.ts` using Nuxt 3 `$fetch`.
- `https://losungen.ec-nordbund.de` — Daily Bible verse service
- Analytics via custom Ackee instance (client-only, respects DoNotTrack)

### Key Helpers

- `helpers/fetch.ts` — GET/POST wrapper using `$fetch`
- `plugins/validate.ts` — Form validation composable (`useValidation()`)
- `plugins/alter.ts` — Age calculation (`useAlter()`)
- `helpers/current-time.ts` — Reactive clock
- `plugins/vuetify.ts` — Vuetify 3 plugin setup with custom theme colors

### Styling

- Vuetify theming with custom color palette (defined in `plugins/vuetify.ts` and `nuxt.config.ts`)
- Global SCSS in `assets/styles/global.scss`
- Vuetify SCSS variables in `assets/styles/variables-vuetify.scss`
- Custom fonts: Montserrat, Goldney (in `assets/fonts/`)
- Icons: MDI via `@mdi/js` (SVG, tree-shakeable)
- CSS variables: use `rgb(var(--v-theme-colorname))` pattern

### State Management

No Pinia/Vuex — state is local via Composition API refs/computed. Page meta set via `useHead()` / `useSeoMeta()`.

## Deployment

CI runs on push, daily schedule, and `repository_dispatch` (triggered by content repo changes). Uses Node 20.

- `main` branch → `www.ec-nordbund.de`
- Other branches → `dev.ec-nordbund.de/<branch>/`
- Content preview → `preview.ec-nordbund.de/<branch>/`

Static files from the content submodule (`blog`, `veranstaltungen`, `download`, `old`) are copied into `.output/public/` during CI build.

## Code Style

- Prettier: single quotes, 2-space indent
- EditorConfig: 2 spaces, UTF-8, LF line endings
