import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { ErrorWithStatus } from "../models/Errors.js";
import Member, { IMember } from "../models/member.model.js";
import logger from "../config/logger.js";

export interface AuthenticatedRequest extends Request {
  user?: IMember;
}
export const checkWebAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.redirect("/login");
  }

  try {
   
    const isValid = await authService.validateDbRefreshToken(token);
    if (!isValid) {
      res.clearCookie("refreshToken", { path: "/" });
      return res.redirect("/login");
    }

    const user = await authService.findUserByRefreshToken(token);
    if (!user) {
      res.clearCookie("refreshToken", { path: "/" });
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Web auth middleware error:", error);
    res.clearCookie("refreshToken", { path: "/" });
    return res.redirect("/login");
  }
};
export const checkAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //return res.redirect("/login");
    return next(new ErrorWithStatus({ message: "Authentication required: No token provided", status: 401 }));
  }
  logger.info("Found token:", req);
  logger.info("Found token:", authHeader);
  const token = authHeader.split(" ")[1];
  try {
    logger.info("Attempting to authenticate token:", token);
    const decodedPayload = authService.validateAccessToken(token);
    const user = await Member.findById(decodedPayload.sub);

    if (!user) {
      return next(new ErrorWithStatus({ message: "Authentication failed: User not found", status: 401 }));
    }

    req.user = user as IMember;
    next();
  } catch (error) {
    logger.info("Authentication error:", error);
    // return res.redirect("/login");
    next(new ErrorWithStatus({ message: "Invalid or expired token", status: 401 }));
  }
};

export const checkAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.redirect("/login");
    //return next(new ErrorWithStatus({ message: "Forbidden: Admin access required", status: 403 }));
    
  }
  next();
};
