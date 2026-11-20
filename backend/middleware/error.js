const ErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for development debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new Error(message);
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'JSON Web Token is invalid. Try again.';
    error = new Error(message);
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'JSON Web Token is expired. Try again.';
    error = new Error(message);
    error.statusCode = 401;
  }

  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = ErrorHandler;
