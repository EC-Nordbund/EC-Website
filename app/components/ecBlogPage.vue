<template lang="pug">
v-container
  h1 Beiträge
  //- TODO: filter by tags, author, source (if instagram-feed is included)
  v-row
    v-col(v-for='item in posts', cols='12', :key='item.slug')
      v-card.overflow-hidden(
        variant='outlined',
        rounded='0',
        hover,
        color='offWhite',
        :to='`/blog/${item.slug}`'
      )
        v-row(no-gutters)
          //-  @click="$router.push(`/blog/${item.slug}`)"
          v-col.bg-hellGrau(cols='12', sm='6', md='5', lg='4')
            //- image
            v-img.text-white(
              :src='item.featuredImage',
              height='300',
              aspect-ratio='1',
              gradient='180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.02) 24%, rgba(0,0,0,0.02) 64%, rgba(0,0,0,0.24) 100%'
            )
              v-card-actions.pa-3.d-sm-none
                v-spacer
                ec-hexa-button(
                  :to='`/blog/${item.slug}`',
                  :icon='mdiArrowRight',
                  :aria-label='`Zum Beitrag: ${item.title}`',
                  :size='64'
                )
          v-col.d-flex.flex-column.justify-space-between(
            cols='12',
            sm='6',
            md='7',
            lg='8',
            :style='detailsMaxHeight'
          )
            div
              //- title
              .ec-gradient.text-white
                v-card-title.d-block.pt-2.font-weight-bold.text-truncate {{ item.title }}
                v-card-subtitle.pb-2.text-secondary.d-flex.justify-space-between
                  span Vom {{ item.published.split("T")[0].split("-").reverse().join(".") }}
              v-card-text.full-heigth.overflow-hidden.py-0.d-none.d-sm-block
                //- labels
                v-row(no-gutters)
                  //- categories
                  v-col.d-flex.flex-wrap.mb-n1.ml-n2.mt-3(cols='12', lg='8')
                    v-chip.ml-2.mb-1.font-weight-medium.text-primary(
                      color='secondary',
                      variant='outlined',
                      size='small',
                      v-for='tag in item.tags',
                      :key='tag'
                    )
                      | {{ tag }}
                //- description
                v-row
                  v-col(cols='12') {{ getDescription(item) }}

            //- actions/buttons
            v-card-actions.pa-4.d-none.d-sm-flex
              v-spacer
              ec-hexa-button(
                :to='`/blog/${item.slug}`',
                exact,
                :icon='mdiArrowRight',
                :rotate='30',
                :aria-label='`Zum Beitrag: ${item.title}`'
              )
  v-pagination(
    :model-value='currPage',
    :length='pageCount || Math.min(page, 10)',
    :total-visible='7',
    @update:model-value='pageChange'
  )
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { mdiArrowRight } from '@mdi/js'

const props = defineProps({
  page: {
    type: Number,
  },
})

const currPage = computed(() => props.page)

// Alt: useStatic('blog-page', currPage) — Param gehört in den Key (pro
// Pagination-Seite ein eigener Payload); reaktiver Key refetcht bei
// Seitenwechsel (/blog/1 → /blog/2 nutzt dieselbe Komponenteninstanz).
const { data: posts } = await useAsyncData(
  computed(() => `blog-page-${currPage.value}`),
  async () => {
    const items = await queryCollection('blog')
      .select('title', 'tags', 'description', 'featuredImage', 'stem', 'published')
      .order('published', 'DESC')
      .skip(10 * ((currPage.value ?? 1) - 1))
      .limit(10)
      .all()

    // stem = Dateiname ohne Endung = alter Slug; Templates nutzen weiter `slug`
    return items.map((d) => ({ ...d, slug: d.stem }))
  },
)

const { data: pageCount } = await useAsyncData('blog-page-count', async () =>
  Math.ceil((await queryCollection('blog').count()) / 10),
)

const router = useRouter()

const pageChange = (newPage: number) => {
  router.push('/blog/' + newPage)
}

const { name: breakpointName } = useDisplay()

const detailsMaxHeight = computed(() => {
  switch (breakpointName.value) {
    case 'xs':
    case 'sm':
      return ''
    default:
      return 'max-height: 300px;'
  }
})

const getDescription = (item: { description?: string }) => {
  if (typeof item.description === 'string' && item.description.length > 0) {
    return item.description
  }
  return 'Klicke auf "Mehr Anzeigen", um den Betrag zu vollständig zu lesen.'
}
</script>
