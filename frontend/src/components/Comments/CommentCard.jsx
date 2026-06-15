import { useState } from "react";
import { getFullDayWithTime } from "../../common/Date";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import CommentField from "./CommentField";
import { setCommentsResults, setIsReplyLoaded } from "../../redux/selectedBlogSlice";
import api from "../../utils/api";

const CommentCard = ({ index, leftVal, commentData }) => {
  const accessToken = useSelector((store) => store.auth.accessToken);
  const dispatch = useDispatch();
  const isReplyLoaded = useSelector((store) => store.selectedBlog.comments.results[index]?.isReplyLoaded);
  const commentArr = useSelector((store) => store.selectedBlog.comments.results);

  const { _id, comment, commented_by: { personal_info: { profile_img, fullname, username } }, commentedAt, children } = commentData;
  const [isReplying, setReplying] = useState(false);

  const removeCommentsCards = (startingPoint, updatedArr) => {
    let arr = [...updatedArr];
    while (arr[startingPoint] && arr[startingPoint].childrenLevel > commentData.childrenLevel) {
      arr.splice(startingPoint, 1);
    }
    dispatch(setCommentsResults(arr));
  };

  const hideReplies = () => {
    const updated = commentArr.map((c, i) => i === index ? { ...c, isReplyLoaded: false } : c);
    dispatch(setCommentsResults(updated));
    removeCommentsCards(index + 1, updated);
  };

  const loadReplies = async ({ skip = 0 }) => {
    if (!children.length) return;
    hideReplies();
    try {
      const { data: { replies } } = await api.post("/blogs/reply", { _id, skip });
      dispatch(setIsReplyLoaded({ index, isLoaded: true }));
      const updated = [...commentArr];
      replies.forEach((reply, i) => {
        reply.childrenLevel = commentData.childrenLevel + 1;
        updated.splice(index + 1 + i + skip, 0, reply);
      });
      dispatch(setCommentsResults(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = () => {
    if (!accessToken) return toast.error("Login first to leave a reply!");
    setReplying((prev) => !prev);
  };

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          {profile_img && <img src={profile_img} className="w-6 h-6 rounded-full" alt="" />}
          <p className="line-clamp-1 font-medium capitalize">{fullname}</p>
          <p className="min-w-fit text-dark-grey">{getFullDayWithTime(commentedAt)}</p>
        </div>

        <p className="font-gelasio text-xl ml-3">{comment}</p>

        <div className="flex gap-5 items-center mt-5">
          {isReplyLoaded ? (
            <button onClick={hideReplies} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2">
              <i className="fi fi-rs-comment-dots"></i> Hide Reply
            </button>
          ) : (
            <button onClick={loadReplies} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2">
              <i className="fi fi-rs-comment-dots"></i> {children.length} Replies
            </button>
          )}
          <i className={`fi fi-rr-undo -mr-2 ${isReplying ? "-rotate-90 transition duration-500" : ""}`}></i>
          <button onClick={handleReply} className="underline">Reply</button>
        </div>

        {isReplying && (
          <div className="mt-8">
            <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;