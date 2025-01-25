class responseSuccessBuilder {
  constructor(status, statusCode, data, req) {
    if (status !== 'success') {
      throw new Error(`Invalid status: ${status}`);
    }

    this.status = status;
    this.statusCode = statusCode;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.path = req.originalUrl;
    this.requestId = req.requestId;
  }

  toJSON() {
    return {
      status: this.status,
      statusCode: this.statusCode,
      data: this.data,
      timestamp: this.timestamp,
      path: this.path,
      requestId: this.requestId
    }
  }
}

module.exports = responseSuccessBuilder;