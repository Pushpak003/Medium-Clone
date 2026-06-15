import { useEffect, useState } from "react";
import AnimationWrapper from "../common/Page-animation";
import InPageNavigation, { activeTabRef } from "../components/Home Page/InPageNavigation";
import Loader from "../components/ui/Loader";
import BlogPostCard from "../components/Blogs/BlogPostCard";
import MinimalBlogPost from "../components/Blogs/MinimalBlogPost";
import NoDataMessage from "../components/ui/NoData";
import { filterPaginationData } from "../common/FilteredPaginationData";
import LoadMoreDataBtn from "../components/Blogs/LoadMoreDataBtn";
import api from "../utils/api";

const categories = ["psychology", "space", "tech", "travel", "entertainment", "finance"];

const Homepage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");

  const fetchLatestBlogs = async ({ page = 1 }) => {
    try {
      const { data } = await api.post("/blogs/latest-blogs", { page });
      const formattedData = await filterPaginationData({
        create_new_arr: page === 1,
        state: blogs,
        data: data.blogs,
        page,
        countRoute: "/blogs/all-latest-blogs-count",
      });
      setBlogs(formattedData);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrendingBlogs = async () => {
    try {
      const { data } = await api.get("/blogs/trending-blogs");
      setTrendingBlogs(data.blogs);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBlogsByCategory = async ({ page = 1 }) => {
    try {
      const { data } = await api.post("/blogs/search-blogs", { tag: pageState, page });
      const formattedData = await filterPaginationData({
        create_new_arr: page === 1,
        state: blogs,
        data: data.blogs,
        page,
        countRoute: "/blogs/search-blogs-count",
        data_to_send: { tag: pageState },
      });
      setBlogs(formattedData);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBlogByCategory = (e) => {
    const category = e.target.innerText.toLowerCase();
    setBlogs(null);
    setPageState(pageState === category ? "home" : category);
  };

  useEffect(() => {
    activeTabRef.current.click();
    if (pageState === "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }
    if (!trendingBlogs) fetchTrendingBlogs();
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest blogs */}
        <div className="w-full">
          <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => (
                  <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                    <BlogPostCard content={blog} author={blog.author.personal_info} />
                  </AnimationWrapper>
                ))
              ) : (
                <NoDataMessage message="No Blog Published!" />
              )}
              <LoadMoreDataBtn
                state={blogs}
                fetchData={pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory}
              />
            </>

            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => (
                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                  <MinimalBlogPost blog={blog} index={i} />
                </AnimationWrapper>
              ))
            ) : (
              <NoDataMessage message="No Trending Blogs!" />
            )}
          </InPageNavigation>
        </div>

        {/* Sidebar */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">Stories from all interests</h1>
              <div className="flex flex-wrap gap-3">
                {categories.map((category, i) => (
                  <button
                    key={i}
                    onClick={loadBlogByCategory}
                    className={"tag " + (pageState === category ? "bg-black text-white" : "")}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                <i className="fi fi-rr-arrow-trend-up mr-2"></i>Trending
              </h1>
              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => (
                  <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                ))
              ) : (
                <NoDataMessage message="No Trending Blogs!" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Homepage;