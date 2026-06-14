import User from "../Schema/User.js";
import bcrypt from "bcrypt";
import { AppError } from "../middleware/error.middleware.js";

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // Validation Zod schema handle karega settings.routes mein

    const user = await User.findById(req.user);
    if (!user) return next(new AppError("User not found", 404));

    if (user.google_auth) {
      return next(new AppError("Google account ka password change nahi ho sakta", 403));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.personal_info.password);
    if (!isMatch) {
      return next(new AppError("Current password incorrect hai", 403));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user, { "personal_info.password": hashedPassword });

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateProfileImg = async (req, res, next) => {
  try {
    const { url } = req.body;
    // Validation Zod schema handle karega

    const user = await User.findByIdAndUpdate(
      req.user,
      { "personal_info.profile_img": url },
      { new: true }
    ).select("personal_info.profile_img");

    if (!user) return next(new AppError("User not found", 404));

    return res.status(200).json({ success: true, profile_img: user.personal_info.profile_img });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, bio, social_links } = req.body;
    // Validation Zod schema handle karega

    await User.findByIdAndUpdate(
      req.user,
      {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links,
      },
      { runValidators: true }
    );

    return res.status(200).json({ success: true, username });
  } catch (err) {
    next(err); // Duplicate username — error.middleware handle karega (code 11000)
  }
};