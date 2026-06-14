import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import {
  generalLimiter,
  authLimiter,
  uploadLimiter,
} from "./config/rateLimiter.js";
import authRouter from "./routes/auth.routes.js";
import blogRouter from "./routes/blog.routes.js";
import blogInteractionRouter from "./routes/blogInteractions.routes.js";
import userRouter from "./routes/user.routes.js";
import settingRouter from "./routes/settings.routes.js";
import blogEditorRouter from "./routes/blogEditor.routes.js";

import { errorHandler, notFound } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

//  Rate Limiting
app.use(generalLimiter);

//  Body Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//  NoSQL Injection Protection
app.use(mongoSanitize());

//  Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

//  Routes
app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/blog", blogInteractionRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/settings", settingRouter);
app.use("/api/v1/blog-editor", uploadLimiter, blogEditorRouter);

//  404 Handler
app.use(notFound);

//  Global Error Handler 
app.use(errorHandler);

export default app;
