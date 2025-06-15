import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
const authRouter = Router();
authRouter.get("/login", (req, res) => {
  res.render("login");
});
authRouter.post("/register", userController.register);
export default authRouter;
