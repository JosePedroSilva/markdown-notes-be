const jwt = require('jsonwebtoken');
const logger = require('../logger');

const authenticateTokenMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    logger.trace(`Authenticating token`, { token });

    if (!token) {
        logger.warn(`Token not provided`);
        return res.status(401).send('Token not provided');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.warn(`Invalid token`, { token });
            return res.status(403).send('Invalid token');
        }

        req.user = user;
        logger.trace(`Authenticated user`, { user });
        next();
    });
}

module.exports = authenticateTokenMiddleware;