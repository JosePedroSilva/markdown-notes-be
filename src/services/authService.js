const bycrypt = require('bcryptjs');
const userQueries = require('./queries/userQueries');
const generateAccessToken = require('../utils/generateAccessToken');
const logger = require('../../logger');

exports.registerUser = async (email, password) => {
  const uuid = crypto.randomUUID();
  logger.trace('Generated UUID', { uuid });

  const hashedPassword = bycrypt.hashSync(password, 10);
  logger.trace('Hashed password');

  await userQueries.createUser(uuid, email, hashedPassword);
  logger.info('User registered', { id: uuid });

  const accessToken = generateAccessToken({ id: uuid, email });
  logger.trace('Generated access token');

  return {
    token: accessToken,
    user: { id: uuid, email }
  }
};

exports.login = async (email, password) => {
  try {
    const user = await userQueries.getUserByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bycrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    logger.trace('Generated access token');

    return {
      token: accessToken,
      user: { id: user.id, email: user.email }
    }
  } catch (err) {
    if (err.message.includes('User not found') || err.message.includes('Invalid password')) {
      throw new Error('User not found');
    }
    logger.error('Login failed', err);
    throw new Error(err);
  }
};