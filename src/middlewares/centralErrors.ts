import { ErrorRequestHandler } from "express";
import { ErrorWithStatus, EntityError } from "../models/Errors.js";
import logger from "../config/logger.js";
import { ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const centralErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status); 

  if (req.originalUrl.startsWith("/api/")) {
    if (err instanceof EntityError) {
      res.json({ message: err.message, errors: err.errors });
    } else if (err instanceof ErrorWithStatus) {
      res.json({ message: err.message });
    } else if (err instanceof ZodError) {
      res.json({
        message: "Validation failed",
        errors: err.flatten().fieldErrors,
      });
    } else {
      res.json({ message });
    }
  } else {
    if ( err.status === 404) {
      res.render("404", {
        message: "Page not found",
        error: err,
        req: req,
      });
      return;
    }
    res.render("error", {
      message: "Internal server error",
      error: err,
      req: req,
    });
  }
};

export default centralErrorHandler;
