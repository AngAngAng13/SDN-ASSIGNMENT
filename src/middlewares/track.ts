import {  Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware.js";
import { authService } from "../services/auth.service.js";
import logger from "../config/logger.js";
export const trackMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      const user = await authService.findUserByRefreshToken(token);
      if (user) {
        req.user = user;
        res.locals.user = user;
      }
    } catch (error) {
      logger.error("Error in global user middleware:", error);
    }
  }
  res.locals.path = req.path;
  next();
};
