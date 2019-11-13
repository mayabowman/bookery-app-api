const express = require('express')
const app = express()

const { PORT } = require('./config')

app.get('/api/*', (req, res) => {
  res.json({ok: true})
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

module.exports = {app}



// original boilerplate code
// const app = require('./app')
// const { PORT } = require('./config')

// app.listen(PORT, () => {
//   console.log(`Server listening at http://localhost:${PORT}`)
// })