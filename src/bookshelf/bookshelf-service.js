const xss = require('xss')

const BookshelfService = {

  // get all books
  getAllBookshelfItems(db) {
    return db
      .from('bookery_bookshelf AS bookshelf')
      .select(
        'bookshelf.id',
        'bookshelf.user_id',
        'bookshelf.book_id',
        'bookshelf.review',
        'bookshelf.rating',
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'user_email', usr.user_email,
              'first_name', usr.first_name,
              'last_name', usr.last_name,
              'date_created', usr.date_created,
              'date_modified', usr.date_modified
            )
          ) AS "reviewer"`
        ),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', books.id,
              'title', books.title,
              'author', books.author,
              'book_description', books.book_description,
              'graphic', books.graphic,
              'isbn', books.isbn,
              'pages', books.pages,
              'average_rating', books.average_rating
            )
          ) AS "books"`
        )
      )
      .leftJoin(
        'bookery_books AS books',
        'bookshelf.book_id',
        'books.id'
      )
      .leftJoin(
        'bookery_users AS usr',
        'usr.id',
        'bookshelf.user_id'
      )
      .groupBy('books.id', 'usr.id', 'bookshelf.rating', 'bookshelf.review', 'bookshelf.id')  },

  // get book by book id
  getById(db, id) {
    return BookshelfService.getAllBookshelfItems(db)
      .where('bookshelf.id', id)
      .first()
  },

  // add book to bookshelf
  addToBookshelf(db, bookToAdd) {
    return db
      .insert(bookToAdd)
      .into('bookery_bookshelf')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  // post review / rating
  insertReview(db, newReview) {
    return db
      .insert(newReview)
      .into('bookery_bookshelf')
  },

  // put / patch review and rating
  updateBookshelfItem(db, id, newReviewFields) {
    return db('bookery_bookshelf')
      .where('id', id)
      .update(newReviewFields)
  },

  // delete bookshelfItem by book id
  deleteBookshelfItem(db, id) {
    console.log(id)
    return BookshelfService.getById(db, id)
      .where('id', id)
      .delete()
  },

  serializeBookshelfItem(bookshelfItem) {
    const { reviewer, usr } = bookshelfItem
    console.log('****bookshelfItem****', bookshelfItem)
    return {
      id: bookshelfItem.id,
      title: bookshelfItem.title,
      author: bookshelfItem.author,
      description: bookshelfItem.book_description,
      graphic: bookshelfItem.graphic,
      isbn: bookshelfItem.isbn,
      pages: bookshelfItem.pages,
      average_rating: bookshelfItem.average_rating,
    }
  },

}

module.exports = BookshelfService

