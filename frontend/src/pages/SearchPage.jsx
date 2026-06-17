import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/Home Page/InPageNavigation";
import AnimationWrapper from "../common/Page-animation";
import Loader from "../components/ui/Loader";
import BlogPostCard from "../components/Blogs/BlogPostCard";
import NoDataMessage from "../components/ui/NoData";
import LoadMoreDataBtn from "../components/Blogs/LoadMoreDataBtn";
import { filterPaginationData } from "../common/FilteredPaginationData";
import UserCard from "../components/Users/UserCard";
import api from "../utils/api";

const SearchPage = () => {
  const { query } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [users, setUsers] = useState(null);

  const searchBlogs = async ({ page = 1, create_new_arr = false }) => {
    try {
      const { data } = await api.post("/blogs/search-blogs", { query, page });
      const formattedData = await filterPaginationData({
        create_new_arr,
        state: blogs,
        data: data.blogs,
        page,
        countRoute: "/blogs/search-blogs-count",
        data_to_send: { query },
      });
      setBlogs(formattedData);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const { data: { users } } = await api.post("/user/search", { query });
      setUsers(users);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    setBlogs(null);
    setUsers(null);
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const UserCardWrapper = () => (
    <>
      {users == null ? <Loader /> : users.length
        ? users.map((user, i) => (
          <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
            <UserCard user={user} />
          </AnimationWrapper>
        ))
        : <NoDataMessage message="No User Found!" />}
    </>
  );

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation routes={[`Search Results from ${query}`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
          <>
            {blogs == null ? <Loader /> : blogs.results.length
              ? blogs.results.map((blog, i) => (
                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                  <BlogPostCard content={blog} author={blog.author.personal_info} />
                </AnimationWrapper>
              ))
              : <NoDataMessage message="No Blog Published!" />}
            <LoadMoreDataBtn state={blogs} fetchData={searchBlogs} />
          </>
          <UserCardWrapper />
        </InPageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          <i className="fi fi-rr-user mt-1 mr-2"></i>Users related to search
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;