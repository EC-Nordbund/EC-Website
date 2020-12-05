const axios = require('axios')

axios.default.post('http://localhost:3000/api/anmeldung/ma/ort', {test: 'abc'}).catch(v=>v.response.data).then(console.log)