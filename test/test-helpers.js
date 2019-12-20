const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function makeUsersArray() {
  return [
    {
      id: 1,
      user_email: 'testuser1@gmail.com',
      first_name: 'Test1',
      last_name: 'User1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    // {
    //   id: 2,
    //   user_email: 'testuser2@gmail.com',
    //   first_name: 'Test2',
    //   last_name: 'User2',
    //   password: 'password',
    //   date_created: '2029-01-22T16:28:32.615Z'
    // },
    // {
    //   id: 3,
    //   user_email: 'testuser3@gmail.com',
    //   first_name: 'Test3',
    //   last_name: 'User3',
    //   password: 'password',
    //   date_created: '2029-01-22T16:28:32.615Z'
    // },
  ]
}

function makeBooksArray() {
  return [
    {
      id: 1,
      title: "Test Book 1",
      author: "Test Author 1",
      book_description: "Test description 1",
      graphic: "https://test-graphic-1.jpg",
      isbn: "9780618711659",
      pages: 368,
      average_rating: 4
    },
    // {
    //   id: 2,
    //   title: "Test Book 2",
    //   author: "Test Author 2",
    //   book_description: "Test description 2",
    //   graphic: "https://test-graphic-2.jpg",
    //   isbn: "9780786866588",
    //   pages: 130,
    //   average_rating: 3
    // },
    // {
    //   id: 3,
    //   title: "Test Book 3",
    //   author: "Test author 3",
    //   book_description: "Test description 3",
    //   graphic: "https://test-graphic-3.jpg",
    //   isbn: "9780062963673",
    //   pages: 352,
    //   average_rating: 2
    // }
  ]
}

function makeBookshelfArray(users, books) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      book_id: books[0].id,
      review:"test review 1",
      rating: 3
    },
    // {
    //   id: 2,
    //   user_id: users[1].id,
    //   book_id: books[1].id,
    //   review:"test review 2",
    //   rating: 3
    // },
  ]
}

function makeBookshelfItemsArray(users, books) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      book_id: books[0].id,
      review:"test review 1",
      rating: 3,
      reviewer: {
        id: 1,
          user_email: "testuser1@gmail.com",
          first_name: "Test1",
          last_name: "User1",
          date_created: "2029-01-22T16:28:32.615"

      },
      books: {
        id: 1,
        title: "Test Book 1",
        author: "Test Author 1",
        book_description: "Test description 1",
        graphic: "https://test-graphic-1.jpg",
        isbn: "9780618711659",
        pages: 368,
        average_rating: 4
      }
    },
    // {
    //   id: 2,
    //   user_id: users[1].id,
    //   book_id: books[1].id,
    //   review:"test review 2",
    //   rating: 3,
    //   reviewer: {
    //     id: 2,
    //       user_email: "testuser2@gmail.com",
    //       first_name: "Test2",
    //       last_name: "User2",
    //       date_created: "2029-01-22T16:28:32.615"

    //   },
    //   books: {
    //     id: 2,
    //     title: "Test Book 2",
    //     author: "Test Author 2",
    //     book_description: "Test description 2",
    //     graphic: "https://test-graphic-2.jpg",
    //     isbn: "9780786866588",
    //     pages: 130,
    //     average_rating: 3
    //   }
    // },
  ]
}

function makeReviewsArray(bookshelfItem) {
  return [
    {
      bookshelfItemId: bookshelfItem[0].id,
      reviewUpdate: "Test Review 1"
    },
    // {
    //   bookshelfItemId: bookshelfItem[1].id,
    //   reviewUpdate: "Test Review 2"
    // },
  ]
}

function makeFixtures() {
  const testUsers = makeUsersArray()
  const testBooks = makeBooksArray()
  const testBookshelf = makeBookshelfArray(testUsers, testBooks)
  const testBookshelfItems = makeBookshelfItemsArray(testUsers, testBooks)
  const testUpdatedReviews = makeReviewsArray(testBookshelfItems)

  return { testUsers, testBooks, testBookshelf, testBookshelfItems, testUpdatedReviews }
}

function cleanTables(db) {
  console.log('**********************')
  return db.raw(
    `TRUNCATE
      bookery_users,
      bookery_books,
      bookery_bookshelf
      CASCADE
    `
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('bookery_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('bookery_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_email,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeBooksArray,
  makeBookshelfItemsArray,
  makeFixtures,
  cleanTables,
  seedUsers,
  makeAuthHeader
}