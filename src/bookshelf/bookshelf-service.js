const xss = require('xss')

const BookshelfService = {

  // get all books
  getAllBookshelfItems(db) {
    console.log('***************',db)
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

    return oneBookshelfItem

    // return BookshelfService.getAllBookshelfItems(db)
    //   .where(oneBookshelfItem, id)
    //   .first()
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
    // const allBookshelfItems = BookshelfService.getAllBookshelfItems()
    // const oneBookshelfItem = allBookshelfItems.find(x => x.id === req.params.bookshelf_id)
    console.log(id)
    return db
      .where('bookshelf.book_id', id)
      .delete()
  },

        // 'books.id',
        // 'books.title',
        // 'books.author',
        // 'books.book_description',
        // 'books.graphic',
        // 'books.isbn',
        // 'books.pages',
        // 'books.average_rating',

        // 'id', usr.id,
        // 'user_email', usr.user_email,
        // 'first_name', usr.first_name,
        // 'last_name', usr.last_name,
        // 'password', usr.password,
        // 'date_created', usr.date_created,
        // 'date_modified', usr.date_modified

  serializeBookshelfItem(bookshelfItem) {
    const { reviewer } = bookshelfItem
    return {
      id: article.id,
      style: article.style,
      title: xss(article.title),
      content: xss(article.content),
      date_created: new Date(article.date_created),
      number_of_comments: Number(article.number_of_comments) || 0,
      author: {
        id: author.id,
        user_name: author.user_name,
        full_name: author.full_name,
        nickname: author.nickname,
        date_created: new Date(author.date_created),
        date_modified: new Date(author.date_modified) || null
      },
    }
  },

}

module.exports = BookshelfService