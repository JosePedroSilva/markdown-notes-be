const { User } = require('../../models');

exports.getUserById = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  return user;
};

exports.createUser = async (uuid, email, hashedPassword) => {
  // const query = 'INSERT INTO users (id, email, password) VALUES (?, ?, ?)';
  // return dbAllPromise(query, [uuid, email, hashedPassword]);
  try {
    const user = await User.create({ id: uuid, email, password: hashedPassword });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// exports.getUserByEmail = (email) => {
//   const query = 'SELECT * FROM users WHERE email = ?';
//   return dbAllPromise(query, [email]);
// }