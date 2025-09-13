import express from "express";

import { userSchema, subscriptionSchema } from "../schemas/authSchemas.js";

import validateBody from "../helpers/validateBody.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../config/multerConfig.js";

import {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  uploadAvatar,
} from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(userSchema), register);
authRouter.post("/login", validateBody(userSchema), login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, getCurrentUser);
authRouter.patch(
  "/subscription",
  authMiddleware,
  validateBody(subscriptionSchema),
  updateSubscription
);

authRouter.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);

export default authRouter;
