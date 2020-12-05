<template lang="pug">
  v-container(class="page-wrapper")
    v-card
      v-card-title
        h1 Anmeldung für Mitarbeiter
      v-card-text
        v-alert(type="info")
          v-icon(color="#8dc44f") ec-logo
          | Du bist kein Mitarbeiter im EC? Dann bist du hier falsch!
        br
        | Bitte wähle was für ein Mitarbeiter du bist. Entweder lokal in deinem Ortsverband oder überreginal bei einer Veranstaltung oder Freizeit.
      v-card-actions
        v-btn(variant="success" to="/mitarbeiter/anmeldung/ort") Ortsverband
        v-btn(variant="info" to="/mitarbeiter/anmeldung/veranstaltung") Veranstaltung / Freizeiten
</template>
