const logger = require('../../logger');
const { successResponse, errorResponse } = require('../utils/responseUtil');
const authService = require('../services/authService');

exports.createUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error('Email or password not provided');
    return errorResponse(res, 400, { message: 'Email or password not provided', status: 'BAD_REQUEST', details: { email, password } });
  }

  try {
    const result = await authService.registerUser(email, password);
    logger.info('User registered', { id: result.user.id });

    return successResponse(res, 'User registered', result, 201);

  } catch (err) {
    if (err.name.includes('SequelizeUniqueConstraintError')) {
      logger.warn('Registration failed: Email already exists', { err });
      return errorResponse(res, 409, { message: 'Email already exists', status: 'CONFLICT', details: { error: err.message } });
    }
    logger.error('Registration failed', { err });
    return errorResponse(res, 500, { message: 'Error registering user', details: { error: err.message } });
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error('Email or password not provided');
    return res.status(400).send('Email or password not provided');
  }

  logger.trace('Login attempt', { email });

  try {
    const result = await authService.login(email, password);
    logger.info('User logged in', { id: result.user.id });

    res.status(200).send(result);

  } catch (err) {
    if (err.message === 'User not found' || err.message === 'Invalid password') {
      logger.warn('Login failed: Invalid credentials', { email });
      return res.status(401).send('Invalid credentials');
    }
    logger.error('Login failed', { error: err });
    return res.status(500).send('Error logging in');
  }
}