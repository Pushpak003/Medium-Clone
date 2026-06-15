import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDraftedBlogs, setPublishedBlogs } from "../redux/blogManagementSlice";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/Home Page/InPageNavigation";
import Loader from "../components/ui/Loader";
import NoDataMessage from "../components/ui/NoData";
import AnimationWrapper from "../common/Page-animation";
import { ManageDraftBlogPost, ManagePublishedBlogCard } from "../components/Blogs/ManagePublishedBlogCard";
import { filterPaginationData } from "../common/FilteredPaginationData";
import api from "../utils/api";

const ManageBlogs = () => {
  const blogs = useSelector((store) => store.blogManagement.publishedBlogs);
  const drafts = useSelector((store) => store.blogManagement.draftedBlogs);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const getBlogs = async ({ page, draft, deletedDocCount = 0 }) => {
    try {
      const { data } = await api.post("/user/written-blogs", {
        page,
        draft,
        query,
        deletedDocCount,
      });

      const formattedData = await filterPaginationData({
        create_new_arr: page === 1,   // ← bug fix: pehle page pe naya array
        state: draft ? drafts : blogs,
        data: data.blogs,
        page,
        countRoute: "/user/written-blogs-count",
        data_to_send: { draft, query },
      });

      if (draft) {
        dispatch(setDraftedBlogs(formattedData));
      } else {
        dispatch(setPublishedBlogs(formattedData));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (blogs == null) getBlogs({ page: 1, draft: false });
    if (drafts == null) getBlogs({ page: 1, draft: true });
  }, [blogs, drafts, query]);

  const handleSearch = (e) => {
    const search = e.target.value;
    setQuery(search);
    if (e.keyCode === 13) {
      dispatch(setDraftedBlogs(null));
      dispatch(setPublishedBlogs(null));
    }
  };

  const handleChange = (e) => {
    if (!e.target.value.length) {
      setQuery("");
      dispatch(setDraftedBlogs(null));
      dispatch(setPublishedBlogs(null));
    }
  };

  return (
    <>
      <h1 className="max-md:hidden">Manage Blogs</h1>
      <Toaster />
      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="Search Blogs"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />
        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <InPageNavigation routes={["Published Blogs", "Drafts"]}>
        {blogs == null ? (
          <Loader />
        ) : blogs.results.length ? (
          <>
            {blogs.results.map((blog, i) => (
              <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                <ManagePublishedBlogCard blog={blog} />
              </AnimationWrapper>
            ))}
          </>
        ) : (
          <NoDataMessage message="No Published Blogs" />
        )}

        {drafts == null ? (
          <Loader />
        ) : drafts.results.length ? (
          <>
            {drafts.results.map((blog, i) => (
              <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                <ManageDraftBlogPost blog={blog} index={i + 1} />
              </AnimationWrapper>
            ))}
          </>
        ) : (
          <NoDataMessage message="No Draft Blogs" />
        )}
      </InPageNavigation>
    </>
  );
};

export default ManageBlogs;