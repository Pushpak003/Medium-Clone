import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setActivity, setComments, setTotalParentCommentsLoaded } from "../../redux/selectedBlogSlice";
import api from "../../utils/api";

const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {
  const accessToken = useSelector((store) => store.auth.accessToken);
  const userInfo = useSelector((store) => store.auth);
  const selectedBlog = useSelector((store) => store.selectedBlog);
  const commentArr = selectedBlog.comments.results;
  const { _id, author: { _id: blog_author } } = selectedBlog;

  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  let currentUser = {};
  if (accessToken && userInfo.user) {
    const { profile_img, fullname, username } = userInfo.user;
    currentUser = { profile_img, fullname, username };
  }

  const handleComment = async () => {
    if (!accessToken) return toast.error("Login first to leave a comment!");
    if (!comment.trim().length) return toast.error("Write something to leave a comment..");

    try {
      const { data } = await api.post("/blogs/comment", { _id, blog_author, comment, replying_to: replyingTo });

      setComment("");
      data.commented_by = { personal_info: currentUser };

      let newCommentArr;
      if (replyingTo) {
        newCommentArr = [...commentArr];
        newCommentArr[index] = { ...newCommentArr[index], children: [...newCommentArr[index].children, data._id], isReplyLoaded: true };
        data.childrenLevel = newCommentArr[index].childrenLevel + 1;
        data.parentIndex = index;
        newCommentArr.splice(index + 1, 0, data);
        setReplying(false);
      } else {
        data.childrenLevel = 0;
        newCommentArr = [data, ...commentArr];
      }

      const parentCommentIncrementVal = replyingTo ? 0 : 1;
      dispatch(setComments(newCommentArr));
      dispatch(setActivity(parentCommentIncrementVal));
      dispatch(setTotalParentCommentsLoaded(parentCommentIncrementVal));
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };

  return (
    <>
      <Toaster />
      <textarea value={comment} onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..." className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto" />
      <button onClick={handleComment} className="btn-dark mt-5 px-10">{action}</button>
    </>
  );
};

export default CommentField;