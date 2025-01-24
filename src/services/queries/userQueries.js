const { User } = require('../../models');

exports.getUserById = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  return user;
};

exports.createUser = async (uuid, email, hashedPassword) => {
  const user = await User.create({ id: uuid, email, password: hashedPassword });
  return user;
}

exports.getUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user
}