# Bookery API

This RESTful API controls all interactions between the front end Bookery app and the database.

## Technology

This API was built using Node, Express and Knex. The database was built using PostgreSQL.

## Client Repo

https://github.com/mayabowman/bookery-app

## Live Site

https://bookery-app.mayabowman.now.sh

# Using this API

## Login
Authenticates user login credentials

## URL
```javascript
/api/login
```
* Method
```
POST
```
* Body Params
  User email
  Password

* Success Response
  Code: 200
  Content:
  ```
  {
    authToken: 'authToken',
    userId: 'userId'
  }

* Error Response
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
