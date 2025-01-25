const logger = require('../../logger');

const requestLogger = (req, res, next) => {
  logger.info('Incoming request', { method: req.method, url: req.url, requestId: req.requestId });
  next();
}

module.exports = requestLogger;