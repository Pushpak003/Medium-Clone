import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import api from "../utils/api";

const NotificationCommentField = ({ _id, blog_author, index, replyingTo, setReplying, notification_id, notificationData }) => {
  const [reply, setReply] = useState("");
  const { notifications, setNotifications } = notificationData;

  const sendReply = async () => {
    if (!reply.trim().length) {
      return toast.error("Write something to reply");
    }

    try {
      await api.post("/blogs/comment", {
        _id,
        comment: reply,
        blog_author,
        replying_to: replyingTo,
        notification_id,
      });

      // Mark this notification as replied in local state
      const updatedNotifications = notifications.results.map((n, i) => {
        if (i === index) return { ...n, reply: { comment: reply } };
        return n;
      });

      setNotifications({ ...notifications, results: updatedNotifications });
      setReplying(false);
      toast.success("Reply posted!");
    } catch ({ response }) {
      toast.error(response?.data?.error || "Failed to post reply");
    }
  };

  return (
    <>
      <Toaster />
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Leave a reply..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      />
      <button className="btn-dark mt-2 px-10" onClick={sendReply}>
        Reply
      </button>
    </>
  );
};

export default NotificationCommentField;