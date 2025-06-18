import bcrypt from "bcrypt";
import jwt, { JwtPayload, Algorithm, SignOptions } from "jsonwebtoken";
import { ErrorWithStatus } from "../models/Errors.js";
import { randomUUID } from "crypto";
import RefreshToken from "../models/refreshToken.model.js";
import { IMember } from "../models/member.model.js";
import logger from "../config/logger.js";
interface AuthConfig {
  jwtAlgorithm: Algorithm;
  jwtSecret: string | undefined;
  jwtRefreshSecret: string;
  saltRounds: number;
  jwtExpiration: number;
  jwtRefreshExpiration: number;
}

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

const authConfig: AuthConfig = {
  jwtAlgorithm: (process.env.JWT_ALGORITHM || "HS256") as Algorithm,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  saltRounds: parseInt(process.env.SALT || "10", 10),
  jwtExpiration: Number(process.env.JWT_EXPIRATION as unknown as number),
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION as unknown as number,
};

export const authService = {
  generateAccessToken: (userId: string): string => {
    if (!authConfig.jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }
    logger.info(authConfig);
    const options: SignOptions = {
      algorithm: authConfig.jwtAlgorithm,
      expiresIn: authConfig.jwtExpiration,
      subject: userId,
    };
    // userID thì ép buộc truy suat du lieu moi nhat ma neu them role trong vidu admin demote ma cai accesstoken nay van dung duoc server ko invalidate dc
    return jwt.sign({}, authConfig.jwtSecret, options);
  },
  validateAccessToken: (token: string): CustomJwtPayload => {
    if (!authConfig.jwtSecret) {
      throw new ErrorWithStatus({ message: "Server configuration error: JWT secret not found.", status: 500 });
    }
    try {
      return jwt.verify(token, authConfig.jwtSecret, {
        algorithms: [authConfig.jwtAlgorithm],
      }) as CustomJwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ErrorWithStatus({ message: "Access token has expired", status: 401 });
      }
      throw new ErrorWithStatus({ message: "Invalid access token", status: 401 });
    }
  },
  createAndSaveRefreshToken: async (userId: string): Promise<string> => {
    const tokenValue = randomUUID();
    const expirationInMs = authConfig.jwtRefreshExpiration * 1000;
    const expirationDate = new Date(Date.now() + expirationInMs);

    const refreshToken = new RefreshToken({
      token: tokenValue,
      user_id: userId,
      exp: expirationDate,
      iat: new Date(),
    });

    await refreshToken.save();
    return tokenValue;
  },

  validateDbRefreshToken: async (token: string): Promise<boolean> => {
    const dbToken = await RefreshToken.findOne({ token });
    if (!dbToken || dbToken.exp < new Date()) {
      return false;
    }
    return true;
  },

  deleteRefreshToken: (token: string) => {
    RefreshToken.deleteOne({ token }).exec();
  },

  encryptPassword: (password: string): Promise<string> => {
    return bcrypt.hash(password, authConfig.saltRounds);
  },

  comparePassword: (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  },
  findUserByRefreshToken: async (token: string): Promise<IMember | null> => {
    const dbToken = await RefreshToken.findOne({ token }).populate<{ user_id: IMember }>("user_id");

    return dbToken?.user_id ?? null;
  },
};
