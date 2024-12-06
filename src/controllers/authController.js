const bycrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const logger = require('../../logger');

const generateAccessToken = require('../utils/generateAccessToken');

exports.createUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error('Email or password not provided');
    return res.status(400).send('Email or password not provided');
  }

  try {
    const uuid = crypto.randomUUID();
    logger.trace('Generated UUID', { uuid });

    const hashedPassword = bycrypt.hashSync(password, 10);
    logger.trace('Hashed password');

    await userModel.createUser(uuid, email, hashedPassword);
    logger.info('User registered', { id: uuid });

    const accessToken = generateAccessToken({ id: uuid, email });
    logger.trace('Generated access token');

    logger.info('User registered', { id: uuid });

    res.status(201).send({ token: accessToken, user: { id: uuid, email } });

  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed: users.email')) {
      logger.warn('Registration failed: Email already exists', { email });
      return res.status(409).send('User already exists');
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
    const user = await userModel.getUserByEmail(email);

    if (user.length === 0) {
      logger.warn('Login failed: User not found', { email });
      return res.status(404).send('User not found');
    }

    bycrypt.compare(password, user[0].password, (err, result) => {
      if (err) {
        logger.error('Login failed', { error: err });
        return res.status(500).send('Error logging in');
      }

      if (!result) {
        logger.warn('Login failed: Invalid password', { email });
        return res.status(401).send('Invalid password');
      }

      const accessToken = generateAccessToken({ id: user[0].id, email: user[0].email });

      logger.info('User logged in', { id: user[0].id });

      res.status(200).send({ token: accessToken, user: { id: user[0].id, email: user[0].email } });
    });
  } catch (err) {
    logger.error('Login failed', { error: err });
    return res.status(500).send('Error logging in');
  }
}