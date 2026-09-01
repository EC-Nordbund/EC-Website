// Flat Config über das @nuxt/eslint-Modul (generiert .nuxt/eslint.config.mjs
// mit projektspezifischen Nuxt-Regeln). Formatierung macht weiterhin Prettier.
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      // Der tolerante Content-Layer (schmutzige Alt-Daten, typlose Frontmatter-
      // Records) arbeitet bewusst mit any — vue-tsc sichert das Wesentliche
      '@typescript-eslint/no-explicit-any': 'off',
      // Vue-3-Stil dieses Projekts: optionale Props ohne default
      'vue/require-default-prop': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      // Templates sind Pug — der Vue-Parser sieht die Template-Nutzung nicht,
      // jede nur im Template verwendete Variable gälte sonst als unused
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off',
      // SFCs mit <script> + <script setup> sind EIN Modul für ESLint —
      // der Import des zweiten Blocks steht zwangsläufig "nach" dem ersten
      'import/first': 'off',
    },
  },
)
