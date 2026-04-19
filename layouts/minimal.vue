<template lang="pug">
  v-app
    v-app-bar(color="white" flat)
      v-toolbar-title(class="mx-auto")
        NuxtLink(class="d-flex align-center mr-auto no-underline" to="/" exact)
          ec-logo(size="42px" alt="EC")
          h1 Nordbund
    v-main(class="flex-fill fill-height")
      slot
    footer(class="bg-secondary text-white angle--top-left pb-4")
      v-container
        v-row(justify="space-between")
          v-col(cols="12" sm="6" md="auto" class="px-5 py-2")
            NuxtLink(class="text-subtitle-2 no-underline" to="/") Startseite
          v-col(cols="12" sm="6" md="auto" class="px-5 py-2")
            NuxtLink(class="text-subtitle-2 no-underline" to="/teilnahmebedingungen/") Teilnahmebedingungen
          v-col(cols="12" sm="6" md="auto" class="px-5 py-2")
            NuxtLink(class="text-subtitle-2 no-underline" to="/datenschutz") Datenschutz
          v-col(cols="12" sm="6" md="auto" class="px-5 py-2")
            NuxtLink(class="text-subtitle-2 no-underline" to="/impressum") Impressum

        v-row(class="pt-1")
          v-col(class="text-center") © by EC-Nordbund
</template>

<style lang="scss" scoped>
header.v-toolbar {
  height: 64px !important;

  .v-toolbar__content {
    height: 64px !important;
  }
}

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
