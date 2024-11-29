const express = require('express');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const db = require('../config/database');

const logger = require('../../logger');

const generateAccessToken = (user) => {
  logger.trace('Generating access token for user:', { user });
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error('Email or password not provided');
    return res.status(400).send('Email or password not provided');
  }

  const uuid = crypto.randomUUID();
  logger.trace('Generated UUID', { uuid });

  const query = 'INSERT INTO users (id, email, password) VALUES (?, ?, ?)';

  db.run(query, [uuid, email, bycrypt.hashSync(password, 10)], (err) => {
    if (err?.message.includes('UNIQUE constraint failed: users.email')) {
      logger.warn('Registration failed: Email already exists', { email });
      return res.status(409).send('User already exists');
    }

    if (err) {
      logger.error('Registration failed', { error: err });
      return res.status(500).send('Registration failed');
    }

    const accessToken = generateAccessToken({ id: uuid, email });

    logger.info('User registered', { id: uuid });

    res.status(201).send({ token: accessToken, user: { id: uuid, email } });
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error('Email or password not provided');
    return res.status(400).send('Email or password not provided');
  }

  logger.trace('Login attempt', { email });

  const query = 'SELECT * FROM users WHERE email = ?';

  db.get(query, [email], (err, user) => {
    if (!user) {
      logger.warn('Login failed: User not found', { email });
      return res.status(404).send('User not found');
    }

    if (err) {
      logger.error('Login failed', { error: err });
      return res.status(500).send('Error logging in');
    }

    bycrypt.compare(password, user.password, (err, result) => {
      if (err) {
        logger.error('Login failed', { error: err });
        return res.status(500).send('Error logging in');
      }

      if (!result) {
        logger.warn('Login failed: Invalid password', { email });
        return res.status(401).send('Invalid password');
      }

      const accessToken = generateAccessToken({ id: user.id, email: user.email });

      logger.info('User logged in', { id: user.id });

      res.status(200).send({ token: accessToken, user: { id: user.id, email: user.email } });
    });
  });
});

module.exports = router;