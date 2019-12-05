const BooksService = {
  getAllBooks(knex) {
    return knex.select('*').from('bookery_books')
  },

  // addToBookshelf(knex, bookToAdd) {
  //   return knex
  //     .insert(bookToAdd)
  //     .into('bookery_bookshelf')
  //     .returning('*')
  //     .then(rows => {
  //       return rows[0]
  //     })
  // }
}

module.exports = BooksService