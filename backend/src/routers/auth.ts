import { Router } from "express";

import authController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.get("/google", authController.googleOAuth);

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

export default authRouter;
