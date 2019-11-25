const BooksService = require('../src/books/books-service')
const knex = require('knex')

describe(`Books service object`, function() {
  let db

  let testBooks = [
    {
      id: 1,
      title: 'First test book',
      author: 'First test author',
      book_description: 'First test description',
      graphic: 'https://test-graphic.jpg',
      isbn: 9780618711659,
      pages: 368,
      average_rating: 4
    },
    {
      id: 2,
      title: 'Second test book',
      author: 'Second test author',
      book_description: 'Second test description',
      graphic: 'https://test-graphic-2.jpg',
      isbn: 9780786866588,
      pages: 130,
      average_rating: 3
    },
    {
      id: 3,
      title: 'Third test book',
      author: 'Third test author',
      book_description: 'Third test description',
      graphic: 'https://test-graphic-3.jpg',
      isbn: 9780062963673,
      pages: 352,
      average_rating: 2
    }
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
  })

  before(() => {
    return db
      .into('bookery_books')
      .insert(testBooks)
  })

  after(() => db.destroy())

  before(() => db('bookery_books').truncate())

  describe(`getAllBooks()`, () => {
    it(`resolves all books from 'bookery_books' table`, () => {
      return BooksService.getAllBooks(db)
        .then(actual => {
          console.log(actual)
          expect(actual).to.eql(testBooks)
        })
    })
  })
})