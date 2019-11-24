const app = require('../src/app')
const knex = require('knex')

describe('App', () => {
  let db

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
  })

  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, world!')
  })
})