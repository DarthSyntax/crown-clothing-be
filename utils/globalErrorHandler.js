const AppError = require('./appError');

const sendErrorDev = function (err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = function (err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleJWTError = (err) => new AppError('Invalid token signature!', 401);

const handleExpiredTokenError = (err) => new AppError('Expired token', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
  if (error.name === 'TokenExpiredError')
    error = handleExpiredTokenError(error);

  sendErrorDev(error, res);
};
