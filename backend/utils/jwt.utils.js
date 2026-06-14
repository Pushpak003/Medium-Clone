import jwt from "jsonwebtoken";
import { AppError } from "../middleware/error.middleware.js";

// ── Generate Tokens ───────────────────────────────────────────────────────────

// Access Token — short lived, har request mein bheja jata hai
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
};

// Refresh Token — long lived, sirf naya access token lene ke liye
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

// Dono ek saath generate karo — login/signup mein use hoga
export const generateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken };
};

// ── Verify Tokens ─────────────────────────────────────────────────────────────

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    // TokenExpiredError aur JsonWebTokenError — error.middleware pakad lega
    throw new AppError(err.message, 401);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token. Please login again.", 401);
  }
};