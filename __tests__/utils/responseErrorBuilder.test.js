const responseErrorBuilder = require('../../src/utils/responseErrorBuilder');

describe('responseErrorBuilder', () => {
  let mockReq;

  beforeEach(() => {
    mockReq = {
      originalUrl: '/api/v1/test',
      requestId: '12345',
    };
  });

  test('should create a valid error response', () => {
    const response = new responseErrorBuilder(
      'error',
      400,
      'BAD_REQUEST',
      'Invalid input',
      { field: 'email' },
      mockReq
    );

    expect(response).toBeInstanceOf(responseErrorBuilder);
    expect(response.status).toBe('error');
    expect(response.statusCode).toBe(400);
    expect(response.error.code).toBe('BAD_REQUEST');
    expect(response.error.message).toBe('Invalid input');
    expect(response.error.details).toEqual({ field: 'email' });
    expect(response.error.path).toBe('/api/v1/test');
    expect(response.requestId).toBe('12345');
  });

  test('should throw error for invalid status', () => {
    expect(() => {
      new responseErrorBuilder('success', 400, 'BAD_REQUEST', 'Invalid input', {}, mockReq);
    }).toThrow('Invalid status: success');
  });

  test('should throw error for invalid code', () => {
    expect(() => {
      new responseErrorBuilder('error', 400, 'INVALID_CODE', 'Invalid input', {}, mockReq);
    }).toThrow('Invalid status code: 400');
  });

  test('should return expected JSON structure', () => {
    const response = new responseErrorBuilder(
      'error',
      401,
      'UNAUTHORIZED',
      'Unauthorized access',
      null,
      mockReq
    );

    expect(response.toJSON()).toEqual({
      status: 'error',
      statusCode: 401,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized access',
        details: null,
        timestamp: expect.any(String), // Ensure it's a string (ISO timestamp)
        path: '/api/v1/test',
      },
      requestId: '12345',
    });
  });

  test('should handle missing details field', () => {
    const response = new responseErrorBuilder(
      'error',
      404,
      'NOT_FOUND',
      'Resource not found',
      undefined,
      mockReq
    );

    expect(response.error.details).toBeUndefined();
  });
});
