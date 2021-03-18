const files = ['./.nuxt/stats/client.json']

const addPackages = [
  '@nuxtjs/composition-api', '@nuxt/content', 'nuxt', '@ec-nordbund/vuetify-module', '@nuxt/components', '@ec-nordbund/typescript-module',
  '@nuxtjs/sitemap',
  'nuxt-build-optimisations']

const okPackages = [
  // 'vue',
  // 'vue-meta',
  // 'vuetify',
  // 'vue2-leaflet',
  // 'vue2-leaflet-nuxt',
  // 'leaflet',
  // 'vue-router',
  // 'vue-client-only',

  // '@nuxt/components',
  // '@nuxt/content',
  // '@nuxtjs/composition-api',
  // '@vue/composition-api',

  // 'core-js',
  // 'property-information',
  // 'nuxt',

  // 'regenerator-runtime',
  // 'setimmediate',
  // 'timers-browserify',
  // 'process',
  // 'defu',
  // 'deepmerge',
  // '@babel/runtime',
  // 'html-webpack-plugin',
  // 'xtend',
  // 'webpack',
  // 'extract-css-chunks-webpack-plugin',
]

const packs = []

files.forEach((f) => {
  const items = require('fs')
    .readFileSync(f, 'utf-8')
    .split(/\\/)
    .filter((v) => v !== '')
    .join('/')
    .split(/\//)
    .filter((v) => v !== '')
    .join('/')
    .split(/node_modules\//)
    .filter((v, i) => i !== 0)
    .sort()
    .map((v) => v.split('\n')[0])
    .map((v) => v.split('/'))
    .map((v) => (v[0][0] === '@' ? v[0] + '/' + v[1] : v[0]))
    .map((v) => v.split('?')[0])

  items.push(...addPackages)

  const filItems = items.filter((v, i, t) => v !== items[i - 1]).sort()

  console.log(
    filItems
    // .filter((v) => !v.split('-').some((k) => k === 'loader'))
    // .filter((v) => !okPackages.includes(v))
  )

  packs.push(...filItems)
})

packs.forEach(p => {
  require('package-info')(p).then((data) => {
    if (data.license !== 'MIT' && data.license !== 'BSD-2-Clause') {
      console.log(data)
    }
  })
})

// const infos = packs
//   .sort()
//   .filter((v, i, t) => v !== t[i - 1])
//   .map((p) => {
//     const pp = require(p + '/package.json')

//     return {
//       name: pp.name,
//       version: pp.version,
//       repository: pp.repository,
//       license: pp.license,
//       author: pp.author || pp.contributors,
//     }
//   })
//   .map((p) => {
//     if (typeof p.author === 'object' && p.author.name) {
//       p.author = p.author.name
//     } else if (Array.isArray(p.author)) {
//       p.author = p.author.map((v) => v.name || v).join(' und ')
//     }

//     p.author = p.author
//       ?.split(/(.*)/)
//       .join('')
//       .split(/<.*>/)
//       .join('')
//       .split('  ')
//       .join('')
//       .split('  ')
//       .join('')
//       .split('  ')
//       .join('')
//       .split('  ')
//       .join('')
//       .split('  ')
//       .join('')
//       .split('  ')
//       .join('')
//       .trim()

//     p.repository = p.repository?.url || p.repository

//     if (typeof p.repository === 'string') {
//       p.repository = p.repository
//         .split('.git')
//         .join('')
//         .split('git+')
//         .join('')
//         .split('git@')
//         .join('')
//         .split('git://')
//         .join('')
//         .split('github.com:')
//         .join('')

//       if (!p.repository.startsWith('http')) {
//         if (p.repository.startsWith('github.com/')) {
//           p.repository = 'https://' + p.repository
//         } else {
//           p.repository = 'https://github.com/' + p.repository
//         }
//       }
//     }

//     if (!p.author) {
//       if (p.repository) {
//         p.author = p.repository.split('/')[3]
//       }
//     }

//     return p
//   })

// require('fs').writeFileSync('./content/packages.json', JSON.stringify(infos))
