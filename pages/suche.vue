<template lang="pug">
v-container
  h1 Suche
  v-text-field(v-model='suche', label='Suche...')

  template(v-if='suche')
    h2 Blog
    v-row(v-if='posts.length > 0')
      v-col(cols='12', sm='6', md='4', v-for='item in posts', :key='item.slug')
        v-card(tile, hover, outlined, :to='`/blog/${item.slug}`')
          ec-image-item(
            :image='item.featuredImage',
            :title='item.title',
            :subTitle='`Vom ${item.published.split("T")[0].split("-").reverse().join(".")}`'
          )
    p(v-else) Keine Suchergebnisse gefunden!

    h2 Veranstaltungen
    v-row(v-if='veranstaltungen.length > 0')
      v-col(
        cols='12',
        sm='6',
        md='4',
        v-for='item in veranstaltungen',
        :key='item.slug'
      )
        v-card(tile, hover, outlined, :to='`/veranstaltungen/${item.slug}`')
          ec-image-item(
            :image='item.featuredImage',
            :title='item.title',
            :subTitle='`Vom ${item.begin.split("-").reverse().join(".")} bis ${item.ende.split("-").reverse().join(".")}`'
          )
    p(v-else) Keine Suchergebnisse gefunden!
  p(v-else) Gebe einen Suchbegriff ein.
</template>
<script lang="ts">
import { IContentDocument } from '@nuxt/content/types/content'
import {
  defineComponent,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const suche = ref('')
    const posts = ref([] as IContentDocument[])
    const veranstaltungen = ref([] as IContentDocument[])

    const { $content } = useContext()

    watch(suche, async () => {
      const [v, p] = await Promise.all([
        $content('veranstaltung')
          .only(['slug', 'title', 'begin', 'ende', 'featuredImage', 'tags'])
          .sortBy('begin')
          .search(suche.value)
          .limit(3)
          .fetch(),
        $content('blog')
          .only([
            'title',
            'tags',
            'description',
            'featuredImage',
            'slug',
            'published',
          ])
          .sortBy('published', 'desc')
          .search(suche.value)
          .limit(6)
          .fetch(),
      ])

      posts.value = Array.isArray(p) ? p : [p]
      veranstaltungen.value = Array.isArray(v) ? v : [v]
    })

    return {
      suche,
      posts,
      veranstaltungen,
    }
  },
  head() {
    return {
      link: [
        {
          rel: 'canonical',
          href: 'https://www.ec-nordbund.de/suche',
          hid: 'canonical',
        },
      ],
    }
  },
})
</script>
