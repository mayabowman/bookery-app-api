const knex = require('knex')
// const express = require('express')
const app = require('./app')

const { PORT, DATABASE_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL
})

app.set('db', db)

// original boilerplate code
const app = require('./app')
const { PORT } = require('./config')

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

// app.get('/api/*', (req, res) => {
//   res.json({ok: true})
// })

// app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

// module.exports = {app}



