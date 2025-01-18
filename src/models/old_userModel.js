const dbAllPromise = require('../utils/dbAllPromise');

exports.getUserById = (userId) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  return dbAllPromise(query, [userId]);
};

exports.createUser = (uuid, email, hashedPassword) => {
  const query = 'INSERT INTO users (id, email, password) VALUES (?, ?, ?)';
  return dbAllPromise(query, [uuid, email, hashedPassword]);
}

exports.getUserByEmail = (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  return dbAllPromise(query, [email]);
}