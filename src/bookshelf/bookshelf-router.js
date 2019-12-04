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
    .route('/:bookshelf_item_id')
    // .all(requireAuth)
    .all(checkBookshelfItemExists)
    .get((req, res) => {
      res.json(BookshelfService.serializeBookshelfItem(res.bookshelfItem))
      // res.json(BookshelfService.serializeBookshelfItem(res.bookshelfItem))
    })

  // bookshelfRouter.route('/:bookshelf_item_id/review/')
  //   .all(requireAuth)
  //   .all(checkBookshelfItemExists)
  //   .get((req, res, next) => {
  //     BookshelfService.getReviewsForBookshelfItem(
  //       req.app.get('db'),
  //       req.params.bookshelf_item_id
  //     )
  //     .then(reviews => {
  //       res.json(reviews.map(BookshelfService.serializeBookshelfItemReview))
  //     })
  //     .catch(next)
  //   })



// bookshelfRouter
  // .route('/:book_id')
  // .get((req, res) => {
  //   res.json(BookshelfService.getById(req.app.get('db'), req.params.book_id))
  //     .then(review => {
  //       if (!review) {
  //         return res.status(404).json({
  //           error: { message: 'Review does not exist' }
  //         })
  //       }
  //       res.review = review
  //       next()
  //     })
  // })

  // articlesRouter
  // .route('/:article_id')
  // .all(requireAuth)
  // .all(checkArticleExists)
  // .get((req, res) => {
  //   res.json(ArticlesService.serializeArticle(res.article))
  // })

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