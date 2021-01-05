import express from 'express'
import { json } from 'body-parser'
import { ruleLib } from '../plugins/validateLib'
import { saveForConfirm, validateToken, cleanup } from './fs-helpers'
import { validate } from './validate'
import { sendMail } from './sendMail'
import axios from 'axios'
import {
  createMailContentMA,
  createMailContentTN,
  createMailContentMAOrt,
} from './mailContent'
import { checkToken } from './jwt'

// console.log('test')

const vData = {
  428: 'TimeOut 2020/21',
  440: "EC'ler auf der Kanzel",
  441: 'Mitarbeiter Wochenende',
  442: 'PfingstCamp',
  443: 'Landesjungscharfreizeit I',
  444: 'Landesjungscharfreizeit II',
  445: 'TeenCamp',
  446: 'Jugendfreizeit',
  447: 'BibleCamp',
  448: 'Abenteuerfreizeit',
  449: 'Reiterfreizeit',
  450: 'MaTag',
  451: 'TimeOut 2021/22',
}

const app = express()

app.use(json())

app.post('/anmeldung/ma/checkToken', (req, res) => {
  checkToken(req.body.token)
    .then((d) => {
      res.json({
        ok: true,
        ort: d.d.includes('|'),
      })
    })
    .catch(() => {
      res.json({
        ok: false,
      })
    })
})

app.post('/anmeldung/ma/ort', (req, res) => {
  const rules = {
    vorname: ruleLib.vorname,
    nachname: ruleLib.nachname,
    geschlecht: ruleLib.geschlecht,
    gebDat: ruleLib.gebDat,
    strasse: ruleLib.strasse,
    plzOrt: {
      plz: ruleLib.plz,
      ort: ruleLib.ort,
    },
    email: ruleLib.email,
    datenschutz: ruleLib.datenschutz,
    ecKreis: ruleLib.ecKreis,
    isMA: ruleLib.isMA,
  }

  const errVals = validate(rules, req.body)

  if (errVals.length !== 0) {
    res.status(400)
    res.json({
      status: 'ERROR',
      context: errVals,
    })
    return
  }

  try {
    const token = saveForConfirm(req.body, 20)

    const { email } = req.body

    // TODO: send Email

    res.status(200)
    res.json({
      status: 'OK',
    })
  } catch (ex) {
    res.status(500)
    res.json({
      status: 'ERROR',
      context: ex,
    })
  }
})
app.post('/anmeldung/ma/veranstaltung', async (req, res) => {
  const tk: string = (await checkToken(req.body.token)).d

  const [veranstaltungsID, position] = tk
    .split('|')
    .map((v) => parseInt(v) || v)

  req.body.veranstaltungsID = veranstaltungsID
  req.body.position = position

  const rules = {
    vorname: ruleLib.vorname,
    nachname: ruleLib.nachname,
    geschlecht: ruleLib.geschlecht,
    gebDat: ruleLib.gebDat,
    strasse: ruleLib.strasse,
    plz: ruleLib.plz,
    ort: ruleLib.ort,
    email: ruleLib.email,
    telefon: ruleLib.telefon,
    lebensmittelallergien: ruleLib.textArea250,
    bemerkungen: ruleLib.textArea250,
  }

  const errVals = validate(rules, req.body)

  if (errVals.length !== 0) {
    res.status(400)
    res.json({
      status: 'ERROR',
      context: errVals,
    })
    return
  }

  if (!req.body.token) {
    res.status(400)
    res.json({
      status: 'ERROR',
      context: 'Token not valid',
    })
    return
  }

  try {
    const token = saveForConfirm(req.body, position ? 10 : 20)

    const { email } = req.body

    const mail = await sendMail({
      to: email,
      from: 'anmeldung@ec-nordbund.de',
      subject: `Deine Anmeldung als Mitarbeiter beim EC-Nordbund (${
        vData[veranstaltungsID as keyof typeof vData] ||
        // @ts-ignore veranstaltungsID kann hier ein String sein.
        `EC-${veranstaltungsID[0].toUpperCase()}${veranstaltungsID.slice(1)}`
      })`,
      html:
        typeof veranstaltungsID !== 'number'
          ? await createMailContentMAOrt(req.body, token)
          : await createMailContentMA(req.body, token),
    })

    res.status(200)
    res.json({
      status: 'OK',
    })
  } catch (ex) {
    res.status(500)
    res.json({
      status: 'ERROR',
      context: ex,
    })
    throw ex
  }
})
// app.use(async (req, res, next) => {
//   console.log(req)
//   next()
// })

app.post('/anmeldung/tn/:id', async (req, res) => {
  // console.log('test2')
  const rules = {
    vorname: ruleLib.vorname,
    nachname: ruleLib.nachname,
    geschlecht: ruleLib.geschlecht,
    gebDat: ruleLib.gebDat,
    strasse: ruleLib.strasse,
    // plzOrt: {
    plz: ruleLib.plz,
    ort: ruleLib.ort,
    // },
    email: ruleLib.email,
    telefon: ruleLib.telefon,
    bemerkungen: ruleLib.textArea250,
    lebensmittelallergien: ruleLib.textArea250,
    gesundheit: ruleLib.textArea250,
    datenschutz: ruleLib.datenschutz,
    freizeitLeitung: ruleLib.checkboxRequired,
    tnBedingungen: ruleLib.tnBedingungen,
  }

  const errVals = validate(rules, req.body)

  if (errVals.length !== 0) {
    res.status(400)
    res.json({
      status: 'ERROR',
      context: errVals,
    })
    return
  }

  try {
    const token = saveForConfirm(
      { ...req.body, veranstaltungsID: parseInt(req.params.id) },
      1
    )

    const { email } = req.body

    const mail = await sendMail({
      to: email,
      from: 'anmeldung@ec-nordbund.de',
      subject: `Deine Anmeldung beim EC-Nordbund (${
        vData[parseInt(req.params.id) as keyof typeof vData]
      })`, // TODO: welche Veranstaltung
      // html: `
      //   <p>Um deine Anmeldung zu bestätigen klicke <a href="https://www.ec-nordbund.de/anmeldung/token/${token}">HIER</a>.<br>Oder gebe den Verifizierungscode ${token} auf <a href="https://www.ec-nordbund.de/anmeldung/token">https://www.ec-nordbund.de/anmeldung/token</a> ein</p>
      //   <p>Deine Anmeldung für ... TOKEN: ${token}</p>
      //   DATA: ${JSON.stringify(req.body)}
      // `
      html: await createMailContentTN(req.body, token),
    })

    // console.log(mail)

    res.status(200)
    res.json({
      status: 'OK',
    })
  } catch (ex) {
    res.status(500)
    res.json({
      status: 'ERROR',
      context: ex,
    })
  }
})

function escape(data: string = '') {
  return JSON.stringify(data.trim())
}

app.post('/confirm/:token', async (req, res) => {
  const token = req.params.token

  try {
    const data = validateToken(token)

    const type = data.__internals.type

    if (type === 1) {
      const gqlCode = `
        mutation {
          anmelden(
            isWP: true, 
            token: "${process.env.WPToken || 'NO WP-TOKEN'}", 
            vorname: ${escape(data.vorname)}, 
            nachname: ${escape(data.nachname)}, 
            gebDat: ${escape(data.gebDat)}, 
            geschlecht: ${escape(data.geschlecht)}, 
            position: 1, 
            veranstaltungsID: ${data.veranstaltungsID}, 
            eMail: ${escape(data.email)}, 
            telefon: ${escape(data.telefon)}, 
            strasse: ${escape(data.strasse)}, 
            plz: ${escape(data.plz)}, 
            ort: ${escape(data.ort)}, 
            anmeldeZeitpunkt: ${escape(data.__internals.time.split('.')[0])}, 
            vegetarisch: ${!!data.vegetarisch}, 
            lebensmittelAllergien: ${escape(data.lebensmittelallergien)}, 
            gesundheitsinformationen: ${escape(data.gesundheit)}, 
            bemerkungen: ${escape(data.bemerkungen)}, 
            radfahren: ${!!data.fahrrad}, 
            schwimmen: ${data.schwimmen}, 
            fahrgemeinschaften: ${!!data.fahrgemeinschaften}, 
            klettern: ${!!data.klettern}, 
            sichEntfernen: ${!!data.sichEntfernen}, 
            bootFahren: ${!!data.bootfahren}, 
            extra_json: "{}"
          ) {
            status
            anmeldeID
          }
        }
      `

      const gqlRes = await axios.post('http://api:4000/graphql', {
        query: gqlCode,
      })

      if (!data.alter && gqlRes.data.data.anmelden.status >= 0) {
        await sendMail({
          to:
            'kinder-referent@ec-nordbund.de;referent@ec-nordbund.de;app@ec-nordbund.de;BirgitHerbert@t-online.de',
          // to: 'app@ec-nordbund.de',
          from: 'anmeldung@ec-nordbund.de',
          subject: `Anmeldung mit fehlerhaften Alter`,
          html: `<p>Es gab eine Anmeldung mit nicht passenden Alter. AnmeldeID: ${gqlRes.data.data.anmelden.anmeldeID}; Wartelistenposition ${gqlRes.data.data.anmelden.status} (0 bedeutet keine Warteliste)</p>`,
        })
      }

      res.status(200)
      res.json({
        status: 'OK',
        anmeldeID: gqlRes.data.data.anmelden.anmeldeID,
        wList: gqlRes.data.data.anmelden.status,
        type,
      })
      return
    }

    if (type === 10) {
      const gqlCode = `
        mutation {
          anmelden(
            isWP: true, 
            token: "${process.env.WPToken || 'NO WP-TOKEN'}", 
            vorname: ${escape(data.vorname)}, 
            nachname: ${escape(data.nachname)}, 
            gebDat: ${escape(data.gebDat)}, 
            geschlecht: ${escape(data.geschlecht)}, 
            position: ${data.position}, 
            veranstaltungsID: ${data.veranstaltungsID}, 
            eMail: ${escape(data.email)}, 
            telefon: ${escape(data.telefon)}, 
            strasse: ${escape(data.strasse)}, 
            plz: ${escape(data.plz)}, 
            ort: ${escape(data.ort)}, 
            anmeldeZeitpunkt: ${escape(data.__internals.time.split('.')[0])}, 
            vegetarisch: ${!!data.vegetarisch}, 
            lebensmittelAllergien: ${escape(data.lebensmittelallergien)}, 
            gesundheitsinformationen: "", 
            bemerkungen: ${escape(data.bemerkungen)}, 
            radfahren: true, 
            schwimmen: 3, 
            fahrgemeinschaften: true, 
            klettern: true, 
            sichEntfernen: true, 
            bootFahren: true, 
            extra_json: "{}"
          ) {
            status
            anmeldeID
          }
        }
      `

      const gqlRes = await axios.post('http://api:4000/graphql', {
        query: gqlCode,
      })

      console.log(gqlRes)

      res.status(200)
      res.json({
        status: 'OK',
        anmeldeID: gqlRes.data.data.anmelden.anmeldeID,
        wList: gqlRes.data.data.anmelden.status,
        type,
      })
      return
    }
    if (type === 20) {
      const gqlCode = `
        mutation {
          anmelden(
            isWP: true, 
            token: "${process.env.WPToken || 'NO WP-TOKEN'}", 
            vorname: ${escape(data.vorname)}, 
            nachname: ${escape(data.nachname)}, 
            gebDat: ${escape(data.gebDat)}, 
            geschlecht: ${escape(data.geschlecht)}, 
            position: 1, 
            veranstaltungsID: 42, 
            eMail: ${escape(data.email)}, 
            telefon: ${escape(data.telefon)}, 
            strasse: ${escape(data.strasse)}, 
            plz: ${escape(data.plz)}, 
            ort: ${escape(data.ort)}, 
            anmeldeZeitpunkt: ${escape(data.__internals.time.split('.')[0])}, 
            vegetarisch: false, 
            lebensmittelAllergien: "", 
            gesundheitsinformationen: "", 
            bemerkungen: ${escape(data.bemerkungen)}, 
            radfahren: true, 
            schwimmen: 3, 
            fahrgemeinschaften: true, 
            klettern: true, 
            sichEntfernen: true, 
            bootFahren: true, 
            extra_json: "{}"
          ) {
            status
            anmeldeID
          }
        }
      `

      const gqlRes = await axios.post('http://api:4000/graphql', {
        query: gqlCode,
      })

      console.log(gqlRes)

      res.status(200)
      res.json({
        status: 'OK',
        anmeldeID: gqlRes.data.data.anmelden.anmeldeID,
        wList: gqlRes.data.data.anmelden.status,
        type,
      })
      return
    }

    res.status(500)
    res.json({
      status: 'ERROR',
      context: 'DATEN fehlerhaft',
    })
  } catch (ex) {
    console.log(ex)
    res.status(500)
    res.json({
      status: 'ERROR',
      context: ex,
    })
  }
})

cleanup()

setInterval(cleanup, 1000 * 60 * 59)

export default app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
