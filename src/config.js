module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/bookery',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  // API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000",
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret'
}