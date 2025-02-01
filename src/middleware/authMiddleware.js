const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const userQueries = require('../services/queries/userQueries');
const logger = require('../../logger');
const responseErrorBuilder = require('../utils/responseErrorBuilder');

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
      logger.warn('Missing or invalid authorization header');

      const response = new responseErrorBuilder(
        'error',
        401,
        'UNAUTHORIZED',
        'Missing or invalid authorization header',
        {},
        req
      );

      return res.status(401).send(response);
    }

    const token = authHeader.split(' ')[1];

    logger.trace('Authenticating token', { token });

    if (!token) {
      logger.warn('Token not provided');

      const response = new responseErrorBuilder(
        'error',
        401,
        'UNAUTHORIZED',
        'Token not provided',
        {},
        req
      );

      return res.status(401).send(response);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    logger.trace('Decoded token', { decodedToken });

    if (Date.now() >= decodedToken.exp * 1000) {
      logger.warn('Token expired');

      const response = new responseErrorBuilder(
        'error',
        401,
        'UNAUTHORIZED',
        'Token expired',
        { token },
        req
      );
      return res.status(401).send(response);
    }

    const user = await userQueries.getUserById(decodedToken.id);
    logger.debug('refactor log user fetched:', { user });
    logger.trace('Authenticated user', { user });

    if (!user) {
      logger.warn('User not found');

      const response = new responseErrorBuilder(
        'error',
        401,
        'UNAUTHORIZED',
        'User not found',
        { token },
        req
      );

      return res.status(401).send(response);
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
      const response = new responseErrorBuilder(
        'error',
        403,
        'FORBIDDEN',
        'Invalid token',
        {},
        req
      );
      return res.status(403).send(response);
    }
    logger.error('Authentication error', { error: err });
    const response = new responseErrorBuilder(
      'error',
      500,
      'INTERNAL_SERVER_ERROR',
      'Internal server error',
      {},
      req
    );
    return res.status(500).send(response);
  }
};

const enhance = [
  limiter,
  securityHeaders,
  authenticateTokenMiddleware,
]

module.exports = enhance;