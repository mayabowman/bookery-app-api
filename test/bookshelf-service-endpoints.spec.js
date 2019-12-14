const BooksService = require("../src/books/books-service")
const knex = require("knex")

describe(`Books service object`, function() {
  let db

  let testBookshelfItems = [
    {
      id: 1,
      user_id: 1,
      book_id: 1,
      review:"test review 1",
      rating: 3,
      reviewer: {
        id: 1,
          user_email: "testuser1@gmail.com",
          first_name: "Test1",
          last_name: "User1",
          date_created: "2019-11-26T20:52:15.526905"

      },
      books: {
        id: 1,
        title: "Test Book 1",
        author: "Test Author 1",
        book_description: "Test description 1.",
        graphic: "https://images-na.ssl-images-amazon.com/images/I/41Q3WS9PARL.jpg",
        isbn: "1234567899111",
        pages: 130,
        average_rating: 3
      }
    },
    {
      id: 2,
      user_id: 2,
      book_id: 2,
      review:"test review 2",
      rating: 3,
      reviewer: {
        id: 2,
          user_email: "testuser2@gmail.com",
          first_name: "Test2",
          last_name: "User2",
          date_created: "2019-11-26T20:52:15.526905"

      },
      books: {
        id: 2,
        title: "Test Book 2",
        author: "Test Author 2",
        book_description: "Test description 2.",
        graphic: "https://images-na.ssl-images-amazon.com/images/I/41Q3WS9PARL.jpg",
        isbn: "123456789222",
        pages: 130,
        average_rating: 3
      }
    },
    {
      id: 3,
      user_id: 3,
      book_id: 3,
      review:"test review 3",
      rating: 3,
      reviewer: {
        id: 3,
          user_email: "testuser3@gmail.com",
          first_name: "Test3",
          last_name: "User3",
          date_created: "2019-11-26T20:52:15.526905"

      },
      books: {
        id: 1,
        title: "Test Book 3",
        author: "Test Author 3",
        book_description: "Test description 3.",
        graphic: "https://images-na.ssl-images-amazon.com/images/I/41Q3WS9PARL.jpg",
        isbn: "123456789333",
        pages: 130,
        average_rating: 3
      }
    },
  ]

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    // empty the bookery_bookshelf table
    return db("bookery_bookshelf")
      .truncate()
      .then(() => {
        console.log('before adding')
        // insert our test bookshelfItems list into bookery_bookshelf table
        return db.into("bookery_bookshelf").update(testBookshelfItems)
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
