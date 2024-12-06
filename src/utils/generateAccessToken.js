const jwt = require('jsonwebtoken');
const logger = require('../../logger');

const generateAccessToken = (user) => {
  logger.trace('Generating access token for user:', { user });
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' });
}

module.exports = generateAccessToken;