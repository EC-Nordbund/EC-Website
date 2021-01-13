<template lang="pug">
  v-container
    h1 Beiträge
    //- TODO: filter by tags, author, source (if instagram-feed is included)
    v-row
      v-col(v-for="item in posts" cols="12" :key="item.slug")
        v-card(outlined tile hover class="overflow-hidden" color="offWhite" :to="`/blog/${item.slug}`")
          v-row(no-gutters) 
            //-  @click="$router.push(`/blog/${item.slug}`)"
            v-col(cols="12" sm="6" md="5" lg="4" class="hellGrau")
                //- image
                v-img(:src="item.featuredImage" height="300" aspectRatio="1" class="white--text" gradient="180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.02) 24%, rgba(0,0,0,0.02) 64%, rgba(0,0,0,0.24) 100%")
                  v-card-actions(class="pa-3 hidden-sm-and-up")
                    v-spacer
                    ec-hexa-button(:to="`/blog/${item.slug}`" icon="mdi-arrow-right" :aria-label="`Zum Beitrag: ${item.title}`" :size="64")
            v-col(cols="12" sm="6" md="7" lg="8" class="d-flex flex-column justify-space-between" :style="detailsMaxHeight")
              v-flex()
                //- title
                div(class="ec-gradient white--text")
                  v-card-title(class="d-block pt-2 font-weight-bold text-truncate") {{item.title}}
                  v-card-subtitle(class="pb-2 secondary--text d-flex justify-space-between")
                    span Vom {{item.published.split('T')[0].split('-').reverse().join('.')}}
                v-card-text(class="full-heigth overflow-hidden py-0 hidden-xs-only")
                  //- labels
                  v-row(no-gutters)
                    //- categories
                    v-col(cols="12" lg="8" class="d-flex flex-wrap mb-n1 ml-n2 mt-3")
                      v-chip(color="secondary" text-color="primary" class="ml-2 mb-1 font-weight-medium" outlined small v-for="tag in item.tags" :key="tag")
                        | {{ tag }}
                  //- description
                  v-row
                    v-col(cols="12") {{getDescription(item)}}

              //- actions/buttons
              v-card-actions(class="pa-4 hidden-xs-only")
                v-spacer
                ec-hexa-button(:to="`/blog/${item.slug}`" exact icon="mdi-arrow-right" :rotate="30" :aria-label="`Zum Beitrag: ${item.title}`")

    v-pagination(
      v-model="page"
      :length="pageCount"
      :total-visible="7"
    )
</template>
<script>
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

export default {
  async asyncData({ $content, query }) {
    const page = parseInt(query.page || '1') || 1

    const [posts, pageCount] = await Promise.all([
      pagination.getPostsOfPage($content, page),
      pagination.getNumberOfPages($content),
    ])

    return { posts, page, pageCount }
  },
  data() {
    return {
      posts: [],
      page: 1,
      pageCount: 1,
    }
  },

  head() {
    return {
      title: 'Blog',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
        },
        // Open Graph
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Blog',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
        },
        // Twitter Card
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'Blog',
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content:
            'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.',
        },
      ],
    }
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
  watch: {
    async page() {
      this.$router.replace({ path: '/blog', query: { page: this.page } })
      this.posts = await pagination.getPostsOfPage(this.$content, this.page)
    },
  },
  methods: {
    getDescription(item) {
      if (typeof item.description === 'string' && item.description.length > 0) {
        return item.description
      }
      return 'Klicke auf "Mehr Anzeigen" um den Betrag zu vollständig zu lesen.'
    },
  },
}
</script>
