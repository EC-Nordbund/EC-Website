import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs'

const base = './.nuxt/dist'

function handleDir(dir) {
  readdirSync(dir).forEach((fileOrFolder) => {
    const combined = dir + '/' + fileOrFolder

    if (statSync(combined).isFile()) {
      if (combined.endsWith('.css')) {
        handleFile(combined)
      }
    } else {
      handleDir(combined)
    }

  })
}


function handleFile(file) {
  let content = readFileSync(file, 'utf-8')

  let len = 0

  while (content.length !== len) {
    len = content.length

    content = handleContents(content)
  }

  writeFileSync(file, content)
}

// TODO: optimize multiple css selectors
function handleContents(content) {
  return content.split('}')
    .filter(v => {
      const sel = v.split('{')[0]
      // sel.includes(':not') ||
      return sel.split(',').every(selector =>
        !selector.includes('.v-application--is-rtl') && !selector.includes('.v-toolbar__items') && !selector.includes('[dir=rtl]') && !(selector.includes('rounded') && !selector.includes('0')) &&
        !selector.includes('.v-navigation-drawer--mini-variant') && !selector.includes('.v-text-field--enclosed') && !selector.includes('.v-text-field--outlined') &&
        !selector.includes('.v-select--chips') && !selector.includes('.v-input--dense') && !selector.includes('v-toolbar--prominen') &&
        !selector.includes('order') && !selector.includes('.v-card--disabled') && !selector.includes('.v-app-bar--fixed') && !selector.includes('.v-app-bar--fade-img-on-scroll') &&
        !selector.includes('.v-toolbar__content>.v-tabs') && !selector.includes('.v-toolbar__image') && !selector.includes('.v-progress-linear--reverse') && !selector.includes('.v-card--disabled') &&
        !selector.includes('.v-pagination--disabled') && !selector.includes('.container.grid-list-') && !selector.includes('.layout.reverse') && !selector.includes('.v-icon--dense') &&
        !selector.includes('.v-progress-circular') && !selector.includes('.v-icon--disabled') && !selector.includes('.v-btn--fab') &&
        !selector.includes('.theme--dark'))
    })
    .join('}').split('  ').join('').split('\n ').join('\n').split('\n\n').join('\n')


}

handleDir(base)