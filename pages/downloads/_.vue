<template lang="pug">
  v-container
    v-breadcrumbs(:items="['Downloads',...fileRoute].map(toBreadcrumb)" divider="/" large)
    h1 {{data.title}}
    p {{data.description}}

    v-list(:key="$route.fullpath")
      v-list-item(v-if="fileRoute.length > 0" :to="`/downloads/${fileRoute.slice(0, -1).join('/')}`")
        v-list-item-avatar
          v-icon(size="26") mdi-arrow-up
        v-list-item-content
          v-list-item-title Zurück
      v-divider
      v-list-item(v-for="el in data.files" :key="$route.fullpath + el.filename" :href="`${el.filename}`" two-line)
        v-list-item-avatar
          v-icon(size="32") {{ {pdf: mdiFilePdfOutline, docx: mdiFileWord, jpg: mdiFileImage, png: mdiFileImage}[el.filename.split('.')[1].toLowerCase()] || mdiFile }}
        v-list-item-content
          v-list-item-title {{el.title}}
          v-list-item-subtitle {{el.description}}
      v-list-item(v-for="key in Object.keys(data.folders)" :key="$route.fullpath + key" :to="key + '/'" two-line)
        v-list-item-avatar
          v-icon(size="36") mdi-folder
        v-list-item-content
          v-list-item-title {{data.folders[key].title}}
          v-list-item-subtitle {{data.folders[key].description}}
</template>
<script lang="ts">
import {
  defineComponent,
  useContext,
  useAsync,
  computed,
} from '@nuxtjs/composition-api'
import { mdiFilePdfOutline, mdiFileWord, mdiFileImage, mdiFile } from '@mdi/js'

export default defineComponent({
  setup() {
    const { route, $content } = useContext()

    const fileRoute = route.value.params.pathMatch
      .split('/')
      .filter((v) => v !== '')

    const fileData = useAsync(
      async () => await $content('downloads').fetch<any>()
    )

    const data = computed(() => {
      if (fileData.value === null) {
        return { files: [], folders: [] }
      } else if (route.value.params.pathMatch.length < 2) {
        return fileData.value
      } else {
        let pointer = fileData.value

        for (let i = 0; i < fileRoute.length; i++) {
          pointer = pointer?.folders?.[fileRoute[i]]

          if (!pointer) {
            return { files: [], folders: [] }
          }
        }

        return pointer
      }
    })

    function toBreadcrumb(key = '', depth = 0) {
      const item = {
        text: key,
        href: '/downloads/',
      }
      let curr = fileData.value

      // add title to subpath
      for (let i = 0; i < depth; i++) {
        curr = curr?.folders?.[fileRoute[i]]
      }
      item.text = curr?.title

      // add link to subpath
      if (fileRoute.length > depth) {
        item.href += fileRoute.slice(0, -fileRoute.length + depth).join('/')
      } else if (fileRoute.length === depth) {
        item.href += fileRoute.join('/')
      } else {
        item.href = (undefined as unknown) as string
      }

      return item
    }

    return {
      fileRoute,
      data,
      toBreadcrumb,
      mdiFilePdfOutline,
      mdiFileWord,
      mdiFileImage,
      mdiFile,
    }
  },
  head: {
    title: 'Downloads',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Download von Vorlagen, Dokumenten etc.',
      },
      // Open Graph
      { hid: 'og:title', property: 'og:title', content: 'Downloads' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Download von Vorlagen, Dokumenten etc.',
      },
      // Twitter Card
      { hid: 'twitter:title', name: 'twitter:title', content: 'Downloads' },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Download von Vorlagen, Dokumenten etc..',
      },
    ],
  },
})
</script>
