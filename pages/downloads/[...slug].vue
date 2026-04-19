<template lang="pug">
v-container
  v-breadcrumbs(
    :items='["Downloads", ...fileRoute].map(toBreadcrumb)',
    divider='/',
    large
  )
  h1 {{ data.title }}
  p {{ data.description }}

  v-list(:key='$route.fullpath')
    v-list-item(
      v-if='fileRoute.length > 0',
      :to='`/downloads/${fileRoute.slice(0, -1).join("/")}`'
    )
      v-list-item-avatar
        v-icon(size='26') mdi-arrow-up
      v-list-item-content
        v-list-item-title Zurück
    v-divider
    v-list-item(
      v-for='el in data.files',
      :key='$route.fullpath + el.filename',
      :href='`${el.filename}`',
      two-line
    )
      v-list-item-avatar
        v-icon(size='32') {{ { pdf: 'mdi-file-pdf-outline', docx: 'mdi-file-word', jpg: 'mdi-file-image', png: 'mdi-file-image' }[el.filename.split(".")[1].toLowerCase()] || 'mdi-file' }}
      v-list-item-content
        v-list-item-title {{ el.title }}
        v-list-item-subtitle {{ el.description }}
    v-list-item(
      v-for='key in Object.keys(data.folders)',
      :key='$route.fullpath + key',
      :to='key + "/"',
      two-line
    )
      v-list-item-avatar
        v-icon(size='36') mdi-folder
      v-list-item-content
        v-list-item-title {{ data.folders[key].title }}
        v-list-item-subtitle {{ data.folders[key].description }}
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
} from 'vue'

export default defineComponent({
  async setup() {
    const route = useRoute()

    const slugArray = route.params.slug || []
    const fileRoute = Array.isArray(slugArray)
      ? slugArray.filter((v) => v !== '')
      : String(slugArray).split('/').filter((v) => v !== '')

    const { data: fileData } = await useAsyncData(
      'downloads',
      () => queryContent('downloads').findOne()
    )

    const data = computed(() => {
      if (fileData.value === null) {
        return { files: [], folders: [] }
      } else if (fileRoute.length < 1) {
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

    useHead({
      title: 'Downloads',
      meta: [
        {
          name: 'description',
          content: 'Download von Vorlagen, Dokumenten etc.',
        },
        // Open Graph
        { property: 'og:title', content: 'Downloads' },
        {
          property: 'og:description',
          content: 'Download von Vorlagen, Dokumenten etc.',
        },
        // Twitter Card
        { name: 'twitter:title', content: 'Downloads' },
        {
          name: 'twitter:description',
          content: 'Download von Vorlagen, Dokumenten etc..',
        },
        ...(fileRoute.length > 0
          ? [{ property: 'robots', content: 'noindex' }]
          : []),
      ],
    })

    return {
      fileRoute,
      data,
      toBreadcrumb
    }
  },
})
</script>
