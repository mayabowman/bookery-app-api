const knex = require('knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { makeUsersArray } = require('./test-helpers');

function seedUsers(users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 12),
  }));
  return preppedUsers
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_name: user.user_name }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `bearer ${token}`
}

describe('Auth Endpoints', () => {
  let db;
  const testUsers = makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw(`TRUNCATE bookery_users, bookery_books, bookery_bookshelf RESTART IDENTITY CASCADE`));

  afterEach('clean the table', () => db.raw(`TRUNCATE bookery_users, bookery_books, bookery_bookshelf RESTART IDENTITY CASCADE`));

  describe('POST /api/auth/login', () => {
    const preppedUsers = seedUsers(testUsers);
    beforeEach('insert users', () => db
      .into('bookery_users')
      .insert(preppedUsers));

    it('responds 200 and JWT auth token using secret when valid credentials', () => {
      const userValidCreds = {
        user_email: testUser.user_email,
        password: testUser.password,
      }
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.user_email,
          algorithm: 'HS256',
        }
      );
      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
          userId: testUser.id
        });
    });
  });
});



// const knex = require('knex')
// const jwt = require('jsonwebtoken')
// const app = require('../src/app')
// const bcrypt = require('bcryptjs')
// const { makeUsersArray} = require('./test-helpers')

// function seedUsers(users) {
//   const preppedUsers = users.map((user) => ({
//     ...user,
//     password: bcrypt.hashSync(user.password, 12),
//   }));
//   return preppedUsers
// }

// describe('Auth Endpoints', function() {
//   let db

//   let testUsers = [
//     {
//       // id: 1,
//       user_email: 'testuser1@gmail.com',
//       first_name: 'Test1',
//       last_name: 'User1',
//       password: 'password',
//       date_created: '2029-01-22T16:28:32.615Z'
//     },
//     {
//       // id: 2,
//       user_email: 'testuser2@gmail.com',
//       first_name: 'Test2',
//       last_name: 'User2',
//       password: 'password',
//       date_created: '2029-01-22T16:28:32.615Z'
//     },
//     {
//       // id: 3,
//       user_email: 'testuser3@gmail.com',
//       first_name: 'Test3',
//       last_name: 'User3',
//       password: 'password',
//       date_created: '2029-01-22T16:28:32.615Z'
//     },
//     {
//       // id: 4,
//       user_email: 'testuser4@gmail.com',
//       first_name: 'Test4',
//       last_name: 'User4',
//       password: 'password',
//       date_created: '2029-01-22T16:28:32.615Z'
//     }
//   ]

//   const testUser = testUsers[0]
//   before('make knex instance', () => {
//     db = knex({
//       client: 'pg',
//       connection: process.env.TEST_DATABASE_URL,
//     })
//     app.set('db', db)
//   })

//   before('cleanup', () => {
//     // empty the bookery_users table
//     return db.raw(
//       `TRUNCATE
//         bookery_users,
//         bookery_books,
//         bookery_bookshelf
//         CASCADE
//       `
//     )
//     .then(() => {
//       console.log('before adding')
//       // insert our test user list into bookery_users table
//       return db.into("bookery_users").insert(testUsers)
//     })
//     .then(() => {
//       console.log("after adding")
//     })
//   })

//   after('disconnect from db', () => db.destroy())

//   describe(`POST /api/auth/login`, () => {

// it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
//   const userValidCreds = {
//     user_email: testUser.user_email,
//     password: testUser.password,
//   }
//   const expectedToken = jwt.sign(
//     { user_id: testUser.id },
//     process.env.JWT_SECRET,
//     {
//       subject: testUser.user_email,
//       algorithm: 'HS256',
//     }
//   )
//   return supertest(app)
//     .post('/api/auth/login')
//     .send(userValidCreds)
//     .expect(200, {
//       authToken: expectedToken,
//     })
//     })
//   })
// })
