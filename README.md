# Bookery API

This RESTful API controls all interactions between the front end Bookery app and the database.

![Bookery Browse Page](https://user-images.githubusercontent.com/50124247/71899540-f4e09300-3129-11ea-9693-34692af37fef.png)

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

* Success Response\
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

* Success Response\
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

## URL
```javascript
/api/bookshelf
```
* Method
```
GET
```
* Body Params
  None

* Success Response\
  Code: 200\
  Content:
  ```
  {
    bookshelf: 'bookshelfItems'
  }
  ```

* Error Response\
  Code: 400

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/bookshelf`)
    .then((bookshelfRes) => {
      if (!bookshelfRes.ok) {
        throw new Error(bookshelfRes.statusText)
      }
      return bookshelfRes.json()
    })
  ```

***

## URL
```javascript
/api/bookshelf
```
* Method
```
POST
```
* Body Params\
  Book Id\
  Review\
  Rating

* Success Response\
  Code: 201

* Error Response\
  Code: 400

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/bookshelf`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `bearer ${TokenService.getAuthToken()}`,
    },
    body: JSON.stringify({
      book_id: book_id,
      review: review,
      rating: rating
    })
  })
  ```

***

## URL
```javascript
/api/bookshelf/bookshelf_item_id
```
* Method
```
PATCH
```

* URL Params\
  ```
  bookshelfItemId=[bookshelf item id]
  ```

* Body Params\
  Review text

* Success Response\
  Code: 204

* Error Response\
  Code: 404\
  Content:
  Content:
  ```
  {
    error: `Bookshelf item doesn't exist`
  }
  ```

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/bookshelf/${bookshelfItemId}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'authorization': `bearer ${TokenService.getAuthToken()}`
    },
    body: JSON.stringify({
      review: review,
    }),
  })
  ```

***

## URL
```javascript
/api/bookshelf/bookshelf_item_id
```
* Method
```
DELETE
```

* URL Params\
  ```
  bookshelfItemId=[bookshelf item id]
  ```

* Body Params\
  None

* Success Response\
  Code: 204

* Error Response\
  Code: 404\
  Content:
  ```
  {
    error: `Bookshelf item doesn't exist`
  }
  ```

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/bookshelf/${bookshelfItemId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'authorization': `bearer ${TokenService.getAuthToken()}`,
    },
  })
  ```