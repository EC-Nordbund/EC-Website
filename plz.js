const fs = require('fs')
const fetch = require('node-fetch')

const PATH = './static/plz/'

function plz() {
  if (!fs.existsSync(PATH)) {
    fs.mkdirSync(PATH)
  }

  fs.readdirSync(PATH)
    .filter((v) => v[0] !== '.')
    .map((v) => PATH + v)
    .forEach(fs.unlinkSync)

  fetch(
    'https://www.suche-postleitzahl.org/download_files/public/zuordnung_plz_ort.csv'
  )
    .then((v) => v.text())
    .then((content) => {
      const plzData = {}

      content.split('\n').forEach((eintrag, id) => {
        if (id === 0 || eintrag === '') {
          return
        }

        const data = eintrag.split(',')
        const plz = data[2]
        const ort = data[1]

        if (!plzData[plz]) {
          plzData[plz] = []
        }

        plzData[plz].push(ort)
      })

      const plzListe = Object.keys(plzData).sort()

      plzListe.forEach((plz) => {
        fs.writeFileSync(PATH + plz + '.json', JSON.stringify(plzData[plz]))
      })

      fs.writeFileSync(PATH + 'plz.json', JSON.stringify(plzListe))
    })
}

plz()
