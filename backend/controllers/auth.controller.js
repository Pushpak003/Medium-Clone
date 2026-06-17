import bcrypt from "bcrypt";
import User from "../Schema/User.js";
import { formatDataToSend, generateUsername } from "../utils/auth.utils.js";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwt.utils.js";
import { AppError } from "../middleware/error.middleware.js";
import { isFirebaseAdminReady, verifyGoogleIdToken } from "../config/firebaseAdmin.js";

// ── Signup ────────────────────────────────────────────────────────────────────
export const signup = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    // Note: yahan validation nahi karenge — Zod schema middleware mein karega
    // Abhi existing logic rakho, Zod schemas next step mein banenge

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = await generateUsername(email);

    const newUser = new User({
      personal_info: { fullname, email, password: hashedPassword, username },
    });

    const user = await newUser.save();
    const data = await formatDataToSend(user);

    return res.status(201).json({ success: true, ...data });
  } catch (err) {
    next(err); // Global error handler pakad lega — duplicate email bhi
  }
};

// ── Signin ────────────────────────────────────────────────────────────────────
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ "personal_info.email": email });

    if (!user) {
      return next(new AppError("Invalid email or password", 401));
      // Note: "User not found" mat bolna — attacker ko email existence pata chal jaata hai
    }

    if (user.google_auth) {
      return next(new AppError("This account uses Google sign-in. Please use Google to login.", 400));
    }

    const isMatch = await bcrypt.compare(password, user.personal_info.password);

    if (!isMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    const data = await formatDataToSend(user);
    return res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

// ── Google Sign-in ──────────────────────────────────────────────────────────
// Frontend Firebase se Google popup login karta hai, fir ID token yahan bhejta hai.
// Hum us token ko Firebase Admin se verify karte hain — fake/tampered token reject ho jata hai.
export const googleAuth = async (req, res, next) => {
  try {
    if (!isFirebaseAdminReady()) {
      return next(new AppError("Google sign-in abhi server par configure nahi hai", 503));
    }

    const { id_token } = req.body;

    let decoded;
    try {
      decoded = await verifyGoogleIdToken(id_token);
    } catch (err) {
      return next(new AppError("Invalid ya expired Google sign-in token", 401));
    }

    const { email, name, picture } = decoded;

    if (!email) {
      return next(new AppError("Google account mein email nahi mila", 400));
    }

    let user = await User.findOne({ "personal_info.email": email });

    if (user) {
      // Email pehle se password ke saath registered hai — accounts mix mat karo
      if (!user.google_auth) {
        return next(
          new AppError(
            "Ye email already password ke saath registered hai. Email/password se login karein.",
            400
          )
        );
      }
    } else {
      const username = await generateUsername(email);
      user = await new User({
        personal_info: {
          fullname: name || email.split("@")[0],
          email,
          username,
          ...(picture && { profile_img: picture }),
        },
        google_auth: true,
      }).save();
    }

    const data = await formatDataToSend(user);
    return res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

// ── Refresh Token ─────────────────────────────────────────────────────────────
// Frontend access token expire hone par yeh call karega
// Naya access token milega bina dobara login kiye
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError("Refresh token required", 400));
    }

    // Token valid hai?
    const decoded = verifyRefreshToken(refreshToken);

    // DB mein stored token se match karo — token rotation ke liye
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError("Invalid refresh token. Please login again.", 401));
    }

    // Naya access token do
    const accessToken = generateAccessToken(user._id);

    return res.status(200).json({ success: true, accessToken });
  } catch (err) {
    next(err);
  }
};

// ── Logout ────────────────────────────────────────────────────────────────────
// DB se refresh token delete karo — dono devices se logout
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      );
    }

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};