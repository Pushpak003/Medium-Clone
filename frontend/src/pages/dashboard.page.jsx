import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/Page-animation";

const DashboardPage = () => {
  const user = useSelector((store) => store.auth.user);

  return (
    <AnimationWrapper>
      <div className="py-6">
        <h1 className="max-md:hidden text-2xl font-medium mb-8">
          Welcome back, {user?.fullname} 👋
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/dashboard/blogs"
            className="border border-grey rounded-lg p-6 hover:bg-grey/30 transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <i className="fi fi-rr-document text-2xl text-dark-grey"></i>
              <h2 className="text-xl font-medium">Manage Blogs</h2>
            </div>
            <p className="text-dark-grey">
              View, edit or delete your published blogs and drafts.
            </p>
          </Link>

          <Link
            to="/dashboard/notifications"
            className="border border-grey rounded-lg p-6 hover:bg-grey/30 transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <i className="fi fi-rr-bell text-2xl text-dark-grey"></i>
              <h2 className="text-xl font-medium">Notifications</h2>
            </div>
            <p className="text-dark-grey">
              See who liked, commented or replied to your blogs.
            </p>
          </Link>

          <Link
            to="/editor"
            className="border border-grey rounded-lg p-6 hover:bg-grey/30 transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <i className="fi fi-rr-file-edit text-2xl text-dark-grey"></i>
              <h2 className="text-xl font-medium">Write a Blog</h2>
            </div>
            <p className="text-dark-grey">
              Start writing a new blog post.
            </p>
          </Link>

          <Link
            to="/settings/edit-profile"
            className="border border-grey rounded-lg p-6 hover:bg-grey/30 transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <i className="fi fi-rr-user text-2xl text-dark-grey"></i>
              <h2 className="text-xl font-medium">Edit Profile</h2>
            </div>
            <p className="text-dark-grey">
              Update your profile info, bio and social links.
            </p>
          </Link>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default DashboardPage;