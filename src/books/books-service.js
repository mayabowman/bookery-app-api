const BooksService = {
  getAllBooks(knex) {
    return knex.select('*').from('bookery_books')
  }
}

module.exports = BooksService