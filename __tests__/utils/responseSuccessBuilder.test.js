const responseSuccessBuilder = require('../../src/utils/responseSuccessBuilder');

describe('responseSuccessBuilder', () => {
  let mockReq;

  beforeEach(() => {
    mockReq = {
      originalUrl: '/api/v1/test',
      requestId: '12345',
    };
  });

  test('should create a valid success response', () => {
    const response = new responseSuccessBuilder(
      'success',
      200,
      { message: 'Operation successful' },
      mockReq
    );

    expect(response).toBeInstanceOf(responseSuccessBuilder);
    expect(response.status).toBe('success');
    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual({ message: 'Operation successful' });
    expect(response.path).toBe('/api/v1/test');
    expect(response.requestId).toBe('12345');
    expect(response.timestamp).toEqual(expect.any(String));
  });

  test('should throw an error for invalid status', () => {
    expect(() => {
      new responseSuccessBuilder('error', 200, { message: 'Invalid' }, mockReq);
    }).toThrow('Invalid status: error');
  });

  test('should return expected JSON structure', () => {
    const response = new responseSuccessBuilder(
      'success',
      201,
      { id: 123, name: 'New Item' },
      mockReq
    );

    expect(response.toJSON()).toEqual({
      status: 'success',
      statusCode: 201,
      data: { id: 123, name: 'New Item' },
      timestamp: expect.any(String), // Ensures it's an ISO timestamp
      path: '/api/v1/test',
      requestId: '12345',
    });
  });

  test('should handle missing data', () => {
    const response = new responseSuccessBuilder(
      'success',
      204, // No content
      null,
      mockReq
    );

    expect(response.data).toBeNull();
  });
});
