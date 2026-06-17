import { nanoid } from "nanoid";
import Blog from "../Schema/Blog.js";
import User from "../Schema/User.js";
import { AppError } from "../middleware/error.middleware.js";

export const createBlog = async (req, res, next) => {
  try {
    const authorId = req.user;
    let { title, des, banner, tags, content, draft, id } = req.body;
    // Validation Zod schema handle karega blog.routes mein

    tags = tags.map((tag) => tag.toLowerCase());

    const blog_id =
      id ||
      title.replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, "-").trim() + nanoid();

    if (id) {
      await Blog.findOneAndUpdate(
        { blog_id },
        { title, des, banner, content, tags, draft: draft ?? false }
      );
      return res.status(200).json({ success: true, id: blog_id });
    }

    const blog = await new Blog({
      title, des, banner, content, tags,
      author: authorId,
      blog_id,
      draft: Boolean(draft),
    }).save();

    const incrementVal = draft ? 0 : 1;
    await User.findByIdAndUpdate(authorId, {
      $inc: { "account_info.total_posts": incrementVal },
      $push: { blogs: blog._id },
    });

    return res.status(201).json({ success: true, id: blog.blog_id });
  } catch (err) {
    next(err);
  }
};

export const getLatestBlogs = async (req, res, next) => {
  try {
    const { page = 1 } = req.body;
    const maxLimit = 5;

    const blogs = await Blog.find({ draft: false })
      .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
      .sort({ publishedAt: -1 })
      .select("blog_id title des banner activity tags publishedAt -_id")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);

    return res.status(200).json({ success: true, blogs });
  } catch (err) {
    next(err);
  }
};

export const getTrendingBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ draft: false })
      .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
      .sort({ "activity.total_read": -1, "activity.total_likes": -1, publishedAt: -1 })
      .select("blog_id title publishedAt -_id")
      .limit(5);

    return res.status(200).json({ success: true, blogs });
  } catch (err) {
    next(err);
  }
};

export const searchBlogs = async (req, res, next) => {
  try {
    const { tag, query, page = 1, author, limit, eliminate_blog } = req.body;
    const maxLimit = limit || 2;

    let findQuery;
    if (tag) {
      findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } };
    } else if (query) {
      findQuery = { title: new RegExp(query, "i"), draft: false };
    } else if (author) {
      findQuery = { author, draft: false };
    } else {
      return next(new AppError("tag, query, ya author zaroori hai", 400));
    }

    const blogs = await Blog.find(findQuery)
      .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
      .sort({ publishedAt: -1 })
      .select("blog_id title des banner activity tags publishedAt -_id")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);

    return res.status(200).json({ success: true, blogs });
  } catch (err) {
    next(err);
  }
};

export const getLatestBlogsCount = async (req, res, next) => {
  try {
    const count = await Blog.countDocuments({ draft: false });
    return res.status(200).json({ success: true, totalDocs: count });
  } catch (err) {
    next(err);
  }
};

export const searchBlogsCount = async (req, res, next) => {
  try {
    const { tag, query, author } = req.body;

    let findQuery;
    if (tag) {
      findQuery = { tags: tag, draft: false };
    } else if (query) {
      findQuery = { draft: false, title: new RegExp(query, "i") };
    } else if (author) {
      findQuery = { author, draft: false };
    } else {
      return next(new AppError("tag, query, ya author zaroori hai", 400));
    }

    const count = await Blog.countDocuments(findQuery);
    return res.status(200).json({ success: true, totalDocs: count });
  } catch (err) {
    next(err);
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const { blog_id, draft, mode } = req.body;
    const incrementVal = mode !== "edit" ? 1 : 0;

    const blog = await Blog.findOneAndUpdate(
      { blog_id },
      { $inc: { "activity.total_reads": incrementVal } }
    )
      .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname")
      .select("title des content banner activity publishedAt blog_id tags draft");

    if (!blog) return next(new AppError("Blog not found", 404));

    if (blog.draft && !draft) {
      return next(new AppError("This blog is a draft and cannot be accessed", 403));
    }

    // Author ke total reads bhi update karo — fire and forget (non-blocking)
    User.findOneAndUpdate(
      { "personal_info.username": blog.author.personal_info.username },
      { $inc: { "account_info.total_reads": incrementVal } }
    ).catch(() => {});

    return res.status(200).json({ success: true, blog });
  } catch (err) {
    next(err);
  }
};