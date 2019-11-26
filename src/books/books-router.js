const express = require('express')
const BooksService = require('./books-service')
const booksRouter = express.Router()

booksRouter
  .route('/')
  .get((req, res, next) => {
    BooksService.getAllBooks(req.app.get('db'))
      .then(books => {
        res.json(books)
      })
      .catch(next)
  })
module.exports = booksRouter

