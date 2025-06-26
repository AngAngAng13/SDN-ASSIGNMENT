import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginSchema, registerSchema ,changePasswordSchema} from "../schemas/user.schema.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { refreshTokenSchema } from "../schemas/user.schema.js";
const authRouter = Router();


authRouter.post("/register", validateRequest(registerSchema), authController.register);
authRouter.post("/login", validateRequest(loginSchema), authController.login);
authRouter.post('/refresh', validateRequest(refreshTokenSchema), authController.refreshToken);

authRouter.delete("/logout", authController.logout);
authRouter.post(
  "/change-password",
  validateRequest(changePasswordSchema), 
  checkAuth,                             
  authController.changePassword          
);
export default authRouter;