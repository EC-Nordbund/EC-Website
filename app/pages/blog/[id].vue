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

// OG/Twitter verlangen absolute Bild-URLs. Alt überschrieb das card.png-
// Default effektiv nie (der relative Pfad kam im generierten Head nicht an);
// mit absoluter URL funktioniert das Post-Bild beim Teilen jetzt wirklich.
const ogImageUrl = computed(() => {
  const img = page.value?.featuredImage
  return img ? `https://www.ec-nordbund.de${assetUrl(img)}` : undefined
})

useSeoMeta({
  title: () =>
    isPost.value ? page.value?.title : 'Blog | Seite ' + pageNum.value,
  description: () =>
    isPost.value ? page.value?.description : defaultDescription,
  // Open Graph
  ogTitle: () => (isPost.value ? page.value?.title : defaultDescription),
  ogDescription: () =>
    isPost.value ? page.value?.description : defaultDescription,
  ogImage: () => (isPost.value ? ogImageUrl.value : undefined),
  // Twitter Card
  twitterTitle: () => (isPost.value ? page.value?.title : defaultDescription),
  twitterDescription: () =>
    isPost.value ? page.value?.description : defaultDescription,
  twitterImage: () => (isPost.value ? ogImageUrl.value : undefined),
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
