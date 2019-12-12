const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')

describe('Users Endpoints', function() {
  let db

  let testUsers = [
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
    }
  ]

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    // empty the bookery_users table
    return db("bookery_users")
      .truncate()
      .then(() => {
        console.log('before adding')
        // insert our test user list into bookery_users table
        return db.into("bookery_users").insert(testUsers)
      })
      .then(() => {
        console.log("after adding")
      })
  })

  after('disconnect from db', () => db.destroy())

  describe(`POST /api/users`, () => {
    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          user_email: 'test user_email',
          password: '11AAaa!!',
          first_name: 'test first_name',
          last_name: 'test last_name'
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.user_email).to.eql(newUser.user_email)
            expect(res.body.first_name).to.eql(newUser.first_name)
            expect(res.body.last_name).to.eql(newUser.last_name)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
            const actualDate = new Date(res.body.date_created).toLocaleString()
            expect(actualDate).to.eql(expectedDate)
          })
          .expect(res =>
            db
              .from('blogful_users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.user_email).to.eql(newUser.user_email)
                expect(row.first_name).to.eql(newUser.first_name)
                expect(row.last_name).to.eql(newUser.last_name)
                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                const actualDate = new Date(row.date_created).toLocaleString()
                expect(actualDate).to.eql(expectedDate)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })
    })
  })
})