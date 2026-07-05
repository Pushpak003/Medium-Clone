import Notification from "../Schema/Notification.js";

// GET /api/v1/notifications?page=1&filter=all
export const getNotifications = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { page = 1, filter = "all" } = req.query;
    const maxLimit = 10;

    const findQuery = { notification_for: user_id, user: { $ne: user_id } };

    if (filter !== "all") {
      findQuery.type = filter;
    }

    const notifications = await Notification.find(findQuery)
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .populate("blog", "title blog_id")
      .populate("user", "personal_info.fullname personal_info.username personal_info.profile_img")
      .populate("comment", "comment")
      .populate("replied_on_comment", "comment")
      .populate("reply", "comment")
      .sort({ createdAt: -1 })
      .select("createdAt type seen blog user comment replied_on_comment reply");

    return res.status(200).json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/notifications/count   body: { filter }
export const getNotificationsCount = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { filter = "all" } = req.body;

    const findQuery = { notification_for: user_id, user: { $ne: user_id } };

    if (filter !== "all") {
      findQuery.type = filter;
    }

    const totalDocs = await Notification.countDocuments(findQuery);

    return res.status(200).json({ success: true, totalDocs });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/notifications/new  -> used for the navbar bell "unseen" dot
export const hasNewNotifications = async (req, res, next) => {
  try {
    const user_id = req.user;

    const result = await Notification.exists({
      notification_for: user_id,
      user: { $ne: user_id },
      seen: false,
    });

    return res.status(200).json({ success: true, new_notification_available: Boolean(result) });
  } catch (err) {
    next(err);
  }
};