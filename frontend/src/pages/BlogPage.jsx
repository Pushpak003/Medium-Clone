import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/Page-animation";
import Loader from "../components/ui/Loader";
import { getDay } from "../common/Date";
import BlogInteraction from "../components/Blogs/BlogInteraction";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedBlog, setSelectedBlog } from "../redux/selectedBlogSlice";
import { resetSimilarBlog, setSimilarBlog } from "../redux/similarBlogSlice";
import BlogPostCard from "../components/Blogs/BlogPostCard";
import BlogContent from "../components/Blogs/BlogContent";
import CommentsContainer, { fetchComments } from "../components/Comments/CommentsContainer ";
import api from "../utils/api";

const BlogPage = () => {
  const { id: blog_id } = useParams();
  const selectedBlog = useSelector((store) => store.selectedBlog);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { title, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = selectedBlog;

  const fetchBlog = async () => {
    try {
      const { data: { blog } } = await api.post("/blogs", { blog_id });
      blog.comments = await fetchComments({ dispatch, blog_id: blog._id });

      api.post("/blogs/search-blogs", { tag: blog.tags[0], limit: 6, eliminate_blog: blog_id })
        .then(({ data }) => dispatch(setSimilarBlog(data.blogs)))
        .catch(console.error);

      dispatch(setSelectedBlog(blog));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(resetSelectedBlog());
    dispatch(resetSimilarBlog());
    fetchBlog();
    window.scrollTo(0, 0);
  }, [blog_id]);

  const similarBlog = useSelector((store) => store.similarBlog.blogs);

  return (
    <AnimationWrapper>
      {loading ? <Loader /> : (
        <>
          <CommentsContainer />
          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <img src={banner} alt="" className="aspect-video rounded-md" />

            <div className="mt-12">
              <h2>{title}</h2>
              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img src={profile_img} alt="" className="w-12 h-12 rounded-full" />
                  <p className="capitalize">
                    {fullname}<br />
                    @<Link className="underline font-semibold" to={`/user/${author_username}`}>{author_username}</Link>
                  </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">Published on {getDay(publishedAt)}</p>
              </div>
            </div>

            <BlogInteraction />

            <div className="my-12 font-gelasio blog-page-content">
              {content[0].blocks.map((block, i) => (
                <div key={i} className="my-4 md:my-8">
                  <BlogContent block={block} />
                </div>
              ))}
            </div>

            <BlogInteraction />

            {similarBlog?.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>
                {similarBlog.map((blog, i) => (
                  <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.8 }}>
                    <BlogPostCard content={blog} author={blog.author.personal_info} />
                  </AnimationWrapper>
                ))}
              </>
            ) : ""}
          </div>
        </>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;