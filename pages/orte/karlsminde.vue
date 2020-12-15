<template lang="pug">
div
  v-img(:src='require("@/assets/img/karlsminde/karlsminde.jpg")')
    h1 EC-Ferienlager
      br
      | Karlsminde
  v-row
    v-container
      p 
        | ...so heißt der Ort,
        br
        | an dem schon Viele unvergessliche Tage verbracht wurden.
      p Das Ferienlager besteht aus acht Bungalows mit je sieben Schlafmöglichkeiten, dem Hauptgebäude mit Leiterzimmern, Küche und Speisesaal, sowie dem Sanitärgebäude und einem Gruppenbungalow.
        br
        | Das weitläufige Gelände mit eigenem Bootssteg am Aassee, der Ostseestrand in nur 300m Entfernung, Lagerfeuerplatz und Bolzplatz sind der ideale Ort für Freizeiten aller Art.

      p 
        b Wer Karlsminde nicht kennt, hat was verpasst!
  v-parallax(:src='require("@/assets/img/karlsminde/karlsminde (7).jpg")')
    v-container
      h2 Gelände
      p Auf dem Gelände des Ferienlagers Karlsminde gibt es acht Bungalows für jeweils sieben Personen und das Haupthaus. In diesem Haupthaus stehen ein Speiseraum, eine Großküche, eine Spülküche, eine Vorratskammer, drei Schlafräume (für 2+3+3 Pers.) und ein Duschbad zur Verfügung. In einem separaten Sanitärgebäude gibt es weitere Toiletten, Waschräume und Duschen. Ein zusätzlicher Gruppenbungalow kann genutzt werden.
      p Im Außenbereich gibt es einen Volleyball- und einen Bolzplatz für die Sportbegeisterten, einen Grillstand und einen Steinbackofen für die kulinarischen Hochgenüsse.
        br
        | Darüber hinaus laden vier Ruderboote mit ausreichend Schwimmwesten ein, den Aassee zu erkunden.
      p Die Küche verfügt über eine Kippbratpfanne, einen großen Herd und einen Backofen. Sie ist komplett mit Geschirr ausgestattet.
        br
        | Eine Waschmaschine und ein Wäschetrockner sind ebenfalls vorhanden.
  v-row.primary(style='padding: 0 15px')
    v-col
      ec-location(
        :marker='[{ marker: [54.5, 9.9484807], noMore: true }]',
        style='width: 100%; height: 500px; z-index: 0'
      )
    v-col
      v-carousel(cycle, hide-delimiter-background, show-arrows-on-hover)
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (1).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (2).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (3).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (4).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (5).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (6).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (7).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (8).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (9).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (10).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (11).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )
        v-carousel-item(
          :src='require("@/assets/img/karlsminde/diashow (12).jpg")',
          reverse-transition='fade-transition',
          transition='fade-transition'
        )

  v-parallax(:src='require("@/assets/img/karlsminde/karlsminde (8).jpg")')
    v-container
      h2 Lage
      p Etwa 15 Kilometer nordöstlich von Eckernförde liegt das Ferienlager Karlsminde. Es ist über den gleichnamigen Campingplatz zu erreichen. Durch die separate Lage ist aber vom Campingbetrieb kaum etwas zu spüren.
      p Die Lage ist wunderschön inmitten eines Naturschutzgebietes, umgeben von zwei Seen und der Ostsee, von Wäldern und Wiesen.
      p In der Umgebung liegen viele reizvolle Ausflugsziele, wie z.B. Eckernförde mit Hafen und der Möglichkeit zu Schifffahrten, das Ostseebad Damp mit diversen Freizeiteinrichtungen und Erlebnisbad, Schleswig mit dem Wikingerdorf Haithabu und dem Schloss Gottorf. Auch die Landeshauptstadt Kiel ist in einer Autostunde gut zu erreichen.
  v-row.angle--bottom-right.primary(
    style='margin-bottom: -3.492vw; padding-top: 3vw'
  )
    v-container
      h2 Buchungsinformationen
      p(style='color: #fff') Das Ferienlager Karlsminde ist nur für den Sommerbetrieb konzipiert und wird in der Zeit von Mai bis September an Selbstversorgergruppen vermietet.
        br
        | Die aktuellen Preise können Sie unserer Preisliste entnehmen.
      nuxt-link.preisliste.elevation-5(to='/downloads/Dokumente/Karlsminde') Preisliste
      p(style='color: #fff') Sollten Sie noch weitere Informationen benötigen, wenden Sie sich bitte an das Erholungs- & Bildungszentrum Wittensee, das für die Buchungen verantwortlich ist.
      div
        p(style='color: #fff')
          | Erholungs- & Bildungszentrum Wittensee
          br
          | An See 7
          br
          | 24794 Bünsdorf
          br
          | Telefon : +49 04356 / 99 77 0
          br
          | E-Mail : info(at)ec-karlsminde.de
          br 
          | Web:&nbsp;
          a(
            href='https://www.ebz-wittensee.de',
            target='ebz',
            style='color: #fff'
          ) https://www.ebz-wittensee.de
</template>
<style lang="scss" scoped>
h1,
h2,
p {
  text-align: center;
}

h1 {
  top: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

h1,
h2 {
  color: #fff;
}

.preisliste {
  display: block;
  background: #ffff;
  padding: 20px;
  margin: 17px 33%;
  text-align: center;
  text-decoration: none !important;
  font-weight: 500;
  font-size: 29px;
  border-radius: 15px;
}
</style>