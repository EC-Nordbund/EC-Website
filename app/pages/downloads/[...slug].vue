<template lang="pug">
v-container
  v-breadcrumbs(
    :items='["Downloads", ...fileRoute].map(toBreadcrumb)',
    divider='/'
  )
  h1 {{ data.title }}
  p {{ data.description }}

  v-list(:key='route.fullPath')
    v-list-item(
      v-if='fileRoute.length > 0',
      :to='`/downloads/${fileRoute.slice(0, -1).join("/")}`'
    )
      template(#prepend)
        v-icon(size='26', :icon='mdiArrowUp')
      v-list-item-title Zurück
    v-divider
    v-list-item(
      v-for='el in data.files',
      :key='route.fullPath + el.filename',
      :href='`${el.filename}`',
      lines='two'
    )
      template(#prepend)
        v-icon(size='32', :icon='fileIcon(el.filename)')
      v-list-item-title {{ el.title }}
      v-list-item-subtitle {{ el.description }}
    v-list-item(
      v-for='key in Object.keys(data.folders)',
      :key='route.fullPath + key',
      :to='key + "/"',
      lines='two'
    )
      template(#prepend)
        v-icon(size='36', :icon='mdiFolder')
      v-list-item-title {{ data.folders[key].title }}
      v-list-item-subtitle {{ data.folders[key].description }}
</template>
<script setup lang="ts">
import {
  mdiArrowUp,
  mdiFile,
  mdiFileImage,
  mdiFilePdfBox,
  mdiFileWord,
  mdiFolder,
} from '@mdi/js'

const route = useRoute()

/**
 * Catch-all-Param: in Nuxt 4 ein Array von Segmenten ([...slug]).
 * Reaktiv als computed (Alt-Bug: fileRoute wurde einmalig in setup()
 * berechnet → stale Breadcrumbs bei Client-Navigation; Fix laut Guide).
 */
const fileRoute = computed<string[]>(() => {
  const slug = route.params.slug
  const parts = Array.isArray(slug)
    ? slug
    : typeof slug === 'string'
      ? slug.split('/')
      : []
  return parts.filter((v) => v !== '')
})

const { data: fileData } = await useAsyncData('downloads', () =>
  queryCollection('downloads').first(),
)

const data = computed<any>(() => {
  if (!fileData.value) {
    return { files: [], folders: [] }
  } else if (fileRoute.value.length === 0) {
    return fileData.value
  } else {
    let pointer: any = fileData.value

    for (let i = 0; i < fileRoute.value.length; i++) {
      pointer = pointer?.folders?.[fileRoute.value[i]]

      if (!pointer) {
        return { files: [], folders: [] }
      }
    }

    return pointer
  }
})

function toBreadcrumb(key = '', depth = 0) {
  const item: { title?: string; href?: string } = {
    title: key,
    href: '/downloads/',
  }
  let curr: any = fileData.value

  // add title to subpath
  for (let i = 0; i < depth; i++) {
    curr = curr?.folders?.[fileRoute.value[i]]
  }
  item.title = curr?.title

  // add link to subpath
  if (fileRoute.value.length > depth) {
    item.href += fileRoute.value
      .slice(0, -fileRoute.value.length + depth)
      .join('/')
  } else if (fileRoute.value.length === depth) {
    item.href += fileRoute.value.join('/')
  } else {
    item.href = undefined
  }

  return item
}

const fileIcons: Record<string, string> = {
  pdf: mdiFilePdfBox,
  docx: mdiFileWord,
  jpg: mdiFileImage,
  png: mdiFileImage,
}

function fileIcon(filename: string): string {
  return fileIcons[filename.split('.')[1].toLowerCase()] || mdiFile
}

useHead({
  title: 'Downloads',
})

useSeoMeta({
  description: 'Download von Vorlagen, Dokumenten etc.',
  // Open Graph
  ogTitle: 'Downloads',
  ogDescription: 'Download von Vorlagen, Dokumenten etc.',
  // Twitter Card
  twitterTitle: 'Downloads',
  twitterDescription: 'Download von Vorlagen, Dokumenten etc..',
  // noindex auf allen Unterordner-Seiten (Alt-Code nutzte fälschlich
  // property statt name — Fix laut Guide, useSeoMeta rendert name)
  robots: () => (fileRoute.value.length > 0 ? 'noindex' : undefined),
})
</script>
