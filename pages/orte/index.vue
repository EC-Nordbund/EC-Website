<template lang="pug">
  v-container
    //- p {{ orte }}
    nuxt-content(:document="page")
    ec-location(:marker="orte.map(v=>({...v, marker: [v.lat, v.long], more: `/orte/${v.slug}`}))" style="width: 100%; height: 500px; z-index: 0;")
    ul
      li(v-for="ort in orte") 
        nuxt-link(:to="'/orte/' + ort.slug") {{ort.title}}
</template>
<script>
export default {
  async asyncData({ $content }) {
    const page = await $content('orte').fetch()
    const orte = await $content('ort')
      .only(['title', 'strasse', 'plz', 'ort', 'lat', 'long', 'slug'])
      .fetch()

    return { orte, page }
  },
  head() {
    return {
      title: 'EC-Kreise',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Überblick über alle EC Standorte.',
        },
        // Open Graph
        { hid: 'og:title', property: 'og:title', content: 'EC-Kreise' },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Überblick über alle EC Standorte.',
        },
        // Twitter Card
        { hid: 'twitter:title', name: 'twitter:title', content: 'EC-Kreise' },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: 'Überblick über alle EC Standorte.',
        },
      ],
    }
  },
}
</script>
