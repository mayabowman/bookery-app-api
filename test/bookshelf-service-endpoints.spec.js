const BooksService = require("../src/books/books-service")
const knex = require("knex")
const app = require('../src/app')
const helpers = require('./test-helpers')

describe(`Bookshelf service object`, function() {
  let db

  const {
    testBooks,
    testUsers,
    testBookshelfItems
  } = helpers.makeFixtures

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  before('cleanup', () => {
    // empty the bookery_books table
    return db.raw(
      `TRUNCATE
        bookery_bookshelf,
        bookery_books,
        bookery_users
        CASCADE
      `
    )
    .then(() => {
      console.log('before adding')
      // insert our test books into bookery_books table
      return db.into("bookery_books").insert(testBooks)
    })
    .then(() => {
      // insert our test users into bookery_users table
      return db.into("bookery_users").insert(testUsers)
    })
    .then(() => {
      // insert our test bookshelfItems into bookery_bookshelf table
      return db.into("bookery_bookshelf").insert(testBookshelfItems)
    })
    .then(() => {
      console.log("after adding")
    })
  })

  after(() => db.destroy());

  // get allBookshelfItems
  describe(`GET /api/bookshelf`, () => {
    context(`Given no bookshelfItems`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('api/bookshelf')
          .expect(200, [])
      })
    })
    context('Given there are bookshelfItems in the database', () => {
      it(`responds with 200 and all of the bookshelfItems`, () => {
        return supertest(app)
          .get('api/bookshelf')
          .expect(200, testBookshelfItems)
      })
    })
  })

  // post book to bookshelf
  describe('POST /api/bookshelf', () => {
    it(`adds book to bookshelf, responding with 204`, () => {
      const testBookshelfItem = testBookshelfItems[0]
      const testReview = testBookshelfItems[0].review
      const testRating = testBookshelfItems.rating
      const bookToAdd = {
        book_id: testBookshelfItem.book_id,
        review: testReview,
        rating: testRating
      }
      return supertest(app)
        .post('/api/bookshelf')
        .send(bookToAdd)
    })
  })

  // get bookshelfItembyId
  describe(`GET /api/bookshelf/:bookshelf_item_id`, () => {
    context(`Given no bookshelfItems`, () => {
      it(`responds with 404`, () => {
        const bookshelfItemId = 123
        return supertest(app)
          .get(`api/bookshelf/${bookshelfItemId}`)
          .expect(404, { error: `BookshelfItem doesn't exist` })
      })
    })
    context('Given there are bookshelfItems in the database', () => {
      it('responds with 200 and the specified bookshelfItem', () => {
        const bookshelfItemId = 2
        const testBookshelfItem = testBookshelfItems[1]
        return supertest(app)
          .get(`'api/bookshelf/${bookshelfItemId}`)
          .expect(200, testBookshelfItem)
      })
    })
  })

  // updatebookshelfItem (review)
  describe(`updateBookshelfItem()`, () => {
    it(`responds 204 when updated review is submitted`, () => {
      const updatedReview = {
        id: testReviews.id,
        review: testReviews.review,
      }

      return supertest(app)
        .patch(`/api/bookshelf/${updatedReview.id}`)
        .send(updatedReview)
        .expect(204, {
          review: testReviews.review,
        })
    })
  })

  // delete bookshelfItem
  describe(`DELETE api/bookshelf/:bookshelf_item_id`, () => {
    it('responds with 204', () => {
      const bookshelfItemId = 2
      const testBookshelfItem = testBookshelfItems[1]
      return supertest(app)
        .delete(`'api/bookshelf/${bookshelfItemId}`)
        .expect(204, testBookshelfItem)
    })
  })
})
