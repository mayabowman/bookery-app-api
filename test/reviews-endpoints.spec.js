const BooksService = require("../src/books/books-service")
const knex = require("knex")

describe(`Books service object`, function() {
  let db

  let testReviews = [
    {
      id: 1,
      review: "test review 1"
    },
    {
      id: 2,
      review: "test review 2"
    },
    {
      id: 3,
      review: "test review 3"
    }
  ]

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    // empty the bookery_books table
    return db("bookery_bookshelf")
      .truncate()
      .then(() => {
        console.log('before adding')
        // insert our test book list into bookery_books table
        return db.into("bookery_bookshelf").update(testReviews)
      })
      .then(() => {
        console.log("after adding")
      })
  })

  after(() => db.destroy());

  describe(`updateBookshelfItem()`, () => {
    it(`responds 204 when updated review is submiited`, () => {
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
})
