const logger = require('../../logger');

const authService = require('../services/authService');

exports.createUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error('Email or password not provided');
    return res.status(400).send('Email or password not provided');
  }

  try {
    const result = await authService.registerUser(email, password);
    logger.info('User registered', { id: result.user.id });

    res.status(201).send(result);

  } catch (err) {
    if (err.message === 'User already exists') {
      logger.warn('Registration failed: Email already exists', { email });
      return res.status(409).send(err.message);
    }
    logger.error('Registration failed', { error: err });
    return res.status(500).send('Registration failed');
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