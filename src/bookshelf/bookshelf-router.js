const express = require('express')
const path = require('path')
const BookshelfService = require('./bookshelf-service')
const bookshelfRouter = express.Router()
const jsonBodyParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

bookshelfRouter
  .route('/')
  .get((req, res, next) => {
    BookshelfService.getAllBookshelfItems(req.app.get('db'))
      .then(items => {
        res.json(items)
      })
      .catch(next)
  })
  .post((req, res, next) => {
    const { book_id } = req.body
    const addedBook = { book_id }
    console.log('I made it here')

    console.log(req.body)

    for (const [key, value] of Object.entries(addedBook)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request` }
        })
      }
    }

    addedBook.user_id = req.user.id

    BookshelfService.addToBookshelf(req.app.get('db'), addedBook)
      .then(book => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${book.id}`))
          .json(BookshelfService.serializeReview(book))
      })
      .catch(next)
  })

  bookshelfRouter
    .route('/:bookshelf_item_id')
    .all(requireAuth)
    .all(checkBookshelfItemExists)
    .get((req, res, next) => {
      BookshelfService.getById(req.app.get('db'), req.params.bookshelf_item_id)
      .then(items => {
        res.json(items)
      })
      .catch(next)
      // res.json(BookshelfService.serializeBookshelfItem(res.bookshelfItem))
    })

    .post(jsonBodyParser, (req, res, next) => {
      const { user_id, bookshelf_item_id, review } = req.body
      const newReview = { user_id, bookshelf_item_id, review }

      for (const [key, value] of Object.entries(newReview)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request` }
          })
        }
      }
      console.log(req.user)
      newReview.user_id = req.user.id
      console.log(newReview)
      BookshelfService.insertReview(req.app.get('db'), newReview)
        .then(review => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${review.id}`))
            .json(BookshelfService.serializeReview(review))
        })
        .catch(next)
    })




  .patch(jsonBodyParser, (req, res, next) => {
    const { user_id, book_id, review } = req.body
    const reviewUpdate = { user_id, book_id, review }

    const numValues = Object.values(reviewUpdate).filter(Boolean).length
      if (numValues === 0) {
        return res.status(400).json({
          error: { message: 'Request must contain either user id, book id, or review' }
        })
      }
      BookshelfService.updateReview(req.app.get('db', req.params.book_id), reviewUpdate)
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
  })

  .delete(jsonBodyParser, (req, res, next) => {
    const { bookshelf_item_id } = req.params
    console.log('id', bookshelf_item_id)
    console.log('req.params', req.params)
    BookshelfService.deleteBookshelfItem(req.app.get('db'), bookshelf_item_id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

  /* async/await syntax for promises */
  async function checkBookshelfItemExists(req, res, next) {
    try {
      const bookshelfItem = await BookshelfService.getById(
        req.app.get('db'),
        req.params.bookshelf_item_id
      )
      console.log('******------------*******', req.params.bookshelf_item_id)
      if (!bookshelfItem)
        return res.status(404).json({
          error: `Bookshelf item doesn't exist`
        })

      res.bookshelfItem = bookshelfItem
      next()
    } catch (error) {
      next(error)
    }
  }



module.exports = bookshelfRouter