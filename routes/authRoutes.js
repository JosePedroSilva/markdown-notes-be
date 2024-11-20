const express = require('express');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const db = require('../config/database');

const logger = require('../logger');

const generateAccessToken = (user) => {
    logger.trace(`Generating access token for user:`, { user });
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        logger.error('Email or password not provided');
        return res.status(400).send('Email or password not provided');
    }

    const uuid = crypto.randomUUID();
    logger.trace(`Generated UUID`, { uuid });

    const query = `INSERT INTO users (id, email, password) VALUES (?, ?, ?)`;

    db.run(query, [uuid, email, bycrypt.hashSync(password, 10)], (err) => {
        if (err?.message.includes('UNIQUE constraint failed: users.email')) {
            logger.warn(`Registration failed: Email already exists`, { email });
            return res.status(409).send('User already exists');
        }

        if (err) {
            logger.error(`Registration failed`, { error: err });
            return res.status(500).send('Registration failed');
        }

        const accessToken = generateAccessToken({ id: uuid, email });

        logger.info(`User registered`, { id: uuid });

        res.status(201).send({ accessToken, user: { id: uuid, email } });

    });
});

module.exports = router;