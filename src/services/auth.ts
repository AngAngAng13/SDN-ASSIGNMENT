import bcrypt from 'bcrypt';
import jwt, { JwtPayload, Algorithm, SignOptions } from 'jsonwebtoken';
import { ErrorWithStatus } from '../models/Errors.js';

interface AuthConfig {
  jwtAlgorithm: Algorithm;
  jwtSecret: string | undefined;
  jwtRefreshSecret: string;
  saltRounds: number;
  jwtExpiration: number;
  jwtRefreshExpiration: number ;
}

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

const authConfig: AuthConfig = {
  jwtAlgorithm: (process.env.JWT_ALGORITHM || 'HS256') as Algorithm,
  jwtSecret: process.env.JWT_SECRET ,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  saltRounds: parseInt(process.env.SALT || '10', 10),
  jwtExpiration: process.env.JWT_EXPIRATION as unknown as number || 3600,
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION as unknown as number || 604800,
  
};

export const authService = {

  generateAccessToken: (userId: string): string => {
    if (!authConfig.jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    const options: SignOptions = {
        algorithm: authConfig.jwtAlgorithm,
        expiresIn: authConfig.jwtExpiration,
        
    };
    return jwt.sign({ userId }, authConfig.jwtSecret, options);
  },

  generateRefreshToken: (userId: string): string => {
    if (!authConfig.jwtRefreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    const options: SignOptions = {
        algorithm: authConfig.jwtAlgorithm,
        expiresIn: authConfig.jwtRefreshExpiration ,
        
    };
    return jwt.sign({ userId }, authConfig.jwtRefreshSecret, options);
  },

  validateAccessToken: (token: string): CustomJwtPayload => {
    if (!authConfig.jwtSecret) {
      throw new ErrorWithStatus({ message: 'Server configuration error: JWT secret not found.', status: 500 });
    }
    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret, {
        algorithms: [authConfig.jwtAlgorithm],
      });
      return decoded as CustomJwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ErrorWithStatus({ message: 'Access token has expired', status: 401 });
      }
      throw new ErrorWithStatus({ message: 'Invalid access token', status: 401 });
    }
  },

  validateRefreshToken: (token: string): CustomJwtPayload => {
    if (!authConfig.jwtRefreshSecret) {
      throw new ErrorWithStatus({ message: 'Server configuration error: JWT refresh secret not found.', status: 500 });
    }
    try {
      const decoded = jwt.verify(token, authConfig.jwtRefreshSecret, {
        algorithms: [authConfig.jwtAlgorithm],
      });
      return decoded as CustomJwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ErrorWithStatus({ message: 'Refresh token has expired', status: 401 });
      }
      throw new ErrorWithStatus({ message: 'Invalid refresh token', status: 401 });
    }
  },

  encryptPassword: (password: string): Promise<string> => {
    return bcrypt.hash(password, authConfig.saltRounds);
  },

  comparePassword: (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  },
};