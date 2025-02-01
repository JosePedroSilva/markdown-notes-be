class responseErrorBuilder {
  static CODE = [
    'BAD_REQUEST',
    'UNAUTHORIZED',
    'FORBIDDEN',
    'NOT_FOUND',
    'CONFLICT',
    'INTERNAL_SERVER_ERROR'
  ];

  constructor(status, statusCode, code, message, details, req) {
    if (status !== 'error') {
      throw new Error(`Invalid status: ${status}`);
    }

    if (!responseErrorBuilder.CODE.includes(code)) {
      throw new Error(`Invalid status code: ${statusCode}`);
    }

    this.status = status;
    this.statusCode = statusCode;

    this.error = {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    }

    this.requestId = req.requestId;

  }

  toJSON() {
    return {
      status: this.status,
      statusCode: this.statusCode,
      error: this.error,
      requestId: this.requestId
    }
  }
}

module.exports = responseErrorBuilder;