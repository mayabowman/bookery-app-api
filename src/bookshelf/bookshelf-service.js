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
              'rating', bookshelf.rating,
              'review', bookshelf.review
            )
          ) AS "bookshelfItem"`
        )
      )
      .leftJoin(
        'bookery_bookshelf AS bookshelf',
        'books.id',
        'bookshelf.book_id',
      )
      .leftJoin(
        'bookery_users AS usr',
        'bookshelf.user_id',
        'usr.id',
      )
      .groupBy('books.id', 'usr.id', 'bookshelf.rating', 'bookshelf.review')
  }

  // get book by book id
  // getById(db, id) {
  //   return BookshelfService.getBookshelfItems(db)
  //     .where('art.id', id)
  //     .first()
  // },


  // post review / rating

  // put / patch review and rating

  // delete bookshelfItem by book id

}

module.exports = BookshelfService