import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { ErrorWithStatus } from '../models/Errors.js';
import Member, { IMember } from '../models/member.model.js';
import logger from '../config/logger.js';

export interface AuthenticatedRequest extends Request {
    user?: IMember;
}

export const checkAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ErrorWithStatus({ message: 'Authentication required: No token provided', status: 401 }));
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedPayload = authService.validateAccessToken(token);
        const user = await Member.findById(decodedPayload.sub).lean();

        if (!user) {
            return next(new ErrorWithStatus({ message: 'Authentication failed: User not found', status: 401 }));
        }

        req.user = user as IMember;
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        next(new ErrorWithStatus({ message: 'Invalid or expired token', status: 401 }));
    }
};

export const checkAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.isAdmin) {
        return next(new ErrorWithStatus({ message: 'Forbidden: Admin access required', status: 403 }));
    }
    next();
};