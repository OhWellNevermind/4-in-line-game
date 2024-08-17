import { Router } from "express";

import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import authController from "../controllers/auth.controller";
import { validateBody } from "../middlewars/validateBody";
import { registerSchema } from "../validation/registerSchema";
import { loginSchema } from "../validation/loginSchema";
import { isAuthenticated } from "../middlewars/isAuthentificated";

const authRouter = Router();

authRouter.get("/google", asyncErrorHandler(authController.googleOAuth));

authRouter.post(
  "/register",
  validateBody(registerSchema),
  asyncErrorHandler(authController.register)
);

authRouter.post(
  "/login",
  validateBody(loginSchema),
  asyncErrorHandler(authController.login)
);

authRouter.post("/refresh", asyncErrorHandler(authController.refreshToken));

authRouter.get(
  "/get-me",
  isAuthenticated,
  asyncErrorHandler(authController.getMe)
);

export default authRouter;
