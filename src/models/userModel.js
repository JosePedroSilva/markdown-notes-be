const dbAllPromise = require('../utils/dbAllPromise');

exports.getUserById = (userId) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  return dbAllPromise(query, [userId]);
};