require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const usersRouter = require('./users/users-router')
const booksRouter = require('./books/books-router')
const authRouter = require('./auth/auth-router')
const bookshelfRouter = require('./bookshelf/bookshelf-router')


const app = express()

const morganOption = (NODE_ENV === 'production'
  ? 'tiny'
  : 'common')

app.use(morgan(morganOption))
app.use(helmet())

const whitelist = [CLIENT_ORIGIN, 'http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

// app.use(cors(
//   { origin: CLIENT_ORIGIN }
// ))

app.use('/api/users', usersRouter)
app.use('/api/books', booksRouter)
app.use('/api/auth', authRouter)
app.use('/api/bookshelf', bookshelfRouter)


app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app
