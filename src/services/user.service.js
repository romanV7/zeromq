const sqlite = require('sqlite3')

let db = new sqlite.Database('./sample.db', (err, res) => {
  if (err) console.log(err)
  console.log('connected to db')
});

const findAllUsers = callback => {
  const sql = 'SELECT * FROM users'
  db.all(sql, (err, result) => callback(err, result))
}

const findUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], (err, result) => callback(err, result))
}

module.exports = { findAllUsers, findUserByEmail }
