<template lang="pug">
v-container
  h1 Beiträge
  //- TODO: filter by tags, author, source (if instagram-feed is included)
  v-row
    v-col(v-for='item in posts', cols='12', :key='item.slug')
      v-card.overflow-hidden(
        outlined,
        tile,
        hover,
        color='offWhite',
        :to='`/blog/${item.slug}`'
      )
        v-row(no-gutters) 
          //-  @click="$router.push(`/blog/${item.slug}`)"
          v-col.hellGrau(cols='12', sm='6', md='5', lg='4')
            //- image
            v-img.text-white(
              :src='item.featuredImage',
              height='300',
              aspectRatio='1',
              gradient='180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.02) 24%, rgba(0,0,0,0.02) 64%, rgba(0,0,0,0.24) 100%'
            )
              v-card-actions.pa-3.hidden-sm-and-up
                v-spacer
                ec-hexa-button(
                  :to='`/blog/${item.slug}`',
                  icon='mdi-arrow-right',
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
            v-col
              //- title
              .ec-gradient.text-white
                v-card-title.d-block.pt-2.font-weight-bold.text-truncate {{ item.title }}
                v-card-subtitle.pb-2.text-secondary.d-flex.justify-space-between
                  span Vom {{ item.published.split("T")[0].split("-").reverse().join(".") }}
              v-card-text.full-heigth.overflow-hidden.py-0.hidden-xs-only
                //- labels
                v-row(no-gutters)
                  //- categories
                  v-col.d-flex.flex-wrap.mb-n1.ml-n2.mt-3(cols='12', lg='8')
                    v-chip.ml-2.mb-1.font-weight-medium(
                      color='secondary',
                      text-color='primary',
                      outlined,
                      small,
                      v-for='tag in item.tags',
                      :key='tag'
                    )
                      | {{ tag }}
                //- description
                v-row
                  v-col(cols='12') {{ getDescription(item) }}

            //- actions/buttons
            v-card-actions.pa-4.hidden-xs-only
              v-spacer
              ec-hexa-button(
                :to='`/blog/${item.slug}`',
                exact,
                icon='mdi-arrow-right',
                :rotate='30',
                :aria-label='`Zum Beitrag: ${item.title}`'
              )
  v-pagination(
    :model-value="currPage"
    :length="pageCount || Math.min(page, 10)",
    :total-visible="7"
    @update:model-value="pageChange"
  )
</template>
<script>
import { defineComponent, computed } from 'vue'
import { useDisplay } from 'vuetify'

export default defineComponent({
  props: {
    page: {
      type: Number
    }
  },
  async setup(props) {
    const currPage = computed(() => props.page)

    const { data: posts } = await useAsyncData(
      `blog-page-${currPage.value}`,
      async () => {
        const raw = await queryContent('blog')
          .only([
            'title',
            'tags',
            'description',
            'featuredImage',
            '_path',
            'published',
          ])
          .sort({ published: -1 })
          .skip(10 * (currPage.value - 1))
          .limit(10)
          .find()
        return raw.map(v => ({ ...v, slug: v._path.split('/').pop() }))
      },
      { watch: [() => props.page] }
    )

    const { data: pageCount } = await useAsyncData(
      'blog-page-count',
      async () => {
        const allPosts = await queryContent('blog').only([]).find()
        return Math.ceil(allPosts.length / 10)
      }
    )

    const router = useRouter()

    const pageChange = (newPage) => {
      router.push('/blog/' + newPage)
    }

    const { name: breakpointName } = useDisplay()
    const detailsMaxHeight = computed(() => {
      switch (breakpointName.value) {
        case 'md': case 'lg': case 'xl': case 'xxl':
          return 'max-height: 300px;'
        default:
          return ''
      }
    })

    const imgHeight = computed(() => {
      switch (breakpointName.value) {
        case 'xl': case 'xxl': return 500
        case 'lg': return 400
        default: return 300
      }
    })

    const getDescription = (item) => {
      if (typeof item.description === 'string' && item.description.length > 0) {
        return item.description
      }
      return 'Klicke auf "Mehr Anzeigen", um den Betrag zu vollständig zu lesen.'
    }

    return { posts, pageCount, pageChange, currPage, detailsMaxHeight, imgHeight, getDescription }
  },
})
</script>
