<template lang="pug">
div
  v-img.align-end.angle--bottom-right(
    :src='require("@/assets/img/karlsminde/karlsminde.jpg")',
    height='400',
    width='auto',
    min-width='100%',
    gradient='180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.02) 16%, rgba(0,0,0,0.03) 64%, rgba(0,0,0,0.48) 100%')
    v-container.pb-4.pb-sm-2.white--text
      h2.text-h5.text-sm-h4.font-weight-bold.text-no-wrap EC-Ferienlager
      h1.text-h3.text-sm-h2.font-weight-black Karlsminde

  .angle--both-left-left
    v-container
      p ...so heißt der Ort, an dem schon Viele unvergessliche Tage verbracht wurden.
      p Das Ferienlager besteht aus acht Bungalows mit je sieben Schlafmöglichkeiten, dem Hauptgebäude mit Leiterzimmern, Küche und Speisesaal, sowie dem Sanitärgebäude und einem Gruppenbungalow.
        br
        | Das weitläufige Gelände mit eigenem Bootssteg am Aassee, der Ostseestrand in nur 300m Entfernung, Lagerfeuerplatz und Bolzplatz sind der ideale Ort für Freizeiten aller Art.
      p.text-center.text-h6 Wer Karlsminde nicht kennt, hat was verpasst!

  .angle--both-right-right(style='background: #f5f5f5')
    v-container
      v-row

        v-col(cols="12" md="6")
          h2#gelaende Gelände
          p Auf dem Gelände des Ferienlagers Karlsminde gibt es acht Bungalows für jeweils sieben Personen und das Haupthaus. In diesem Haupthaus stehen ein Speiseraum, eine Großküche, eine Spülküche, eine Vorratskammer, drei Schlafräume (für 2+3+3 Pers.) und ein Duschbad zur Verfügung. In einem separaten Sanitärgebäude gibt es weitere Toiletten, Waschräume und Duschen. Ein zusätzlicher Gruppenbungalow kann genutzt werden.
          p Im Außenbereich gibt es einen Volleyball- und einen Bolzplatz für die Sportbegeisterten, einen Grillstand und einen Steinbackofen für die kulinarischen Hochgenüsse.
            br
            | Darüber hinaus laden vier Ruderboote mit ausreichend Schwimmwesten ein, den Aassee zu erkunden.
          p Die Küche verfügt über eine Kippbratpfanne, einen großen Herd und einen Backofen. Sie ist komplett mit Geschirr ausgestattet.
            br
            | Eine Waschmaschine und ein Wäschetrockner sind ebenfalls vorhanden.

        v-col(cols="12" md="6")
          v-carousel(cycle, hide-delimiters, show-arrows-on-hover)
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (1).jpg")')
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (2).jpg")')
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (3).jpg")')
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (4).jpg")')
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (5).jpg")')
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (6).jpg")')
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (7).jpg")')
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (8).jpg")')
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (9).jpg")')
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (10).jpg")')
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (11).jpg")')
            v-carousel-item(:src='require("@/assets/img/karlsminde/diashow (12).jpg")')

  .angle--both-left-left
    v-container
      v-row

        v-col(cols="12" md="6" order-md="last")
          h2#lage Lage
          p Etwa 15 Kilometer nordöstlich von Eckernförde liegt das Ferienlager Karlsminde. Es ist über den gleichnamigen Campingplatz zu erreichen. Durch die separate Lage ist aber vom Campingbetrieb kaum etwas zu spüren.
          p Die Lage ist wunderschön inmitten eines Naturschutzgebietes, umgeben von zwei Seen und der Ostsee, von Wäldern und Wiesen.
          p In der Umgebung liegen viele reizvolle Ausflugsziele, wie z.B. Eckernförde mit Hafen und der Möglichkeit zu Schifffahrten, das Ostseebad Damp mit diversen Freizeiteinrichtungen und Erlebnisbad, Schleswig mit dem Wikingerdorf Haithabu und dem Schloss Gottorf. Auch die Landeshauptstadt Kiel ist in einer Autostunde gut zu erreichen.

        v-col(cols="12" md="6" order-md="first")
          ec-location(
            :marker='[{ marker: [54.5, 9.9484807], noMore: true }]',
            style='width: 100%; min-height: 333px; z-index: 0'
          )
      
  .angle--both-right-right.ec-gradient.before-footer
    v-container
      v-row

        v-col(cols="12" sm="6")
          h2#buchungsinformationen Buchungsinformationen
          p.mb-0 Das Ferienlager Karlsminde ist nur für den Sommerbetrieb konzipiert und wird in der Zeit von Mai bis September an Selbstversorgergruppen vermietet.
          p  Die aktuellen Preise können Sie unserer Preisliste entnehmen.
          v-btn(tile depressed block to='/downloads/Dokumente/Karlsminde').mb-4 Preisliste
          .font-italic Sollten Sie noch weitere Informationen benötigen, wenden Sie sich bitte an das Erholungs- & Bildungszentrum Wittensee, das für die Buchungen verantwortlich ist.

        v-col(cols="12" sm="6")
          h2#kontakt Kontakt
          .text-subtitle-1.font-weight-medium.mb-1 Erholungs- & Bildungszentrum Wittensee
          .text-body-1 An See 7, 24794 Bünsdorf
          .text-body-1 Telefon: 04356 / 99 77 0
          .text-body-1 E-Mail : info(at)ec-karlsminde.de
          .text-body-1 Web:&nbsp;
            a(href='https://www.ebz-wittensee.de', alt="https://www.ebz-wittensee.de" title="Zur Website" rel="noopener").secondary--text https://www.ebz-wittensee.de

</template>
<script>
export default {
  head() {
    return {
      title: 'EC-Ferienlager Karlsminde',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Ein Ort an dem schon viele unvergessliche Tage verbracht wurden. Egal ob Boot fahren, im Wald spielen oder ... Für jeden ist auf dem Gelände mit spitzdach Bungalows was dabei!',
        },
        // Open Graph
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'EC-Ferienlager Karlsminde',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            'Ein Ort an dem schon viele unvergessliche Tage verbracht wurden. Egal ob Boot fahren, im Wald spielen oder ... Für jeden ist auf dem Gelände mit spitzdach Bungalows was dabei!',
        },
        // Twitter Card
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'EC-Ferienlager Karlsminde',
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content:
            'Ein Ort an dem schon viele unvergessliche Tage verbracht wurden. Egal ob Boot fahren, im Wald spielen oder ... Für jeden ist auf dem Gelände mit spitzdach Bungalows was dabei!',
        },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.before-footer {
  margin-bottom: calc(-1px - #{3.492}vw);
}

.v-parallax.with-gradient {
  ::v-deep .v-parallax__image-container::before {
    content: '';
    position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    width: 100%;
    background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.16) 0%,
      rgba(0, 0, 0, 0.05) 68%,
      rgba(0, 0, 0, 0.05) 32%,
      rgba(0, 0, 0, 0.16) 100%
    );
  }
}
</style>