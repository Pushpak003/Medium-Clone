import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { setLike, setUserLiked, toggleCommentWrapper, toggleLikedByUser } from "../../redux/selectedBlogSlice";
import api from "../../utils/api";

const BlogInteraction = () => {
  const user = useSelector((store) => store.auth.user);
  const accessToken = useSelector((store) => store.auth.accessToken);
  const selectedBlog = useSelector((store) => store.selectedBlog);
  const isLikedByUser = useSelector((store) => store.selectedBlog.isLikedByUser);
  const dispatch = useDispatch();

  let { _id, title, blog_id, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } } = selectedBlog;

  useEffect(() => {
    if (accessToken) {
      api.post("/blogs/isLiked", { _id })
        .then(({ data }) => dispatch(setUserLiked(Boolean(data.result))))
        .catch(console.error);
    }
  }, []);

  const handleLike = () => {
    if (!accessToken) return toast.error("Please login to like this blog!");

    dispatch(toggleLikedByUser());
    !isLikedByUser ? total_likes++ : total_likes--;
    dispatch(setLike(total_likes));

    api.post("/blogs/like", { _id, isLikedByUser }).catch(console.error);
  };

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button onClick={handleLike} className={`w-10 h-10 rounded-full flex items-center justify-center ${isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80"}`}>
            <i className={`fi fi-${isLikedByUser ? "sr" : "rr"}-heart`}></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button onClick={() => dispatch(toggleCommentWrapper())} className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {user?.username === author_username && (
            <Link to={`/editor/${blog_id}`} className="underline">Edit</Link>
          )}
          <Link to={`https://twitter.com/intent/tweet?text=Read${title}&url=${location.href}`}>
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;