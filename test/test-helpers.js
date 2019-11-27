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
      last_name: 'Usere',
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