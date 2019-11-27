const express = require('express')
const path = require('path')
const BookshelfService = require('./bookshelf-service')
const bookshelfRouter = express.Router()
const jsonBodyParser = express.json()

bookshelfRouter
  .route('/')
  .get((req, res, next) => {
    BookshelfService.getAllBookshelfItems(req.app.get('db'))
      .then(items => {
        res.json(items)
      })
      .catch(next)
  })

module.exports = bookshelfRouter