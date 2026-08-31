# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for EC-Nordbund (German Christian youth organization) at www.ec-nordbund.de. Built with **Nuxt 4** (static site generation via `nuxt generate`), **Vue 3**, **Vuetify 4** (via `vuetify-nuxt-module`), **@nuxt/content 3**, and **TypeScript**. Templates use **Pug** syntax; components use `<script setup lang="ts">` (some use `defineComponent` + `setup()`).

## Commands

```bash
npm run dev       # Dev server at localhost:3000
npm run build     # Production build
npm run generate  # Static site generation (creates .output/public/)
npm run preview   # Preview the generated site
npm run types     # Type check (vue-tsc --noEmit)
npm run lint      # ESLint (@nuxt/eslint)
```

Node 22 is required (see `.nvmrc`).

## Architecture

### Directory Layout (Nuxt 4 `app/` structure)

- `app/` — application code: `pages/`, `components/`, `layouts/`, `assets/`, `plugins/`, `composables/`, `app.vue`, `error.vue`
- Repo root — `nuxt.config.ts`, `content.config.ts`, `public/` (static assets, replaces old `static/`), `server/` (sitemap route), `content` symlink → `cms-content/content`, `cms-content/` (git submodule)

### Content Management

Content lives in the `cms-content/` git submodule (from EC-Nordbund/EC-Website-Content). After cloning, run `git submodule update --init` to populate it. Collections are defined in `content.config.ts` (`blog`, `veranstaltung`, `ort`, `datenschutz`, `krisenintervention`, `impressum`, `teilnahmebedingungen`, `orte`, `downloads`) with deliberately tolerant zod schemas — the content data is dirty (coerced strings/numbers); never "fix" the content repo, keep schemas tolerant instead.

**Slugs are `stem`-based**: the file name without extension is the URL slug (preserves CamelCase/umlaut slugs). Query layer maps `stem` → `slug` for templates.

Content fetching pattern used throughout pages:
```ts
const { data: page } = await useAsyncData('key' + (param ? `-${param}` : ''), () =>
  queryCollection('blog').where('stem', '=', id).first()
)
```

Rendered via `<ContentRenderer :value="page">`.

### Routing (app/pages/)

- `/` — Homepage
- `/blog/`, `/blog/[id].vue` — Blog; `[id]` is dual-role: numeric = pagination page (10 posts/page), otherwise post slug
- `/veranstaltungen/`, `/veranstaltungen/[id].vue` — Events
- `/anmeldung/` — Registration forms (token-based)
- `/downloads/[...slug].vue` — Catch-all for downloads (`params.slug` is an array)
- `/orte/` — Locations with Leaflet maps (`@nuxtjs/leaflet`)

Prerendering: `nitro.prerender` (crawlLinks) plus a `prerender:routes` hook in `nuxt.config.ts` that reads content directories from the filesystem. Sitemap via `@nuxtjs/sitemap` + `server/api/__sitemap__/urls.ts`. Deploy base path comes from `EC_SET_BASE` → `app.baseURL`.

### Components

All prefixed with `ec` (e.g., `ecHexaButton`, `ecBlogPage`, `ecCountdown`). Vuetify breakpoints via `useDisplay()`, scrolling via `useGoTo()` (both from `vuetify`).

### External APIs

- `https://api.ec-nordbund.de/nuxt` — Main API (registrations, data). Accessed via `helpers/fetch.ts`.
- `https://losungen.ec-nordbund.de` — Daily Bible verse service
- Analytics via custom Ackee instance (`app/plugins/analytics.client.ts`, client-only, respects DoNotTrack). Never change Ackee event IDs/domain ID/field names.

### Key Helpers / Composables

- `helpers/fetch.ts` — GET/POST wrapper (native fetch)
- `app/composables/validate.ts` — Form validation composable (`useValidation()`)
- `app/composables/alter.ts` — Age calculation (`useAlter()`)
- `app/composables/current-time.ts` — Reactive clock
- `app/plugins/sw-cleanup.client.ts` — Unregisters legacy service workers for returning visitors

### Styling

- Vuetify theme/colors configured in `nuxt.config.ts` (`vuetify.vuetifyOptions`, custom palette incl. `gradientLeft`/`gradientRight` etc.)
- Global SCSS in `app/assets/styles/global.scss`
- Custom fonts: Montserrat (`@fontsource/montserrat`), Goldney (in `app/assets/fonts/`); CSS load order matters (fonts before `global.scss`)
- Icons: MDI via `@mdi/js` SVG paths (`icons: { defaultSet: 'mdi-svg' }`) — import paths like `mdiFacebook` and bind `:icon`; no icon font, no string icon names

No store (Pinia/Vuex) — state is local via Composition API refs/computed.

## Deployment

CI (`.github/workflows/ci.yml`) runs on push, daily schedule, and `repository_dispatch` (triggered by content repo changes). `npm run generate` produces `.output/public/`, which is rsynced to the server.

- `main` branch → `www.ec-nordbund.de`
- Other branches → `dev.ec-nordbund.de/<branch>/`
- Content preview → `preview.ec-nordbund.de/<branch>/`

Static files from the content submodule (`cms-content/static/`: blog/veranstaltungen/download images, `old`) are **merged** into `.output/public/` during CI (rsync without delete; prerendered route HTML like `blog/<slug>/index.html` must never be removed). In the repo, `public/blog`, `public/veranstaltungen`, `public/download` are symlinks into `cms-content/static/`.

## Code Style

- Prettier: single quotes, 2-space indent
- ESLint: `@nuxt/eslint`
- EditorConfig: 2 spaces, UTF-8, LF line endings
- Pug templates stay Pug; URLs/slugs must never change
