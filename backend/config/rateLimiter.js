import rateLimit from "express-rate-limit";

// Auth routes — login, signup, refresh token
// Strict limit — brute force attacks rokne ke liye
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    error: "Too many attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Sirf failed requests count hongi
});

// General API — saare routes pe default
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    error: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload routes — image/file upload pe alag limit
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: {
    success: false,
    error: "Upload limit reached. Try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});