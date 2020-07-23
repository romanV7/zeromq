var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('sample.db');

db.serialize(function() {

  db.run("CREATE TABLE users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, passw TEXT NOT NULL);");
  db.run('INSERT INTO users (email, passw) VALUES ("user@gmail.com", "xxx")')
  db.run('INSERT INTO users (email, passw) VALUES ("bob@gmail.com", "aaa")')
  db.run('INSERT INTO users (email, passw) VALUES ("jake@gmail.com", "zzz")')

});

db.close();
