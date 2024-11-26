const jwt = require('jsonwebtoken');
const authenticateTokenMiddleware = require('../../../src/middleware/authMiddleware');
const logger = require('../../../logger');

jest.mock('jsonwebtoken');
jest.mock('../../../logger');

describe('authenticateTokenMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn().mockReturnValue('Bearer token')
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 401 if token is not provided', () => {
    req.header.mockReturnValue(null);

    authenticateTokenMiddleware(req, res, next);

    expect(logger.warn).toHaveBeenCalledWith('Token not provided');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Token not provided');
  });

  it('should return 403 if token is invalid', () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    authenticateTokenMiddleware(req, res, next);

    expect(logger.warn).toHaveBeenCalledWith('Invalid token', { token: 'token' });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Invalid token');
  });

  it('should call next if token is valid', () => {
    const user = { id: 1, name: 'John Doe' };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, user);
    });

    authenticateTokenMiddleware(req, res, next);

    expect(req.user).toEqual(user);
    expect(logger.trace).toHaveBeenCalledWith('Authenticated user', { user });
    expect(next).toHaveBeenCalled();
  });
});