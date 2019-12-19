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
    {
      id: 2,
      user_email: 'testuser2@gmail.com',
      first_name: 'Test2',
      last_name: 'User2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 3,
      user_email: 'testuser3@gmail.com',
      first_name: 'Test3',
      last_name: 'User3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 4,
      user_email: 'testuser4@gmail.com',
      first_name: 'Test4',
      last_name: 'User4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    },
  ]
}

function makeBooksArray() {
  return [
    {
      id: 1,
      title: "First test book",
      author: "First test author",
      book_description: "First test description",
      graphic: "https://test-graphic.jpg",
      isbn: "9780618711659",
      pages: 368,
      average_rating: 4
    },
    {
      id: 2,
      title: "Second test book",
      author: "Second test author",
      book_description: "Second test description",
      graphic: "https://test-graphic-2.jpg",
      isbn: "9780786866588",
      pages: 130,
      average_rating: 3
    },
    {
      id: 3,
      title: "Third test book",
      author: "Third test author",
      book_description: "Third test description",
      graphic: "https://test-graphic-3.jpg",
      isbn: "9780062963673",
      pages: 352,
      average_rating: 2
    }
  ]
}

function makeBookshelfItemsArray() {
  return [
    {
      id: 1,
      user_id: 1,
      book_id: 1,
      review:"test review 1",
      rating: 3,
      // reviewer: {
      //   id: 1,
      //     user_email: "testuser1@gmail.com",
      //     first_name: "Test1",
      //     last_name: "User1",
      //     date_created: "2019-11-26T20:52:15.526905"

      // },
      // books: {
      //   id: 1,
      //   title: "Test Book 1",
      //   author: "Test Author 1",
      //   book_description: "Test description 1.",
      //   graphic: "https://images-na.ssl-images-amazon.com/images/I/41Q3WS9PARL.jpg",
      //   isbn: "1234567899111",
      //   pages: 130,
      //   average_rating: 3
      // }
    },
    {
      id: 2,
      user_id: 2,
      book_id: 2,
      review:"test review 2",
      rating: 3,
      // reviewer: {
      //   id: 2,
      //     user_email: "testuser2@gmail.com",
      //     first_name: "Test2",
      //     last_name: "User2",
      //     date_created: "2019-11-26T20:52:15.526905"

      // },
      // books: {
      //   id: 2,
      //   title: "Test Book 2",
      //   author: "Test Author 2",
      //   book_description: "Test description 2.",
      //   graphic: "https://images-na.ssl-images-amazon.com/images/I/41Q3WS9PARL.jpg",
      //   isbn: "123456789222",
      //   pages: 130,
      //   average_rating: 3
      // }
    },
    {
      id: 3,
      user_id: 3,
      book_id: 3,
      review:"test review 3",
      rating: 3,
    //   reviewer: {
    //     id: 3,
    //       user_email: "testuser3@gmail.com",
    //       first_name: "Test3",
    //       last_name: "User3",
    //       date_created: "2019-11-26T20:52:15.526905"

    //   },
    //   books: {
    //     id: 1,
    //     title: "Test Book 3",
    //     author: "Test Author 3",
    //     book_description: "Test description 3.",
    //     graphic: "https://images-na.ssl-images-amazon.com/images/I/41Q3WS9PARL.jpg",
    //     isbn: "123456789333",
    //     pages: 130,
    //     average_rating: 3
    //   }
    },
  ]
}

function makeFixtures() {
  const testUsers = makeUsersArray()
  const testBooks = makeBooksArray()
  const testBookshelfItems = makeBookshelfItemsArray()

  return { testUsers, testBooks, testBookshelfItems }
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