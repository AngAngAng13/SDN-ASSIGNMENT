import { ErrorRequestHandler } from 'express';
import { ErrorWithStatus, EntityError } from '../models/Errors.js';
import logger from '../config/logger.js';
import { ZodError } from 'zod'; 

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const centralErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  if (err instanceof EntityError) {
    res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  else if (err instanceof ErrorWithStatus) {
    res.status(err.status).json({ message: err.message });
  }
  else if (err instanceof ZodError) {
    res.status(422).json({
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });
  }
  else {
    res.render('error', {
      message: 'Internal server error',
      error: err,
    });
  }
};

export default centralErrorHandler;