import { verifyAccessToken } from "../utils/jwt.utils.js";
import { AppError } from "./error.middleware.js";

// ── Protect Route — Login Required ───────────────────────────────────────────
// Usage: router.post("/create", protect, createBlogController)
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Access denied. No token provided.", 401));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    // req.user mein user id daal do — controllers mein kaam aayega
    req.user = decoded.id;
    next();
  } catch (err) {
    // verifyAccessToken throw karega agar token invalid/expired ho
    next(err);
  }
};
// Usage: Public routes jahan logged-in user ko extra data milta hai
// e.g. blog read — guest bhi padh sakta hai, loggedin user ko "liked" status bhi milega
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded.id;
    next();
  } catch {
    // Token invalid ho to bhi chalega — sirf null set karo
    req.user = null;
    next();
  }
};