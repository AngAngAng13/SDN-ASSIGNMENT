import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";

const authRouter = Router();

authRouter.post("/register", validateRequest(registerSchema), authController.register);
authRouter.post("/login", validateRequest(loginSchema), authController.login);
authRouter.post("/logout", authController.logout);
export default authRouter;