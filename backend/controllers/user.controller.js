import User from "../Schema/User.js";
import Blog from "../Schema/Blog.js";
import { AppError } from "../middleware/error.middleware.js";

export const searchUser = async (req, res, next) => {
  try {
    const { query } = req.body;

    const users = await User.find({ "personal_info.username": new RegExp(query, "i") })
      .limit(50)
      .select("personal_info.fullname personal_info.username personal_info.profile_img -_id");

    return res.status(200).json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

export const getProfileOfUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ "personal_info.username": username })
      .select("-personal_info.password -google_auth -refreshToken -updatedAt -blogs");

    if (!user) return next(new AppError("User not found", 404));

    return res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const writtenBlogsOfUser = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { page = 1, draft, query = "", deletedDocCount = 0 } = req.body;
    const maxLimit = 4;
    const skipDocs = (page - 1) * maxLimit - deletedDocCount;

    const blogs = await Blog.find({ author: user_id, draft, title: new RegExp(query, "i") })
      .skip(Math.max(skipDocs, 0))
      .limit(maxLimit)
      .sort({ publishedAt: -1 })
      .select("title banner publishedAt blog_id activity des draft -_id");

    return res.status(200).json({ success: true, blogs });
  } catch (err) {
    next(err);
  }
};

export const writtenBlogsOfUserCount = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { draft, query = "" } = req.body;

    const count = await Blog.countDocuments({
      author: user_id,
      draft,
      title: new RegExp(query, "i"),
    });

    return res.status(200).json({ success: true, totalDocs: count });
  } catch (err) {
    next(err);
  }
};