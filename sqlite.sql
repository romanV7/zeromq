CREATE TABLE users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  email   TEXT NOT NULL UNIQUE,
  passw   TEXT NOT NULL
);