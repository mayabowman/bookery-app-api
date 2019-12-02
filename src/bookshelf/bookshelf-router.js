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

  .post(jsonBodyParser, (req, res, next) => {
    const { user_id, book_id, review } = req.body
    const newReview = { user_id, book_id, review }

    for (const [key, value] of Object.entries(newReview)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request` }
        })
      }
    }

    newReview.user_id = req.user.id

    BookshelfService.insertReview(req.app.get('db'), newReview)
      .then(review => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${review.id}`))
          .json(BookshelfService.serializeReview(review))
      })
      .catch(next)
  })

bookshelfRouter
  .route('/:book_id')
  .get((req, res) => {
    res.json(BookshelfService.getById(req.app.get('db'), req.params.book_id))
      .then(review => {
        if (!review) {
          return res.status(404).json({
            error: { message: 'Review does not exist' }
          })
        }
        res.review = review
        next()
      })
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
    const { id } = req.params
    console.log(id)
    BookshelfService.deleteBookshelfItem(req.app.get('db'), id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })



module.exports = bookshelfRouter