import User from "../Schema/User.js";
import { generateTokens } from "./jwt.utils.js";

export const generateUsername = async (email) => {
  let username = email.split("@")[0];
  const userExists = await User.exists({ "personal_info.username": username });
  return userExists ? `${username}${Math.floor(Math.random() * 1000)}` : username;
};

// Login/signup ke baad user data + tokens format karke bhejo
// Refresh token DB mein save bhi karta hai
export const formatDataToSend = async (user) => {
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Refresh token DB mein store karo
  await User.findByIdAndUpdate(user._id, { refreshToken });

  return {
    accessToken,
    refreshToken,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};