import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import authRouter from "./routes/auth.routes.js";
import connectdb from "./config/db.js";
import blogRouter from "./routes/blog.routes.js";
import userRouter from "./routes/user.routes.js";
import blogInteractionRouter from "./routes/blogInteractions.routes.js";
import settingRouter from "./routes/settings.routes.js";
import blogEditorRouter from "./routes/blogEditor.routes.js";

const server = express();
const PORT = process.env.PORT || 3000;

// ── Security Middleware ──────────────────────────────────────────────────────
server.use(helmet());

server.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Rate limiting — auth routes pe strict limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: "Too many requests, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

server.use(generalLimiter);

// ── Body Parsing ─────────────────────────────────────────────────────────────
server.use(express.json({ limit: "10mb" }));
server.use(express.urlencoded({ limit: "10mb", extended: true }));

// NoSQL Injection protection
server.use(mongoSanitize());

// ── Health Check ─────────────────────────────────────────────────────────────
server.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Routes ───────────────────────────────────────────────────────────────────
server.use("/auth", authLimiter, authRouter);
server.use("/blog", blogRouter);
server.use("/blog", blogInteractionRouter);
server.use("/user", userRouter);
server.use("/settings", settingRouter);
server.use("/blog-editor", blogEditorRouter);

// ── Cloudinary ───────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Global Error Handler ─────────────────────────────────────────────────────
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
server.listen(PORT, async () => {
  await connection();
  console.log(`Server running on port ${PORT}`);
});