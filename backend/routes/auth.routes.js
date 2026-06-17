import express from "express";
import { signin, signup, refreshToken, logout, googleAuth } from "../controllers/auth.controller.js";
import { authLimiter } from "../config/rateLimiter.js";
import { validate } from "../middleware/validate.middleware.js";
import { signupSchema, signinSchema, refreshTokenSchema } from "../schemas/auth.schema.js";

const authRouter = express.Router();

authRouter.post("/signup", authLimiter, validate(signupSchema), signup);
authRouter.post("/signin", authLimiter, validate(signinSchema), signin);
authRouter.post("/google-auth", googleAuth);
authRouter.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
authRouter.post("/logout", logout);


export default authRouter;