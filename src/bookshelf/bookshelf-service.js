const xss = require('xss')

const BookshelfService = {

  // get all books
  getAllBookshelfItems(db) {
    return db
      .from('bookery_books AS books')
      .select(
        'books.id',
        'books.title',
        'books.author',
        'books.book_description',
        'books.graphic',
        'books.isbn',
        'books.pages',
        'books.average_rating',
        // db.raw(
        //   `count(DISTINCT comm) AS number_of_comments`
        // ),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'user_email', usr.user_email,
              'first_name', usr.first_name,
              'last_name', usr.last_name,
              'password', usr.password,
              'date_created', usr.date_created,
              'date_modified', usr.date_modified
            )
          ) AS "reviewer"`
        ),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', bookshelf.id,
              'rating', bookshelf.rating,
              'review', bookshelf.review
            )
          ) AS "bookshelfItem"`
        )
      )
      .leftJoin(
        'bookery_bookshelf AS bookshelf',
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

    const allBookshelfItems = BookshelfService.getAllBookshelfItems()
    const oneBookshelfItem = allBookshelfItems.find(x => x.id === req.params.bookshelf_id)

    return BookshelfService.getAllBookshelfItems(db)
      .where(oneBookshelfItem, id)
      .first()
  },

  // post review / rating
  insertReview(db, newReview) {
    return db
      .insert(newReview)
      .into('bookery_bookshelf')
  },

  // put / patch review and rating
  updateReview(db, id, newReviewFields) {
    return db
      .where('bookshelf.review', id)
      .update(newReviewFields)
  },

  // delete bookshelfItem by book id
  deleteBookshelfItem(db, id) {
    console.log(id)
    return db
      .where('bookshelf.book_id', id)
      .delete()
  },

  serializeReview(review) {
    const { user } = review
    return {
      id: review.id,
      text: xss(review.text),
      article_id: review.article_id,
      date_created: new Date(review.date_created),
      user: {
        id: user.id,
        user_eamil: user.user_email,
        first_name: user.first_name,
        last_name: user.last_name,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      },
    }
  }

}

module.exports = BookshelfService