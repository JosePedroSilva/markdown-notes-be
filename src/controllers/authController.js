const logger = require('../../logger');
const authService = require('../services/authService');

const responseErrorBuilder = require('../utils/responseErrorBuilder');
const responseSuccessBuilder = require('../utils/responseSuccessBuilder');

exports.createUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error('Email or password not provided');

    const response = new responseErrorBuilder(
      'error',
      400,
      'BAD_REQUEST',
      'Email or password not provided',
      { email },
      req
    );

    return res.status(400).send(response);
  }

  try {
    const result = await authService.registerUser(email, password);
    logger.info('User registered', { id: result.user.id });

    const response = new responseSuccessBuilder(
      'success',
      201,
      result,
      req
    )

    return res.status(201).send(response);
  } catch (err) {
    if (err.name.includes('SequelizeUniqueConstraintError')) {
      logger.warn('Registration failed: Email already exists', { err });

      const response = new responseErrorBuilder(
        'error',
        409,
        'CONFLICT',
        'Email already exists',
        { email },
        req
      );

      return res.status(409).send(response);
    }
    logger.error('Registration failed', { err });

    const response = new responseErrorBuilder(
      'error',
      500,
      'INTERNAL_SERVER_ERROR',
      'Error registering user',
      err.message,
      req);

    return res.status(500).send(response);
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error('Email or password not provided');

    const response = new responseErrorBuilder(
      'error',
      400,
      'BAD_REQUEST',
      'Email or password not provided',
      { email },
      req
    );

    return res.status(400).send(response);
  }

  logger.trace('Login attempt', { email });

  try {
    const result = await authService.login(email, password);
    logger.info('User logged in', { id: result.user.id });

    const response = new responseSuccessBuilder(
      'success',
      200,
      result,
      req
    );

    res.status(200).send(response);

  } catch (err) {
    if (err.message === 'User not found' || err.message === 'Invalid password') {
      logger.warn('Login failed: Invalid credentials', { email });

      const response = new responseErrorBuilder(
        'error',
        401,
        'UNAUTHORIZED',
        'Invalid credentials',
        {
          email,
          error: err.message
        },
        req
      );

      return res.status(401).send(response);
    }
    logger.error('Login failed', { error: err });

    const response = new responseErrorBuilder(
      'error',
      500,
      'INTERNAL_SERVER_ERROR',
      'Error logging in',
      err.message,
      req
    );

    return res.status(500).send(response);
  }
}