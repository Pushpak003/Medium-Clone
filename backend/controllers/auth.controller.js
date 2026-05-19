import bcrypt from "bcrypt";
import User from "../Schema/User.js";
import { formatDataToSend, generateUsername } from "../utils/auth.utils.js";

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// ================= SIGNUP =================
export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be at least 3 letters or more" });
  }

  if (!email.length) {
    return res.status(403).json({ error: "Enter Email" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is invalid!" });
  }

  if (password.length < 6) {
    return res
      .status(403)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ "personal_info.email": email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = await generateUsername(email);

    const newUser = new User({
      personal_info: { fullname, email, password: hashedPassword, username },
    });

    const user = await newUser.save();
    return res.status(200).json(formatDataToSend(user));
  } catch (error) {
    return res
      .status(500)
      .json({ error: "User creation failed", message: error.message });
  }
};

// ================= SIGNIN =================
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      "personal_info.email": email,
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      existingUser.personal_info.password
    );

    if (!isMatch) {
      return res.status(403).json({ error: "Incorrect password!" });
    }

    return res.status(200).json(formatDataToSend(existingUser));
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};