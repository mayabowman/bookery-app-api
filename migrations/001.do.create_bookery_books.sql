CREATE TABLE bookery_books (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  book_description TEXT,
  graphic TEXT,
  isbn CHAR(13),
  pages INTEGER,
  average_rating INTEGER
)