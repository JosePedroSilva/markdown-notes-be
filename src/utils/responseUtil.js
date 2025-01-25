exports.successResponse = (res, message, data = {}, code = 200, status = 'SUCCESS') => {
  res.status(code).send({
    status,
    message,
    data
  });
};

exports.errorResponse = (res, code = 500, { message, details = null, status = 'INTERNAL_SERVER_ERROR' }) => {
  const response = {
    status,
    message,
  };

  if (details) response.details = details;

  res.status(code).send(response);
};