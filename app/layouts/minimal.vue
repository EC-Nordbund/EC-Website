<template lang="pug">
v-app
  v-app-bar(color='white', flat)
    v-toolbar-title.mx-auto
      NuxtLink.d-flex.align-center.mr-auto.no-underline(to='/')
        ec-logo(size='42px', alt='EC')
        h1 Nordbund
  v-main.flex-fill.fill-height
    slot
  footer.bg-secondary.text-white.angle--top-left.pb-4
    v-container
      v-row(justify='space-between')
        v-col.px-5.py-2(cols='12', sm='6', md='auto')
          NuxtLink.text-subtitle-2.no-underline(to='/') Startseite
        v-col.px-5.py-2(cols='12', sm='6', md='auto')
          NuxtLink.text-subtitle-2.no-underline(to='/teilnahmebedingungen/') Teilnahmebedingungen
        v-col.px-5.py-2(cols='12', sm='6', md='auto')
          NuxtLink.text-subtitle-2.no-underline(to='/datenschutz') Datenschutz
        v-col.px-5.py-2(cols='12', sm='6', md='auto')
          NuxtLink.text-subtitle-2.no-underline(to='/impressum') Impressum

      v-row.pt-1
        v-col.text-center © by EC-Nordbund
</template>

<style lang="scss" scoped>
.no-underline {
  text-decoration: none;
}

footer {
  a {
    color: #fff !important;

    &:hover {
      color: rgb(var(--v-theme-primary)) !important;
    }
  }
}
</style>
