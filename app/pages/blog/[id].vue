<template lang="pug">
ecBlogPage(:page="pageNum" v-if="isPagination")
v-container(v-else-if="page")
  ContentRenderer.nuxt-content(:value='page')
</template>
<script setup lang="ts">
const route = useRoute()

const id = computed(() => route.params.id as string)
const pageNum = computed(() => parseInt(id.value))
const isPagination = computed(() => /^\d+$/.test(id.value))

const { data: page } = await useAsyncData(`blog-post-${id.value}`, async () => {
  if (isPagination.value) return null

  const post = await queryCollection('blog')
    .where('stem', '=', `blog/${id.value}`)
    .first()
  if (!post) return null

  return { ...post, slug: stemToSlug(post.stem) }
})

/**
 * Meta: Post-Metadaten nur auf echten Beitragsseiten (nicht Pagination).
 * Bugfix ggü. Nuxt 2: die head()-Verzweigung war invertiert benannt
 * (isPost = isPagination) — hier korrekt verzweigt, mit Optional Chaining.
 */
const isPost = computed(() => !isPagination.value)
const defaultDescription =
  'Blog des EC-Nordbundes mit allen wichtigen Informationen, Veranstaltungsberichten etc.'

useSeoMeta({
  title: () =>
    isPost.value ? page.value?.title : 'Blog | Seite ' + pageNum.value,
  description: () =>
    isPost.value ? page.value?.description : defaultDescription,
  // Open Graph
  ogTitle: () => (isPost.value ? page.value?.title : defaultDescription),
  ogDescription: () =>
    isPost.value ? page.value?.description : defaultDescription,
  ogImage: () => (isPost.value ? page.value?.featuredImage : undefined),
  // Twitter Card
  twitterTitle: () => (isPost.value ? page.value?.title : defaultDescription),
  twitterDescription: () =>
    isPost.value ? page.value?.description : defaultDescription,
  twitterImage: () => (isPost.value ? page.value?.featuredImage : undefined),
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: () =>
        'https://www.ec-nordbund.de/blog/' +
        (isPost.value ? (page.value?.slug ?? id.value) : pageNum.value),
    },
  ],
})
</script>
