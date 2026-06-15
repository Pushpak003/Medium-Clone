import { Link } from "react-router-dom";
import { getDay } from "../common/Date";

const NotificationCard = ({ data, index, notificationState }) => {
  const {
    seen,
    type,
    reply,
    createdAt,
    comment,
    replied_on_comment,
    user: {
      personal_info: { fullname, username, profile_img },
    },
    blog: { _id, blog_id, title },
  } = data;

  const { notifications, setNotifications } = notificationState;

  return (
    <div className={"p-6 border-b border-grey " + (!seen ? "border-l-black border-l-2" : "")}>
      <div className="flex gap-5 mb-3">
        <img src={profile_img} alt="" className="w-14 h-14 flex-none rounded-full" />

        <div className="w-full">
          <h1 className="font-medium text-xl text-dark-grey">
            <span className="lg:inline-block hidden capitalize">{fullname}</span>
            <Link to={`/user/${username}`} className="mx-1 text-black underline">
              @{username}
            </Link>
            <span className="font-normal">
              {type === "like"
                ? "liked your blog"
                : type === "comment"
                ? "commented on your blog"
                : "replied to your comment"}
            </span>
          </h1>

          <Link
            to={`/blog/${blog_id}`}
            className="font-medium text-dark-grey hover:underline line-clamp-1"
          >
            &ldquo;{title}&rdquo;
          </Link>
        </div>
      </div>

      {/* Comment / Reply text */}
      {type !== "like" && (
        <div className="ml-14 pl-5 mt-3 text-xl text-dark-grey">
          {type === "reply" && replied_on_comment && (
            <p className="bg-grey p-3 rounded-md mb-2 line-clamp-2">
              {replied_on_comment.comment}
            </p>
          )}
          <p>{comment?.comment}</p>
        </div>
      )}

      <div className="ml-14 mt-3 text-dark-grey flex gap-8 items-center">
        <p className="text-xl">{getDay(createdAt)}</p>

        {!seen && (
          <span className="text-sm font-medium bg-black text-white px-3 py-1 rounded-full">
            New
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;