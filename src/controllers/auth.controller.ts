import { Request, Response } from "express";
import Member from "../models/member.model.js";
import { ErrorWithStatus } from "../models/Errors.js";
import { authService } from "../services/auth.service.js";
import { LoginInput, RefreshTokenInput, RegisterInput, ChangePasswordInput } from "../schemas/user.schema.js";

const setTokenCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const authController = {
  register: async (req: Request<object, unknown, RegisterInput>, res: Response) => {
    const { membername, password, name, YOB, isAdmin } = req.body;

    const existingMember = await Member.findOne({ membername });
    if (existingMember) {
      throw new ErrorWithStatus({ message: "Member already exists", status: 409 });
    }

    const hashedPassword = await authService.encryptPassword(password);
    const member = new Member({ membername, password: hashedPassword, name, YOB, isAdmin: isAdmin || false });
    await member.save();

    const accessToken = authService.generateAccessToken(member.id);
    const refreshToken = await authService.createAndSaveRefreshToken(member.id);

    setTokenCookie(res, refreshToken);
    res.status(201).json({ message: "Member created and logged in successfully", accessToken });
  },

  login: async (req: Request<object, unknown, LoginInput>, res: Response) => {
    const { membername, password } = req.body;
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const member = await Member.findOne({ membername }).lean();
    if (!member) {
      throw new ErrorWithStatus({ message: "Invalid credentials", status: 401 });
    }

    const isPasswordCorrect = await authService.comparePassword(password, member.password);
    if (!isPasswordCorrect) {
      throw new ErrorWithStatus({ message: "Invalid credentials", status: 401 });
    }

    const accessToken = authService.generateAccessToken(member._id.toString());
    const refreshToken = await authService.createAndSaveRefreshToken(member._id.toString());

    setTokenCookie(res, refreshToken);
    res.status(200).json({ message: "Login successful", accessToken });
  },

  logout: async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      authService.deleteRefreshToken(refreshToken);
    }
    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json({ message: "Logout successful" });
  },

  refreshToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies as RefreshTokenInput;

    const isValid = await authService.validateDbRefreshToken(refreshToken);
    if (!isValid) {
      throw new ErrorWithStatus({ message: "Invalid or expired refresh token", status: 403 });
    }

    const member = await authService.findUserByRefreshToken(refreshToken);
    if (!member) {
      throw new ErrorWithStatus({ message: "User not found for this token", status: 403 });
    }

    const accessToken = authService.generateAccessToken(member.id);
    res.status(200).json({ accessToken });
  },
  changePassword: async (req: Request<object, unknown, ChangePasswordInput & RefreshTokenInput>, res: Response) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const { refreshToken } = req.cookies;

    if (newPassword !== confirmNewPassword) {
      throw new ErrorWithStatus({ message: "New passwords do not match", status: 400 });
    }

    const isValid = await authService.validateDbRefreshToken(refreshToken);
    if (!isValid) {
      throw new ErrorWithStatus({ message: "Invalid or expired refresh token", status: 403 });
    }

    const member = await authService.findUserByRefreshToken(refreshToken);
    if (!member) {
      throw new ErrorWithStatus({ message: "User not found for this token", status: 403 });
    }

    const isOldPasswordCorrect = await authService.comparePassword(oldPassword, member.password);
    if (!isOldPasswordCorrect) {
      throw new ErrorWithStatus({ message: "Old password is incorrect", status: 401 });
    }

    const hashedNewPassword = await authService.encryptPassword(newPassword);
    member.password = hashedNewPassword;
    await member.save();

    res.status(200).json({ message: "Password changed successfully" });
  },
};
