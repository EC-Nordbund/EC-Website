/**
 * @type {Window["fetch"]}
 */
const fetch = require('node-fetch')
const fs = require('fs')

const data = require('./fileToDownload.json').filter((v, i, t) => t.indexOf(v) === i).filter(v => !v.endsWith('/') && !v.includes('#'))

console.log(data)

const lost = []

data
  // .filter(v => !v.endsWith('mp4') && !v.endsWith('.m4v'))
  .forEach(async from => {
    try {
      const _parted = from.split('/')
      const to = './static/old/' + _parted[_parted.length - 1]

      const res = await fetch(from)
      const stream = res.body

      if (!stream) {
        console.log(to)
        return
      } else {
        if (fs.existsSync(to)) {
          fs.unlinkSync(to)
          //   return
        }

        stream.pipe(fs.createWriteStream(to))
      }

      // fs.createWriteStream(to).pipe(stream)
    } catch (error) {
      console.log(from)
      lost.push(from)
      // console.log(error)
    }


    // console.log(to)
  })

// setTimeout(() => {
//   console.log(lost)
// }, 10000);