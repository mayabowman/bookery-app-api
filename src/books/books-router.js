require('dotenv').config()
const knex = require('knex')
const BooksService = require('./books-service')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
})

console.log(BooksService.getAllBooks())