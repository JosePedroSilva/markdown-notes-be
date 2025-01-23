const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
// const userModel = require('../models/userModel');
const userQueries = require('../services/queries/userQueries');
const logger = require('../../logger');

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const limiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 100,
  message: 'Too many requests, please try again later.',
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit reached for IP: ${req.ip}`);

    res.status(options.statusCode).send(options.message);
  }
});

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block'); // Check if this won´t cause CORS issues
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
};

const authenticateTokenMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Invalid authorization header format');
      return res.status(401).send('Invalid authorization header format');
    }

    const token = authHeader.split(' ')[1];

    logger.trace('Authenticating token', { token });

    if (!token) {
      logger.warn('Token not provided');
      return res.status(401).send('Token not provided');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    logger.trace('Decoded token', { decodedToken });

    if (Date.now() >= decodedToken.exp * 1000) {
      logger.warn('Token expired');
      return res.status(401).send('Token expired');
    }

    const user = await userQueries.getUserById(decodedToken.id);
    logger.debug('refactor log user fetched:', { user });
    logger.trace('Authenticated user', { user });

    if (!user) {
      logger.warn('User not found');
      return res.status(401).send('User not found');
    }

    req.user = {
      id: decodedToken.id,
      email: decodedToken.email,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    };

    logger.trace('Authenticated user', { user });
    next();

  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      logger.warn('Invalid token', { error: err.message });
      return res.status(403).send('Invalid token');
    }
    logger.error('Authentication error', { error: err });
    return res.status(500).send('Internal server error');
  }
};

const enhance = [
  limiter,
  securityHeaders,
  authenticateTokenMiddleware,
]

module.exports = enhance;