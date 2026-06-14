import Blog from "../Schema/Blog.js";
import Notification from "../Schema/Notification.js";
import Comment from "../Schema/Comment.js";
import User from "../Schema/User.js";
import { AppError } from "../middleware/error.middleware.js";

export const likeBlog = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { _id, isLikedByUser } = req.body;
    const incrementVal = !isLikedByUser ? 1 : -1;

    const blog = await Blog.findOneAndUpdate(
      { _id },
      { $inc: { "activity.total_likes": incrementVal } }
    );

    if (!blog) return next(new AppError("Blog not found", 404));

    if (!isLikedByUser) {
      await new Notification({
        type: "like",
        blog: _id,
        notification_for: blog.author,
        user: user_id,
      }).save();
    } else {
      await Notification.findOneAndDelete({ user: user_id, type: "like", blog: _id });
    }

    return res.status(200).json({ success: true, liked_by_user: !isLikedByUser });
  } catch (err) {
    next(err);
  }
};

export const isLikedByUser = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { _id } = req.body;

    const result = await Notification.exists({ user: user_id, type: "like", blog: _id });
    return res.status(200).json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { _id, comment, replying_to, blog_author } = req.body;

    if (!comment || !comment.trim().length) {
      return next(new AppError("Comment cannot be empty", 400));
    }

    const commentObj = {
      blog_id: _id,
      blog_author,
      comment,
      commented_by: user_id,
      ...(replying_to && { parent: replying_to, isReply: true }),
    };

    const commentFile = await new Comment(commentObj).save();

    await Blog.findOneAndUpdate(
      { _id },
      {
        $push: { comments: commentFile._id },
        $inc: {
          "activity.total_comments": 1,
          "activity.total_parent_comments": replying_to ? 0 : 1,
        },
      }
    );

    const notificationObj = {
      type: replying_to ? "reply" : "comment",
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: commentFile._id,
    };

    if (replying_to) {
      notificationObj.replied_on_comment = replying_to;
      const replyingToCommentDoc = await Comment.findOneAndUpdate(
        { _id: replying_to },
        { $push: { children: commentFile._id } }
      );
      notificationObj.notification_for = replyingToCommentDoc.commented_by;
    }

    await new Notification(notificationObj).save();

    return res.status(200).json({
      success: true,
      comment: commentFile.comment,
      commentedAt: commentFile.commentedAt,
      _id: commentFile._id,
      user_id,
      children: commentFile.children,
    });
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { blog_id, skip } = req.body;
    const maxLimit = 5;

    const comments = await Comment.find({ blog_id, isReply: false })
      .populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img")
      .skip(skip || 0)
      .limit(maxLimit)
      .sort({ commentedAt: -1 });

    return res.status(200).json({ success: true, comments });
  } catch (err) {
    next(err);
  }
};

export const getReplies = async (req, res, next) => {
  try {
    const { _id, skip } = req.body;
    const maxLimit = 5;

    const doc = await Comment.findOne({ _id })
      .populate({
        path: "children",
        options: { limit: maxLimit, skip: skip || 0, sort: { commentedAt: -1 } },
        populate: {
          path: "commented_by",
          select: "personal_info.profile_img personal_info.fullname personal_info.username",
        },
        select: "-blog_id -updatedAt",
      })
      .select("children");

    if (!doc) return next(new AppError("Comment not found", 404));

    return res.status(200).json({ success: true, replies: doc.children });
  } catch (err) {
    next(err);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { blog_id } = req.body;

    const blog = await Blog.findOneAndDelete({ blog_id });
    if (!blog) return next(new AppError("Blog not found", 404));

    // Parallel delete — faster
    await Promise.all([
      Notification.deleteMany({ blog: blog._id }),
      Comment.deleteMany({ blog_id: blog._id }),
      User.findOneAndUpdate(
        { _id: user_id },
        { $pull: { blogs: blog._id }, $inc: { "account_info.total_posts": -1 } }
      ),
    ]);

    return res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    next(err);
  }
};