import { ErrorRequestHandler } from 'express';
import { ErrorWithStatus } from '../models/Errors.js';
import logger from '../config/logger.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const centralErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  
  const statusCode = err.status || 500;
  logger.error(
    `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  if (err instanceof ErrorWithStatus) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).render('error', {
      message: 'An internal server error occurred.',
      error: process.env.NODE_ENV === 'development' ? err : {},
    });
  }
};
export default centralErrorHandler;