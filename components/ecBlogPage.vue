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
            v-img.white--text(
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
            v-flex
              //- title
              .ec-gradient.white--text
                v-card-title.d-block.pt-2.font-weight-bold.text-truncate {{ item.title }}
                v-card-subtitle.pb-2.secondary--text.d-flex.justify-space-between
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
    :value="currPage"
    :length="pageCount || Math.min(page, 10)", 
    :total-visible="7"
    @input="pageChange"
  )
</template>
<script>
import { defineComponent, useStatic, useContext, useRoute, useRouter, computed  } from '@nuxtjs/composition-api'

const pagination = {
  getPostsOfPage($content, page) {
    return $content('blog')
      .only([
        'title',
        'tags',
        'description',
        'featuredImage',
        'slug',
        'published',
      ])
      .sortBy('published', 'desc')
      .skip(10 * (page - 1))
      .limit(10)
      .fetch()
  },

  async getNumberOfPages($content) {
    return Math.ceil((await $content('blog').only([]).fetch()).length / 10)
  },
}

export default defineComponent({
  props: {
    page: {
      type: Number
    }
  },
  setup(props) {
    const { $content } = useContext()

    const currPage = computed(() => props.page)
    const posts = useStatic(page => pagination.getPostsOfPage($content, parseInt(page)), currPage, 'blog-page')
    const pageCount = useStatic(() => pagination.getNumberOfPages($content), undefined, 'blog-page-count')

    const router = useRouter()

    const pageChange = (newPage) => {
      router.push('/blog/' + newPage)
    }

    return { posts, pageCount, pageChange, currPage }
  },
  computed: {
    detailsMaxHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          return ''
        default:
          return 'max-height: 300px;'
      }
    },
    imgHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          return undefined
        default:
          return 300
      }
    },
  },
  methods: {
    getDescription(item) {
      if (typeof item.description === 'string' && item.description.length > 0) {
        return item.description
      }
      return 'Klicke auf "Mehr Anzeigen", um den Betrag zu vollständig zu lesen.'
    },
  },
})
</script>
