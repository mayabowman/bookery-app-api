# Bookery API

This RESTful API controls all interactions between the front end Bookery app and the database.

## Technology

This API was built using Node, Express and Knex. The database was built using PostgreSQL.

## Client Repo

https://github.com/mayabowman/bookery-app

## Live Site

https://bookery-app.mayabowman.now.sh

# Using this API

## Add User
Adds user to database

## URL
```javascript
/api/users
```
* Method
```
POST
```
* Body Params\
  First name\
  Last name\
  User email\
  Password

* Success Response\
  Code: 201

* Error Response\
  Code: 400

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/users`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  ```

***

## Login
Authenticates user login credentials

## URL
```javascript
/api/auth
```
* Method
```
POST
```
* Body Params\
  User email\
  Password

* Success Response
  Code: 200\
  Content:
  ```
  {
    authToken: 'authToken',
    userId: 'userId'
  }
  ```

* Error Response\
  Code: 400

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ user_email, password }),
  })
  ```

***

  ## URL
```javascript
/api/books
```
* Method
```
GET
```
* Body Params
  None

* Success Response
  Code: 200\
  Content:
  ```
  {
    books: 'books'
  }
  ```

* Error Response\
  Code: 400

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/books`)
    .then((booksRes) => {
      if (!booksRes.ok) {
        throw new Error(booksRes.statusText)
      }
      return booksRes.json()
    })
  ```

***
